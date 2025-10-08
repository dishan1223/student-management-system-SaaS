'use client'

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  UserPlus, 
  User, 
  Phone, 
  GraduationCap, 
  AlertTriangle
} from "lucide-react";



export default function AddStudentPage() {


  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const router = useRouter();

  // fetch batches for dropdown
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch("/api/batch");
        if (res.ok) {
          const data = await res.json();
          setBatches(data);
        }
      } catch (err) {
        console.error("Failed to load batches:", err);
      }
    };
    fetchBatches();
  }, []);

  const handleBatchChange = (e) => {
    const batchId = e.target.value;
    const batch = batches.find(b => b._id === batchId);
    setSelectedBatch(batch);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // get todays date when a student is added
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const form = formRef.current;

    const name = form.name.value.trim();
    const phone_number = form.phone_number.value.trim();
    const batch_id = form.batch.value;

    if (!selectedBatch) {
      setError("Please select a valid batch.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/students/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone_number,
          batch_id,
          payment_amount: selectedBatch.payment_amount, // automatically from batch
          admission_date: formattedDate,
        }),
      });
      if (res.ok) {
        router.push("/");
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
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Add New Student
            </h1>
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

            {/* Batch Selection */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <div className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center">
                  <GraduationCap className="w-3 h-3 text-pink-600" />
                </div>
                Select Batch
              </label>
              <select
                name="batch"
                onChange={handleBatchChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                required
              >
                <option value="">Choose a batch</option>
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.batch_name} (৳{batch.payment_amount})
                  </option>
                ))}
              </select>
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
