import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    // ✅ Parse JSON body properly
    const selected = await req.json();
    console.log("Selected:", selected);

    // ✅ Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: true, redirect: "/sign-up" }, { status: 401 });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return NextResponse.json({ success: true, redirect: "/sign-up" }, { status: 403 });
    }

    // ✅ Calculate expiry
    const validityInMonths = parseInt(selected.validity);
    let expiryDate = null;

    if (!isNaN(validityInMonths)) {
      const now = new Date();
      expiryDate = new Date(now);
      expiryDate.setMonth(now.getMonth() + validityInMonths);
    }

    // ✅ Connect to DB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // ✅ Update user's plan
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: { plan: selected.name, planExpiry: expiryDate } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "User not found or plan not updated" }, { status: 404 });
    }

    // ✅ Success
    return NextResponse.json({ success: true, redirect: "/payment?status=true" });
  } catch (error) {
    console.error("Error in order placement:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
