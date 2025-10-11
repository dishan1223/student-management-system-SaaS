import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; // ✅ use cookies() instead of req.cookies

    if (!token) return Response.json({ loggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) return Response.json({ loggedIn: false });

    return Response.json({
      loggedIn: true,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (err) {
    console.error("Error verifying token:", err);
    return Response.json({ loggedIn: false });
  }
}
