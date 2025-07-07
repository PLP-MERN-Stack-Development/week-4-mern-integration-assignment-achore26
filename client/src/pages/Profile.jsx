import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContext';
import { usePosts } from '../hooks/usePosts';
import api from '../services/api';
import Loading from '../components/UI/Loading';
import ErrorMessage from '../components/UI/ErrorMessage';
import PostCard from '../components/Posts/PostCard';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthContext();
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || ''
    });

    if (activeTab === 'posts') {
      fetchUserPosts();
    }
  }, [user, navigate, activeTab]);

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await api.posts.getAll({ author: user.id });
      setUserPosts(response.data.data);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      toast.error('Failed to load your posts');
    } finally {
      setPostsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.auth.updateProfile(formData);
      updateUser(response.data.data);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.posts.delete(postId);
      setUserPosts(posts => posts.filter(post => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&size=120&background=random`}
              alt={user.name}
              className="w-24 h-24 rounded-full"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                {user.bio && (
                  <p className="text-gray-700 mt-2">{user.bio}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{userPosts.length} posts</span>
                </div>
              </div>
              
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {editing && (
          <form onSubmit={handleUpdateProfile} className="mt-6 pt-6 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border">
        {activeTab === 'posts' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Posts</h2>
              <button
                onClick={() => navigate('/posts/create')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Post
              </button>
            </div>

            {postsLoading ? (
              <Loading />
            ) : userPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPosts.map((post) => (
                  <div key={post._id} className="relative">
                    <PostCard post={post} />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => navigate(`/posts/${post._id}/edit`)}
                        className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        title="Edit post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        title="Delete post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-500 mb-4">You haven't written any posts yet. Start sharing your thoughts!</p>
                <button
                  onClick={() => navigate('/posts/create')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Write Your First Post
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
            
            <div className="space-y-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Account Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Account ID:</strong> {user.id}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Password Change</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  To change your password, please contact support or use the password reset feature.
                </p>
                <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm">
                  Request Password Reset
                </button>
              </div>

              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-800 mb-3">
                  Delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
