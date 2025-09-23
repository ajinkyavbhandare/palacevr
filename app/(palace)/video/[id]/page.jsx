import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import PalaceHeader from '../../../../components/layout/PalaceHeader';
import { FaVrCardboard } from 'react-icons/fa';

async function getVideo(id, supabase) {
  const { data: video, error } = await supabase
    .from('videos')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !video) {
    notFound();
  }

  // This page is for public videos, so we can add a check here.
  // If a user tries to access a private video URL, they will get a 404.
  if (!video.is_public) {
    const { data: { session } } = await supabase.auth.getSession();
    // Allow owner to see their own private video via URL
    if (!session || session.user.id !== video.user_id) {
      notFound();
    }
  }

  return video;
}

export default async function VideoPage({ params }) {
  const supabase = createServerComponentClient({ cookies });
  const video = await getVideo(params.id, supabase);

  // Using programmatic names for creator and cast as requested
  const creatorName = "The Palace Team";
  const cast = ['John Doe', 'Jane Smith', 'Alex Ray'];

  return (
    <div className="min-h-screen bg-black text-white">
      <PalaceHeader />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Video Player with VR Button */}
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6 shadow-lg relative group">
            <video
              src={video.video_url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="flex items-center bg-black/60 backdrop-blur-md text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-300">
                <FaVrCardboard className="mr-2" />
                <span>View in VR 180</span>
              </button>
            </div>
          </div>

          {/* Video Details Section */}
          <div className="bg-gray-900/50 rounded-lg p-8 backdrop-blur-md">
            <h1 className="text-4xl font-bold mb-2">{video.title}</h1>
            <p className="text-gray-300 text-lg mb-6">{video.description}</p>

            <div className="border-t border-gray-700 my-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Creator */}
              <div className="md:col-span-1">
                <h2 className="text-xl font-semibold text-white mb-3">Creator</h2>
                <p className="text-orange-400">{creatorName}</p>
              </div>

              {/* Cast */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-white mb-3">Cast</h2>
                <div className="flex flex-wrap gap-3">
                  {cast.map((actor, index) => (
                    <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}