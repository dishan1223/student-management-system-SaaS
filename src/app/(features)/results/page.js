"use client";

import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [batchFilter, setBatchFilter] = useState("");

  const [subjectFilter, setSubjectFilter] = useState("");
  const [totalMarksFilter, setTotalMarksFilter] = useState("");

  const [marks, setMarks] = useState({});
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students and batches
  useEffect(() => {
    async function fetchData() {
      try {
        const resStudents = await fetch(`api/students`);
        const dataStudents = await resStudents.json();
        setStudents(dataStudents);
        setFiltered(dataStudents);

        const initialMarks = {};
        dataStudents.forEach((s) => {
          initialMarks[s._id] = {
            subject: subjectFilter || "",
            total: totalMarksFilter || "",
            obtained: (s.marks && s.marks[0] && s.marks[0].obtained) || "",
          };
        });
        setMarks(initialMarks);

        const resBatches = await fetch(`api/batch/all`);
        const dataBatches = await resBatches.json();
        setBatches(dataBatches); // array of { _id, batch_name }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter students by batch_id
  useEffect(() => {
    if (batchFilter) {
      setFiltered(students.filter((s) => s.batch_id === batchFilter));
    } else {
      setFiltered(students);
    }
  }, [batchFilter, students]);

  // Update global subject/total for all students
  useEffect(() => {
    setMarks((prev) => {
      const next = { ...prev };
      students.forEach((s) => {
        next[s._id] = {
          subject: subjectFilter || (next[s._id] && next[s._id].subject) || "",
          total: totalMarksFilter || (next[s._id] && next[s._id].total) || "",
          obtained: (next[s._id] && next[s._id].obtained) || "",
        };
      });
      return next;
    });
  }, [subjectFilter, totalMarksFilter, students]);

  const handleObtainedChange = (_id, value) => {
    setMarks((prev) => ({
      ...prev,
      [_id]: { ...prev[_id], obtained: value },
    }));
  };

  const handleSubmit = async () => {
    const resultData = filtered.map((s) => {
      const m = marks[s._id] || {};
      const subject = subjectFilter || m.subject || "";
      const total = totalMarksFilter || m.total || "";
      const obtained = m.obtained !== undefined && m.obtained !== "" ? m.obtained : "Absent";

      return {
        student_id : s._id,
        phone_number: s.phone_number,
        batch_id: s.batch_id,
        marks: [{ subject, total, obtained }],
      };
    });


    try {
      const res = await fetch(`api/submit-results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "results.xlsx";
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

  const hasMarks = Object.values(marks).some((m) => m?.obtained !== undefined && m?.obtained !== "");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white border rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Results Dashboard</h1>
          <p className="text-sm text-gray-600">
            Enter obtained marks for each student. Use the Subject and Total fields to set the subject and total marks for all students. Empty obtained fields will be recorded as "Absent".
          </p>
        </div>

        {/* Batch Filter */}
        <div className="bg-white border rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Students by Batch</h3>
          <div className="w-64">
            <label className="text-sm font-medium text-gray-700">Batch</label>
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Batches</option>
              {batches.map((bt) => (
                <option key={bt._id} value={bt._id}>
                  {bt.batch_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white border rounded-lg p-8 text-center text-gray-600">Loading students...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border rounded-lg p-8 text-center text-gray-600">No students found for the selected batch.</div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Class</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Batch</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">{subjectFilter ? `Obtained (${subjectFilter})` : "Obtained Marks"}</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((s, idx) => {
                    const m = marks[s._id] || {};
                    return (
                      <tr key={s._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-6 py-4 text-sm text-gray-900">{s.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{s.phone_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{s.class}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{batches.find(b => b._id === s.batch_id)?.batch_name || "-"}</td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            placeholder="0"
                            className="w-24 border border-gray-300 rounded-md px-2 py-1 text-center text-sm"
                            value={m.obtained || ""}
                            onChange={(e) => handleObtainedChange(s._id, e.target.value)}
                          />
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">{totalMarksFilter || m.total || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filtered.map((s, idx) => {
                const m = marks[s._id] || {};
                return (
                  <div key={s._id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{s.name}</h3>
                        <p className="text-sm text-gray-600">{s.phone_number}</p>
                        <p className="text-xs text-gray-500 mt-1">Class: {s.class}</p>
                        <p className="text-xs text-gray-500">Batch: {batches.find(b => b._id === s.batch_id)?.batch_name || "-"}</p>
                      </div>
                      <span className="text-xs text-gray-500">#{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">{subjectFilter ? `Obtained (${subjectFilter})` : "Obtained Marks"}</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full border border-gray-300 rounded-md px-2 py-2 text-center text-sm"
                          value={m.obtained || ""}
                          onChange={(e) => handleObtainedChange(s._id, e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Total</label>
                        <div className="w-full border border-gray-100 rounded-md px-2 py-2 text-center text-sm text-gray-600">{totalMarksFilter || m.total || "-"}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center lg:items-end mt-8 space-y-2">
              <button
                onClick={handleSubmit}
                disabled={!hasMarks}
                className={`w-full sm:w-auto px-8 py-3 rounded-md font-semibold transition-colors duration-200 ${
                  hasMarks ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Results
              </button>
              {!hasMarks && <p className="text-xs text-gray-500">⚠️ Please enter at least one student's obtained marks to submit.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
