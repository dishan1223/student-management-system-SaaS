// Create this file at: app/api/debug/database/route.js
// This will show ALL collections and data

import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get database name
    const dbName = db.databaseName;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    
    // Get data from each collection
    const collectionData = {};
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      const samples = await db.collection(collectionName).find({}).limit(3).toArray();
      
      collectionData[collectionName] = {
        count,
        samples: samples.map(doc => ({
          ...doc,
          _idType: typeof doc._id,
          _idConstructor: doc._id?.constructor?.name
        }))
      };
    }
    
    return NextResponse.json({
      databaseName: dbName,
      collections: collections.map(c => c.name),
      data: collectionData
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (err) {
    console.error("Database debug error:", err);
    return NextResponse.json(
      { error: err.message, stack: err.stack }, 
      { status: 500 }
    );
  }
}