import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getPublicVideos(supabase) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching public videos:", error);
    return [];
  }
  return data;
}

export default async function PublicVideos() {
  const supabase = createServerComponentClient({ cookies });
  const publicVideos = await getPublicVideos(supabase);

  if (publicVideos.length === 0) {
    return null; // Don't render anything if there are no public videos
  }

  return (
    <div className="p-8 md:p-16">
      <h2 className="text-3xl font-bold text-white mb-8">Latest Community Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {publicVideos.map(video => (
          <Link href={`/video/${video.id}`} key={video.id} className="group">
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
              <video 
                src={video.video_url} 
                className="w-full h-full object-cover"
                poster={video.thumbnail_url || undefined}
              />
            </div>
            <h3 className="text-white font-bold mt-3">{video.title}</h3>
            <p className="text-gray-400 text-sm">{video.description?.substring(0, 100) || ''}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}