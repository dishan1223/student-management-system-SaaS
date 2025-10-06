// src/app/api/batch/new/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    // Add _id like Go’s primitive.NewObjectID()
    const batch = { ...body, _id: new ObjectId() };

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("batches");

    const result = await collection.insertOne(batch);

    if (!result.acknowledged) {
      return NextResponse.json({ error: "Cannot insert batch" }, { status: 500 });
    }

    return NextResponse.json(batch, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot parse JSON" }, { status: 400 });
  }
}

