// src/app/api/students/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  let student;
  try {
    student = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Cannot parse JSON" }, { status: 400 });
  }

  // Assign a new ObjectId
  student._id = new ObjectId();

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

