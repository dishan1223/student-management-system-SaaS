"use client";

import React, { useState } from "react";

export default function DownloadButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    if(!window.confirm("This action will reset every students payment status to UNPAID.")) return;

    try {
      const res = await fetch(`/api/students/export`, {
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to download file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      // Let browser use the backend filename
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      alert("✅ Download successful!");
    } catch (error) {
      console.error(error);
      alert("❌ Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="flex flex-col gap-2 items-center">
            <div className="flex flex-col gap-2 items-center">
                <p className="bg-green-100 py-2 rounded-lg w-[90%] text-center">📢 Please perform your monthly payment status reset to ensure your service runs smoothly.</p>
            </div>
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`px-6 py-3 w-[90%] lg:w-auto rounded-lg shadow text-white ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
      } flex items-center justify-center gap-2`}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      {loading ? "Downloading..." : "Download And Reset"}
    </button>
    </div>
  );
}

