"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiSave, FiCheckCircle, FiUser, FiFilter, FiPhone } from "react-icons/fi";

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [batchFilter, setBatchFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [absentStudents, setAbsentStudents] = useState(new Set());
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch students
        const resStudents = await fetch(`/api/students`);
        if (!resStudents.ok) throw new Error('Failed to fetch students');
        const studentData = await resStudents.json();
        
        setStudents(studentData);
        setFilteredStudents(studentData);
        setAbsentStudents(new Set());

        // Fetch batches
        const resBatches = await fetch(`/api/batch/all`);
        if (!resBatches.ok) throw new Error('Failed to fetch batches');
        const batchData = await resBatches.json();
        
        setBatches(batchData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter by batch
  useEffect(() => {
    if (batchFilter) {
      setFilteredStudents(students.filter((s) => s.batch_id === batchFilter));
    } else {
      setFilteredStudents(students);
    }
  }, [batchFilter, students]);

  const toggleAbsent = (studentId) => {
    setAbsentStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const markAllPresent = () => {
    setAbsentStudents(new Set());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          absentStudents: Array.from(absentStudents),
          allPresent: absentStudents.size === 0,
          batchId: batchFilter || null
        }),
      });

      if (!response.ok) throw new Error('Failed to save attendance');
      
      // --- Backend returned success ---
      alert('Attendance submitted successfully!');
      window.location.href = '/dashboard';

    } catch (error) {
      alert("Error Saving attendance");
      console.error('Error saving attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBatchName = batches.find(b => b._id?.toString() === batchFilter)?.batch_name || 'All Batches';

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="space-y-5">
      {/* Header Skeleton */}
      <div className="text-center mb-6">
        <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto mb-3"></div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="h-8 bg-gray-200 rounded-full w-48"></div>
          <div className="h-8 bg-gray-200 rounded-full w-32"></div>
        </div>
      </div>

      {/* Controls Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Students List Skeleton */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="h-3 bg-gray-200 rounded w-28"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-28"></div>
                  <div className="h-2 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Student Attendance
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-600">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
              <FiCalendar className="mr-2 text-blue-600 w-4 h-4" />
              <span className="text-sm font-medium">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="bg-blue-50 text-blue-700 font-medium px-4 py-2 rounded-full border border-blue-100 shadow-sm text-sm">
              {selectedBatchName}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 flex items-center">
                <FiCalendar className="mr-1.5 text-blue-600 w-3.5 h-3.5" />
                Select Date
              </label>
              <div className="relative group">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700 flex items-center justify-between">
                <span className="flex items-center">
                  <FiFilter className="mr-1.5 text-blue-600 w-3.5 h-3.5" />
                  Filter by Batch
                </span>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden text-blue-600 text-xs px-2 py-1 rounded-full bg-blue-50"
                >
                  {showFilters ? 'Hide' : 'Show'}
                </button>
              </label>
              <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
                <select
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                  className="block w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Batches</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.batch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center space-x-2 transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4" />
                    <span>Save Attendance</span>
                    {absentStudents.size > 0 && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {absentStudents.size}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {submitSuccess && (
            <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center shadow-sm">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <FiCheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-blue-800 font-semibold text-sm">Success!</p>
                <p className="text-blue-700 text-xs">
                  {absentStudents.size === 0 
                    ? 'All students marked as present' 
                    : 'Attendance has been saved successfully'}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-xs text-gray-600 font-medium">
              {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} total
            </p>
            <div className="flex items-center space-x-2">
              {absentStudents.size > 0 && (
                <button
                  onClick={markAllPresent}
                  className="text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  Mark All Present
                </button>
              )}
              <p className={`text-xs font-semibold px-3 py-1 rounded-full ${
                absentStudents.size === 0 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {absentStudents.size === 0 ? 'All Present' : `${absentStudents.size} Absent`}
              </p>
            </div>
          </div>
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-gray-300 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500 text-sm">Try adjusting your filter criteria</p>
            </div>
          ) : (
            filteredStudents.map((student) => {
              const sId = student._id?.toString();
              const isAbsent = absentStudents.has(sId);
              
              return (
                <div 
                  key={sId} 
                  className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${
                    isAbsent ? 'border-red-200 bg-red-50' : 'border-gray-100'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${
                          isAbsent ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <FiUser className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-semibold truncate ${
                            isAbsent ? 'text-red-900' : 'text-gray-900'
                          }`}>
                            {student.name}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <FiPhone className="mr-1 h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{student.phone_number || 'No phone'}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAbsent(sId)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 ${
                          isAbsent 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isAbsent ? '✓ Present' : '✗ Absent'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}