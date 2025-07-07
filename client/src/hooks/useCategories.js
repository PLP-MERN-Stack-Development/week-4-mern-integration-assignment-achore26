import { useQuery } from 'react-query'
import { categoryService } from '../services/api'

// Hook to fetch all categories
export const useCategories = () => {
  return useQuery('categories', categoryService.getAllCategories, {
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
