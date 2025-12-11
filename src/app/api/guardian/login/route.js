import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

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

export async function POST(req) {
  try {
    const { phone_number } = await req.json();

    // Basic validation
    if (!phone_number) {
      return NextResponse.json(
        { message: "Phone number and passkey required" },
        { status: 400 }
      );
    }

    // format phone number to search the database.
    const formattedPhoneNumber = formatPhoneNumber(phone_number);
    console.log(formattedPhoneNumber);
    // mongodb database connection.
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); 
    const students = db.collection("students");

    // Find student by phone number
    const student = await students.findOne({ phone_number:formattedPhoneNumber });
    if (!student) {
      return NextResponse.json(
        { message: "No student found with that phone number" },
        { status: 404 }
      );
    }

    console.log(student)

    // Create JWT token
    const token = jwt.sign(
      {
        id: student._id,
        name: student.name,
        phone_number: formatPhoneNumber(student.phone_number),
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Send success response
    return NextResponse.json(
      {
        message: "Login successful",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
