import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            MERN Blog
          </Link>
          
          <ul className="navbar-nav">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/posts">Posts</Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/create-post">Create Post</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <span>Welcome, {user?.firstName}!</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn btn-outline btn-sm">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
