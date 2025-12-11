// src/app/api/students/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { Redis } from "@upstash/redis";

// initialize redis for caching
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
  let student;
  try {
    student = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Cannot parse JSON" }, { status: 400 });
  }

  // Get token from cookies
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }


  // Assign a new ObjectId and createdBy
  student._id = new ObjectId();
  student.createdBy = new ObjectId(decoded.userId);
  // format students phone number
  student.phone_number = formatPhoneNumber(student.phone_number);

  let client;
  try {
    client = await clientPromise;
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }

  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection("students");

  try {
    await collection.insertOne(student);

    // invalidate redis cache
    const cacheKey =  `students:${decoded.userId}`;
    await redis.del(cacheKey);
  } catch (err) {
    return NextResponse.json({ error: "Cannot insert student" }, { status: 500 });
  }

  return NextResponse.json(student, { status: 201 });
}
