import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API);

const baseURL = headers.get("host")


export async function POST(req, res) {
    const {email} = req.body;
    if (!email){
        return res.status(400).json({message: "email is required"});
    }

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const users = db.collection("users");

        const user = await users.findOne({email});
        if(!user) {
            return res.status(400).json({message: "user not found"});
        }

        // token will expire in 20 mins
        const shortTermToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:"20m"})

        // send email with resend
        const resetLink = `${baseURL}/reset-password?token=${shortTermToken}`;

        await resend.emails.send({
            from: "EduFlow <no-reply@eduflow.com>",
            to: email,
            subject: "Reset your password",
            html: `
                <div style="font-family:sans-serif;">
                <h2>Password Reset Request</h2>
                <p>Hi ${user.name || "there"},</p>
                <p>We received a request to reset your password. Click the link below to set a new password:</p>
                <a href="${resetLink}" 
                    style="display:inline-block;padding:10px 16px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">
                    Reset Password
                </a>
                <p style="margin-top:20px;">If you didn’t request this, you can safely ignore this email.</p>
                <p style="font-size:13px;color:#666;">This link will expire in 15 minutes.</p>
                </div>
            `,
        })

        res.status(200).json({
            success: true,
            message: "Password reset email sent!",
        })

    } catch (error) {
        console.error(error)

        res.status(500),json({
            message: "Failed to send reset email."
        })
    }

}