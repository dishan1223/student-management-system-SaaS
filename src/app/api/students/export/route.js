// src/app/api/students/export/route.js
'use server'

import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import ExcelJS from "exceljs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// ----------------------
// MongoDB setup
// ----------------------
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error("Please define MONGODB_URI in .env");
if (!dbName) throw new Error("Please define MONGODB_DB in .env");

const client = new MongoClient(uri);
const clientPromise = client.connect();

// ----------------------
// GET handler
// ----------------------
export async function GET() {
  try {
    // ✅ Token check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) return NextResponse.json({ error: "Invalid user" }, { status: 401 });

    // ✅ Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(dbName);
    const studentsCol = db.collection("students");
    const batchesCol = db.collection("batches");

    // ✅ Fetch all students of this user
    const students = await studentsCol
      .find({ createdBy: new ObjectId(userId) })
      .toArray();

    if (!students.length) return NextResponse.json({ error: "No students found" }, { status: 404 });

    // ✅ Fetch all batches related to these students
    const batchIds = [...new Set(students.map((s) => s.batch_id))].filter(Boolean).map(id => new ObjectId(id));
    const batches = await batchesCol.find({ _id: { $in: batchIds } }).toArray();
    const batchMap = Object.fromEntries(batches.map(b => [b._id.toString(), b]));

    // ✅ Create workbook
    const workbook = new ExcelJS.Workbook();

    for (const batch of batches) {
      const batchStudents = students.filter(s => s.batch_id?.toString() === batch._id.toString());

      const sheet = workbook.addWorksheet(batch.name || "Unnamed Batch");

      // Headers
      sheet.addRow([
        "Name",
        "Phone Number",
        "Class",
        "Subject",
        "Payment Status",
        "Payment Amount",
        "Paid Months",
        "Due Months",
        "Study Days",
      ]);

      // Rows
      batchStudents.forEach(s => {
        sheet.addRow([
          s.name || "",
          s.phone_number || "",
          s.class || "",
          s.subject || "",
          s.payment_status ? "PAID" : "UNPAID",
          s.payment_amount || 0,
          (s.paid_months || []).join(", "),
          (s.due_months || []).join(", "),
          s.study_days || "",
        ]);
      });

      // Styling
      sheet.getRow(1).font = { bold: true };
      sheet.columns.forEach(col => {
        let maxLength = 15;
        col.eachCell({ includeEmpty: true }, cell => {
          const len = cell.value ? cell.value.toString().length : 0;
          if (len > maxLength) maxLength = len;
        });
        col.width = maxLength + 2;
      });
    }

    // ✅ Current month for due tracking
    const currentMonth = new Date()
      .toLocaleString("default", { month: "long", year: "numeric" })
      .replace(" ", "_");

    // ✅ Add current month to due_months for unpaid students
    await studentsCol.updateMany(
      { createdBy: new ObjectId(userId), payment_status: false },
      { $addToSet: { due_months: currentMonth } }
    );

    // ✅ Reset payment_status for this user's students
    await studentsCol.updateMany(
      { createdBy: new ObjectId(userId) },
      { $set: { payment_status: false } }
    );

    // ✅ Export Excel
    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=student_report_${currentMonth}.xlsx`,
      },
    });

  } catch (err) {
    console.error("Export failed:", err);
    return NextResponse.json({ error: "Failed to export students", details: err.message }, { status: 500 });
  }
}
