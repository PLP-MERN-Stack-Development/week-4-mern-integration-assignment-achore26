import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="card post-card">
      {post.featuredImage && (
        <img
          src={`/api/uploads/${post.featuredImage}`}
          alt={post.title}
          className="post-image"
          onError={(e) => {
            e.target.src = '/default-post.jpg'
          }}
        />
      )}
      
      <div className="card-body">
        {post.category && (
          <span
            className="category-badge"
            style={{ backgroundColor: post.category.color }}
          >
            {post.category.name}
          </span>
        )}
        
        <h3 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.25rem' }}>
          <Link
            to={`/posts/${post._id}`}
            style={{ textDecoration: 'none', color: '#1f2937' }}
          >
            {post.title}
          </Link>
        </h3>
        
        {post.excerpt && (
          <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>
            {post.excerpt}
          </p>
        )}
        
        <div className="post-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={post.author?.avatar ? `/api/uploads/${post.author.avatar}` : '/default-avatar.jpg'}
              alt={post.author?.username}
              style={{ width: '24px', height: '24px', borderRadius: '50%' }}
              onError={(e) => {
                e.target.src = '/default-avatar.jpg'
              }}
            />
            <span>{post.author?.firstName} {post.author?.lastName}</span>
          </div>
          <span>{formatDate(post.createdAt)}</span>
          <span>{post.viewCount || 0} views</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
