// components/layout/Header.jsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full text-white z-50
        transition-colors duration-300 ease-in-out
        ${isScrolled ? 'bg-gray-900 shadow-md' : 'bg-transparent'}
      `}
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href="/" className="flex items-center gap-x-4">
          <Image
            src="/images/icons_palace.svg"
            alt="Palace Logo"
            width={135}
            height={135}
            className="brightness-0 invert"
          />

          <Image
            src="/images/icons_x.svg"
            alt="X icon"
            width={30}
            height={30}
            // Added translate-y-2 to shift the icon down slightly
            className="brightness-0 invert translate-y-6"
          />

          <Image
            src="/images/icons_palace_studio.svg"
            alt="Palace Studio Logo"
            width={200}
            height={200}
            className="brightness-0 invert"
          />
        </Link>
        
        {/* You can add other navigation items here */}
      </nav>
    </header>
  );
};

export default Header;