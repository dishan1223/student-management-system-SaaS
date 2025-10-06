'use client'

import { useEffect, useState } from "react";
import StudentCard from "@/components/studentCard";
import useRequirePin from "@/utils/useRequirePin";

function StudentSkeleton() {
    useRequirePin()
  return (
    <div className="border border-gray-300 rounded-2xl px-4 py-3 mb-4 bg-gray-100 w-full animate-pulse">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/3 mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="flex gap-3 items-center ml-3">
          <div className="h-8 w-16 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default function AllStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`);
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-6">All Students</h1>

      {loading ? (
        <>
          <StudentSkeleton />
          <StudentSkeleton />
          <StudentSkeleton />
        </>
      ) : students.length === 0 ? (
        <div className="text-center mt-6">No students found.</div>
      ) : (
        students.map(
          (student) =>
            student && (
              <StudentCard
                key={student.id}
                id={student.id}
                name={student.name}
                batchTime={student.batch_time}
                className={student.class}
                phone={student.phone_number}
                subject={student.subject}
                paid={student.payment_status}
              />
            )
        )
      )}
    </div>
  );
}

