import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login, isAuthenticated, error, clearError } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await login(formData)
      toast.success('Login successful!')
      navigate('/')
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-4">
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div className="card">
          <div className="card-header">
            <h2 style={{ textAlign: 'center', margin: 0 }}>Login</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
          <div className="card-footer text-center">
            <p>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#3b82f6' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
