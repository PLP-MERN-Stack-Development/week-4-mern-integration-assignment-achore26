import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        token: null,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = authService.getCurrentUser()
    
    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      })
    }
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authService.login(credentials)
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response,
      })
      
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authService.register(userData)
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response,
      })
      
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage,
      })
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
