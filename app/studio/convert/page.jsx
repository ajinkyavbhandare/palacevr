"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import StudioHeader from '../../../components/layout/StudioHeader';

export default function ConvertPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [user, setUser] = useState(null);
  const [convertedVideos, setConvertedVideos] = useState([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  useEffect(() => {
    const getConvertedVideos = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('converted_videos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          setNotification({ message: `Could not fetch converted videos: ${error.message}`, type: 'error' });
        } else {
          setConvertedVideos(data);
        }
      }
    };

    getConvertedVideos();
  }, [user, supabase]);

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setError('');
      setDownloadUrl('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile) {
        setNotification({ message: 'Please select a video file to convert', type: 'error' });
        return;
    }
    if (!user) {
        setNotification({ message: 'You must be logged in to convert videos.', type: 'error' });
        return;
    }

    setIsConverting(true);
    setError('');
    setDownloadUrl('');
    setNotification({ message: 'Your video conversion has started. This may take some time. The video will be added to your account when finished.', type: 'info' });

    try {
        const formData = new FormData();
        formData.append('video_file', videoFile);

        const response = await fetch('https://ajinkyabhandare200210--video-processor.modal.run/process-and-upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(errorData.detail || `Server responded with status ${response.status}`);
        }

        const data = await response.json();

        if (data.gofile_download_page) {
            const newUrl = data.gofile_download_page;
            setDownloadUrl(newUrl);
            setNotification({ message: 'Video processed successfully! Saving to your account...', type: 'success' });

            const { data: dbData, error: dbError } = await supabase
                .from('converted_videos')
                .insert([{
                    user_id: user.id,
                    video_url: newUrl,
                    file_name: videoFile.name
                }])
                .select()
                .single();

            if (dbError) {
                setError(`Failed to save video to your account: ${dbError.message}`);
                setNotification({ message: `Conversion succeeded, but failed to save to account.`, type: 'error' });
            } else {
                setNotification({ message: 'Video converted and saved to your account!', type: 'success' });
                if (dbData) {
                  setConvertedVideos([dbData, ...convertedVideos]);
                }
            }

            setVideoFile(null);
        } else {
            throw new Error('Conversion failed: The server did not return a download URL.');
        }

    } catch (err) {
        console.error("Conversion Error:", err);
        setError(`Error converting video: ${err.message}`);
        setNotification({ message: `An error occurred: ${err.message}`, type: 'error' });
    } finally {
        setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/images/palace_subhero.png')]">
      <div className="min-h-screen w-full bg-black/70">
        <StudioHeader />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-black/50 rounded-lg shadow-lg p-8 backdrop-blur-lg">
            <h1 className="text-3xl font-bold text-white mb-8">Convert to 180° Video</h1>
            
            {notification.message && (
              <div className={`mb-6 p-4 ${notification.type === 'success' ? 'bg-green-600' : notification.type === 'info' ? 'bg-blue-600' : 'bg-red-600'} text-white rounded-lg`}>
                {notification.message}
              </div>
            )}
            
            {error && !notification.message && (
              <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-white mb-2">Upload Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  disabled={isConverting || !user}
                />
                {videoFile && (
                  <p className="text-gray-300 text-sm mt-2">
                    Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isConverting || !user}
                className={`w-full py-3 rounded-lg font-bold ${isConverting || !user ? 'bg-gray-600 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} text-white transition-colors`}
              >
                {isConverting ? 'Converting...' : 'Convert Video'}
              </button>
            </form>

            {isConverting && (
              <div className="mt-6 text-center text-white">
                <p>Due to GPU unavailability, this conversion may take some time. In the meantime, you can browse our platform. Once finished, the video URL will be saved automatically to your account.</p>
              </div>
            )}
            
            {downloadUrl && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">Conversion Complete!</h2>
                <p className="text-gray-300 mb-4">Your video has been successfully processed and saved. You can also download it here:</p>
                <a 
                  href={downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline break-all"
                >
                  {downloadUrl}
                </a>
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto bg-black/50 rounded-lg shadow-lg p-8 backdrop-blur-lg mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Your Converted Videos</h2>
            {convertedVideos.length > 0 ? (
              <ul className="space-y-4">
                {convertedVideos.map((video) => (
                  <li key={video.id} className="p-4 bg-gray-700 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{video.file_name}</p>
                      <p className="text-sm text-gray-400">Converted on: {new Date(video.created_at).toLocaleDateString()}</p>
                    </div>
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline font-bold"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">You haven't converted any videos yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}