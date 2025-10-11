// src/app/api/students/export/route.js
import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import ExcelJS from "exceljs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// MongoDB setup
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error("Please define MONGODB_URI in .env");
if (!dbName) throw new Error("Please define MONGODB_DB in .env");

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}


const token = cookies().get("token")?.value;
if(!token) {
  return NextResponse.json({error : "failed to load token"}, {status : 401})
}

const decoded = jwt.verify(token, process.env.JWT_SECRET)
if(!decoded) {
  return NextResponse.json({error : "failed to load token"}, {status : 401})
}
const userId = decoded.userId
if(!userId) {
  return NextResponse.json({error : "failed to load token"}, {status : 401})
}


export async function GET(req) {
  const client = await clientPromise;
  const db = client.db(dbName);
  const collection = db.collection("students");

  // 1️⃣ Fetch all students
  const students = await collection.find({createdBy : new ObjectId(userId)}).toArray();

  // 2️⃣ Group students by batch
  const batchMap = {};
  students.forEach((s) => {
    if (!batchMap[s.batch_time]) batchMap[s.batch_time] = [];
    batchMap[s.batch_time].push(s);
  });

  // 3️⃣ Week and study day maps
  const weekOrder = {
    Saturday: 0,
    Sunday: 1,
    Monday: 2,
    Tuesday: 3,
    Wednesday: 4,
    Thursday: 5,
    Friday: 6,
  };

  const studyDayMap = {
    smw: "Saturday, Monday, Wednesday",
    stt: "Saturday, Tuesday, Thursday",
    regular: "Regular",
  };

  // 4️⃣ Create Excel workbook
  const workbook = new ExcelJS.Workbook();

  let firstSheet = true;
  for (const [batch, batchStudents] of Object.entries(batchMap)) {
    // Map study day codes
    batchStudents.forEach((s) => {
      const code = (s.study_days || "").toLowerCase();
      if (studyDayMap[code]) s.study_days = studyDayMap[code];
    });

    // Sort students by first study day
    batchStudents.sort((a, b) => {
      const aDays = a.study_days;
      const bDays = b.study_days;
      if (aDays === "Regular") return 1;
      if (bDays === "Regular") return -1;
      const aFirst = aDays.split(",")[0].trim();
      const bFirst = bDays.split(",")[0].trim();
      return weekOrder[aFirst] - weekOrder[bFirst];
    });

    const sheet = firstSheet
      ? workbook.addWorksheet(batch)
      : workbook.addWorksheet(batch);
    firstSheet = false;

    // Headers
    sheet.addRow([
      "Name",
      "Phone Number",
      "Class",
      "Subject",
      "Payment Status",
      "Payment Amount",
      "Study Days",
    ]);

    // Student rows
    batchStudents.forEach((s) => {
      sheet.addRow([
        s.name,
        s.phone_number,
        s.class,
        s.subject,
        s.payment_status ? "PAID" : "UNPAID",
        s.payment_amount || 0,
        s.study_days || "",
      ]);
    });
  }

  // 5️⃣ Current month for due_months
  const currentMonth = new Date()
    .toLocaleString("default", { month: "long", year: "numeric" })
    .replace(" ", "_");

  // 6️⃣ Update MongoDB: add due_months for unpaid
  await collection.updateMany(
    { payment_status: false },
    { $addToSet: { due_months: currentMonth } }
  );

  // 7️⃣ Reset all payment_status to false
  await collection.updateMany({}, { $set: { payment_status: false } });

  // 8️⃣ Prepare Excel file for response
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=student_report_of_${currentMonth}.xlsx`,
    },
  });
}

