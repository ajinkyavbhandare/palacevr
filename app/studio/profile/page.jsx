// app/studio/profile/page.jsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StudioHeader from '../../../components/layout/StudioHeader';
import SignOutButton from '../../../components/auth/SignOutButton';
import Link from 'next/link';
import { FaUserCog, FaVideo, FaSignOutAlt } from 'react-icons/fa';

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/images/palace_subhero.png')]">
      <div className="min-h-screen w-full bg-black/70">
        <StudioHeader />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto bg-black/50 rounded-lg shadow-lg p-8 backdrop-blur-lg">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-2 text-white">Your Profile</h1>
              <p className="text-gray-300">Manage your account and content</p>
            </div>

            {/* User Info */}
            <div className="bg-gray-800/80 rounded-lg p-6 mb-8">
              <p className="text-lg text-white">
                <span className="font-semibold">Email:</span> {session.user.email}
              </p>
            </div>

            {/* Action Links */}
            <div className="space-y-4">
              <Link href="/studio/profile/settings" className="flex items-center bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300">
                <FaUserCog className="mr-4 text-xl" />
                <span>Account Settings</span>
              </Link>
              <Link href="/studio/dashboard" className="flex items-center bg-gray-800/80 hover:bg-gray-700/80 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300">
                <FaVideo className="mr-4 text-xl" />
                <span>Manage Videos</span>
              </Link>
              <div className="bg-gray-800/80 hover:bg-gray-700/80 rounded-lg transition-colors duration-300">
                <div className="flex items-center text-orange-500 font-bold py-4 px-6">
                  <FaSignOutAlt className="mr-4 text-xl" />
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}