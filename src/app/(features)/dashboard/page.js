"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StudentCard from "@/components/studentCard";
import SectionHeader from "@/components/SectionHeader";
import Search from "@/components/Search";
import DownloadButton from "@/components/report";
import DummyButton from "@/components/DummyButton";
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Eye, 
  BookOpen, 
  Plus, 
  BarChart3, 
  UserPlus,
  Bell,
  LogOut
} from "lucide-react";

// Modern Button Component
function ModernButton({ title, href, icon: Icon, variant = "default", visibility }) {
  const baseClasses = "group relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-1 hover:shadow-md";
  
  const variants = {
    default: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
  };

  return (
    <Link href={href} className={`${baseClasses} ${variants[variant]} ${visibility}`}>
      {Icon && <Icon className="w-5 h-5" />}
      <span>{title}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </Link>
  );
}

// Modern Dummy Button Component
function ModernDummyButton({ title, icon: Icon }) {
  return (
    <div className="group relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold bg-gray-100 text-gray-400 cursor-not-allowed">
      {Icon && <Icon className="w-5 h-5" />}
      <span>{title}</span>
      <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full ml-2">Coming Soon</span>
    </div>
  );
}

export default function Home() {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudyDays, setSelectedStudyDays] = useState("");



  // Check localStorage for PIN on mount
  // Fetch students
  useEffect(() => {
    
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students`);
        const data = await res.json();

        // Ensure we always have an array
        const safeData = Array.isArray(data) ? data : [];
        setStudents(safeData);
        setResults(safeData);
      } catch (err) {
        console.error("Failed to fetch students", err);
        setStudents([]);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // Safe defaults for mapping
  const safeStudents = Array.isArray(students) ? students : [];
  const safeResults = Array.isArray(results) ? results : [];

  // Filters
  const batchTimes = [...new Set(safeStudents.map((s) => s?.batch_time || ""))];
  const studyDays = [...new Set(safeStudents.flatMap((s) => s?.study_days || []))];

  // Apply filters
  const filteredResults = safeResults.filter((student) => {
    const batchMatch = selectedBatch ? student?.batch_time === selectedBatch : true;
    const studyDaysMatch = selectedStudyDays ? student?.study_days?.includes(selectedStudyDays) : true;
    return batchMatch && studyDaysMatch;
  });

  // Stats
  const total = safeStudents.length;
  const totalPaid = safeStudents.filter((student) => student?.payment_status).length;
  const unpaid = total - totalPaid;
  const totalPaidAmount = safeStudents
    .filter(s => s.payment_status)
    .reduce((sum, s) => sum + (s.payment_amount || 0), 0);

  // Handle PIN submission
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/login?pin=${pinInput}`);
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userPin", pinInput);
        setPinEntered(true);
      } else {
        alert("Invalid PIN");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };
 
  // Main dashboard content
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
            {process.env.NEXT_PUBLIC_CUSTOMER_}
          </h1>
          <p className="text-gray-600">Manage your teaching dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Total Students */}
          <Link href="/students" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {loading ? "..." : total}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
            </div>
          </Link>

          {/* Total Paid */}
          <Link href="/total-paid" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {loading ? "..." : totalPaid}
                  </span>
                  <span className="text-gray-400 text-lg font-normal">/{total}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">Students Paid</p>
            </div>
          </Link>

          {/* Total Unpaid */}
          <Link href="/total-unpaid" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {loading ? "..." : unpaid}
                  </span>
                  <span className="text-gray-400 text-lg font-normal">/{total}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600">Students Unpaid</p>
            </div>
          </Link>

          {/* Total Paid Amount */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                {loading ? "..." : `৳${totalPaidAmount}`}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Total Collected</p>
          </div>
        </div>

        

        {/* Section Header */}
        <div className="mb-8">
          <SectionHeader />
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <ModernButton 
            title="Result Dashboard" 
            href="/results" 
            icon={BarChart3}
            variant="default"
          />

          <ModernButton 
            visibility={process.env.NEXT_PUBLIC_COACHING === "true" ? "" : "hidden"}
            title="View Batches" 
            href="/batches" 
            icon={BookOpen}
            variant="default"
          />
          <ModernButton 
            visibility={process.env.NEXT_PUBLIC_COACHING === "true" ? "" : "hidden"}
            title="Create Batch" 
            href="/create-batch" 
            icon={Plus}
            variant="primary"
          />
          
          
          <ModernButton 
            title="Add Student" 
            href="/add-students-to-batch" 
            icon={UserPlus}
            variant="success"
          />
          <ModernDummyButton 
            title="Notice Board" 
            icon={Bell}
          />
        </div>

        {/* Download Section */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <DownloadButton />
          </div>
        </div>

        

      </div>
    </div>
  );
}
