import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContext';
import api from '../services/api';
import Loading from '../components/UI/Loading';
import ErrorMessage from '../components/UI/ErrorMessage';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.posts.getById(id);
      setPost(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await api.posts.addComment(id, { content: newComment });
      setPost(response.data.data);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.posts.delete(id);
      toast.success('Post deleted successfully');
      navigate('/posts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!post) return <ErrorMessage message="Post not found" />;

  const canEdit = user && (user.id === post.author._id || user.role === 'admin');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Post Header */}
      <div className="mb-8">
        <nav className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/posts" className="hover:text-blue-600">Posts</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{post.title}</span>
        </nav>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <img
              src={`https://ui-avatars.com/api/?name=${post.author.name}&background=random`}
              alt={post.author.name}
              className="w-8 h-8 rounded-full"
            />
            <span>By {post.author.name}</span>
          </div>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.category && (
            <>
              <span>•</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {post.category.name}
              </span>
            </>
          )}
        </div>

        {canEdit && (
          <div className="flex gap-2 mb-4">
            <Link
              to={`/posts/${post._id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Post
            </Link>
            <button
              onClick={handleDeletePost}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Post
            </button>
          </div>
        )}

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
      </div>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none mb-12">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() && (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          )
        ))}
      </div>

      {/* Comments Section */}
      <div className="border-t pt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({post.comments?.length || 0})
        </h3>

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {submittingComment ? 'Adding...' : 'Add Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link> to leave a comment.
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {post.comments?.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${comment.author.name}&background=random`}
                    alt={comment.author.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-gray-900">{comment.author.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
