// Create this file at: app/api/batch/debug/[id]/route.js
// This is just for debugging - remove it later

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const params = await Promise.resolve(context.params);
    const { id } = params;
    
    const client = await clientPromise;
    const db = client.db();
    const batchCollection = db.collection("batches");
    const studentCollection = db.collection("students");
    
    // Get all batches to see their ID format
    const allBatches = await batchCollection.find({}).limit(5).toArray();
    
    // Try to find this specific batch
    let foundBatch = null;
    let foundMethod = null;
    
    if (ObjectId.isValid(id)) {
      const withObjectId = await batchCollection.findOne({ _id: new ObjectId(id) });
      if (withObjectId) {
        foundBatch = withObjectId;
        foundMethod = "ObjectId";
      }
    }
    
    if (!foundBatch) {
      const withString = await batchCollection.findOne({ _id: id });
      if (withString) {
        foundBatch = withString;
        foundMethod = "String";
      }
    }
    
    // Count students with this batch_id
    const studentsWithString = await studentCollection.countDocuments({ batch_id: id });
    const studentsWithObjectId = ObjectId.isValid(id) 
      ? await studentCollection.countDocuments({ batch_id: new ObjectId(id) })
      : 0;
    
    return NextResponse.json({
      requestedId: id,
      requestedIdType: typeof id,
      isValidObjectId: ObjectId.isValid(id),
      foundBatch: foundBatch ? {
        _id: foundBatch._id,
        _idType: typeof foundBatch._id,
        _idConstructor: foundBatch._id.constructor.name,
        batch_name: foundBatch.batch_name
      } : null,
      foundMethod,
      studentsWithStringBatchId: studentsWithString,
      studentsWithObjectIdBatchId: studentsWithObjectId,
      sampleBatches: allBatches.map(b => ({
        _id: b._id,
        _idType: typeof b._id,
        _idConstructor: b._id.constructor.name,
        batch_name: b.batch_name
      }))
    });
    
  } catch (err) {
    console.error("Debug error:", err);
    return NextResponse.json(
      { error: err.message }, 
      { status: 500 }
    );
  }
}