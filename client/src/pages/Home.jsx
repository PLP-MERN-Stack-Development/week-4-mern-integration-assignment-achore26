import { Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/Posts/PostCard'
import Loading from '../components/UI/Loading'
import ErrorMessage from '../components/UI/ErrorMessage'

const Home = () => {
  const { data: postsData, isLoading, error } = usePosts(1, 6)

  console.log('Posts Data:', postsData);
  console.log('Error:', error);
  console.log('Is Loading:', isLoading);

  if (isLoading) return <Loading />
  if (error) return <ErrorMessage message={error.message} />

  const posts = postsData?.data || []

  if (posts.length === 0) {
    return (
      <div className="container py-4 text-center">
        <h2 style={{ fontSize: '2rem', color: '#1f2937' }}>Welcome to MERN Blog</h2>
        <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>No posts available yet. Be the first to create one!</p>
        <Link to="/posts/create" className="btn btn-primary mt-4">
          Create Post
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-4">
      {/* Hero Section */}
      <section className="text-center mb-4">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1f2937' }}>
          Welcome to MERN Blog
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
          Discover amazing stories, tutorials, and insights from our community
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/posts" className="btn btn-primary btn-lg">
            Explore Posts
          </Link>
          <Link to="/register" className="btn btn-outline btn-lg">
            Join Community
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#1f2937' }}>Featured Posts</h2>
          <Link to="/posts" className="btn btn-outline">
            View All Posts
          </Link>
        </div>
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              No posts available yet. Be the first to create one!
            </p>
            <Link to="/create-post" className="btn btn-primary mt-4">
              Create Post
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section style={{ marginTop: '4rem', padding: '3rem 0', background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1f2937' }}>
            Why Choose MERN Blog?
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            A modern blogging platform built with cutting-edge technology
          </p>
        </div>
        
        <div className="grid grid-cols-3">
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              Fast & Modern
            </h3>
            <p style={{ color: '#6b7280' }}>
              Built with React and powered by a robust Node.js backend
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              Rich Editor
            </h3>
            <p style={{ color: '#6b7280' }}>
              Create beautiful posts with our intuitive writing interface
            </p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              Community
            </h3>
            <p style={{ color: '#6b7280' }}>
              Connect with writers and readers from around the world
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
