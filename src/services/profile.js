import { apiService } from './api';

class ProfileService {
  async getUserProfile(userId) {
    try {
      const response = await apiService.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async updateProfileImage(imageUri) {
    try {
      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await apiService.upload('/users/profile/image', formData);
      return response.data;
    } catch (error) {
      console.error('Update profile image error:', error);
      throw error;
    }
  }

  async searchUsers(query, role, verified, limit = 20, offset = 0) {
    try {
      const params = {
        query,
        limit,
        offset,
      };

      if (role) params.role = role;
      if (verified !== undefined) params.verified = verified;

      const response = await apiService.get('/users/search', params);
      return response.data;
    } catch (error) {
      console.error('Search users error:', error);
      throw error;
    }
  }

  async getUserSuggestions() {
    try {
      const response = await apiService.get('/users/suggestions');
      return response.data;
    } catch (error) {
      console.error('Get user suggestions error:', error);
      throw error;
    }
  }

  async followUser(userId) {
    try {
      const response = await apiService.post(`/users/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Follow user error:', error);
      throw error;
    }
  }

  async unfollowUser(userId) {
    try {
      const response = await apiService.delete(`/users/follow/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Unfollow user error:', error);
      throw error;
    }
  }

  async getFollowers(userId, page = 1, limit = 20) {
    try {
      const response = await apiService.get('/users/followers', {
        user_id: userId,
        page,
        limit,
      });
      return response.data;
    } catch (error) {
      console.error('Get followers error:', error);
      throw error;
    }
  }

  async getFollowing(userId, page = 1, limit = 20) {
    try {
      const response = await apiService.get('/users/following', {
        user_id: userId,
        page,
        limit,
      });
      return response.data;
    } catch (error) {
      console.error('Get following error:', error);
      throw error;
    }
  }

  async enableOfficialTab() {
    try {
      const response = await apiService.post('/users/enable-official-tab');
      return response.data;
    } catch (error) {
      console.error('Enable official tab error:', error);
      throw error;
    }
  }

  async updateOfficialProfile(officialData) {
    try {
      const response = await apiService.put('/users/official-profile', officialData);
      return response.data;
    } catch (error) {
      console.error('Update official profile error:', error);
      throw error;
    }
  }

  async getUserPosts(userId, page = 1, limit = 20) {
    try {
      const response = await apiService.get(`/posts/user/${userId}`, {
        page,
        limit,
      });
      return response.data;
    } catch (error) {
      console.error('Get user posts error:', error);
      throw error;
    }
  }

  async getPostAnalytics(postId) {
    try {
      const response = await apiService.get(`/posts/${postId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Get post analytics error:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await apiService.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async getNotificationPreferences() {
    try {
      const response = await apiService.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.error('Get notification preferences error:', error);
      throw error;
    }
  }

  async updateNotificationPreferences(preferences) {
    try {
      const response = await apiService.put('/notifications/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Update notification preferences error:', error);
      throw error;
    }
  }

  async registerDevice(deviceToken) {
    try {
      const response = await apiService.post('/notifications/register-device', {
        device_token: deviceToken,
        platform: Platform.OS,
      });
      return response.data;
    } catch (error) {
      console.error('Register device error:', error);
      throw error;
    }
  }

  async unregisterDevice(deviceToken) {
    try {
      const response = await apiService.delete('/notifications/unregister-device', {
        device_token: deviceToken,
      });
      return response.data;
    } catch (error) {
      console.error('Unregister device error:', error);
      throw error;
    }
  }

  async getVerificationStatus() {
    try {
      const response = await apiService.get('/auth/verification-status');
      return response.data;
    } catch (error) {
      console.error('Get verification status error:', error);
      throw error;
    }
  }

  async requestVerification(documents, notes) {
    try {
      const response = await apiService.post('/auth/request-verification', {
        documents,
        notes,
      });
      return response.data;
    } catch (error) {
      console.error('Request verification error:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
export default profileService;