'use client'

import { useEffect, useState } from "react";
import { Users, CreditCard, BarChart3, MessageSquare, Bell, GraduationCap, CheckCircle, ArrowRight, Menu, X, Sparkles, Zap, Shield } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
            <div className="absolute inset-0 inline-block animate-ping rounded-full h-16 w-16 border-4 border-gray-300 opacity-20"></div>
          </div>
          <p className="text-gray-900 font-semibold mt-6 text-lg">Loading your experience...</p>
        </div>
      </div>
    );

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Efficiently manage student records, enrollment, and attendance with intelligent automation"
    },
    {
      icon: CreditCard,
      title: "Payment Management",
      description: "Seamless fee tracking with automated SMS notifications and instant payment confirmations"
    },
    {
      icon: BarChart3,
      title: "Result Dashboard",
      description: "Real-time analytics and instant SMS notifications for published results"
    },
    {
      icon: GraduationCap,
      title: "Batch Management",
      description: "Organize multiple batches with advanced scheduling and resource allocation"
    },
    {
      icon: MessageSquare,
      title: "Student Portal",
      description: "Comprehensive self-service portal for payments, marks, and real-time updates"
    },
    {
      icon: Bell,
      title: "Notice Board",
      description: "Dynamic announcement system with push notifications and priority alerts"
    }
  ];

  const plans = [
    {
      name: "Monthly",
      price: "2,000",
      duration: "1 Month",
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
      duration: "3 Months",
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
      duration: "Custom",
      features: [
        "All Quarterly Features",
        "Unlimited Students",
        "Dedicated Support",
        "Custom Integrations",
        "Advanced Security",
        "Training & Onboarding"
      ]
    }
  ];

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Navigation */}
        <nav className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Loom Softwares</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold border-2 border-gray-200 hover:border-gray-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Welcome Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12 text-center overflow-hidden relative">
            {/* Subtle Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl opacity-50"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 mb-6">
                <Sparkles className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-sm font-semibold">Welcome Back</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
                Hey, {user.name}! 👋
              </h1>
              <p className="text-xl text-gray-600 mb-12">Ready to manage your coaching center?</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <a
                  href="/dashboard"
                  className="group px-10 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 hover:shadow-xl transition-all font-bold text-lg inline-flex items-center justify-center transform hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </a>
                <button
                  onClick={handleLogout}
                  className="px-10 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-lg transform hover:scale-105"
                >
                  Logout
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                  <Zap className="w-8 h-8 text-gray-700 mb-3 mx-auto" />
                  <p className="text-gray-600 text-sm mb-1">Current Plan</p>
                  <p className="text-gray-900 text-2xl font-bold">{user.plan}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                  <Shield className="w-8 h-8 text-gray-700 mb-3 mx-auto" />
                  <p className="text-gray-600 text-sm mb-1">Account Status</p>
                  <p className="text-gray-900 text-2xl font-bold">Active</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
                  <Sparkles className="w-8 h-8 text-gray-700 mb-3 mx-auto" />
                  <p className="text-gray-600 text-sm mb-1">Email</p>
                  <p className="text-gray-900 text-lg font-semibold truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
      </div>

      {/* Navigation */}
      <nav className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Loom Softwares</span>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <a href="/sign-in" className="px-5 py-2.5 text-gray-700 hover:text-gray-900 font-semibold transition-colors">
                Log In
              </a>
              <a href="/sign-up" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all font-semibold transform hover:scale-105">
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
              <a href="/sign-in" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                Log In
              </a>
              <a href="/sign-up" className="block px-4 py-2 bg-gray-900 text-white rounded-lg text-center hover:bg-gray-800">
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-14">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 mb-8">
            <Sparkles className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 text-sm font-semibold">Next Generation Management</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-gray-900">
            Modern Coaching Center
            <span className="block mt-3 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Transform your coaching center with intelligent automation, real-time analytics, and seamless communication
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/sign-up" 
              className="group px-10 py-4 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 hover:shadow-xl transition-all font-bold text-lg inline-flex items-center justify-center transform hover:scale-105"
            >
              Test Beta
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
            <a 
              href="/sign-in" 
              className="px-10 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-bold text-lg transform hover:scale-105"
            >
              Log In
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern coaching centers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-2xl transform hover:-translate-y-2">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <feature.icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your coaching center
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <div 
                key={idx} 
                className={`bg-white rounded-3xl p-8 border-2 relative transform hover:-translate-y-2 transition-all shadow-lg hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-gray-900 scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-5xl font-bold text-gray-900">৳{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-600 text-lg">/{plan.duration}</span>}
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="/sign-up" 
                  className={`block w-full py-4 rounded-2xl font-bold text-center transition-all transform hover:scale-105 ${
                    plan.popular 
                      ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-200'
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
      <footer className="relative bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-4 text-lg">
              Powered by <span className="font-bold text-gray-900">Loom Softwares</span>
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}