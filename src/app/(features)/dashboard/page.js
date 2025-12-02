"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StudentCard from "@/components/studentCard";
import SectionHeader from "@/components/SectionHeader";
import Search from "@/components/Search";
import DownloadButton from "@/components/report";
import DummyButton from "@/components/DummyButton";
import InstallPWAButton from "@/components/InstallPWAButton";
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
  LogOut,
  Info
} from "lucide-react";

import useRequirePaid from "@/utils/requireAuth";

// Update this version number whenever you release new updates
const CURRENT_VERSION = "0.2.4";

// Define your updates here
const UPDATES = {
  "0.2.1": {
    fixed: [
      "Fixed student export and payment status reseting button",
      "Fixed student edit feature",
    ]
  },
  "0.2.2": {
    new: [
      "Added Install PWA button",
    ],
    fixed: [
      "Changed get started  button to signup for better usability",
    ]
  },
  "0.2.3": {
    new: [
      "Added Install PWA button",
      "Attendance submission system",
    ],
    fixed: [
      "Changed get started  button to signup for better usability",
    ]
  },
  "0.2.4": {
    fixed: [
      "- Patch for the new attendance tracking feature. ",
    ]
  },


};

// Modern Button Component
function ModernButton({ title, href, icon: Icon, variant = "default", visibility }) {
  const baseClasses = "group relative flex flex-col lg:flex-row items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-sm";
  
  const variants = {
    default: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
  };

  return (
    <Link href={href} className={`${baseClasses} ${variants[variant]} ${visibility}`}>
      {Icon && <Icon className="w-4 h-4" />}
      <span>{title}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </Link>
  );
}

// Modern Dummy Button Component
function ModernDummyButton({ title, icon: Icon }) {
  return (
    <div className="group relative flex flex-col lg:flex-row items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold bg-gray-100 text-gray-400 cursor-not-allowed text-sm">
      {Icon && <Icon className="w-4 h-4" />}
      <span>{title}</span>
      <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full lg:ml-2">Coming Soon</span>
    </div>
  );
}

function formatBDT(amount){
  if(isNaN(Number(amount))) return amount;
  return Number(amount).toLocaleString("en-IN"); 
}

export default function Home() {
  useRequirePaid();

  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Filter state
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStudyDays, setSelectedStudyDays] = useState("");

  // SMS Modal state
  const [showSmsModal, setShowSmsModal] = useState(false);
  
  // NEW: Updates Modal state
  const [showUpdatesModal, setShowUpdatesModal] = useState(false);
  const [updatesToShow, setUpdatesToShow] = useState({ new: [], fixed: [] });

  // Show SMS modal once
  useEffect(() => {
    const alreadyShown = localStorage.getItem("smsIntegrationShown");
    if (!alreadyShown) {
      setShowSmsModal(true);
      localStorage.setItem("smsIntegrationShown", "true");
    }
  }, []);

  // NEW: Check for updates
  useEffect(() => {
    const lastSeenVersion = localStorage.getItem("lastSeenVersion");

    // Convert version string to number array for proper comparison
    const parseVersion = (v) => v.split('.').map(Number);

    // Filter versions that are newer than last seen
    const versionsToShow = Object.keys(UPDATES)
      .filter(v => {
        if (!lastSeenVersion) return true;
        const [vMaj, vMin, vPatch] = parseVersion(v);
        const [lMaj, lMin, lPatch] = parseVersion(lastSeenVersion);
        if (vMaj > lMaj) return true;
        if (vMaj === lMaj && vMin > lMin) return true;
        if (vMaj === lMaj && vMin === lMin && vPatch > lPatch) return true;
        return false;
      })
      .sort((a, b) => {
        const [aMaj, aMin, aPatch] = parseVersion(a);
        const [bMaj, bMin, bPatch] = parseVersion(b);
        if (aMaj !== bMaj) return aMaj - bMaj;
        if (aMin !== bMin) return aMin - bMin;
        return aPatch - bPatch;
      });

    if (versionsToShow.length > 0) {
      const allUpdates = { new: [], fixed: [] };
      versionsToShow.forEach(version => {
        allUpdates.new.push(...(UPDATES[version].new ?? []));
        allUpdates.fixed.push(...(UPDATES[version].fixed ?? []));
      });

      if (allUpdates.new.length > 0 || allUpdates.fixed.length > 0) {
        setUpdatesToShow(allUpdates);
        setShowUpdatesModal(true);
      }
    }
  }, []);


  // Fetch students
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`/api/students`);
        const data = await res.json();

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

  const safeStudents = Array.isArray(students) ? students : [];
  const safeResults = Array.isArray(results) ? results : [];

  const batchTimes = [...new Set(safeStudents.map((s) => s?.batch_time || ""))];
  const studyDays = [...new Set(safeStudents.flatMap((s) => s?.study_days || []))];

  const filteredResults = safeResults.filter((student) => {
    const batchMatch = selectedBatch ? student?.batch_time === selectedBatch : true;
    const studyDaysMatch = selectedStudyDays ? student?.study_days?.includes(selectedStudyDays) : true;
    return batchMatch && studyDaysMatch;
  });

  const total = safeStudents.length;
  const totalPaid = safeStudents.filter((student) => student?.payment_status).length;
  const unpaid = total - totalPaid;
  const totalPaidAmount = safeStudents
    .filter(s => s.payment_status)
    .reduce((sum, s) => sum + (s.payment_amount || 0), 0);

  const handleUpdatesSeen = () => {
    localStorage.setItem("lastSeenVersion", CURRENT_VERSION);
    setShowUpdatesModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-5 lg:mb-6">
          
          <Link href="/students" className="group">
            <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0 mb-1 lg:mb-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 lg:mb-3">
                  <Users className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                </div>
                <span className="text-xl lg:text-3xl font-bold text-gray-900">
                  {loading ? "..." : total}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-600">Total Students</p>
            </div>
          </Link>

          <Link href="/total-paid" className="group">
            <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0 mb-1 lg:mb-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 lg:mb-3">
                  <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                </div>
                <div>
                  <span className="text-xl lg:text-3xl font-bold text-gray-900">
                    {loading ? "..." : totalPaid}
                  </span>
                  <span className="text-gray-400 text-sm lg:text-lg font-normal">/{total}</span>
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600">Students Paid</p>
            </div>
          </Link>

          <Link href="/total-unpaid" className="group">
            <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0 mb-1 lg:mb-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 lg:mb-3">
                  <XCircle className="w-4 h-4 lg:w-5 lg:h-5 text-red-600" />
                </div>
                <div>
                  <span className="text-xl lg:text-3xl font-bold text-gray-900">
                    {loading ? "..." : unpaid}
                  </span>
                  <span className="text-gray-400 text-sm lg:text-lg font-normal">/{total}</span>
                </div>
              </div>
              <p className="text-xs font-medium text-gray-600">Students Unpaid</p>
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-3 lg:p-4 shadow-sm border border-gray-100">
            <div className="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-0 mb-1 lg:mb-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 lg:mb-3">
                <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-600" />
              </div>
              <span className="text-lg lg:text-2xl font-bold text-gray-900">
                {loading ? "..." : `৳${formatBDT(totalPaidAmount)}`}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-600">Total Collected</p>
          </div>
        </div>

        <div className="mb-5 lg:mb-6">
          <SectionHeader />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <ModernButton 
            title="Results" 
            href="/results" 
            icon={BarChart3}
            variant="default"
          />

          <ModernButton 
            visibility={process.env.NEXT_PUBLIC_COACHING === "true" ? "" : "hidden"}
            title="Batches" 
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

          <InstallPWAButton />
          
          <button
            onClick={() => setShowMoreOptions(true)}
            className="group relative flex flex-col lg:flex-row items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-sm bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>

        {showMoreOptions && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMoreOptions(false)}>
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">More Options</h2>
                <button 
                  onClick={() => setShowMoreOptions(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-3">
                <ModernDummyButton 
                  title="Notice Board" 
                  icon={Bell}
                />
                <ModernButton 
                  title="Attendance Tracker" 
                  href="/attendance" 
                  icon={BarChart3}
                  variant="default"
                />

                <ModernDummyButton 
                  title="Guardian Portal" 
                  icon={Bell}
                />
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 mb-6 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs font-medium text-gray-600 mb-2">Download Reports</p>
              <DownloadButton />
            </div>
            <Link href="/students" className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
              <p className="text-xs font-medium text-gray-600 mb-2">View All Students</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{total}</span>
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* SMS Integrated Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl text-center relative">
            <h2 className="text-xl font-bold text-gray-900 mb-2">🎉 SMS Integrated!</h2>
            <p className="text-gray-600 text-sm mb-4">
              Your SMS service is now connected.  
              You can now send notifications to students instantly.
            </p>

            <button
              onClick={() => setShowSmsModal(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* NEW: Updates Modal */}
      {showUpdatesModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl text-center relative">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">What&apos;s New in v{CURRENT_VERSION}</h2>
            
            {updatesToShow.new.length > 0 && (
              <div className="mb-4 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">New Features:</h3>
                <ul className="space-y-1">
                  {updatesToShow.new.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {updatesToShow.fixed.length > 0 && (
              <div className="mb-4 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Bug Fixes:</h3>
                <ul className="space-y-1">
                  {updatesToShow.fixed.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleUpdatesSeen}
              className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}