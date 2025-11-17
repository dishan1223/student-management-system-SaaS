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
  const [submitting, setSubmitting] = useState(false); // ✅ FIX

  // Fetch data
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
            obtained: (s.marks && s.marks[0]?.obtained) || "",
          };
        });
        setMarks(initialMarks);

        const resBatches = await fetch(`api/batch/all`);
        const dataBatches = await resBatches.json();
        setBatches(dataBatches);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [subjectFilter, totalMarksFilter]);

  // Filter by batch
  useEffect(() => {
    if (batchFilter) {
      setFiltered(students.filter((s) => s.batch_id === batchFilter));
    } else {
      setFiltered(students);
    }
  }, [batchFilter, students]);

  // Update marks when subject or total changes
  useEffect(() => {
    setMarks((prev) => {
      const next = { ...prev };
      students.forEach((s) => {
        next[s._id] = {
          subject: subjectFilter || next[s._id]?.subject || "",
          total: totalMarksFilter || next[s._id]?.total || "",
          obtained: next[s._id]?.obtained || "",
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
    if (submitting) return; // ✅ Prevent duplicate calls
    setSubmitting(true);

    const resultData = filtered.map((s) => {
      const m = marks[s._id] || {};
      return {
        student_name: s.name,
        student_id: s._id,
        phone_number: s.phone_number,
        batch_id: s.batch_id,
        marks: [
          {
            subject: subjectFilter || m.subject || "",
            total: totalMarksFilter || m.total || "",
            obtained: m.obtained !== "" ? m.obtained : "Absent",
          },
        ],
      };
    });

    try {
      const res = await fetch(`api/submit_results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      alert("✅ Results submitted via SMS successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Error submitting results");
    } finally {
      setSubmitting(false); // ✅ Reset
    }
  };

  const hasMarks = Object.values(marks).some(
    (m) => m?.obtained !== undefined && m?.obtained !== ""
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Results Dashboard
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto lg:mx-0">
            Enter obtained marks for each student. Subject and total marks apply
            to all students. Empty fields will be marked as Absent.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-6 mb-10 border border-blue-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Filters & Marks Info
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Batch
              </label>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="w-full bg-white border-2 border-blue-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">All Batches</option>
                {batches.map((bt) => (
                  <option key={bt._id} value={bt._id}>
                    {bt.batch_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                placeholder="Subject name"
                className="w-full bg-white border-2 border-blue-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Marks
              </label>
              <input
                type="number"
                value={totalMarksFilter}
                onChange={(e) => setTotalMarksFilter(e.target.value)}
                placeholder="Total marks"
                className="w-full bg-white border-2 border-blue-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading students...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-600 font-medium">
              No students found for the selected batch.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-xl border-2 border-blue-100 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Student Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Phone Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Batch
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      {subjectFilter
                        ? `Obtained (${subjectFilter})`
                        : "Obtained Marks"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filtered.map((s) => {
                    const m = marks[s._id] || {};
                    return (
                      <tr
                        key={s._id}
                        className="hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {s.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {s.phone_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {batches.find((b) => b._id === s.batch_id)
                            ?.batch_name || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            placeholder="0"
                            className="w-24 border-2 border-blue-200 rounded-lg px-3 py-2 text-center text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            value={m.obtained || ""}
                            onChange={(e) =>
                              handleObtainedChange(s._id, e.target.value)
                            }
                          />
                        </td>
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
                  <div
                    key={s._id}
                    className="bg-white border-2 border-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {s.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {s.phone_number}
                        </p>
                        <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                          {batches.find((b) => b._id === s.batch_id)
                            ?.batch_name || "-"}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                        #{idx + 1}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {subjectFilter
                          ? `Obtained (${subjectFilter})`
                          : "Obtained Marks"}
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full border-2 border-blue-200 rounded-lg px-3 py-2.5 text-center text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        value={m.obtained || ""}
                        onChange={(e) =>
                          handleObtainedChange(s._id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center lg:items-end mt-10 space-y-3">
              <button
                onClick={handleSubmit}
                disabled={!hasMarks || submitting} // ← also prevents double click
                className={`w-full sm:w-auto px-10 py-3.5 rounded-xl font-semibold text-base shadow-lg transition-all duration-200 ${
                  hasMarks && !submitting
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                {submitting ? "Sending..." : "Send Results"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
