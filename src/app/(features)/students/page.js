"use client";
import StudentCard from "@/components/studentCard.jsx";
import Search from "@/components/Search.jsx";
import { useEffect, useState } from "react";
import { Users, Filter, Search as SearchIcon, AlertCircle } from "lucide-react";

import useRequirePin from "@/utils/useRequirePin";

export default function Students() {

    useRequirePin();
    
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]); // search results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudyDays, setSelectedStudyDays] = useState("");

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students`);
        if (!res.ok) throw new Error("Failed to fetch students");
        
        const data = await res.json();
        
        // Handle null/undefined data and ensure we have an array
        const safeData = Array.isArray(data) ? data : (data ? [data] : []);
        
        setStudents(safeData);
        setResults(safeData);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.message);
        setStudents([]);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // Safe array operations with null checks
  const safeStudents = Array.isArray(students) ? students : [];
  const safeResults = Array.isArray(results) ? results : [];

  const batchTimes = [...new Set(safeStudents.map((s) => s?.batch_time).filter(Boolean))];
  const studyDays = [...new Set(safeStudents.flatMap((s) => s?.study_days || []).filter(Boolean))];

  const filteredResults = safeResults.filter((student) => {
    if (!student) return false;
    
    const batchMatch = selectedBatch ? student.batch_time === selectedBatch : true;
    const studyDaysMatch = selectedStudyDays ? student.study_days?.includes(selectedStudyDays) : true;
    return batchMatch && studyDaysMatch;
  });

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse mb-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Students</h1>
          </div>
          <p className="text-gray-600">
            {loading ? "Loading..." : `Manage your ${safeStudents.length} students`}
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batch Time</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Batch Times</option>
                {batchTimes.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Study Days</label>
              <select
                value={selectedStudyDays}
                onChange={(e) => setSelectedStudyDays(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Study Days</option>
                {studyDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SearchIcon className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Search Students</h2>
          </div>
          <Search students={safeStudents} onResults={setResults} />
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Students</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredResults.length === 0 && safeStudents.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600 mb-4">No students match your current filters</p>
              <button
                onClick={() => {
                  setSelectedBatch("");
                  setSelectedStudyDays("");
                  setResults(safeStudents);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* No Data State */}
          {!loading && !error && safeStudents.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first student</p>
              <a
                href="/add-student"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                <Users className="w-4 h-4" />
                Add Student
              </a>
            </div>
          )}

          {/* Students List */}
          {!loading && !error && filteredResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredResults.length} of {safeStudents.length} students
                </p>
              </div>
              
              {filteredResults.map((student) => (
                student && (
                  <StudentCard
                    key={student.id || student._id}
                    id={student.id || student._id}
                    name={student.name}
                    batchTime={student.batch_time}
                    className={student.class}
                    phone={student.phone_number}
                    subject={student.subject}
                    paid={student.payment_status}
                    amount={student.payment_amount}
                  />
                )
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
