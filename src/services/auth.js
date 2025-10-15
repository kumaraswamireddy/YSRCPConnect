import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from './api';

WebBrowser.maybeCompleteAuthSession();

// Configuration
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

class AuthService {
  async initiateGoogleAuth() {
    try {
      // Generate CSRF state
      const state = await Crypto.getRandomBytesAsync(10);
      
      // Configure auth request
      const authRequest = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri({
          scheme: 'ysrcp-connect',
        }),
        responseType: 'code',
        state: state,
        extraParams: {
          prompt: 'consent',
        },
      });

      // Start auth flow
      const result = await authRequest.promptAsync(discovery);
      
      if (result.type === 'success') {
        // Exchange code for tokens
        const tokens = await this.exchangeCodeForTokens(result.params.code);
        return tokens;
      }
      
      return null;
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  }

  async exchangeCodeForTokens(code) {
    try {
      const response = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          code,
          redirect_uri: AuthSession.makeRedirectUri({
            scheme: 'ysrcp-connect',
          }),
          grant_type: 'authorization_code',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_description || 'Failed to exchange code for tokens');
      }

      return data;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  }

  async googleLogin(googleToken) {
    try {
      const response = await apiService.post('/auth/google/callback', {
        access_token: googleToken.access_token,
      });

      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async selectRole(role) {
    try {
      const response = await apiService.post('/auth/select-role', { role });
      return response.data;
    } catch (error) {
      console.error('Role selection error:', error);
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
      console.error('Verification request error:', error);
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

  async refreshToken() {
    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { token, refresh_token } = response.data;
      
      // Update stored tokens
      await AsyncStorage.setItem('userToken', token);
      if (refresh_token) {
        await AsyncStorage.setItem('refreshToken', refresh_token);
      }

      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server logout fails
    } finally {
      // Clear local storage
      await AsyncStorage.multiRemove([
        'userToken',
        'refreshToken',
        'userData',
      ]);
    }
  }

  async logoutAllDevices() {
    try {
      await apiService.post('/auth/logout/all');
    } finally {
      // Clear local storage
      await AsyncStorage.multiRemove([
        'userToken',
        'refreshToken',
        'userData',
      ]);
    }
  }

  // Store auth data securely
  async storeAuthData(token, refreshToken, user) {
    try {
      await AsyncStorage.multiSet([
        ['userToken', token],
        ['userData', JSON.stringify(user)],
      ]);
      
      if (refreshToken) {
        await AsyncStorage.setItem('refreshToken', refreshToken);
      }
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  }

  // Retrieve auth data
  async getAuthData() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userDataString = await AsyncStorage.getItem('userData');
      
      if (!token || !userDataString) {
        return null;
      }

      const user = JSON.parse(userDataString);
      
      return {
        token,
        refreshToken,
        user,
      };
    } catch (error) {
      console.error('Error retrieving auth data:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
export default authService;