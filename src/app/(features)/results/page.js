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
        setBatches(dataBatches);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const obtained =
        m.obtained !== undefined && m.obtained !== "" ? m.obtained : "Absent";

      return {
        student_id: s._id,
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

  const hasMarks = Object.values(marks).some(
    (m) => m?.obtained !== undefined && m?.obtained !== ""
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Results Dashboard
          </h1>
          <p className="text-gray-600 text-base max-w-3xl">
            Enter obtained marks for each student. Use the Subject and Total
            fields to set the subject and total marks for all students. Empty
            obtained fields will be recorded as &quot;Absent&quot;.
          </p>
        </div>

        {/* Batch Filter */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-6 mb-8 border border-blue-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Filter Students by Batch
          </h3>
          <div className="w-full max-w-xs">
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
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading students...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
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
                      Class
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Batch
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      {subjectFilter
                        ? `Obtained (${subjectFilter})`
                        : "Obtained Marks"}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filtered.map((s, idx) => {
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
                          {s.class}
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
                        <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                          {totalMarksFilter || m.total || "-"}
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
                  <div key={s._id} className="bg-white border-2 border-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {s.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {s.phone_number}
                        </p>
                        <div className="flex gap-3 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                            Class: {s.class}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">
                            {batches.find((b) => b._id === s.batch_id)
                              ?.batch_name || "-"}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total
                        </label>
                        <div className="w-full bg-blue-50 border-2 border-blue-100 rounded-lg px-3 py-2.5 text-center text-sm font-medium text-gray-700">
                          {totalMarksFilter || m.total || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center lg:items-end mt-10 space-y-3">
              <button
                onClick={handleSubmit}
                disabled={!hasMarks}
                className={`w-full sm:w-auto px-10 py-3.5 rounded-xl font-semibold text-base shadow-lg transition-all duration-200 ${
                  hasMarks
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                Send Results
              </button>
              {!hasMarks && (
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please enter at least one student&apos;s obtained marks to submit
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}