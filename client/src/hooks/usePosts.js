import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';
import { toast } from 'react-toastify';

// Hook to fetch all posts
export const usePosts = (params = {}) => {
  const queryParams = {
    page: 1,
    limit: 10,
    ...params
  };

  return useQuery(
    ['posts', queryParams],
    () => api.posts.getAll(queryParams),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

// Hook to fetch a single post
export const usePost = (id) => {
  return useQuery(
    ['post', id],
    () => postService.getPost(id),
    {
      enabled: !!id,
    }
  )
}

// Hook to create a new post
export const useCreatePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation(postService.createPost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts')
      toast.success('Post created successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to create post'
      toast.error(message)
    },
  })
}

// Hook to update a post
export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ id, data }) => postService.updatePost(id, data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries('posts')
        queryClient.invalidateQueries(['post', variables.id])
        toast.success('Post updated successfully!')
      },
      onError: (error) => {
        const message = error.response?.data?.error || 'Failed to update post'
        toast.error(message)
      },
    }
  )
}

// Hook to delete a post
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation(postService.deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries('posts')
      toast.success('Post deleted successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.error || 'Failed to delete post'
      toast.error(message)
    },
  })
}

// Hook to search posts
export const useSearchPosts = (query) => {
  return useQuery(
    ['searchPosts', query],
    () => postService.searchPosts(query),
    {
      enabled: !!query && query.length > 2,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  )
}

// Hook to add a comment
export const useAddComment = () => {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ postId, commentData }) => postService.addComment(postId, commentData),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['post', variables.postId])
        toast.success('Comment added successfully!')
      },
      onError: (error) => {
        const message = error.response?.data?.error || 'Failed to add comment'
        toast.error(message)
      },
    }
  )
}
