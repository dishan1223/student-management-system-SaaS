// src/app/api/students/[id]/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req, { params }) {
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

  let updateData;
  try {
    updateData = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Cannot parse request body" }, { status: 400 });
  }

  // Clean up invalid/empty fields
  Object.keys(updateData).forEach((key) => {
    let value = updateData[key];

    if (value === "" || value === null || value === undefined) {
      delete updateData[key];
      return;
    }

    // Convert payment_amount to float
    if (key === "payment_amount") {
      const num = parseFloat(value);
      if (!isNaN(num)) updateData[key] = num;
      else delete updateData[key];
    }

    // Convert payment_status to boolean
    if (key === "payment_status") {
      if (value === "true" || value === true) updateData[key] = true;
      else if (value === "false" || value === false) updateData[key] = false;
      else delete updateData[key];
    }
  });

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  let client;
  try {
    client = await clientPromise;
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 });
  }

  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection("students");

  const res = await collection.updateOne(
    { _id: objId },
    { $set: updateData }
  );

  if (res.matchedCount === 0) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Student updated successfully" });
}

