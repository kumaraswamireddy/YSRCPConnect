// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_INITIATE: '/auth/google/initiate',
    GOOGLE_CALLBACK: '/auth/google/callback',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout/all',
    SELECT_ROLE: '/auth/select-role',
    REQUEST_VERIFICATION: '/auth/request-verification',
    VERIFICATION_STATUS: '/auth/verification-status',
  },
  USERS: {
    PROFILE: '/users/profile',
    SEARCH: '/users/search',
    SUGGESTIONS: '/users/suggestions',
    FOLLOW: '/users/follow',
    FOLLOWERS: '/users/followers',
    FOLLOWING: '/users/following',
    ENABLE_OFFICIAL_TAB: '/users/enable-official-tab',
    OFFICIAL_PROFILE: '/users/official-profile',
  },
  POSTS: {
    CREATE: '/posts',
    GET: '/posts/:id',
    UPDATE: '/posts/:id',
    DELETE: '/posts/:id',
    LIKE: '/posts/:id/like',
    SHARE: '/posts/:id/share',
    BOOKMARK: '/posts/:id/bookmark',
    REPORT: '/posts/:id/report',
    ANALYTICS: '/posts/:id/analytics',
    UPLOAD: '/posts/upload',
    DELETE_MEDIA: '/posts/media/:mediaId',
    USER_POSTS: '/posts/user/:userId',
  },
  FEED: {
    GET: '/feed',
    REFRESH: '/feed/refresh',
    BROADCASTS: '/feed/broadcasts',
    PREFERENCES: '/feed/preferences',
    MARK_READ: '/feed/mark-read',
    HIDE_POST: '/feed/hide/:postId',
    ANALYTICS: '/feed/analytics',
  },
  NOTIFICATIONS: {
    GET: '/notifications',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: '/notifications/:id',
    PREFERENCES: '/notifications/preferences',
    REGISTER_DEVICE: '/notifications/register-device',
    UNREGISTER_DEVICE: '/notifications/unregister-device',
  },
};

// User Roles
export const USER_ROLES = {
  WORKER: 'worker',
  COMMITTEE: 'committee',
  ADMIN: 'admin',
};

// Verification Status
export const VERIFICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Post Content Types
export const POST_CONTENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  MENTION: 'mention',
  POST_APPROVED: 'post_approved',
  POST_REJECTED: 'post_rejected',
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  OFFICIAL_POST: 'official_post',
  BROADCAST: 'broadcast',
};

// App Colors
export const COLORS = {
  PRIMARY: '#1DA1F2',
  SECONDARY: '#14171A',
  BACKGROUND: '#FFFFFF',
  BACKGROUND_DARK: '#000000',
  TEXT_PRIMARY: '#14171A',
  TEXT_SECONDARY: '#657786',
  TEXT_DARK: '#FFFFFF',
  TEXT_SECONDARY_DARK: '#8899A6',
  BORDER: '#E1E8ED',
  BORDER_DARK: '#38444D',
  ERROR: '#E1306C',
  SUCCESS: '#17BF63',
  WARNING: '#FFAD1F',
  INFO: '#1DA1F2',
  
  // Role-specific colors
  ADMIN_BADGE: '#E1306C',
  COMMITTEE_BADGE: '#1DA1F2',
  WORKER_BADGE: '#17BF63',
  
  // Social media colors
  LIKE: '#E1306C',
  RETWEET: '#17BF63',
  SHARE: '#1DA1F2',
};

// Dimensions
export const DIMENSIONS = {
  PADDING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    ROUND: 9999,
  },
  FONT_SIZES: {
    XS: 12,
    SM: 14,
    MD: 16,
    LG: 18,
    XL: 20,
    XXL: 24,
    XXXL: 32,
  },
  ICON_SIZES: {
    XS: 12,
    SM: 16,
    MD: 20,
    LG: 24,
    XL: 28,
    XXL: 32,
    XXXL: 48,
  },
  AVATAR_SIZES: {
    XS: 24,
    SM: 32,
    MD: 40,
    LG: 48,
    XL: 64,
    XXL: 80,
    XXXL: 120,
  },
};

// Screen Names
export const SCREEN_NAMES = {
  // Auth
  LOGIN: 'Login',
  ROLE_SELECTION: 'RoleSelection',
  VERIFICATION: 'Verification',
  
  // Main
  FEED: 'Feed',
  CREATE_POST: 'CreatePost',
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  
  // Profile
  EDIT_PROFILE: 'EditProfile',
  FOLLOWERS: 'Followers',
  FOLLOWING: 'Following',
  POST_DETAIL: 'PostDetail',
  
  // Settings
  SETTINGS: 'Settings',
  NOTIFICATION_SETTINGS: 'NotificationSettings',
  PRIVACY_SETTINGS: 'PrivacySettings',
  ACCOUNT_SETTINGS: 'AccountSettings',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  AUTH_ERROR: 'Authentication error. Please log in again.',
  PERMISSION_DENIED: 'Permission denied. You do not have access to this resource.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
  UPLOAD_FAILED: 'Upload failed. Please try again.',
  CAMERA_PERMISSION_DENIED: 'Camera permission denied. Please enable it in settings.',
  GALLERY_PERMISSION_DENIED: 'Gallery permission denied. Please enable it in settings.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  POST_CREATED: 'Post created successfully',
  POST_DELETED: 'Post deleted successfully',
  FOLLOW_SUCCESS: 'User followed successfully',
  UNFOLLOW_SUCCESS: 'User unfollowed successfully',
  VERIFICATION_REQUESTED: 'Verification request submitted successfully',
  SETTINGS_UPDATED: 'Settings updated successfully',
};

// Validation Rules
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  BIO: {
    MAX_LENGTH: 500,
  },
  POST_CONTENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 5000,
  },
  POST_FULL_CONTENT: {
    MAX_LENGTH: 10000,
  },
  COMMENT: {
    MAX_LENGTH: 1000,
  },
  POSITION: {
    MAX_LENGTH: 160,
  },
  COMMITTEE_NAME: {
    MAX_LENGTH: 200,
  },
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_FILES_COUNT: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
};

// Cache Times (in milliseconds)
export const CACHE_TIMES = {
  FEED: 5 * 60 * 1000, // 5 minutes
  PROFILE: 10 * 60 * 1000, // 10 minutes
  NOTIFICATIONS: 2 * 60 * 1000, // 2 minutes
  USER_SEARCH: 15 * 60 * 1000, // 15 minutes
  POST_DETAIL: 30 * 60 * 1000, // 30 minutes
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 800,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Debounce Times (in milliseconds)
export const DEBOUNCE_TIMES = {
  SEARCH: 300,
  TYPING: 500,
  SCROLL: 100,
};

// App Settings Defaults
export const DEFAULT_SETTINGS = {
  THEME: 'light',
  LANGUAGE: 'en',
  PUSH_NOTIFICATIONS: true,
  AUTO_PLAY_VIDEOS: true,
  DATA_SAVER_MODE: false,
  SHOW_SENSITIVE_CONTENT: false,
};