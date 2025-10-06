import clientPromise from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); // replace with your DB name
    const users = db.collection("users");

    // Find the user
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Combine password with JWT secret (same as signup)
    const combinedPassword = password + process.env.JWT_SECRET;
    const isMatch = await bcrypt.compare(combinedPassword, user.password);

    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    // Set cookie
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=${30*24*60*60}; SameSite=Strict`
    );

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
