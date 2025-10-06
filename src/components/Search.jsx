'use client'

import { useState, useEffect } from "react";

export default function StudentSearch({ students = [], onResults }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Ensure students is always an array
    const safeStudents = Array.isArray(students) ? students : [];

    const filtered = safeStudents.filter(student =>
      student?.name?.toLowerCase().includes(query.trim().toLowerCase())
    );

    if (onResults) onResults(filtered);
  }, [query, students, onResults]);

  return (
    <div className="flex justify-center">
    <div className="flex justify-center mx-4 mb-6 w-[90%]">
      <input
        type="text"
        placeholder="Search students by name..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="border rounded-lg mt-4 px-3 py-2 w-full lg:w-[290px]"
        autoComplete="off"
      />
    </div>
    </div>
  );
}

