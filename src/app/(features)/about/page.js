'use client'

import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ArrowRight, Shield, Users, Target } from "lucide-react";

export default function AboutPage() {
  const team = [
    {
      name: "Ishtiaq Dishan",
      role: "Frontend & Backend",
      img: "dev-dishan.jpg",
      bio: "Specializes in creating scalable, performant web applications with intuitive user interfaces. ",
    },
    {
      name: "Tasin Rahman",
      role: "Frontend & Design",
      // set an image variable here
      bio: "Specializes in creating smooth UI and designing assets.",
    },
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Our Mission",
      desc: "To empower educational institutions with intelligent, scalable solutions that streamline operations and enhance learning outcomes.",
    },
    {
      icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Our Vision",
      desc: "To be the global standard for educational management platforms, trusted by institutions worldwide for innovation and reliability.",
    },
    {
      icon: <Users className="w-6 h-6 sm:w-7 sm:h-7" />,
      title: "Our Values",
      desc: "Innovation, integrity, and user-centric design. We prioritize security, transparency, and continuous improvement in everything we build.",
    },
  ];

  const stats = [
    { number: "2024", label: "Founded" },
    { number: "2", label: "Team Members" },
    { number: "100%", label: "Dedicated" },
    { number: "24/7", label: "Building" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gradient-to-b from-blue-50 to-transparent opacity-50 rounded-full blur-3xl"></div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 relative z-10">
          About <span className="text-blue-500">EduFlow</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed relative z-10 px-4">
          A dedicated team of engineers, designers, and educators working to transform educational management through innovative technology and enterprise-grade solutions.
        </p>
        <div className="hidden sm:block absolute top-0 right-4 md:-right-4 w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl items-center justify-center shadow-lg animate-bounce" style={{display: 'flex'}}>
          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm md:text-base text-blue-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Leadership Team</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Meet the experts driving innovation in educational technology
          </p>
        </div>
        <div className={`grid gap-6 sm:gap-8 lg:gap-12 ${team.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group">
              <div className="relative inline-block mb-6">
                <Image
                  src={member.img? `/${member.img}` : `https://api.dicebear.com/9.x/notionists/svg?seed=tasinrahman`}
                  alt={member.name}
                  width={144}
                  height={144}
                  className="w-32 h-32 sm:w-36 sm:h-36 rounded-full mx-auto object-cover border-4 border-gray-100 group-hover:border-blue-100 transition-colors"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full shadow-lg" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-xs sm:text-sm text-blue-500 font-semibold mb-4 uppercase tracking-wide">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission / Vision / Values Section */}
      <div className="bg-gray-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10 sm:mb-16">What Drives Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl mb-4 sm:mb-6 text-blue-500 mx-auto md:mx-0" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {item.icon}
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center md:text-left">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed text-center md:text-left">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-6 sm:p-10 md:p-12 border border-gray-200">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Building the Future of Education Management
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              We're a passionate startup committed to creating secure, scalable, and user-friendly solutions for educational institutions. Our platform is built with modern technology and best practices from day one.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-700 font-medium">
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200">Cloud-Based</span>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200">Secure Architecture</span>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200">Modern Stack</span>
              <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200">Mobile Friendly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center relative">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
          Ready to Transform Your Educational Management?
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Be among the first to experience the next generation of educational administration.
        </p>
        <a
          href="/sign-up"
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold text-base sm:text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
        >
          Get Started Today
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
        <div className="hidden sm:block absolute top-0 left-4 md:-left-6 w-10 h-10 bg-blue-100 rounded-xl shadow-lg animate-bounce" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
        </div>
      </div>
    </div>
  );
}