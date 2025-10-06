// src/app/api/batch/new/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// POST = add new batch
export async function POST(req) {
  try {
    const body = await req.json();
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

// GET = fetch all batches
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("batches");

    const batches = await collection.find({}).toArray();

    return NextResponse.json(batches, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot fetch batches" }, { status: 500 });
  }
}

