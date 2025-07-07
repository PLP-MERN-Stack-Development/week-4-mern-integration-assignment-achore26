import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';

const SearchAndFilter = ({ onSearch, onFilter, initialSearch = '', initialCategory = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const { data: categories } = useCategories();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    onFilter({ category: categoryId });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    onSearch('');
    onFilter({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts by title or content..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="sr-only">Search</span>
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </button>
          </div>
        </form>

        {/* Category Filter */}
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory) && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Search: "{searchTerm}"
              <button
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Category: {categories?.find(c => c._id === selectedCategory)?.name}
              <button
                onClick={() => handleCategoryChange('')}
                className="ml-1 hover:text-green-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
