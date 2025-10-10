import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ success: false, reason: "notLoggedIn" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return Response.json({ success: false, reason: "notLoggedIn" });
    }

    const allowedPlans = ["Basic", "Pro", "Enterprise"];
    const now = new Date();

    // Check for valid plan
    if (!allowedPlans.includes(user.plan)) {
      return Response.json({ success: false, reason: "noPlan" });
    }

    // Check if plan expired
    if (!user.planExpiry || new Date(user.planExpiry) <= now) {
      return Response.json({ success: false, reason: "expired" });
    }

    // All checks passed → success
    return Response.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        planExpiry: user.planExpiry,
      },
    });
  } catch (err) {
    console.error("Auth check error:", err);
    return Response.json({ success: false, reason: "error" });
  }
}
