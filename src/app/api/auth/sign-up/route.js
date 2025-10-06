import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const users = db.collection("users");

    // Check if email already exists
    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // Hash password (add JWT_SECRET as salt)
    const salt = await bcrypt.genSalt(10);
    const combinedPassword = password + process.env.JWT_SECRET;
    const hashed = await bcrypt.hash(combinedPassword, salt);

    // Create user
    const newUser = await users.insertOne({
      name,
      email,
      password: hashed,
      plan: "Free",
      isActive: true,
    });

    // Generate token
    const token = jwt.sign(
      { userId: newUser.insertedId },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set cookie
    const response = NextResponse.json({
      success: true,
      user: { id: newUser.insertedId, name, email, plan: "Free" },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "strict",
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
