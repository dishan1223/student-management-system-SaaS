"use client";


import Nav from "@/components/Nav";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";


export default function Home() {
  

  

  return (
    <div>
      {/* hero section / header section */}
      <div className="w-full h-screen">
        <Nav />
        <header className="w-full h-10/12 lg:h-11/12 flex flex-col gap-4 justify-center items-center">
          <p className="secondary-font">
            Powered By <span className="primary-font font-bold">Loom Softwares</span>
          </p>
          <h1 className="text-5xl md:6xl lg:text-7xl primary-font text-center font-bold">
            Make Student Management <br />
            <span className="text-soft-red italic">10x</span> smoother
          </h1>
          <p className="secondary-font text-center md:text-lg w-[70%] lg:text-2xl">
            Focus on teaching while{" "}
            <span className="font-bold t-green hover:underline">Studify</span> takes care of the
            management.
          </p>
          <div className="secondary-font flex flex-col gap-3">
            <ul>
              <li className="flex gap-2 items-center">
                <Image src="/tick.svg" alt="tick mark" width={15} height={15} />
                <p className="md:text-l">Attendance & Absent Reminder</p>
              </li>
              <li className="flex gap-2 items-center">
                <Image src="/tick.svg" alt="tick mark" width={15} height={15} />
                <p className="md:text-l">Student & payment management</p>
              </li>
              <li className="flex gap-2 items-center">
                <Image src="/tick.svg" alt="tick mark" width={15} height={15} />
                <p className="md:text-l">Teacher & Guardian Web Portal </p>
              </li>
              <li className="flex gap-2 items-center">
                <Image src="/tick.svg" alt="tick mark" width={15} height={15} />
                <p className="md:text-l">Exam results and payments via SMS</p>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <Link href="/sign-up">
              <button className="flex gap-2 cursor-pointer px-12 py-3 rounded-md text-white bg-green hover:bg-green-dark hover:gap-4">
                Sign Up
                <Image src="/plane.svg" width={15} height={15} alt="plane" />
              </button>
            </Link>
            <Link href="/gportal">
              <button className="cursor-pointer px-12 py-3 rounded-md text-white border-2 border-green-400 primary-font hover:bg-green-200">
                Guardian Portal
              </button>
            </Link>
          </div>
          <Link className="secondary-font cursor-pointer flex gap-2" href="#learnMore">
            Learn More
            <Image src="/arrow-down.svg" alt="arrow" width={10} height={10} />
          </Link>
        </header>

        {/* features section */}
        <div id="learnMore" className="flex flex-col items-center">
          <h2 className="text-2xl lg:text-4xl text-center font-bold primary-font mb-20">
            Why Choose <span className="t-green">Studify</span>?
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12">
            {/* red */}
            <div className="bg-rose-100/75 text-rose-700 p-8 w-[80%] lg:w-auto md:p-12 rounded-lg">
              <h2 className="font-bold text-lg mb-4">Traditional way</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li className="flex gap-2 items-center">
                  <Image src="/cross.svg" alt="cross" width={10} height={10} />
                  Manage students with pen and paper
                </li>
                <li className="flex gap-2 items-center">
                  <Image src="/cross.svg" alt="cross" width={10} height={10} />
                  Always carry physical documents
                </li>
                <li className="flex gap-2 items-center">
                  <Image src="/cross.svg" alt="cross" width={10} height={10} />
                  Can&apos;t make changes from anywhere else
                </li>
                <li className="flex gap-2 items-center">
                  <Image src="/cross.svg" alt="cross" width={10} height={10} />
                  Give exam results to student one by one
                </li>
              </ul>
            </div>

            {/* green */}
            <div className="bg-emerald-100/70 text-emerald-700 w-[80%] lg:w-auto p-8 md:p-12 rounded-lg">
              <h2 className="font-bold text-lg mb-4">With Studify</h2>
              <ul className="list-disc list-inside space-y-1.5">
                <li className="flex gap-2 items-center">
                  <Image src="/small-tick.svg" alt="cross" width={10} height={10} />
                  Digitally manage you students with ease
                </li>
                <li className="flex gap-2 items-center">
                  <Image src="/small-tick.svg" alt="cross" width={10} height={10} />
                  Store all you data digitally on you phone or PC
                </li>
                <li className="flex gap-2 items-center">
                  <Image src="/small-tick.svg" alt="cross" width={10} height={10} />
                  Update students data from anywhere anytime
                </li>
                <li className="flex gap-2 items-center">
                  <Image src="/small-tick.svg" alt="cross" width={10} height={10} />
                  Publish student results with sms effortlessly
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* pricing section */}
        <div className="bg-sky-50 mt-20 primary-font py-26 overflow-hidden flex flex-col gap-6 items-center" id="pricing">
          <div>
            <p className="border text-center border-dashed rounded-xl border-sky-400 p-2">
              ✨ Launch Discount - Free/2 months ✨
            </p>
          </div>
          <h1 className="text-2xl md:text-4xl mb-6 lg:text-5xl font-bold primary-font text-center">
            Stop Wasting Hours
            <br /> Managing your coaching
          </h1>
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* months free */}
            <div className="bg-gray-50 p-10 rounded-xl">
              <h1 className="text-4xl mb-10 primary-font font-bold">
                <span className="text-sm secondary-font line-through">499 ৳</span> 0 ৳{" "}
                <span className="font-normal secondary-font text-lg">/ months</span>
              </h1>
              <div>
                <ul className="secondary-font flex flex-col gap-4">
                  <li className="flex items-center gap-2">
                    <Check size={20} />
                    <p>Student & batch management</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} />
                    <p>Result Dashboard with sms result publish</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} />
                    <p>Database for 80 students</p>
                  </li>
                </ul>
                <Link href="/sign-up" >
                  <button className="flex mt-10 gap-2 cursor-pointer w-full justify-center mx-auto py-3 rounded-md text-white bg-green hover:bg-green-dark hover:gap-4">
                    Get Studify
                    <Image src="/plane.svg" width={15} height={15} alt="plane" />
                  </button>
                </Link>
              </div>
            </div>

            {/* months free */}
            <div className="bg-gray-50 p-10 rounded-xl">
              <h1 className="text-4xl mb-10 primary-font font-bold">
                <span className="text-sm secondary-font line-through">999 ৳</span> 0 ৳{" "}
                <span className="font-normal secondary-font text-lg">/ months</span>
              </h1>
              <div>
                <ul className="secondary-font flex flex-col gap-4">
                  <li className="flex items-center gap-2">
                    <Check size={20} />
                    <p>Student & batch management</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} />
                    <p>Result Dashboard with sms result publish</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} />
                    <p>Database for 150 students</p>
                  </li>
                </ul>
                <Link href="/sign-up" >
                  <button className="flex mt-10 gap-2 cursor-pointer w-full justify-center mx-auto py-3 rounded-md text-white bg-green hover:bg-green-dark hover:gap-4">
                    Get Studify
                    <Image src="/plane.svg" width={15} height={15} alt="plane" />
                  </button>
                </Link>
              </div>
            </div>

            {/* 6 months */}
            <div className="bg-gray-50 p-10 border rounded-xl border-green-400">
              <h1 className="text-4xl mb-10 primary-font font-bold">
                5999 ৳ <span className="font-normal secondary-font text-lg">/ 6 months</span>
              </h1>
              <div>
                <ul className="secondary-font flex flex-col gap-4">
                  <li className="flex items-center gap-2">
                    <Check size={20} />
                    <p>Student & batch management</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} />
                    <p>Result Dashboard with sms result publish</p>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={20} />
                    <p>Database fore more than 150 students</p>
                  </li>
                </ul>
                <Link href="/sign-up">
                  <button className="flex mt-10 gap-2 cursor-pointer w-full justify-center mx-auto py-3 rounded-md text-white bg-green hover:bg-green-dark hover:gap-4">
                    Get Studify
                    <Image src="/plane.svg" width={15} height={15} alt="plane" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <footer className="lg:py-20 py-18 px-8 lg:px-18 w-full bg-[#EFF2F5]">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 justify-between">
            <div className="flex flex-col items-center lg:items-start gap-3">
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="logo" width={25} height={25} />
                <h1 className="font-bold primary-font text-lg">Studify</h1>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <p className="text-center lg:text-left mb-4 text-sm w-45 secondary-font">
                  Student management made easy. Digitally manage you students and publish results via
                  sms with many more features.
                </p>
                <p className="text-center text-sm font-semibold secondary-font">
                  Copyright © {new Date().getFullYear()}. All rights reserved.
                </p>
              </div>
            </div>
            <div>
              <h1 className="text-soft mb-4 text-center lg:text-left">Links</h1>
              <div className="flex flex-col gap-2 text-sm secondary-font items-center lg:items-start">
                <Link className="hover:underline" href="/">
                  Home
                </Link>
                <Link className="hover:underline" href="#pricing">
                  Pricing
                </Link>
                <Link className="hover:underline" href="/about">
                  About Us
                </Link>
                <Link className="hover:underline" href="/dashboard">
                  Dashboard
                </Link>
                <Link className="hover:underline" href="/gportal">
                  Guardian Portal
                </Link>
              </div>
            </div>
            <div>
              <h1 className="text-soft mb-4 text-center lg:text-left">Legal</h1>
              <div className="flex flex-col gap-2 text-sm secondary-font items-center lg:items-start">
                <Link href="/">Terms of services</Link>
                <Link href="/">Privacy policy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
