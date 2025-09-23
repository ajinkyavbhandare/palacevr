// app/(palace)/featured/page.jsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import PalaceHeader from '../../../components/layout/PalaceHeader';
import Image from 'next/image';
import { FaStar, FaRegClock } from 'react-icons/fa';
import Link from 'next/link';

// Function to fetch multiple movies by their IDs
async function getFeaturedMovies(movieIds) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    console.error("TMDB_API_KEY is not defined.");
    return [];
  }

  const moviePromises = movieIds.map(async (id) => {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`;
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache data for 1 hour
      if (!res.ok) {
        throw new Error(`Failed to fetch movie with id ${id}: ${res.statusText}`);
      }
      return res.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  const movies = await Promise.all(moviePromises);
  return movies.filter(movie => movie !== null); // Filter out any failed requests
}

// Component for the Hero Section
const MovieHero = ({ movie }) => {
  if (!movie) return null;

  const rating = movie.vote_average.toFixed(1);
  const year = new Date(movie.release_date).getFullYear();
  const runtime = movie.runtime;
  const genres = movie.genres.map(g => g.name).join(', ');

  return (
    <div className="relative h-[80vh] w-full">
      {/* Background Image */}
      <Image
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10"></div>

      {/* Movie Details */}
      <div className="relative z-20 flex flex-col justify-center h-full text-white p-8 md:p-16 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-wider" style={{ fontFamily: 'serif' }}>
          {movie.title.toUpperCase()}
        </h1>
        <div className="flex items-center flex-wrap space-x-4 my-4 text-gray-300">
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-400" />
            <span>{rating}/10</span>
          </div>
          <span>•</span>
          <span>{year}</span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <FaRegClock />
            <span>{runtime} min</span>
          </div>
          <span>•</span>
          <span className="border px-2 py-0.5 rounded text-xs">16+</span>
          <span>•</span>
          <span>{genres}</span>
        </div>
        <p className="text-lg leading-relaxed mb-4">{movie.overview}</p>
      </div>
    </div>
  );
};

export default async function FeaturedPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Movie IDs: The Dark Knight (155), Tenet (577922), Star Wars: Revenge of the Sith (1895)
  const movieIds = [155, 577922, 1895];
  const featuredMovies = await getFeaturedMovies(movieIds);

  if (!featuredMovies || featuredMovies.length === 0) {
    return (
      <div>
        <PalaceHeader />
        <div className="text-center py-10 bg-black text-white">
          <h1 className="text-2xl font-bold">Could not load featured movies.</h1>
          <p>Please check the console for more details.</p>
        </div>
      </div>
    );
  }

  const mainHeroMovie = featuredMovies[0]; // The Dark Knight

  return (
    <div className="relative min-h-screen bg-black">
      <PalaceHeader />
      
      {/* Hero Section */}
      <MovieHero movie={mainHeroMovie} />

      {/* Featured Movies Carousel */}
      <div className="p-8 md:p-16">
        <h2 className="text-3xl font-bold text-white mb-8">Featured</h2>
        <div className="flex overflow-x-auto space-x-6 pb-4">
          {featuredMovies.map(movie => (
            <Link href={`/movies/${movie.id}`} key={movie.id} className="flex-shrink-0 w-64 transform hover:scale-105 transition-transform duration-300">
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
      </div>
    </div>
  );
}