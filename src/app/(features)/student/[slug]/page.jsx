'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  User, 
  Phone, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  DollarSign, 
  Calendar,
  Edit3,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
  Save,
  Handshake
} from "lucide-react";


export default function StudentDetails() {

  const { slug } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  // batch related informations
  const [batchID, setBatchID] = useState(null);
  const [batch, setBatch] = useState([]);
  const [studyDays, setStudyDays] = useState("")

  const visibilityHidden = process.env.NEXT_PUBLIC_TUITION ? "hidden" : "";

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/student/${slug}`);
        const data = await res.json();
        setStudent(data);
        setBatchID(data.batch_id)
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  // fetch batch data
  useEffect(() => {
    async function fetchBatch() {
      try {
        const res = await fetch("/api/batch");
        if (!res.ok) throw new Error("Failed to fetch batches");
        const data = await res.json();

        const foundBatch = data.find((b) => b._id === batchID);
        setBatch(foundBatch);
        console.log(foundBatch)
        const studyDays = foundBatch.days.join(", ");
        setStudyDays(studyDays);
      } catch (error) {
        console.error("Error fetching batch:", error);
      }
    }

    if (batchID) fetchBatch();
  }, [batchID]);

  //const studyDays = foundBatch.days.join(", ")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    // remove empty fields so they don't overwrite with ""
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
    );

    // Convert class to int and payment_amount to float
    if (filteredData.payment_amount) filteredData.payment_amount = parseFloat(filteredData.payment_amount);

    try {
      const res = await fetch(`/api/student/edit/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredData),
      });
      if (res.ok) {
        alert("Student updated successfully");
        setShowForm(false);
        setFormData({});
        setStudent({ ...student, ...filteredData }); // update UI
      } else {
        console.error("Update failed");
        alert("Update failed");
      }
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Error updating student");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Student Not Found</h2>
          <p className="text-gray-600">The requested student could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Student Profile</h1>
          </div>
          <p className="text-gray-600">View and manage student information</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Student Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Student Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Student Information</h2>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModernInfoCard 
                    icon={<User className="w-4 h-4 text-purple-600" />}
                    iconBg="bg-purple-100"
                    label="Full Name" 
                    value={student.name} 
                  />
                  <ModernInfoCard 
                    icon={<Phone className="w-4 h-4 text-blue-600" />}
                    iconBg="bg-blue-100"
                    label="Phone Number" 
                    value={student.phone_number} 
                  />
                  <ModernInfoCard 
                    
                    icon={<GraduationCap className="w-4 h-4 text-green-600" />}
                    iconBg="bg-green-100"
                    label="Class" 
                    value={batch.class} 
                  />
                  <ModernInfoCard 
                    icon={<Clock className="w-4 h-4 text-indigo-600" />}
                    iconBg="bg-indigo-100"
                    label="Batch Time" 
                    value={batch.time} 
                  />
                  <ModernInfoCard 
                    
                    icon={<BookOpen className="w-4 h-4 text-orange-600" />}
                    iconBg="bg-orange-100"
                    label="Subject" 
                    value={batch.subject} 
                  />
                  <ModernInfoCard 
                    
                    icon={<Handshake className="w-4 h-4 text-pink-600" />}
                    iconBg="bg-pink-100"
                    label="Admission Date" 
                    value={student.admission_date} 
                  />
                  <ModernInfoCard 
                    icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
                    iconBg="bg-emerald-100"
                    label="Payment Amount" 
                    value={`৳${student.payment_amount}`} 
                  />
                  <ModernInfoCard 
                    icon={<Calendar className="w-4 h-4 text-pink-600" />}
                    iconBg="bg-pink-100"
                    label="Study Days" 
                    value={studyDays}
                    colSpan="md:col-span-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment History */}
          <div className="space-y-6">
            
            {/* Payment History Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Paid Months */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Paid Months</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.paid_months?.length > 0 ? (
                        student.paid_months.map((month, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {month}
                          </span>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 px-3 py-2 rounded-xl">
                          <XCircle className="w-4 h-4" />
                          <span>No payments recorded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Due Months */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Due Months</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {student.due_months?.length > 0 ? (
                        student.due_months.map((month, idx) => (
                          <span 
                            key={idx} 
                            className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-medium px-3 py-1.5 rounded-full border border-red-200"
                          >
                            <XCircle className="w-3 h-3" />
                            {month}
                          </span>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500 text-sm bg-gray-50 px-3 py-2 rounded-xl">
                          <CheckCircle className="w-4 h-4" />
                          <span>No dues pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Edit Student</h2>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                
                {/* Form Fields */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 text-purple-600" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter new name"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    placeholder="Enter new phone number"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <GraduationCap className="w-4 h-4 text-green-600" />
                      Class
                    </label>
                    <input
                      type="text"
                      name="class"
                      placeholder="Enter class"
                      onChange={handleChange}
                      pattern="\d*"
                      inputMode="numeric"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Batch Time
                    </label>
                    <input
                      type="text"
                      name="batch_time"
                      placeholder="Enter batch time"
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Enter subject"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 text-pink-600" />
                    Study Days
                  </label>
                  <select
                    name="study_days"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select Study Days</option>
                    <option value="smw">Saturday, Monday, Wednesday</option>
                    <option value="stt">Sunday, Tuesday, Thursday</option>
                    <option value="regular">Regular</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Payment Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="payment_amount"
                    placeholder="Enter payment amount"
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {updating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModernInfoCard({ icon, iconBg, label, value, colSpan = "", visibility }) {
  return (
    <div className={`${visibility} bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-200 ${colSpan}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {label}
          </div>
          <div className="text-sm font-medium text-gray-900 truncate">
            {value || 'Not specified'}
          </div>
        </div>
      </div>
    </div>
  );
}
