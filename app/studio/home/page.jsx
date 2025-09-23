import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import StudioHeader from '../../../components/layout/StudioHeader';

export default async function HomePage() {
  // This server-side login check remains
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // The returned JSX is updated below
  return (
    // A main container is added to hold the background image
    <main className="relative min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/images/studioherobackground.webp')] filter brightness-80 contrast-120">
      
      {/* The Header (Navbar) is kept as requested */}
      <StudioHeader />

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-start justify-center text-left text-white px-8 md:px-16">
        <h1 className="font-lexend text-[90px] font-thin leading-tight">
          Unleash 
          <br />
          New Dimensions:
          <br />
          2D to Immersive      3D Video
        </h1>
        <p className="mt-4 text-[35px] font-lexend font-thin">
          Transform your flat footage into breathtaking stereoscopic 3D and 180° immersive experiences. The future of video starts here.
        </p>
      </div>

      {/* Your actual page content (like a hero section, video carousels, etc.) would go here */}
      
    </main>
  );
}