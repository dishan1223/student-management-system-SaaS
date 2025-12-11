import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

export async function PATCH(req, { params }) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }

  let objId;
  try {
    objId = new ObjectId(id);
  } catch(err) {
    console.log(err)
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let updateData;
  try {
    updateData = await req.json();
  } catch(err) {
    console.log(err)
    return NextResponse.json({ error: "Cannot parse request body" }, { status: 400 });
  }

  Object.keys(updateData).forEach((key) => {
    let value = updateData[key];

    if (value === "" || value === null || value === undefined) {
      delete updateData[key];
      return;
    }

    // format phone number before updating.
    updateData.phone_number = formatPhoneNumber(updateData.phone_number);

    if (key === "payment_amount") {
      const num = parseFloat(value);
      if (!isNaN(num)) updateData[key] = num;
      else delete updateData[key];
    }

    if (key === "payment_status") {
      if (value === "true" || value === true) updateData[key] = true;
      else if (value === "false" || value === false) updateData[key] = false;
      else delete updateData[key];
    }
  });

  if (Object.keys(updateData).length === 0)
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection("students");

  const res = await collection.updateOne({ _id: objId }, { $set: updateData });
  if (res.matchedCount === 0)
    return NextResponse.json({ error: "Student not found" }, { status: 404 });

  await redis.del(`students:${decoded.userId}`);

  return NextResponse.json({ message: "Student updated successfully" });
}
