import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// DELETE /api/batch/delete/[id]
export async function DELETE(req, context) {
    try {
        const { id } = await context.params;

        if (!id){
            return NextResponse.json({ error: "Batch ID is required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(`${process.env.MONGODB_DB}`)
        const batchCollection = db.collection("batches");


        const objectId = new ObjectId(id);

        const res = batchCollection.deleteOne({ _id: objectId });

        if (res.deletedCount === 0) {
            return NextResponse.json({ error: "Batch not found" }, { status: 404 }); 
        }

        return NextResponse.json({ message: "Batch deleted successfully" }, { status: 200 });

    } catch (err){
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
