// components/layout/Footer.jsx
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Palace</h3>
            <p className="text-sm">
              Your ultimate destination for discovering and enjoying the best films, shows, and shortfilms from around the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/home" className="hover:text-white">Home</Link></li>
              <li><Link href="/movies" className="hover:text-white">Movies</Link></li>
              <li><Link href="/shows" className="hover:text-white">Shows</Link></li>
              <li><Link href="/shortfilms" className="hover:text-white">Shortfilms</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white"><FaFacebook size={24} /></a>
              <a href="#" className="hover:text-white"><FaTwitter size={24} /></a>
              <a href="#" className="hover:text-white"><FaInstagram size={24} /></a>
              <a href="#" className="hover:text-white"><FaLinkedin size={24} /></a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-l-md bg-gray-800 text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-r-md bg-orange-500 text-white font-semibold hover:bg-orange-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p>&copy; {currentYear} Palace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;