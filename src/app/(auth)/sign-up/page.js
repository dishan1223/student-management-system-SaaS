'use client';

import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';



export default function SignupPage() {
  const router = useRouter()

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const res = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setIsLoading(false);
    
    if (res.ok) {
      setShowSuccess(true);
      setProgress(100);
      
      // Animate progress bar
      const duration = 3000; // 5 seconds
      const interval = 50;
      const steps = duration / interval;
      const decrement = 100 / steps;
      
      let currentProgress = 100;
      const timer = setInterval(() => {
        currentProgress -= decrement;
        if (currentProgress <= 0) {
          clearInterval(timer);
          setShowSuccess(false);
          router.push("/");
        } else {
          setProgress(currentProgress);
        }
      }, interval);
    } else {
      setMessage(`❌ ${data.error || 'Signup failed'}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Success Popup */}
      <div className={`fixed top-4 left-4 right-4 md:top-6 md:right-6 md:left-auto bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 z-50 ${
        showSuccess ? 'translate-y-0 md:translate-y-0 md:translate-x-0 opacity-100' : '-translate-y-full md:translate-y-0 md:translate-x-full opacity-0'
      } md:w-96`}>
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-green-100 rounded-full p-1.5 md:p-2">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Success!</h3>
                <p className="text-xs md:text-sm text-gray-600">Account created successfully</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSuccess(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          <p className="text-xs md:text-sm text-gray-500 ml-9 md:ml-11">Redirecting you to the dashboard...</p>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Start your journey with us today</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.includes('✅') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
            >
              {isLoading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/sign-in" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Powered by{' '}
            <span className="font-semibold text-gray-700">Loom Softwares</span>
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}