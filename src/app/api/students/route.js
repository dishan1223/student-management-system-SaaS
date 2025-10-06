// src/app/api/students/route.js
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const students = await db.collection("students").find({}).toArray();

    return new Response(JSON.stringify(students), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Cannot fetch students" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

