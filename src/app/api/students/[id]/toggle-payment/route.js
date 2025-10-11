import { MongoClient, ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function PATCH(req, { params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("students");

    const student = await collection.findOne({ _id: new ObjectId(id) });
    if (!student) {
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
    }

    // Get current date in dd-mm-yy
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);
    const paymentDate = `${day}-${month}-${year}`;

    let updatedPaidMonths = student.paid_months || [];
    let updatedDueMonths = student.due_months || [];
    let newPaymentStatus = !student.payment_status;

    if (newPaymentStatus) {
      // Unpaid → Paid
      if (!updatedPaidMonths.includes(paymentDate)) {
        updatedPaidMonths.push(paymentDate);
      }
      updatedDueMonths = updatedDueMonths.filter((m) => m !== paymentDate);

      console.log(`Payment received for ${student.name} on ${paymentDate}`);
    }

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          payment_status: newPaymentStatus,
          paid_months: updatedPaidMonths,
          due_months: updatedDueMonths,
        },
      }
    );

    const updatedStudent = await collection.findOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify(updatedStudent), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update student" }), { status: 500 });
  }
}
