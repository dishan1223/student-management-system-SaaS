"use client";

import { useEffect, useState } from "react";

import useRequirePin from "@/utils/useRequirePin";

export default function ResultsPage() {
    useRequirePin();

  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [batchFilter, setBatchFilter] = useState("");
  const [studyDaysFilter, setStudyDaysFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch students
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`);
        const data = await res.json();
        setStudents(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter students whenever filters change
  useEffect(() => {
    let result = students;
    if (batchFilter) {
      result = result.filter((s) => s.batch_time === batchFilter);
    }
    if (studyDaysFilter) {
      result = result.filter((s) => s.study_days === studyDaysFilter);
    }
    if (classFilter) {
      result = result.filter((s) => s.class === classFilter);
    }
    setFiltered(result);
  }, [batchFilter, studyDaysFilter, classFilter, students]);

  const handleMarkChange = (id, field, value) => {
    setMarks((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };



    const handleSubmit = async () => {
        const resultData = filtered.map((s) => ({
            name: s.name,
            phone_number: s.phone_number,
            class: s.class,
            batch_time: s.batch_time,
            study_days: s.study_days,
            cq: marks[s.id]?.cq || "Absent",
            mcq: marks[s.id]?.mcq || "Absent",
        }));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submit-results`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resultData),
            });

            if (!res.ok) throw new Error("Failed to submit");

            // Convert response to blob (Excel file)
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            // Trigger download
            const a = document.createElement("a");
            a.href = url;
            a.download = "results.xlsx"; // filename
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            alert("✅ Results submitted successfully and Excel downloaded!");
        } catch (err) {
            console.error(err);
            alert("❌ Error submitting results");
        }
    };



  // 🔹 Collect unique values dynamically
  const uniqueBatchTimes = [...new Set(students.map((s) => s.batch_time))];
  const uniqueStudyDays = [...new Set(students.map((s) => s.study_days))];
  const uniqueClasses = [...new Set(students.map((s) => s.class))];

  const formatStudyDays = (sd) => {
    if (sd === "smw") return "Saturday, Monday, Wednesday";
    if (sd === "stt") return "Sunday, Tuesday, Thursday";
    return "Regular";
  };

  // 🔹 Check if at least one student has marks
  const hasMarks = Object.values(marks).some((m) => m?.cq || m?.mcq);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white border rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Results Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Enter CQ and MCQ marks for each student. Empty fields will automatically be marked as &quot;Absent&quot;.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white border rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Filter Students
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Batch Time Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Batch Time
              </label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Batches</option>
                {uniqueBatchTimes.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            {/* Study Days Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Study Days
              </label>
              <select
                value={studyDaysFilter}
                onChange={(e) => setStudyDaysFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Study Days</option>
                {uniqueStudyDays.map((sd) => (
                  <option key={sd} value={sd}>
                    {formatStudyDays(sd)}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Class</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="bg-white border rounded-lg p-8 text-center text-gray-600">
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border rounded-lg p-8 text-center text-gray-600">
            No students found for the selected filters.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Batch Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Study Days
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      CQ Marks
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      MCQ Marks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((s, idx) => (
                    <tr
                      key={s.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.phone_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.class}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.batch_time}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatStudyDays(s.study_days)}</td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          placeholder="0"
                          className="w-20 border border-gray-300 rounded-md px-2 py-1 text-center text-sm"
                          onChange={(e) => handleMarkChange(s.id, "cq", e.target.value)}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          placeholder="0"
                          className="w-20 border border-gray-300 rounded-md px-2 py-1 text-center text-sm"
                          onChange={(e) => handleMarkChange(s.id, "mcq", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filtered.map((s, idx) => (
                <div key={s.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{s.name}</h3>
                      <p className="text-sm text-gray-600">{s.phone_number}</p>
                      <p className="text-xs text-gray-500 mt-1">Class: {s.class}</p>
                      <p className="text-xs text-gray-500">Batch: {s.batch_time}</p>
                      <p className="text-xs text-gray-500">Days: {formatStudyDays(s.study_days)}</p>
                    </div>
                    <span className="text-xs text-gray-500">#{idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">CQ Marks</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full border border-gray-300 rounded-md px-2 py-2 text-center text-sm"
                        onChange={(e) => handleMarkChange(s.id, "cq", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">MCQ Marks</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full border border-gray-300 rounded-md px-2 py-2 text-center text-sm"
                        onChange={(e) => handleMarkChange(s.id, "mcq", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center lg:items-end mt-8 space-y-2">
              <button
                onClick={handleSubmit}
                disabled={!hasMarks}
                className={`w-full sm:w-auto px-8 py-3 rounded-md font-semibold transition-colors duration-200 ${
                  hasMarks
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Results
              </button>
              {!hasMarks && (
                <p className="text-xs text-gray-500">
                  ⚠️ Please enter at least one student&apos;s marks to submit.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

