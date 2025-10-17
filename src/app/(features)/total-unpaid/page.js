"use client";

import { useEffect, useState } from "react";
import StudentCard from "@/components/studentCard";
import { XCircle, Filter, Users, AlertCircle } from "lucide-react";



// Skeleton component for StudentCard
function StudentCardSkeleton() {

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TotalUnpaidPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter state
  const [selectedStudyDay, setSelectedStudyDay] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/students`);
        let data = await res.json();

        // Ensure array and filter safely
        if (!Array.isArray(data)) data = [];
        const unpaidStudents = data.filter((s) => s && s.payment_status !== true);
        setStudents(unpaidStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-200 rounded-xl animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-1/6 animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudentCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Unpaid Students Found</h3>
          <p className="text-gray-600">All students have completed their payments!</p>
        </div>
      </div>
    );
  }

  // unique study days & batch times with null safety
  const studyDays = [...new Set(students.map((s) => s?.study_days || "Unknown").filter(Boolean))];
  const batchTimes = [...new Set(students.map((s) => s?.batch_time || "Unknown").filter(Boolean))];

  // apply filters
  const filteredStudents = students.filter((s) => {
    if (!s) return false;
    const matchDay = selectedStudyDay ? s.study_days === selectedStudyDay : true;
    const matchBatch = selectedBatch ? s.batch_time === selectedBatch : true;
    return matchDay && matchBatch;
  });

  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Unpaid Students
            </h1>
          </div>
          <p className="text-gray-600">
            {filteredStudents.length} of {students.length} students pending payment
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Unpaid Students</h3>
                <p className="text-sm text-gray-600">Students with pending payments</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600">
              {filteredStudents.length}
            </div>
          </div>
        </div>

       
        {/* Students List */}
        {filteredStudents.length === 0 && students.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600 mb-4">No unpaid students match your current filters</p>
            <button
              onClick={() => {
                setSelectedStudyDay("");
                setSelectedBatch("");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((s) => (
              <StudentCard
                key={s?.id || s?._id}
                id={s?.id || s?._id}
                name={s?.name || "Unknown"}
                batchTime={s?.batch_time || "N/A"}
                className={s?.class || "N/A"}
                phone={s?.phone_number || "N/A"}
                subject={s?.subject || "N/A"}
                paid={s?.payment_status || false}
                amount={s?.payment_amount}
                onDeleteSuccess={(id) =>
                  setStudents((prev) => prev.filter((st) => st?.id !== id && st?._id !== id))
                }
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
