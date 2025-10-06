'use client'

import Link from "next/link";

export default function AddStudentButton({ href = "/add-student" }) {
  return (
    <div className="flex justify-center mx-4 my-3">
      <Link
        href={href}
        className="w-full border-2 border-blue-500 text-blue-500 font-semibold py-2 px-6 rounded-lg shadow transition duration-150 focus:outline-none inline-block"
        aria-label="Add Student"
      >
        + Add Student
      </Link>
    </div>
  );
}
