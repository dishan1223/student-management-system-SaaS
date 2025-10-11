// src/app/api/students/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

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
  } catch (err) {
    return NextResponse.json({ error: "Cannot insert student" }, { status: 500 });
  }

  return NextResponse.json(student, { status: 201 });
}
