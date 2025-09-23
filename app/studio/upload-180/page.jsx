"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import StudioHeader from '../../../components/layout/StudioHeader';

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Cloudinary configuration
  const cloudName = 'dbl9isbso';
  const uploadPreset = 'palace_videos'; // Make sure this is set as "unsigned" in Cloudinary

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setError(''); // Clear any previous errors
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!videoFile || !title) {
      setNotification({ message: 'Please select a video file and provide a title', type: 'error' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('upload_preset', uploadPreset);
      // Remove api_key completely for unsigned uploads

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };
      
      xhr.onload = async function() {
        setUploading(false);
        
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          
          if (data.secure_url) {
            try {
              // Save video metadata to Supabase
              const { data: videoData, error } = await supabase
                .from('videos')
                .insert([
                  {
                    title,
                    description,
                    video_url: data.secure_url,
                    public_id: data.public_id,
                    user_id: (await supabase.auth.getUser()).data.user.id
                  },
                ]);
    
              if (error) throw error;
    
              setUploadedUrl(data.secure_url);
              setNotification({ message: 'Video uploaded successfully!', type: 'success' });
              
              // Reset form
              setTitle('');
              setDescription('');
              setVideoFile(null);
              
            } catch (supabaseError) {
              console.error('Supabase error:', supabaseError);
              setError('Video uploaded but failed to save metadata: ' + supabaseError.message);
            }
          }
        } else {
          // Parse error response
          let errorMessage = 'Upload failed';
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.error?.message || errorData.message || errorMessage;
          } catch (parseError) {
            errorMessage = xhr.responseText || errorMessage;
          }
          
          console.error('Upload failed:', xhr.responseText);
          setError('Upload error: ' + errorMessage);
        }
      };
      
      xhr.onerror = function() {
        setUploading(false);
        console.error('Upload error');
        setError('Network error during upload. Please check your connection.');
      };
      
      xhr.send(formData);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Error uploading video: ' + error.message);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/images/palace_subhero.png')]">
      <div className="min-h-screen w-full bg-black/70">
        <StudioHeader />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto bg-black/50 rounded-lg shadow-lg p-8 backdrop-blur-lg">
            <h1 className="text-3xl font-bold text-white mb-8">Upload 180° Video</h1>
            
            {notification.message && (
              <div className={`mb-6 p-4 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white rounded-lg`}>
                {notification.message}
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-white mb-2">Video Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Upload Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                {videoFile && (
                  <p className="text-gray-300 text-sm mt-2">
                    Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={uploading}
                className={`w-full py-3 rounded-lg font-bold ${uploading ? 'bg-gray-600' : 'bg-orange-600 hover:bg-orange-700'} text-white transition-colors`}
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </form>
            
            {uploading && (
              <div className="mt-6">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-red-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-white text-center mt-2">{uploadProgress}%</p>
              </div>
            )}
            
            {uploadedUrl && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4">Uploaded Video</h2>
                <div className="aspect-video rounded overflow-hidden">
                  <video 
                    src={uploadedUrl} 
                    controls 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
