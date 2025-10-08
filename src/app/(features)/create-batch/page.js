'use client'

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Clock, GraduationCap, BookOpen, DollarSign, Calendar } from "lucide-react";
import useRequirePaid from "@/utils/requireAuth";

export default function CreateBatch() {;
    useRequirePaid();
    const formRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedDays, setSelectedDays] = useState([]);
    const router = useRouter();
    
    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    const handleCheckboxChange = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(formRef.current);
        const data = {
            batch_name: formData.get("batch_name"),
            time: formData.get("time"),
            class: formData.get("class"),
            subject: formData.get("subject"),
            payment_amount: Number(formData.get("payment_amount")),
            days: selectedDays
        };

        try {
            const res = await fetch(`/api/batch/new`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error("Failed to create batch");

            router.push("/"); // redirect to batch list or wherever you want
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Create New Batch</h1>
                    <p className="text-gray-600 mt-2">Set up a new teaching batch with schedule and details</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Batch Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                                    <Plus className="w-3 h-3 text-purple-600" />
                                </div>
                                Batch Name
                            </label>
                            <input 
                                name="batch_name"
                                placeholder="Enter batch name (e.g., Morning Math Class)" 
                                type="text" 
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                required 
                            />
                        </div>

                        {/* Batch Time */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                                    <Clock className="w-3 h-3 text-blue-600" />
                                </div>
                                Batch Time
                            </label>
                            <input 
                                name="time"
                                placeholder="Enter time (e.g., 4:00 PM, 5:30 AM)" 
                                type="text" 
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                required 
                            />
                        </div>

                        {/* Class and Subject Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                                        <GraduationCap className="w-3 h-3 text-green-600" />
                                    </div>
                                    Class
                                </label>
                                <input 
                                    name="class" 
                                    placeholder="e.g., Grade 5, Class 10" 
                                    type="text" 
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                                    required 
                                />
                            </div>

                            <div>
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
                                    required 
                                />
                            </div>
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

                        {/* Days Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                                <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
                                    <Calendar className="w-3 h-3 text-indigo-600" />
                                </div>
                                Select Days
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {days.map((day) => (
                                    <label key={day} className={`relative flex items-center justify-center px-4 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                        selectedDays.includes(day) 
                                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                                    }`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedDays.includes(day)}
                                            onChange={() => handleCheckboxChange(day)}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-medium">{day}</span>
                                        {selectedDays.includes(day) && (
                                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating Batch...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Create Batch
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
