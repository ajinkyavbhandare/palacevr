"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import StudioHeader from '../../../components/layout/StudioHeader';

export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const supabase = createClientComponentClient();

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      
      // Get videos for current user
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setNotification({ message: 'Error loading videos. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const togglePublicStatus = async (video) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ is_public: !video.is_public })
        .eq('id', video.id);
      
      if (error) throw error;
      
      // Update local state
      setVideos(videos.map(v => 
        v.id === video.id ? { ...v, is_public: !v.is_public } : v
      ));
      
      setNotification({ 
        message: `Video is now ${!video.is_public ? 'public' : 'private'}`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error updating video status:', error);
      setNotification({ message: 'Error updating video status. Please try again.', type: 'error' });
    }
  };

  const confirmDelete = (video) => {
    setShowDeleteConfirm(video);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const deleteVideo = async (video) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id);
      
      if (error) throw error;
      
      // Update local state
      setVideos(videos.filter(v => v.id !== video.id));
      setShowDeleteConfirm(null);
      
      setNotification({ message: 'Video deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting video:', error);
      setNotification({ message: 'Error deleting video. Please try again.', type: 'error' });
    }
  };

  const startEditing = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditDescription(video.description || '');
  };

  const cancelEditing = () => {
    setEditingVideo(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdits = async () => {
    if (!editingVideo) return;
    
    try {
      const { error } = await supabase
        .from('videos')
        .update({ 
          title: editTitle,
          description: editDescription 
        })
        .eq('id', editingVideo.id);
      
      if (error) throw error;
      
      // Update local state
      setVideos(videos.map(v => 
        v.id === editingVideo.id ? 
        { ...v, title: editTitle, description: editDescription } : v
      ));
      
      cancelEditing();
      setNotification({ message: 'Video updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating video:', error);
      setNotification({ message: 'Error updating video. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('/images/palace_subhero.png')]">
      <div className="min-h-screen w-full bg-black/70">
        <StudioHeader />
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Video Dashboard</h1>
            
            {notification.message && (
              <div className={`mb-6 p-4 rounded-lg ${notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                {notification.message}
              </div>
            )}
            
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-gray-800/90 p-6 rounded-lg max-w-md w-full shadow-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
                  <p className="text-white mb-6">Are you sure you want to delete this video? This action cannot be undone.</p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={cancelDelete}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteVideo(showDeleteConfirm)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="text-white text-center py-8">Loading your videos...</div>
            ) : videos.length === 0 ? (
              <div className="bg-black/50 backdrop-blur-lg rounded-lg p-8 text-center">
                <p className="text-white text-xl mb-4">You haven't uploaded any videos yet</p>
                <a 
                  href="/studio/upload-180" 
                  className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Upload Your First Video
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {videos.map(video => (
                  <div key={video.id} className="bg-black/50 backdrop-blur-lg rounded-lg overflow-hidden shadow-lg">
                    {editingVideo?.id === video.id ? (
                      <div className="p-6">
                        <h3 className="text-white text-xl mb-4">Edit Video</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-white mb-2">Title</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-white mb-2">Description</label>
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.g.target.value)}
                              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 h-32"
                            />
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={saveEdits}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 aspect-video bg-black">
                            <video 
                              src={video.video_url} 
                              controls
                              className="w-full h-full object-contain"
                              poster={video.thumbnail_url || undefined}
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                            <p className="text-gray-300 mb-4">{video.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 rounded-full text-sm ${video.is_public ? 'bg-green-600' : 'bg-gray-600'}`}>
                                {video.is_public ? 'Public' : 'Private'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-800/50 p-4 flex justify-end space-x-3">
                          <button
                            onClick={() => togglePublicStatus(video)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                          >
                            {video.is_public ? 'Make Private' : 'Make Public'}
                          </button>
                          <button
                            onClick={() => startEditing(video)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(video)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}