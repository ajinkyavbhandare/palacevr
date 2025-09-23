'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Header from '../../../components/layout/Header';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

export default function LoginPage() {
  const supabase = createClientComponentClient();

  const handleOAuthSignIn = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `http://localhost:3000/callback`,
      },
    });
  };

  return (
    <>
      <Header /> 
      
      <div
        className="relative flex justify-center items-center min-h-screen pt-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/loginbackground.png')" }}
      >
        {/* Overlay for semi-transparent pattern */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: "url('/images/Repeat group 1.png')" }}
        ></div>

        {/* Content */}
        <div className="relative w-full max-w-5xl p-12 rounded-3xl shadow-lg"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(50px)",
          }}
        >
          <h1 className="text-center text-white text-4xl font-light mb-10">Sign In</h1>
          
          <div className="flex">
            {/* Left Section: Sign In Form */}
            <div className="w-1/2 pr-10">
              <form className="space-y-6">
                <div>
                  <label className="block text-white text-sm mb-2" htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm mb-2" htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm text-gray-300 hover:underline">Forgot Password?</a>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-medium shadow-md hover:opacity-90 transition-opacity"
                >
                  Sign In
                </button>
              </form>
            </div>

            {/* Right Section: Social Buttons and Sign Up Link */}
            <div className="w-1/2 pl-10 flex flex-col justify-between">
              <div className="space-y-4 w-full mt-8">
                <button onClick={() => handleOAuthSignIn('apple')} className="w-full py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium shadow-sm flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors">
                  <FaApple className="text-xl" />
                  <span>Continue with Apple</span>
                </button>
                <button onClick={() => handleOAuthSignIn('google')} className="w-full py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium shadow-sm flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors">
                  <FaGoogle className="text-red-500 text-xl" />
                  <span>Continue with Google</span>
                </button>
                <button onClick={() => handleOAuthSignIn('facebook')} className="w-full py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium shadow-sm flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors">
                  <FaFacebook className="text-blue-600 text-xl" />
                  <span>Continue with Facebook</span>
                </button>
              </div>
              <div className="text-center w-full">
                <a href="/register" className="text-md text-white hover:underline">Create a account</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}