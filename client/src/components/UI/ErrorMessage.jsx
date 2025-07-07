const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-message">
      <h3 style={{ marginBottom: '0.5rem' }}>Something went wrong</h3>
      <p>{message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary btn-sm mt-4">
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
