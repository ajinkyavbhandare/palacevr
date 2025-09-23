// components/pages/landing/HeroSection.jsx
import Link from 'next/link';
import Header from '../../layout/Header'; // Import the Header component
import Image from 'next/image';

const HeroSection = () => {
  return (
    <>
      <Header /> {/* The transparent header will float over the background */}
      <section className="relative h-screen flex items-center justify-center text-white">
        {/* Background Image */}
        <Image
          src="/images/landing page hero.jpeg"
          alt="A person gazing at a vibrant galaxy, representing the universe of immersive content on Palace."
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Content */}
        <div className="relative z-20 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Your Universe of 180° Video
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Dive into immersive content from creators around the world, or become one yourself with Palace Studio.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                Get Started
              </span>
            </Link>
            <Link href="/login">
              <span className="block bg-transparent border-2 border-orange-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 hover:bg-orange-500/20">
                Login
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;