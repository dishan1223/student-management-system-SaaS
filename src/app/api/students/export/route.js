'use server';

import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import ExcelJS from 'exceljs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
if (!uri || !dbName) throw new Error('Missing MongoDB config');

const client = new MongoClient(uri);
const clientPromise = client.connect();

export async function GET() {
  try {
    // --- Auth ---
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid user' }, { status: 401 });
    }

    // --- DB ---
    const db = (await clientPromise).db(dbName);
    const studentsCol = db.collection('students');
    const batchesCol = db.collection('batches');

    const students = await studentsCol
      .find({ createdBy: new ObjectId(userId) })
      .toArray();

    if (!students.length) {
      return NextResponse.json({ error: 'No students found' }, { status: 404 });
    }

    // collect unique batch IDs
    const batchIds = [
      ...new Set(students.map((s) => s.batch_id).filter(Boolean)),
    ].map((id) => new ObjectId(id));

    const batches = batchIds.length
      ? await batchesCol.find({ _id: { $in: batchIds } }).toArray()
      : [];

    // --- Excel ---
    const workbook = new ExcelJS.Workbook();

    // function to safely add a sheet
    const createSheet = (name) => {
      const safeName = name
        .replace(/[\\/*?:\[\]<>|"]/g, '_')
        .substring(0, 31);
      return workbook.addWorksheet(safeName);
    };

    // --- Create batch sheets ---
    for (const batch of batches) {
      const batchStudents = students.filter(
        (s) => s.batch_id?.toString() === batch._id.toString()
      );

      const sheet = createSheet(batch.batch_name || 'Unnamed Batch');

      sheet.addRow([
        'Name',
        'Phone Number',
        'Class',
        'Subject',
        'Payment Status',
        'Payment Amount',
        'Paid Months',
        'Due Months',
        'Study Days',
      ]);

      for (const s of batchStudents) {
        sheet.addRow([
          s.name || '',
          s.phone_number || '',
          s.class || '',
          s.subject || '',
          s.payment_status ? 'PAID' : 'UNPAID',
          s.payment_amount || 0,
          (s.paid_months || []).join(', '),
          (s.due_months || []).join(', '),
          s.study_days || '',
        ]);
      }

      // style header
      const header = sheet.getRow(1);
      header.font = { bold: true };
      header.alignment = { vertical: 'middle', horizontal: 'center' };

      // auto width
      sheet.columns.forEach((col) => {
        let max = 15;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const len = cell.value ? cell.value.toString().length : 0;
          if (len > max) max = len;
        });
        col.width = max + 2;
      });
    }

    // --- Add "Unassigned Students" sheet (if any) ---
    const unassigned = students.filter((s) => !s.batch_id);
    if (unassigned.length) {
      const sheet = createSheet('Unassigned Students');
      sheet.addRow([
        'Name',
        'Phone Number',
        'Class',
        'Subject',
        'Payment Status',
        'Payment Amount',
        'Paid Months',
        'Due Months',
        'Study Days',
      ]);
      for (const s of unassigned) {
        sheet.addRow([
          s.name || '',
          s.phone_number || '',
          s.class || '',
          s.subject || '',
          s.payment_status ? 'PAID' : 'UNPAID',
          s.payment_amount || 0,
          (s.paid_months || []).join(', '),
          (s.due_months || []).join(', '),
          s.study_days || '',
        ]);
      }
      sheet.getRow(1).font = { bold: true };
    }

    // --- Payment Updates ---
    const currentMonth = new Date()
      .toLocaleString('default', { month: 'long', year: 'numeric' })
      .replace(' ', '_');

    await studentsCol.updateMany(
      { createdBy: new ObjectId(userId), payment_status: false },
      { $addToSet: { due_months: currentMonth } }
    );

    await studentsCol.updateMany(
      { createdBy: new ObjectId(userId) },
      { $set: { payment_status: false } }
    );

    // --- Return Excel File ---
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=students_export_${currentMonth}.xlsx`,
      },
    });
  } catch (err) {
    console.error('Export failed:', err);
    return NextResponse.json(
      { error: 'Failed to export students', details: err.message },
      { status: 500 }
    );
  }
}
