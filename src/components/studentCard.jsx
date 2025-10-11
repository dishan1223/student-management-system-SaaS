'use client'
import { useState } from "react";
import { Trash2, User, Clock, GraduationCap, Phone, BookOpen, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function StudentCard({
  id,
  name,
  batchTime,
  className,
  phone,
  subject,
  paid: initialPaid,
  amount,
  onDeleteSuccess,
}) {
  const [paid, setPaid] = useState(initialPaid);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleStatusClick = async () => {
    if (!window.confirm("Are you sure you want to change payment status?")) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/students/${id}/toggle-payment`,
        { method: "PATCH" ,
            headers: {
                "Content-Type": "application/json",
            }
        }
      );
      if (res.ok) {
        setPaid((prev) => !prev);
      } else {
        alert("Status update failed");
      }
    } catch (err) {
      alert("Status update failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(
        `/api/students/${id}/delete`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setDeleted(true);
        if (onDeleteSuccess) onDeleteSuccess(id);
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  if (deleted) return null;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden">
      
      {/* Main Content */}
      <Link href={`/student/${id}`} className="block p-6 hover:bg-gray-50 transition-colors duration-200">
        
        {/* Header with Name and Batch Time */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{batchTime}</span>
              </div>
            </div>
          </div>

          {/* Payment Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
            paid 
              ? "bg-green-100 text-green-700 border border-green-200" 
              : "bg-red-100 text-red-700 border border-red-200"
          }`}>
            {paid ? (
              <>
                <CheckCircle className="w-3 h-3" />
                <span>Paid</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" />
                <span>Unpaid</span>
              </>
            )}
          </div>
        </div>

        {/* Student Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Class */}
          <div className={`flex items-center gap-2`}>
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-3 h-3 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Class</p>
              <p className="text-sm font-medium text-gray-900">{className}</p>
            </div>
          </div>

          {/* Subject */}
          <div className={` flex items-center gap-2`}>
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Subject</p>
              <p className="text-sm font-medium text-gray-900">{subject}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone</p>
              <p className="text-sm font-medium text-gray-900">{phone}</p>
            </div>
          </div>
        </div>

        {/* Payment Amount (if provided) */}
        {amount && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Amount</span>
              <span className="text-lg font-semibold text-gray-900">৳{amount}</span>
            </div>
          </div>
        )}

      </Link>

      {/* Action Buttons */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        
        {/* Payment Status Button */}
        <button
          onClick={handleStatusClick}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            paid
              ? "bg-green-100 hover:bg-green-200 text-green-700 border border-green-200"
              : "bg-red-100 hover:bg-red-200 text-red-700 border border-red-200"
          } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          aria-label={paid ? "Mark as unpaid" : "Mark as paid"}
        >
          {loading ? (
            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          ) : paid ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <XCircle className="w-3 h-3" />
          )}
          <span>{loading ? "Updating..." : paid ? "Mark Unpaid" : "Mark Paid"}</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="p-2.5 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 rounded-xl transition-all duration-200 hover:scale-105 border border-red-200"
          aria-label="Delete student"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
}
