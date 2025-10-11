
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json([], { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("batches");

    // Fetch only batches created by the logged-in user
    const batches = await collection
      .find({ createdBy: new ObjectId(decoded.userId) })
      .toArray();

    return NextResponse.json(batches, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot fetch batches" }, { status: 500 });
  }
}
