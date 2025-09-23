// components/layout/Header.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SearchIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/shortfilms", label: "Short-films" },
    { href: "/shows", label: "Shows" },
    { href: "/featured", label: "Featured" },
    { href: "/my-palace", label: "My Palace" },
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
    // 1. Changed 'bg-black' to 'bg-transparent' and removed the bottom border.
    <header className="bg-transparent text-white z-50"> {/* Added z-50 */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative">
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center"
          >
            <Image
              src="/images/icons_palace.svg"
              alt="Palace Logo"
              width={150}
              height={150}
              className="brightness-0 invert"
            />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full mt-4 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 z-50"> {/* Increased z-index from z-20 to z-50 */}
              <ul>
                <li>
                  <Link href="/studio/home" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-x-3 p-2 hover:bg-gray-800 rounded-md">
                    <Image src="/images/icons_palace_studio.svg" alt="Palace Studio Logo" width={200} height={200} className="brightness-0 invert" />
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <ul className="hidden md:flex items-center gap-x-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-gray-300 hover:text-white transition-colors text-base duration-200">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="flex items-center gap-x-6">
          <button className="text-gray-300 hover:text-white transition-colors duration-200">
            <SearchIcon />
          </button>
          <Link href="/profile">
            <div className="w-8 h-8 bg-red-600 rounded-md hover:opacity-90 transition-opacity"></div>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;