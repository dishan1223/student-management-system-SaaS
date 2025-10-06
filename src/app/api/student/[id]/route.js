// src/app/api/students/[id]/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  let objId;
  try {
    objId = new ObjectId(id);
  } catch (err) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let client;
  try {
    client = await clientPromise;
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }

  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection("students");

  const student = await collection.findOne({ _id: objId });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}

