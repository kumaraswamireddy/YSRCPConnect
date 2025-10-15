import { apiService } from './api';

class FeedService {
  async getFeed(page = 1, limit = 20, refresh = false) {
    try {
      const response = await apiService.get('/feed', {
        page,
        limit,
        refresh: refresh ? 'true' : 'false',
      });
      
      return response.data;
    } catch (error) {
      console.error('Get feed error:', error);
      throw error;
    }
  }

  async refreshFeed() {
    try {
      const response = await apiService.get('/feed/refresh');
      return response.data;
    } catch (error) {
      console.error('Refresh feed error:', error);
      throw error;
    }
  }

  async getBroadcastPosts(page = 1, limit = 20) {
    try {
      const response = await apiService.get('/feed/broadcasts', {
        page,
        limit,
      });
      
      return response.data;
    } catch (error) {
      console.error('Get broadcast posts error:', error);
      throw error;
    }
  }

  async likePost(postId) {
    try {
      const response = await apiService.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Like post error:', error);
      throw error;
    }
  }

  async unlikePost(postId) {
    try {
      const response = await apiService.delete(`/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Unlike post error:', error);
      throw error;
    }
  }

  async sharePost(postId) {
    try {
      const response = await apiService.post(`/posts/${postId}/share`);
      return response.data;
    } catch (error) {
      console.error('Share post error:', error);
      throw error;
    }
  }

  async bookmarkPost(postId) {
    try {
      const response = await apiService.post(`/posts/${postId}/bookmark`);
      return response.data;
    } catch (error) {
      console.error('Bookmark post error:', error);
      throw error;
    }
  }

  async removeBookmark(postId) {
    try {
      const response = await apiService.delete(`/posts/${postId}/bookmark`);
      return response.data;
    } catch (error) {
      console.error('Remove bookmark error:', error);
      throw error;
    }
  }

  async reportPost(postId, reason, description) {
    try {
      const response = await apiService.post(`/posts/${postId}/report`, {
        reason,
        description,
      });
      return response.data;
    } catch (error) {
      console.error('Report post error:', error);
      throw error;
    }
  }

  async hidePost(postId) {
    try {
      const response = await apiService.post(`/feed/hide/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Hide post error:', error);
      throw error;
    }
  }

  async markPostsAsRead(postIds) {
    try {
      const response = await apiService.post('/feed/mark-read', {
        post_ids: postIds,
      });
      return response.data;
    } catch (error) {
      console.error('Mark posts as read error:', error);
      throw error;
    }
  }

  async getFeedPreferences() {
    try {
      const response = await apiService.get('/feed/preferences');
      return response.data;
    } catch (error) {
      console.error('Get feed preferences error:', error);
      throw error;
    }
  }

  async updateFeedPreferences(preferences) {
    try {
      const response = await apiService.put('/feed/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Update feed preferences error:', error);
      throw error;
    }
  }

  async getFeedAnalytics() {
    try {
      const response = await apiService.get('/feed/analytics');
      return response.data;
    } catch (error) {
      console.error('Get feed analytics error:', error);
      throw error;
    }
  }

  // Create a new post
  async createPost(postData) {
    try {
      const response = await apiService.post('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  }

  // Update an existing post
  async updatePost(postId, postData) {
    try {
      const response = await apiService.put(`/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      console.error('Update post error:', error);
      throw error;
    }
  }

  // Delete a post
  async deletePost(postId) {
    try {
      const response = await apiService.delete(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }

  // Get a single post by ID
  async getPost(postId) {
    try {
      const response = await apiService.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Get post error:', error);
      throw error;
    }
  }

  // Upload media for posts
  async uploadMedia(mediaFiles) {
    try {
      const formData = new FormData();
      
      mediaFiles.forEach((file, index) => {
        formData.append('media', {
          uri: file.uri,
          type: file.type,
          name: file.name || `media_${index}`,
        });
      });

      const response = await apiService.upload('/posts/upload', formData);
      return response.data;
    } catch (error) {
      console.error('Upload media error:', error);
      throw error;
    }
  }

  // Delete media from a post
  async deleteMedia(postId, mediaId) {
    try {
      const response = await apiService.delete(`/posts/media/${mediaId}`);
      return response.data;
    } catch (error) {
      console.error('Delete media error:', error);
      throw error;
    }
  }
}

export const feedService = new FeedService();
export default feedService;