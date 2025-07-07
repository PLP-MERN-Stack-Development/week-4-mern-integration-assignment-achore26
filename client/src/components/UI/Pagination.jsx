const Pagination = ({ currentPage, totalPages, onPageChange, hasNext, hasPrev }) => {
  const pages = []
  const maxVisiblePages = 5
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (totalPages <= 1) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="btn btn-outline btn-sm"
        style={{ opacity: !hasPrev ? 0.5 : 1 }}
      >
        Previous
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="btn btn-outline btn-sm"
          >
            1
          </button>
          {startPage > 2 && <span style={{ padding: '0 0.5rem' }}>...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
        >
          {page}
        </button>
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span style={{ padding: '0 0.5rem' }}>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="btn btn-outline btn-sm"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="btn btn-outline btn-sm"
        style={{ opacity: !hasNext ? 0.5 : 1 }}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
