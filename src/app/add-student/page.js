'use client'

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UserPlus, 
  User, 
  Phone, 
  Clock, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  DollarSign,
  CheckCircle,
  AlertTriangle 
} from "lucide-react";

import useRequirePin from "@/utils/useRequirePin";


export default function AddStudentPage() {
  useRequirePin();


  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const visibilityHidden = process.env.NEXT_PUBLIC_TUITION ? "hidden" : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = formRef.current;

    // Get values from the form elements
    const name = form.name.value.trim();
    const phone_number = form.phone_number.value.trim();
    const batch_time = form.batch_time.value.trim().toLowerCase();
    const className = form.class.value.trim();
    const subject = form.subject.value.trim();
    const payment_status = form.payment_status.checked;
    const payment_amount = Number(form.payment_amount.value);
    const study_days = form.study_days.value;

    

    // Basic validation
    // if (
    //   !name ||
    //   !phone_number ||
    //   !batch_time ||
    //   !className ||
    //   !subject ||
    //   !form.payment_amount.value ||
    //   !study_days
    // ) {
    //   setError("Please fill in all fields.");
    //   setLoading(false);
    //   return;
    // }

    try {
      const res = await fetch(`/api/students/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone_number,
          batch_time,
          class: className,
          subject,
          payment_status,
          payment_amount,
          study_days,
        }),
      });
      if (res.ok) {
        router.push("/"); // Redirect to home or wherever
      } else {
        const data = await res.json();
        setError(data.message || "Failed to add student.");
      }
    } catch (err) {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Add New Student</h1>
          </div>
          <p className="text-gray-600">Add a new student to your teaching roster</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                  <User className="w-3 h-3 text-purple-600" />
                </div>
                Student Name
              </label>
              <input 
                name="name" 
                placeholder="Enter student's full name" 
                type="text" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                required 
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                  <Phone className="w-3 h-3 text-blue-600" />
                </div>
                Phone Number
              </label>
              <input 
                name="phone_number" 
                placeholder="Enter phone number" 
                type="text" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                required 
              />
              <div className="mt-2 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-700">
                  <span className="font-medium">Note:</span> Please avoid using +88 country code
                </p>
              </div>
            </div>

            {/* Batch Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
                  <Clock className="w-3 h-3 text-indigo-600" />
                </div>
                Batch Time
              </label>
              <input 
                name="batch_time" 
                placeholder="e.g., 4:00 PM, 5:30 AM" 
                type="text" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                required 
              />
              <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Format:</span> Use format like 1am, 1pm, etc.
                </p>
              </div>
            </div>

            {/* Class and Subject Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className={`${visibilityHidden}`}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                    <GraduationCap className="w-3 h-3 text-green-600" />
                  </div>
                  Class
                </label>
                <input
                  type="text"
                  name="class"
                  placeholder="e.g., 5, 10, 12"
                  pattern="\d*"
                  inputMode="numeric"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                
                />
                <div className="mt-2 flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Format:</span> Numbers only (1, 2, 3, 4...)
                  </p>
                </div>
              </div>

              <div className={`${visibilityHidden}`}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-orange-600" />
                  </div>
                  Subject
                </label>
                <input 
                  name="subject" 
                  placeholder="e.g., Mathematics, Physics" 
                  type="text" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                   
                />
              </div>
            </div>

            {/* Study Days */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <div className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center">
                  <Calendar className="w-3 h-3 text-pink-600" />
                </div>
                Study Days
              </label>
              <select
                name="study_days"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="">Select study days pattern</option>
                <option value="smw">Saturday, Monday, Wednesday (SMW)</option>
                <option value="stt">Sunday, Tuesday, Thursday (STT)</option>
                <option value="regular">Regular (All Days)</option>
              </select>
            </div>

            {/* Payment Status */}
            <div className="bg-gray-50 rounded-xl p-4">
              <label htmlFor="payment_status" className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    name="payment_status"
                    type="checkbox"
                    id="payment_status"
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-lg peer-checked:border-green-500 peer-checked:bg-green-500 transition-all duration-200 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="font-medium text-gray-700">Mark as Paid</span>
                </div>
              </label>
            </div>

            {/* Payment Amount */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <div className="w-5 h-5 bg-emerald-100 rounded flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-emerald-600" />
                </div>
                Payment Amount
              </label>
              <input
                name="payment_amount"
                type="number"
                placeholder="Enter payment amount"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                min="0"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding Student...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Add Student
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
