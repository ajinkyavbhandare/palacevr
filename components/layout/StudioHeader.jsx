// components/layout/StudioHeader.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const StudioHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { href: "/studio/home", label: "Home" },
    { href: "/studio/upload-180", label: "Upload" },
    { href: "/studio/convert", label: "Create180" },
    { href: "/studio/dashboard", label: "Dashboard" },
    { href: "/studio/analytics", label: "Analytics" },
    { href: "/studio/featured", label: "Features" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    // The outer <header> is now just a sticky container with padding
    <header className="sticky top-0 z-50 pt-4">
      {/* All styling is now on the <nav> element to create the floating effect */}
      <nav 
        className="container mx-auto flex justify-between items-center rounded-2xl border border-white/10
                   bg-neutral-900/25 backdrop-blur-lg px-6 py-4"
      >
        {/* === LEFT SIDE: Logo with Dropdown === */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center"
          >
            {/* NOTE: I've adjusted the logo size to fit the new navbar height */}
            <Image
              src="/images/icons_palace_studio.svg"
              alt="Palace Studio Logo"
              width={200}
              height={200}
              className="brightness-0 invert"
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full mt-4 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 z-20">
              <ul>
                <li>
                  <Link href="/home" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-x-3 p-2 hover:bg-gray-800 rounded-md">
                    {/* NOTE: Adjusted this logo's size as well */}
                    <Image src="/images/icons_palace.svg" alt="Palace Logo" width={110} height={24} className="brightness-0 invert" />
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* === CENTER: Studio Navigation Links === */}
        <ul className="hidden md:flex items-center gap-x-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-base duration-200">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* === RIGHT SIDE: Profile Icon === */}
        <div className="flex items-center">
          <Link href="/studio/profile">
            <div className="w-8 h-8 bg-red-600 rounded-md hover:opacity-90 transition-opacity"></div>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default StudioHeader;