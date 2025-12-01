import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { Redis } from "@upstash/redis";

// --- Redis client setup ---
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

function formatPhoneNumber(phone) {
  if (!phone) throw new Error("Phone number is required");

  //Remove spaces, dashes, and parentheses
  phone = phone.replace(/[\s\-\(\)]/g, "");

  // change format to different types of number method
  if (phone.startsWith("+880")) {
    // e.g. +8801727932635 → 8801727932635
    return phone.slice(1);
  } else if (phone.startsWith("880")) {
    // e.g. 8801727932635 → 8801727932635 (already fine)
    return phone;
  } else if (phone.startsWith("0")) {
    // e.g. 01727932635 → 8801727932635
    return "88" + phone;
  } else if (/^1\d{9}$/.test(phone)) {
    // e.g. 1727932635 → 8801727932635
    return "880" + phone;
  }

  throw new Error("Invalid Bangladeshi phone number format");
}

export async function POST(req) {
  let students;
  try {
    const {absentStudents} = await req.json();
    students=absentStudents;
  } catch {
    return NextResponse.json({ error: "Cannot parse JSON" }, { status: 400 });
  }
  const todaysDate = new Date();
  const day = String(todaysDate.getDate()).padStart(2, '0');
	const month = String(todaysDate.getMonth() + 1).padStart(2, '0');
	const year = String(todaysDate.getFullYear()).slice(-2);

  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }


  const userId = decoded?.userId;
  if (!userId)
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("students");
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    const smsResults = [];

    for (const s of students) {
      if (!s.phone_number) continue; // skip invalid entries

      const phone = formatPhoneNumber(s.phone_number);
      const name = s.student_name || "Student";

      // --- Save absents in MongoDB ---
      await collection.updateOne(
        { _id: new ObjectId(s.student_id) },
        { $setOnInsert: { absent: [] } },
        { upsert: true }
      );

      await collection.updateOne(
        { _id: new ObjectId(s.student_id) },
        [
          {
            $set: {
              absent: {
                $concatArrays: [{ $ifNull: ["$absent", []] }, [todaysDate]],
              },
            },
          },
        ]
      );

      // --- Send SMS ---
      const message = `${s.name} was absent from class on ${day}-${month}-${year}. Please ensure they catch up on missed lessons. - ${user.name}`

      try {
        // FIX: content MUST be an array according to API docs
        const payload = [
          {
            callerID: "loomsoftwares",
            toUser: phone,
            messageContent: message,
          }
        ];

        const url = `http://118.67.213.114:3775/send?apikey=${process.env.SMS_API_KEY}&secretkey=${process.env.SMS_SECRET_KEY}&content=${encodeURIComponent(
          JSON.stringify(payload)
        )}`;

        const response = await fetch(url, { method: "GET" });
        const result = await response.text();

        console.log(`SMS sent to ${phone}: ${result}`);
        smsResults.push({ phone, success: true, result });
      } catch (err) {
        console.error(`Failed to send SMS to ${phone}:`, err);
        smsResults.push({ phone, success: false, error: err.message });
      }
    }

    // --- Invalidate Redis cache for this user ---
    try {
      await redis.del(`students_list:${userId}`);
      await redis.del(`students:${userId}`);
      console.log(`Redis cache cleared for user ${userId}`);
    } catch (err) {
      console.warn("Failed to clear Redis cache:", err.message);
    }

    return NextResponse.json({
      success: true,
      message: "Attendance Submitted",
      smsResults,
    });
  } catch (err) {
    console.error("Error saving results:", err);
    return NextResponse.json(
      { error: "Failed to save results" },
      { status: 500 }
    );
  }
}
