'use client'

import { useEffect, useState } from "react";
import { Users, CreditCard, BarChart3, MessageSquare, Bell, GraduationCap, CheckCircle, ArrowRight, Menu, X, Info } from "lucide-react";

// CONFIGURATION OBJECT - Change your branding and content here
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

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (data.loggedIn) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error checking auth:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-500"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
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
              <div className="flex items-center gap-3">
                <a
                  href="/upgrade"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  Purchase
                </a>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm border border-gray-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Welcome Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600">Ready to manage your coaching center?</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <a
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Logout
              </button>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <p className="text-gray-600 text-sm mb-1">Current Plan</p>
                <p className="text-gray-900 text-xl font-bold">{user.plan}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <p className="text-gray-600 text-sm mb-1">Status</p>
                <p className="text-gray-900 text-xl font-bold">Active</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <p className="text-gray-600 text-sm mb-1">Email</p>
                <p className="text-gray-900 text-sm font-semibold truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                <span className="text-blue-500">i</span>{CONFIG.branding.name}
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-gray-700 hover:text-gray-900 font-medium">HOME</a>
              <a href="#pricing" className="text-gray-700 hover:text-gray-900 font-medium">PRICING</a>
              <a href="#about" className="text-gray-700 hover:text-gray-900 font-medium">ABOUT US</a>
              <a href="/sign-in" className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg">
                Login
              </a>
              <a href="/sign-up" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Get Started
              </a>
            </div>

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
              <a href="#home" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">HOME</a>
              <a href="#pricing" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">PRICING</a>
              <a href="#about" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">ABOUT US</a>
              <a href="/sign-in" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300">
                Login
              </a>
              <a href="/sign-up" className="block px-4 py-2 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div id="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              {CONFIG.hero.title} <span className="text-blue-500">{CONFIG.hero.highlightedWord}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {CONFIG.hero.subtitle}
            </p>
            
            <div className="space-y-3 mb-8">
              {CONFIG.hero.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <a 
              href="/sign-up" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold text-lg shadow-lg shadow-blue-500/30"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </a>

            <div className="mt-8 flex items-center gap-2 text-gray-500">
              <Info className="w-4 h-4" />
              <span className="text-sm">Scroll for more details.</span>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 md:p-12">
              {/* Mockup Dashboard */}
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-gray-200 rounded"></div>
                      <div className="h-6 w-32 bg-blue-500 rounded"></div>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-gray-100 rounded-xl"></div>
                      <div className="h-16 bg-gray-100 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {CONFIG.features.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {CONFIG.features.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONFIG.features.items.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all group">
                <div className="bg-blue-50 rounded-xl w-14 h-14 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  <feature.icon className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {CONFIG.pricing.sectionTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {CONFIG.pricing.sectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CONFIG.pricing.plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-2xl p-8 border-2 relative hover:shadow-xl transition-all ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">৳{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-600">/{plan.duration}</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="/upgrade" 
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    plan.popular 
                      ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-3">
              Powered by <span className="font-bold text-gray-900">{CONFIG.footer.companyName}</span>
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
              {CONFIG.footer.links.map((link, idx) => (
                <span key={idx} className="flex items-center gap-6">
                  <a href={link.href} className="hover:text-gray-900 transition-colors">
                    {link.text}
                  </a>
                  {idx < CONFIG.footer.links.length - 1 && <span className="text-gray-400">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}