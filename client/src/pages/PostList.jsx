import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import Loading from '../components/UI/Loading';
import ErrorMessage from '../components/UI/ErrorMessage';
import Pagination from '../components/UI/Pagination';
import SearchAndFilter from '../components/UI/SearchAndFilter';
import PostCard from '../components/Posts/PostCard';

const PostList = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  
  const { data, isLoading, error } = usePosts({
    page,
    sortBy,
    sortOrder,
    search,
    ...filters,
    limit: 9
  });

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc'); // Default to desc for new field
    }
    setPage(1);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const posts = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalPosts = data?.total || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="text-gray-600 mt-1">
            {totalPosts > 0 ? `${totalPosts} posts found` : 'No posts found'}
          </p>
        </div>
        <Link
          to="/posts/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Post
        </Link>
      </div>

      {/* Search and Filter */}
      <SearchAndFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        initialSearch={search}
        initialCategory={filters.category || ''}
      />

      {/* Sort Options */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-sm text-gray-600 py-2">Sort by:</span>
        <button
          onClick={() => handleSortChange('createdAt')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            sortBy === 'createdAt'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Date {sortBy === 'createdAt' && (sortOrder === 'desc' ? '↓' : '↑')}
        </button>
        <button
          onClick={() => handleSortChange('title')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            sortBy === 'title'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Title {sortBy === 'title' && (sortOrder === 'desc' ? '↓' : '↑')}
        </button>
        <button
          onClick={() => handleSortChange('author')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            sortBy === 'author'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Author {sortBy === 'author' && (sortOrder === 'desc' ? '↓' : '↑')}
        </button>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500 mb-4">
            {search || filters.category
              ? 'Try adjusting your search or filter criteria.'
              : 'Be the first to share your thoughts!'}
          </p>
          {!search && !filters.category && (
            <Link
              to="/posts/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Post
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default PostList;
