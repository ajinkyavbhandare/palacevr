// app/(palace)/my-palace/page.jsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PalaceHeader from '../../../components/layout/PalaceHeader';
import { FaPlus, FaFilm } from 'react-icons/fa';

async function addMovieToWatchlist(formData) {
  'use server';

  const imdbUrl = formData.get('imdb_url');
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && imdbUrl) {
    await supabase.from('watchlist').insert({ user_id: user.id, imdb_url: imdbUrl });
  }
  // Revalidate to show the new item
  redirect('/my-palace');
}

export default async function MyPalacePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: watchlist, error } = await supabase
    .from('watchlist')
    .select('id, imdb_url')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="bg-black min-h-screen text-white">
      <PalaceHeader />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">My Palace</h1>
            <p className="text-gray-400">Your personal movie watchlist.</p>
          </div>

          {/* Add to Watchlist Form */}
          <form action={addMovieToWatchlist} className="mb-12">
            <div className="flex gap-2">
              <input
                type="url"
                name="imdb_url"
                placeholder="Enter IMDb movie link..."
                required
                className="flex-grow bg-gray-800 text-white placeholder-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center"
              >
                <FaPlus className="mr-2" /> Add
              </button>
            </div>
          </form>

          {/* Watchlist */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold border-b-2 border-gray-700 pb-2">Your Watchlist</h2>
            {watchlist && watchlist.length > 0 ? (
              watchlist.map((item) => (
                <div key={item.id} className="bg-gray-900 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <FaFilm className="text-gray-400 mr-4" />
                    <a href={item.imdb_url} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                      {item.imdb_url}
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Your watchlist is empty. Add a movie to get started!</p>
            )}
             {error && <p className="text-red-500">Could not fetch watchlist. Make sure you have a 'watchlist' table in Supabase.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}