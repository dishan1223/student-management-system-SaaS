'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { CheckCircle, Users, BookOpen, BarChart3, Wallet, Headphones, Send, Menu, X, ArrowRight, Star, Zap } from "lucide-react"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 text-gray-800">
      {/* Navbar */}
      <nav className={`flex items-center justify-between px-8 py-4 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
          
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            Loom Softwares
          </span>
        </Link>
        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="#features" className="hover:text-green-600 transition-colors relative group">
            Features
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#pricing" className="hover:text-green-600 transition-colors relative group">
            Pricing
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#contact" className="hover:text-green-600 transition-colors relative group">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
          </Link>
        </div>
        <div className="hidden md:flex gap-3 items-center">
          <Link href="/login" className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-green-600 transition-all">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all">
            Sign Up
          </Link>
          <Link href="/dashboard" className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 hover:shadow-lg transition-all">
            Dashboard
          </Link>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 hover:text-green-600 transition"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-8 animate-in slide-in-from-top">
          <div className="flex flex-col gap-6">
            <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-green-600 transition">
              Features
            </Link>
            <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-green-600 transition">
              Pricing
            </Link>
            <Link href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium hover:text-green-600 transition">
              Contact
            </Link>
            <div className="flex flex-col gap-3 mt-4">
              <Link href="/login" className="px-5 py-3 border border-gray-300 rounded-lg text-center hover:bg-gray-50 transition">
                Login
              </Link>
              <Link href="/signup" className="px-5 py-3 bg-green-600 text-white rounded-lg text-center hover:bg-green-700 transition">
                Sign Up
              </Link>
              <Link href="/dashboard" className="px-5 py-3 bg-gray-900 text-white rounded-lg text-center hover:bg-gray-800 transition">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-14 px-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-6 text-sm font-medium hover:scale-105 transition-transform cursor-pointer">
            <Zap size={16} className="animate-pulse" />
            <span>Transform Your Coaching Business Today</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight">
            Coaching Center
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent"> SaaS</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Simplify your coaching business — manage batches, students, payments, and results with ease. All in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/signup" className="group px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 font-semibold">
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:border-green-600 hover:bg-green-50 transition-all font-semibold">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* User Flow Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto" id="flow">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
          <p className="text-gray-600 text-lg">Three simple steps to streamline your coaching center</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="group text-center p-8 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 p-5 rounded-2xl group-hover:scale-110 transition-transform">
                <Users size={40} className="text-white"/>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 font-bold text-sm rounded-full px-3 py-1 inline-block mb-3">Step 1</div>
            <h3 className="font-bold text-2xl mb-3 text-gray-900">Manage Students</h3>
            <p className="text-gray-600 leading-relaxed">Add, edit, and track students with ease, all in one intuitive dashboard.</p>
          </div>
          <div className="group text-center p-8 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 p-5 rounded-2xl group-hover:scale-110 transition-transform">
                <BookOpen size={40} className="text-white"/>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 font-bold text-sm rounded-full px-3 py-1 inline-block mb-3">Step 2</div>
            <h3 className="font-bold text-2xl mb-3 text-gray-900">Organize Batches</h3>
            <p className="text-gray-600 leading-relaxed">Create and manage batches, assign students, and schedule classes effortlessly.</p>
          </div>
          <div className="group text-center p-8 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-500 p-5 rounded-2xl group-hover:scale-110 transition-transform">
                <BarChart3 size={40} className="text-white"/>
              </div>
            </div>
            <div className="bg-green-100 text-green-700 font-bold text-sm rounded-full px-3 py-1 inline-block mb-3">Step 3</div>
            <h3 className="font-bold text-2xl mb-3 text-gray-900">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">Generate insightful dashboards and track academic performance in real-time.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-white to-gray-50" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Powerful Features</h2>
            <p className="text-gray-600 text-lg">Everything you need to run a successful coaching center</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group flex items-start gap-5 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                <Wallet className="text-white" size={28}/>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Payment Tracker</h3>
                <p className="text-gray-600 leading-relaxed">Easily monitor student payments, fee records, and financial reports in real-time.</p>
              </div>
            </div>
            <div className="group flex items-start gap-5 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                <Headphones className="text-white" size={28}/>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">24/7 Customer Support</h3>
                <p className="text-gray-600 leading-relaxed">Get reliable support whenever you need help. We're here for you around the clock.</p>
              </div>
            </div>
            <div className="group flex items-start gap-5 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle className="text-white" size={28}/>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Feature Requests</h3>
                <p className="text-gray-600 leading-relaxed">Request new features and help shape the future of the platform. Your voice matters.</p>
              </div>
            </div>
            <div className="group flex items-start gap-5 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer">
              <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-emerald-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="text-white" size={28}/>
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-gray-900">Student Portal <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Pro</span></h3>
                <p className="text-gray-600 leading-relaxed">Allow students to log in, check results, track progress, and access course materials.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto" id="pricing">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 text-lg">Choose the plan that fits your coaching center's needs</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Basic Plan */}
          <div className="group border-2 border-gray-200 rounded-3xl p-10 hover:border-green-500 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-3xl font-bold mb-2 text-gray-900">Basic</h3>
            <p className="text-gray-600 mb-6">Perfect for small coaching centers</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20}/>
                <span className="text-gray-700">Batch & Student Management</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20}/>
                <span className="text-gray-700">Payment Tracker</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20}/>
                <span className="text-gray-700">Result Dashboard</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20}/>
                <span className="text-gray-700">Email Support</span>
              </li>
            </ul>
            <Link href="/signup?plan=basic" className="block w-full py-4 text-center bg-gray-900 text-white rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all font-semibold">
              Choose Basic
            </Link>
          </div>
          {/* Pro Plan */}
          <div className="group relative border-2 border-green-600 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold">
              Most Popular
            </div>
            <h3 className="text-3xl font-bold mb-2 text-gray-900">Pro</h3>
            <p className="text-gray-600 mb-6">For growing coaching centers</p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20}/>
                <span className="text-gray-700 font-medium">Everything in Basic</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20}/>
                <span className="text-gray-700">Student Portal Access</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20}/>
                <span className="text-gray-700">Priority 24/7 Support</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20}/>
                <span className="text-gray-700">Advanced Analytics</span>
              </li>
            </ul>
            <Link href="/signup?plan=pro" className="block w-full py-4 text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold">
              Choose Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-gray-50 to-white" id="contact">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Get In Touch</h2>
            <p className="text-gray-600 text-lg">Have questions or need help? We'd love to hear from you.</p>
          </div>
          <form className="bg-white p-10 rounded-3xl shadow-xl space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                placeholder="Tell us how we can help you..."
                rows="5"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold">
              <Send size={20}/> 
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Loom Softwares</h3>
              <p className="text-sm leading-relaxed">Empowering coaching centers with modern, efficient management solutions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-green-400 transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-green-400 transition">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-green-400 transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-green-400 transition">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-green-400 transition">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-green-400 transition">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#contact" className="hover:text-green-400 transition">Contact</Link></li>
                <li><Link href="/help" className="hover:text-green-400 transition">Help Center</Link></li>
                <li><Link href="/privacy" className="hover:text-green-400 transition">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} Loom Softwares. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}