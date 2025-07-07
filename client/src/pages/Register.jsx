import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { register, isAuthenticated, error, clearError } = useAuth()
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
    
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long'
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const { confirmPassword, ...registrationData } = formData
      await register(registrationData)
      toast.success('Registration successful!')
      navigate('/')
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-4">
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="card">
          <div className="card-header">
            <h2 style={{ textAlign: 'center', margin: 0 }}>Create Account</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-control ${errors.firstName ? 'error' : ''}`}
                    required
                  />
                  {errors.firstName && <div className="form-error">{errors.firstName}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-control ${errors.lastName ? 'error' : ''}`}
                    required
                  />
                  {errors.lastName && <div className="form-error">{errors.lastName}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-control ${errors.username ? 'error' : ''}`}
                  required
                />
                {errors.username && <div className="form-error">{errors.username}</div>}
              </div>

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
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  required
                />
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                  required
                />
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
          <div className="card-footer text-center">
            <p>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#3b82f6' }}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
