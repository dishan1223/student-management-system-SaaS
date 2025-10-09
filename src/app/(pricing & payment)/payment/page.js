
'use client'

import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { CheckCircle2, XCircle } from "lucide-react"

export default function PaymentPage() {
  const router = useRouter()
  const success = true // manually toggle between true or false

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow px-6 text-center">
        {success ? (
          <>
            <CheckCircle2 size={80} className="text-green-600 mb-6" />
            <h1 className="text-3xl font-semibold mb-3">Payment Successful!</h1>
            <p className="text-gray-600 max-w-md mb-8">
              Your plan has been successfully activated. You can now access all premium features.
            </p>
          </>
        ) : (
          <>
            <XCircle size={80} className="text-red-600 mb-6" />
            <h1 className="text-3xl font-semibold mb-3">Payment Failed!</h1>
            <p className="text-gray-600 max-w-md mb-8">
              Something went wrong with your payment. Please try again or contact support.
            </p>
          </>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-800 hover:bg-gray-100 transition"
          >
            Back to Home
          </button>
        </div>
      </div>

      <footer className="text-center text-gray-500 py-6 text-sm border-t border-gray-200">
        © {new Date().getFullYear()} Loom Softwares. All rights reserved.
      </footer>
    </div>
  )
}
