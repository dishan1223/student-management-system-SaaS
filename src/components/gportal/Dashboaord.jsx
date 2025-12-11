'use client';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

export default function GuardianDashboard({ student, onLogout }) {
  const marks = Array.isArray(student.marks) ? student.marks : [];

  const validMarks = marks.filter(m =>
    m.subject && m.total && m.obtained
  );

  const chartData = useMemo(() => ({
    labels: validMarks.map(m => m.subject),
    datasets: [
      {
        label: 'Obtained',
        data: validMarks.map(m => Number(m.obtained)),
      },
      {
        label: 'Total',
        data: validMarks.map(m => Number(m.total)),
      }
    ]
  }), [validMarks]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-emerald-700">
          Welcome, Guardian
        </h1>

        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-emerald-600 mb-4">
          Student Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div>Name: {student.name || "N/A"}</div>
          <div>Phone: {student.phone_number || "N/A"}</div>
          <div>Batch ID: {student.batch_id || "N/A"}</div>
          <div>Admission Date: {student.admission_date || "N/A"}</div>
          <div>Payment Amount: {student.payment_amount || "N/A"}</div>
          <div>
            Payment Status:
            <span className={student.payment_status ? "text-green-600" : "text-red-600"}>
              {student.payment_status ? " Paid" : " Due"}
            </span>
          </div>
        </div>
      </div>

      {/* Marks Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-emerald-600 mb-4">
          Performance Overview
        </h2>

        {validMarks.length === 0 ? (
          <div className="text-gray-500">No valid marks available</div>
        ) : (
          <Bar data={chartData} />
        )}
      </div>

      {/* Due Months */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-emerald-600 mb-4">
          Due Months
        </h2>

        {student.due_months?.length ? (
          <ul className="list-disc ml-6 text-gray-700">
            {student.due_months.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No dues</div>
        )}
      </div>
    </div>
  );
}
