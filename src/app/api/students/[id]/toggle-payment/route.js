import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";

function formatPhoneNumber(phone) {
  if (!phone) throw new Error("Phone number is required");

  phone = phone.replace(/[\s\-\(\)]/g, "");

  if (phone.startsWith("+880")) {
    return phone.slice(1);
  } else if (phone.startsWith("880")) {
    return phone;
  } else if (phone.startsWith("0")) {
    return "88" + phone;
  } else if (/^1\d{9}$/.test(phone)) {
    return "880" + phone;
  }

  throw new Error("Invalid Bangladeshi phone number format");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function PATCH(req, { params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("students");

    const student = await collection.findOne({
      _id: new ObjectId(id),
      createdBy: new ObjectId(decoded.userId),
    });

    if (!student) {
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);
    const paymentDate = `${day}-${month}-${year}`;

    let updatedPaidMonths = student.paid_months || [];
    let updatedDueMonths = student.due_months || [];
    let newPaymentStatus = !student.payment_status;

    if (!student.payment_status && newPaymentStatus) {

      if (!updatedPaidMonths.includes(paymentDate)) {
        updatedPaidMonths.push(paymentDate);
      }

      updatedDueMonths = updatedDueMonths.filter((m) => m !== paymentDate);

      console.log(`✅ Payment received for ${student.name} on ${paymentDate}`);

      // -------------------------------------------------------------
      // FIXED SMS — SINGLE JSON OBJECT — NO DOUBLE SMS
      // -------------------------------------------------------------
      try {
        const phone = student.phone_number;

        if (phone) {
          const formattedPhoneNumber = formatPhoneNumber(phone);

          const amount = student.fee ?? student.payment_amount ?? 0;

          const smsText = `Studify: Payment ${amount} BDT for ${student.name} received on ${paymentDate}.`;

          const payload = {
            apikey: process.env.SMS_API_KEY,
            secretkey: process.env.SMS_SECRET_KEY,
            callerID: "loomsoftwares",
            toUser: formattedPhoneNumber,
            messageContent: smsText,
          };

          await fetch("http://118.67.213.114:3775/send", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        }
        console.log("PATCH route HIT", Date.now());
      } catch (err) {
        console.error("SMS send failed:", err.message);
      }
      // -------------------------------------------------------------
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          payment_status: newPaymentStatus,
          paid_months: updatedPaidMonths,
          due_months: updatedDueMonths,
        },
      }
    );

    const updatedStudent = await collection.findOne({ _id: new ObjectId(id) });

    const cacheKey = `students:${decoded.userId}`;
    await redis.del(cacheKey);

    return new Response(JSON.stringify(updatedStudent), { status: 200 });
  } catch (err) {
    console.error("PATCH error:", err);
    return new Response(JSON.stringify({ error: "Failed to update student" }), { status: 500 });
  }
}
