'use client'
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentCard from "@/components/studentCard";
import useRequirePaid from "@/utils/requireAuth";

export default function BatchStudentsPage() {
  useRequirePaid()

  const { id } = useParams(); // batch _id from slug
  const [students, setStudents] = useState([]);
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch batch info
  useEffect(() => {
    async function fetchBatch() {
      try {
        const res = await fetch("/api/batch");
        if (!res.ok) throw new Error("Failed to fetch batches");
        const data = await res.json();

        const foundBatch = data.find((b) => b._id === id);
        setBatch(foundBatch || null);
      } catch (error) {
        console.error("Error fetching batch:", error);
      }
    }

    if (id) fetchBatch();
  }, [id]);

  // Fetch students and filter by batch_id
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/students"); // get ALL students
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();

        const filtered = data.filter((s) => s.batch_id === id);
        setStudents(filtered);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchStudents();
  }, [id]);

  if (loading) return <p className="text-white p-6">Loading students...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Students in {batch ? batch.batch_name : "this Batch"}
      </h1>

      {students.length === 0 ? (
        <p className="text-gray-300">No students found for this batch.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              id={student._id}
              name={student.name}
              phone={student.phone_number || ""}
              batchTime={batch?.batch_time || ""}
              className={batch?.class || ""}
              subject={batch?.subject || ""}
              paid={student.payment_status || false}
              amount={batch?.payment_amount || null}
              onDeleteSuccess={() =>
                setStudents((prev) => prev.filter((s) => s._id !== student._id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
