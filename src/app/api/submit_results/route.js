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

// --- SMS message template ---
function MarksTemplate(name, total, subject, obtainedMarks) {
  return `Dear ${name},  
Your ${subject} exam results have been published.  
Total Marks: ${total}  
Obtained Marks: ${obtainedMarks} \n`;
}

// --- Phone number formatting function (do not modify) ---
function formatPhoneNumber(phone) {
  if (!phone) throw new Error("Phone number is required");

  // Remove spaces, dashes, and parentheses
  phone = phone.replace(/[\s\-\(\)]/g, "");

  if (/^8801\d{9}$/.test(phone)) {
    return phone; // e.g. 8801773153889 stays same
  }

  if (phone.startsWith("+880")) {
    return phone.slice(1); // +8801773153889 → 8801773153889
  } else if (phone.startsWith("880")) {
    return phone; // already fine
  } else if (phone.startsWith("0")) {
    return "88" + phone; // 01773153889 → 8801773153889
  } else if (/^1\d{9}$/.test(phone)) {
    return "880" + phone; // 1773153889 → 8801773153889
  }

  throw new Error("Invalid Bangladeshi phone number format");
}

// --- POST handler ---
export async function POST(req) {
  let students;
  try {
    students = await req.json();
  } catch {
    return NextResponse.json({ error: "Cannot parse JSON" }, { status: 400 });
  }

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

    const smsResults = [];

    for (const s of students) {
      if (!s.marks?.length) continue; // skip if no marks

      const mark = s.marks[0];
      const name = s.student_name || "Student";

      // --- Save marks in MongoDB ---
      await collection.updateOne(
        { _id: new ObjectId(s.student_id) },
        { $setOnInsert: { marks: [] } },
        { upsert: true }
      );

      await collection.updateOne(
        { _id: new ObjectId(s.student_id) },
        [
          {
            $set: {
              marks: {
                $concatArrays: [{ $ifNull: ["$marks", []] }, s.marks],
              },
            },
          },
        ]
      );

      // --- Try sending SMS ---
      let phone;
      try {
        phone = formatPhoneNumber(s.phone_number);
      } catch {
        console.warn(`Skipping SMS for ${name}: invalid phone number (${s.phone_number})`);
        smsResults.push({ phone: s.phone_number || null, success: false, error: "Invalid phone number" });
        continue; // skip SMS but not DB
      }

      const message = MarksTemplate(name, mark.total, mark.subject, mark.obtained);

      try {
        const payload = [
          { callerID: "loomsoftwares", toUser: phone, messageContent: message }
        ];

        const url = `http://118.67.213.114:3775/send?apikey=${process.env.SMS_API_KEY}&secretkey=${process.env.SMS_SECRET_KEY}&content=${encodeURIComponent(JSON.stringify(payload))}`;

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
      await redis.del(`students_excel:${userId}`);
      console.log(`Redis cache cleared for user ${userId}`);
    } catch (err) {
      console.warn("Failed to clear Redis cache:", err.message);
    }

    return NextResponse.json({
      success: true,
      message: "Marks added & SMS processed!",
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
