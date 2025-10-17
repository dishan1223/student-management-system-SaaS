'use client'
import { useEffect, useState } from "react";
import { Users, CreditCard, BarChart3, MessageSquare, Bell, GraduationCap, CheckCircle, ArrowRight, Menu, X, Info } from "lucide-react";

const CONFIG = {
  branding: {
    name: "EduFlow",
    logo: "/logo.png", // Change to your logo image path, or set to null to use icon + text
    useTextLogo: true, // Set to false if you want to use an image logo
    tagline: "Manage coaching easily.",
    description: "Focus on teaching while EduFlow takes care of the management."
  },
  hero: {
    title: "EduFlow - Manage coaching",
    highlightedWord: "easily",
    subtitle: "Focus on teaching while EduFlow takes care of the management.",
    features: [
      "Student Management",
      "Payment Tracking",
      "Batch Tracking",
      "Exam results and payments via SMS"
    ]
  },
  features: {
    sectionTitle: "Everything you need",
    sectionSubtitle: "Powerful features designed to make coaching management easier",
    items: [
      {
        icon: Users,
        title: "Student Management",
        description: "Efficiently manage student records and enrollment intelligent automation"
      },
      {
        icon: CreditCard,
        title: "Payment Management",
        description: "Seamless fee tracking with automated SMS notifications and instant payment confirmations"
      },
      {
        icon: BarChart3,
        title: "Result Dashboard",
        description: "Publish results with instant sms."
      },
      {
        icon: GraduationCap,
        title: "Batch Management",
        description: "Organize multiple batches and its students with ease"
      },
      {
        icon: MessageSquare,
        title: "Student Portal",
        description: "Comprehensive self-service portal for notes, marks, and real-time updates"
      },
      {
        icon: Bell,
        title: "Notice Board",
        description: "Dynamic announcement system with push notifications and priority alerts"
      }
    ]
  },
  pricing: {
    sectionTitle: "Simple Pricing",
    sectionSubtitle: "Choose the perfect plan for your coaching center",
    plans: [
      {
        name: "Monthly",
        price: "2,000",
        duration: "month",
        features: [
          "Student Management",
          "Payment Tracking",
          "Result Dashboard",
          "SMS Notifications",
          "Student Portal",
          "Notice Board"
        ]
      },
      {
        name: "Quarterly",
        price: "5,000",
        duration: "3 months",
        popular: true,
        features: [
          "All Monthly Features",
          "Priority Support",
          "Advanced Analytics",
          "Bulk SMS Credits",
          "Data Export",
          "Custom Reports"
        ]
      },
      {
        name: "Enterprise",
        price: "Custom",
        duration: "custom",
        features: [
          "All Quarterly Features",
          "Unlimited Students",
          "Dedicated Support",
          "Custom Integrations",
          "Advanced Security",
          "Training & Onboarding"
        ]
      }
    ]
  },
  footer: {
    companyName: "Loom Softwares",
    links: [
      { text: "Privacy Policy", href: "#" },
      { text: "Terms of Service", href: "#" },
      { text: "Contact", href: "#" }
    ]
  }
};

// Navbar Component
export default function Navbar({ isLoggedIn = false, onLogout = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {CONFIG.branding.useTextLogo ? (
              <>
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">
                  <span className="text-blue-500">i</span>{CONFIG.branding.name}
                </span>
              </>
            ) : (
              <img 
                src={CONFIG.branding.logo} 
                alt={CONFIG.branding.name}
                className="h-8 w-auto"
              />
            )}
          </div>
          
          {/* Desktop Menu */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <a
                href="/upgrade"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                Purchase
              </a>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm border border-gray-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="text-gray-700 hover:text-gray-900 font-medium">HOME</a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium">PRICING</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 font-medium">ABOUT US</a>
              <a href="/sign-in" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg">
                Login
              </a>
              <a href="/sign-up" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Get Started
              </a>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {isLoggedIn ? (
              <>
                <a href="/upgrade" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  Purchase
                </a>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">HOME</a>
                <a href="#pricing" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">PRICING</a>
                <a href="#about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">ABOUT US</a>
                <a href="/sign-in" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300">
                  Login
                </a>
                <a href="/sign-up" className="block px-4 py-2 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600">
                  Get Started
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}