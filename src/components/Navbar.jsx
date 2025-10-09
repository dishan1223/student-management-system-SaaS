"use client";

import { useState } from "react";
import Link from "next/link";

// Import icons from lucide-react
import { Menu, X } from "lucide-react";

const navLinks = [
  {
    title: "HOME",
    href: "/",
  },
  {
    title: "PRICING",
    href: "/#pricing",
  },
  {
    title: "PURCHASE",
    href: "/order",
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex justify-center w-full h-18 border-b-2 border-b-gray-200">
      <nav className="h-full w-[90%] flex flex-row justify-between items-center py-4">
        {/* Logo/Title */}
        <div className="text-3xl font-bold">
          <h1>Loom Softwares</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-3">
          {navLinks.map((s) => (
            <div key={s.title}>
              <Link href={s.href} className="hover:text-blue-600 transition-colors">
                {s.title}
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Menu Button (Lucid Icon) */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle mobile menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Content */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)} aria-label="Close mobile menu">
            <X className="h-8 w-8" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-6 text-[16px] mt-12">
          {navLinks.map((s) => (
            <div key={s.title}>
              <Link href={s.href} onClick={handleLinkClick} className="hover:text-blue-600 transition-colors">
                {s.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
