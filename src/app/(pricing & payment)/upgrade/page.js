'use client'

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { CheckCircle2 } from "lucide-react";

export default function UpgradePlan() {
  const plans = [
    {
      id: "Basic",
      name: "Basic",
      validity: "1",
      price: "৳2000 / month",
      features: [
        "Batch & Student Management",
        "Payment Tracker",
        "Result Dashboard",
      ],
    },
    {
      id: "Pro",
      name: "Pro",
      price: "৳5000 / 3 month",
      validity: "3",
      features: [
        "All Basic Features",
        "Attendance Management",
        "Announcements & Notifications",
      ],
    },
    {
      id: "Enterprise",
      name: "Enterprise",
      price: "Negotiable",
      validity: "not-specified",
      features: [
        "All Pro Features",
        "Multi-Branch Support",
        "Priority Support & Custom Branding",
      ],
    },
  ];

  const [selected, setSelected] = useState(null);

  const handleOrder = async () => {
    if (!selected) {
      alert("Please select a plan first.");
      return;
    }

    try {
      const res = await fetch("/api/order/placement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Your order placement has failed.");
        return;
      }

      if (data.success) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error(error);
      alert("Make sure to login before purchasing the service");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-semibold mb-4">Choose Your Plan</h1>
        <p className="text-gray-500 mb-10">
          Upgrade to unlock advanced tools for your institute.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelected(plan)}
              className={`border rounded-2xl p-6 cursor-pointer transition hover:shadow-md ${
                selected?.id === plan.id
                  ? "border-gray-900 shadow-lg"
                  : "border-gray-200"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-gray-600 mb-4">{plan.price}</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} className="text-gray-800" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-md font-medium border ${
                  selected?.id === plan.id
                    ? "bg-gray-900 text-white"
                    : "border-gray-300 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {selected?.id === plan.id ? "Selected" : "Select"}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleOrder}
          className="mt-12 px-8 py-3 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition"
        >
          Order Selected Plan
        </button>
      </div>
    </div>
  );
}
