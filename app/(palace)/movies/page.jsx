// app/(palace)/movies/page.jsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PalaceHeader from '../../../components/layout/PalaceHeader';
import Image from 'next/image';
import Link from 'next/link';

// Function to fetch popular movies
async function getPopularMovies() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error("TMDB_API_KEY is not defined.");
    return [];
  }
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!res.ok) {
      throw new Error(`Failed to fetch popular movies: ${res.statusText}`);
    }
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function MoviesPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const movies = await getPopularMovies();

  return (
    <div className="bg-black min-h-screen text-white">
      <PalaceHeader />
      <div className="p-8 md:p-16">
        <h1 className="text-4xl font-bold mb-8">Popular Movies</h1>
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {movies.map(movie => (
              <Link href={`/movies/${movie.id}`} key={movie.id} className="transform hover:scale-105 transition-transform duration-300">
                <div className="rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="object-cover"
                  />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold">Could not load movies.</h2>
            <p>Please check the console for more details.</p>
          </div>
        )}
      </div>
    </div>
  );
}