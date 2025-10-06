// src/app/api/login/route.js
// this route is for pin based loogin
// will be removed soon enough
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pin = searchParams.get("pin");

  if (!pin) {
    return NextResponse.json({ error: "PIN required" }, { status: 400 });
  }

  // Check against PIN in .env
  const validPins = process.env.VALID_PINS?.split(",") || []; // you can store multiple pins separated by commas
  if (!validPins.includes(pin)) {
    return NextResponse.json(
      { success: false, message: "Invalid PIN" },
      { status: 401 }
    );
  }

  // Optional: return a user object
  const user = { name: "Admin" };

  return NextResponse.json({ success: true, user });
}

