import clientPromise from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"})
    }

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const users = db.collection("users");

        // check if email exists
        const exists = await users.findOne({email});
        if (exists) return res.status(400).json({message: "Email already registered"});

        const salt = await bcrypt.genSalt(10);
        const combinedPassword = password + process.env.JWT_SECRET;
        const hashed = await bcrypt.hash(combinedPassword, salt);

        // create new user
        const newUser = await users.insertOne({
            name,
            email,
            password : hashed,
            plan: "Free",
            isActive: true
        })

        // generate jwt
        const token = jwt.sign({userId: newUser.insertedId }, process.env.JWT_SECRET, { expiresIn: "30d"});

        res.setHeader(
            "Set-Cookie",
            `token=${token}; HttpOnly; Path=/; Max-Age=${30*24*60*60}; SameSite=Strict`
        );

        res.status(201).json({
            success: true,
            user: { id: newUser.insertedId, name, email, plan: "Free" }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "server error"})
    }
}