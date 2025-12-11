'use client';

import { useEffect, useState } from 'react';
import { User, BookOpen, Calendar, CreditCard, TrendingUp, LogOut, Menu, X } from 'lucide-react';
import GLogin from '@/components/gAuth/GLogin';

// Decode JWT to extract user ID
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function Gportal() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle authentication
  useEffect(() => {
    const token = localStorage.getItem('guardianToken');

    if (!token) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    const decoded = parseJwt(token);

    if (!decoded || !decoded.id) {
      localStorage.removeItem('guardianToken');
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoggedIn(true);

    async function loadStudent() {
      try {
        const res = await fetch(`/api/student/${decoded.id}`);
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Error loading student:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStudent();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('guardianToken');
    window.location.reload();
  };

  // Login page
  if (!loggedIn) return <GLogin />;

  // Loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );

  // Error fallback
  if (!student)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 text-xl font-medium">Unable to load student data</p>
        </div>
      </div>
    );

  // Calculate attendance data (mock data - replace with real data from API)
  const totalDays = 120;
  const absentDays = 15;
  const presentDays = totalDays - absentDays;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);
  
  // Calculate overall performance
  const calculateOverallPerformance = () => {
    if (!student.marks?.length) return 0;
    const validMarks = student.marks.filter(m => m.subject && m.total > 0);
    if (validMarks.length === 0) return 0;
    const total = validMarks.reduce((sum, m) => sum + (m.obtained / m.total) * 100, 0);
    return Math.round(total / validMarks.length);
  };

  const overallPerformance = calculateOverallPerformance();

  // Dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Guardian Portal</h1>
              <p className="text-sm text-gray-500 mt-1">{student.name}</p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Overall Performance */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Overall Performance</h3>
            <p className="text-3xl font-bold text-gray-900">{overallPerformance}%</p>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Attendance</h3>
            <p className="text-3xl font-bold text-gray-900">{attendancePercentage}%</p>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${student.payment_status ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600'} rounded-xl flex items-center justify-center`}>
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Payment Status</h3>
            <p className={`text-2xl font-bold ${student.payment_status ? 'text-green-600' : 'text-red-600'}`}>
              {student.payment_status ? 'Paid' : 'Due'}
            </p>
          </div>

          {/* Total Subjects */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Subjects</h3>
            <p className="text-3xl font-bold text-gray-900">{student.marks?.filter(m => m.subject)?.length || 0}</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Takes 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* Student Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Student Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="text-base font-medium text-gray-900">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="text-base font-medium text-gray-900">{student.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Batch ID</p>
                    <p className="text-base font-medium text-gray-900">{student.batch_id || "Not Assigned"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Admission Date</p>
                    <p className="text-base font-medium text-gray-900">{student.admission_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Monthly Fee</p>
                    <p className="text-base font-medium text-gray-900">৳{student.payment_amount || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Graphs */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Subject-wise Progress</h2>
              </div>

              <div className="space-y-4">
                {student.marks?.filter(m => m.subject)?.map((mark, index) => {
                  const percentage = Math.round((mark.obtained / mark.total) * 100);
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{mark.subject}</span>
                        <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            percentage >= 60 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            percentage >= 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                            'bg-gradient-to-r from-red-500 to-red-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">{mark.obtained} obtained</span>
                        <span className="text-xs text-gray-500">{mark.total} total</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exam Results */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Exam Results & Analysis</h2>
              </div>

              {/* Performance Analysis */}
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-600 mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-blue-700">{overallPerformance}%</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <p className="text-sm text-green-600 mb-1">Highest Score</p>
                  <p className="text-2xl font-bold text-green-700">
                    {student.marks?.length 
                      ? Math.max(...student.marks.filter(m => m.total > 0).map(m => Math.round((m.obtained / m.total) * 100))) 
                      : 0}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <p className="text-sm text-purple-600 mb-1">Total Marks</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {student.marks?.filter(m => m.total > 0).reduce((sum, m) => sum + Number(m.obtained), 0) || 0}/{student.marks?.filter(m => m.total > 0).reduce((sum, m) => sum + Number(m.total), 0) || 0}
                  </p>
                </div>
              </div>

              {/* Visual Graph - Bar Chart */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Performance Graph</h3>
                <div className="space-y-3">
                  {student.marks?.filter(m => m.subject)?.map((mark, index) => {
                    const percentage = Math.round((mark.obtained / mark.total) * 100);
                    return (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-gray-600">{mark.subject}</span>
                          <span className="text-xs font-bold text-gray-900">{percentage}%</span>
                        </div>
                        <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div
                            className={`h-full flex items-center justify-end px-2 transition-all duration-500 ${
                              percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                              percentage >= 60 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                              percentage >= 40 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                              'bg-gradient-to-r from-red-400 to-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-xs font-semibold text-white">{mark.obtained}/{mark.total}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Table */}
              <div className="overflow-x-auto">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Detailed Results</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Marks</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">%</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.marks?.filter(m => m.subject)?.map((mark, index) => {
                      const percentage = Math.round((mark.obtained / mark.total) * 100);
                      const grade = percentage >= 80 ? 'A+' : percentage >= 70 ? 'A' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'F';
                      const gradeColor = percentage >= 80 ? 'text-green-600 bg-green-50' : 
                                       percentage >= 70 ? 'text-blue-600 bg-blue-50' : 
                                       percentage >= 60 ? 'text-yellow-600 bg-yellow-50' : 
                                       'text-red-600 bg-red-50';
                      
                      return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{mark.subject}</td>
                          <td className="py-4 px-4 text-sm text-center text-gray-700">{mark.obtained}/{mark.total}</td>
                          <td className="py-4 px-4 text-sm text-center font-semibold text-gray-900">{percentage}%</td>
                          <td className="py-4 px-4 text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${gradeColor}`}>
                              {grade}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Takes 1/3 */}
          <div className="space-y-8">
            {/* Attendance Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Attendance</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-green-600 mb-1">Present Days</p>
                    <p className="text-3xl font-bold text-green-700">{presentDays}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-sm text-red-600 mb-1">Absent Days</p>
                    <p className="text-3xl font-bold text-red-700">{absentDays}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Total Days</span>
                    <span className="text-sm font-bold text-gray-900">{totalDays}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Attendance Rate</span>
                    <span className="text-sm font-bold text-green-600">{attendancePercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Payment Status</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Monthly Fee</p>
                  <p className="text-2xl font-bold text-gray-900">৳{student.payment_amount || "N/A"}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">Paid Months</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {student.paid_months?.length || 0} months
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {student.paid_months?.length ? (
                      student.paid_months.map((month, i) => (
                        <span
                          key={i}
                          className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-medium border border-green-200"
                        >
                          {month}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No payment history</p>
                    )}
                  </div>
                </div>

                {student.due_months?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">Due Months</h3>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        {student.due_months.length} months
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.due_months.map((month, i) => (
                        <span
                          key={i}
                          className="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-xs font-medium border border-red-200"
                        >
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}