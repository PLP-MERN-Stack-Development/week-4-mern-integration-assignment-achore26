import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContext';
import { useCategories } from '../hooks/useCategories';
import api from '../services/api';
import Loading from '../components/UI/Loading';
import ErrorMessage from '../components/UI/ErrorMessage';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPost();
  }, [user, navigate, id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.posts.getById(id);
      const postData = response.data.data;
      
      // Check if user can edit this post
      if (postData.author._id !== user.id && user.role !== 'admin') {
        toast.error('You are not authorized to edit this post');
        navigate(`/posts/${id}`);
        return;
      }

      setPost(postData);
      setFormData({
        title: postData.title,
        content: postData.content,
        category: postData.category?._id || '',
        image: null
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setRemoveExistingImage(false);
    }
  };

  const removeNewImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image');
    if (fileInput) fileInput.value = '';
  };

  const toggleRemoveExistingImage = () => {
    setRemoveExistingImage(!removeExistingImage);
    if (!removeExistingImage) {
      // If we're removing existing image, also clear new image
      removeNewImage();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData for multipart upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      if (formData.category) {
        submitData.append('category', formData.category);
      }
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      if (removeExistingImage) {
        submitData.append('removeImage', 'true');
      }

      const response = await api.posts.update(id, submitData);
      
      toast.success('Post updated successfully!');
      navigate(`/posts/${response.data.data._id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      toast.error(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return <Loading />;
  }

  if (loading || categoriesLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!post) {
    return <ErrorMessage message="Post not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Post</h1>
        <p className="text-gray-600">Update your post content</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter post title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category (optional)</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Management */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          
          {/* Existing Image */}
          {post.image && !removeExistingImage && !imagePreview && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current image:</p>
              <div className="relative">
                <img
                  src={post.image}
                  alt="Current"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={toggleRemoveExistingImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Removed existing image notice */}
          {removeExistingImage && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                Current image will be removed when you save.{' '}
                <button
                  type="button"
                  onClick={toggleRemoveExistingImage}
                  className="text-blue-600 hover:underline"
                >
                  Undo
                </button>
              </p>
            </div>
          )}

          {/* New Image Upload */}
          <div className="space-y-4">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {imagePreview && (
              <div className="relative">
                <p className="text-sm text-gray-600 mb-2">New image preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeNewImage}
                  className="absolute top-8 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <p className="text-sm text-gray-500">
              Upload a new image (optional). Max size: 5MB. Supported formats: JPG, PNG, GIF.
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Write your post content here..."
            rows={12}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Markdown formatting is supported. You can use **bold**, *italic*, and other markdown syntax.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Post...
              </span>
            ) : (
              'Update Post'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
