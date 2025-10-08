'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Clock, BookOpen, GraduationCap, DollarSign } from "lucide-react";
import useRequirePaid from "@/utils/requireAuth";




export default function Batches() {
    useRequirePaid()

    const [pin, setPin] = useState(null);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    
    // Delete batch
    // delete students related to this batch
    async function DeleteRelatedStudents(id){
        try {
            const res = await fetch(`/api/students`)
            if (!res.ok) throw new Error("Failed to fetch students");
            const data = await res.json();


            const filteredData = data.filter((s) => s.batch_id === id);
            // delete these students one by one with a loop
            for (let i = 0; i < filteredData.length; i++){
                const res = await fetch(`/api/students/${filteredData[i]._id}/delete`, {
                    method: "DELETE",
                });
                if (!res.ok) {
                    throw new Error(data.error || "Failed to delete student");
                }
            }
            
        } catch (error) {
            console.log(error)
        }
    };


    async function handleDelete(id) {
        if (!confirm("Deleting this batch will also delete every student related to this batch.\nAre you sure?")) return;

        

        try {
            await DeleteRelatedStudents(id);
            const res = await fetch(`/api/batch/delete/${id}`, {
                method: "DELETE", 
            })
            if (!res.ok) throw new Error("Failed to delete batch");
            const data = await res.json();
            setBatches(batches.filter((b) => b._id !== id));
            alert(data.message);
            console.log(data)
        } catch (err) {
            console.error("Failed to delete batch:", err);
            alert(`Failed to delete batch: ${err.message}`);
        }
    }

    // Loading UI
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading batches...</p>
                </div>
            </div>
        );
    }

    // No batches UI
    if (batches.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium text-lg">No batches found</p>
                    <p className="text-gray-400 text-sm mt-1">Start by creating your first batch</p>
                </div>
            </div>
        );
    }

    // Main UI
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Batches</h1>
                    <p className="text-gray-600 mt-2">Manage your teaching batches</p>
                </div>

                {/* Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {batches.map((batch) => (
                        <div
                            key={batch._id}
                            onClick={() => router.push(`/batches/${batch._id}`)}
                            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 hover:-translate-y-1"
                        >
                            {/* Delete button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(batch._id);
                                }}
                                className="absolute top-4 right-4 p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100 shadow-sm z-10"
                                aria-label="Delete batch"
                            >
                                <Trash2 size={16} />
                            </button>

                            {/* Batch Name */}
                            <div className="mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                                    {batch.batch_name}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-gray-600">{batch.time}</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <GraduationCap className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Class</p>
                                        <p className="text-sm font-medium text-gray-900">{batch.class}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Subject</p>
                                        <p className="text-sm font-medium text-gray-900">{batch.subject}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Monthly Fee</p>
                                        <p className="text-sm font-medium text-gray-900">৳{batch.payment_amount}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Days */}
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Schedule</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {batch.days.map((day) => (
                                        <span
                                            key={day}
                                            className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            {day}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Hover indicator */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
