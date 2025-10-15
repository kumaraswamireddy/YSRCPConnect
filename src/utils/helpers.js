import { Dimensions, Platform, PixelRatio } from 'react-native';
import { VALIDATION_RULES, UPLOAD_LIMITS } from './constants';

// Screen dimensions
const { width, height } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

// Responsive sizing
export const scale = size => (width / guidelineBaseWidth) * size;
export const verticalScale = size => (height / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Responsive fontSize
export const responsiveFontSize = (size, factor = 0.5) => {
  const newSize = size + (scale(size) - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Platform specific styling
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Format date and time
export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'now';
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h`;
  } else if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}d`;
  } else {
    return date.toLocaleDateString();
  }
};

export const formatFullDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Format numbers (followers, likes, etc.)
export const formatNumber = (num) => {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return `${(num / 1000000).toFixed(1)}M`;
  }
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Validate post content
export const validatePostContent = (content) => {
  if (!content || content.trim().length === 0) {
    return 'Post content cannot be empty';
  }
  
  if (content.length < VALIDATION_RULES.POST_CONTENT.MIN_LENGTH) {
    return 'Post content is too short';
  }
  
  if (content.length > VALIDATION_RULES.POST_CONTENT.MAX_LENGTH) {
    return 'Post content is too long';
  }
  
  return null;
};

// Validate user name
export const validateUserName = (name) => {
  if (!name || name.trim().length === 0) {
    return 'Name cannot be empty';
  }
  
  if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return 'Name is too short';
  }
  
  if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return 'Name is too long';
  }
  
  return null;
};

// Validate bio
export const validateBio = (bio) => {
  if (bio && bio.length > VALIDATION_RULES.BIO.MAX_LENGTH) {
    return 'Bio is too long';
  }
  
  return null;
};

// Validate file size
export const validateFileSize = (fileSize, type) => {
  const maxSize = type === 'video' 
    ? UPLOAD_LIMITS.MAX_VIDEO_SIZE 
    : UPLOAD_LIMITS.MAX_IMAGE_SIZE;
    
  if (fileSize > maxSize) {
    return `File size exceeds the maximum allowed size of ${maxSize / (1024 * 1024)}MB`;
  }
  
  return null;
};

// Validate file type
export const validateFileType = (mimeType, type) => {
  const allowedTypes = type === 'video'
    ? UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES
    : UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES;
    
  if (!allowedTypes.includes(mimeType)) {
    return `File type ${mimeType} is not allowed`;
  }
  
  return null;
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  
  return clonedObj;
};

// Debounce function
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  return Object.keys(obj).length === 0;
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Get file name from URI
export const getFileName = (uri) => {
  return uri.split('/').pop().split('?')[0];
};

// Get file type from MIME type
export const getFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  }
  return 'unknown';
};

// Create FormData for file upload
export const createFormData = (data, files) => {
  const formData = new FormData();
  
  // Add data fields
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });
  
  // Add files
  if (files && files.length > 0) {
    files.forEach((file, index) => {
      formData.append('media', {
        uri: file.uri,
        type: file.type,
        name: file.name || `file_${index}`,
      });
    });
  }
  
  return formData;
};

// Get initials from name
export const getInitials = (name, maxLength = 2) => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  let initials = '';
  
  for (let i = 0; i < Math.min(parts.length, maxLength); i++) {
    if (parts[i].length > 0) {
      initials += parts[i][0].toUpperCase();
    }
  }
  
  return initials;
};

// Get color based on string (for avatar backgrounds)
export const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};

// Check if post contains media
export const hasMedia = (post) => {
  return post.media_urls && post.media_urls.length > 0;
};

// Check if post is video
export const isVideoPost = (post) => {
  return post.content_type === 'video' || hasMedia(post) && 
    post.media_urls.some(url => url.includes('.mp4') || url.includes('.mov'));
};

// Check if post is image
export const isImagePost = (post) => {
  return post.content_type === 'image' || hasMedia(post) && 
    post.media_urls.some(url => 
      url.includes('.jpg') || 
      url.includes('.jpeg') || 
      url.includes('.png') || 
      url.includes('.gif')
    );
};

// Sort array by key
export const sortByKey = (array, key, descending = false) => {
  return array.sort((a, b) => {
    if (a[key] < b[key]) {
      return descending ? 1 : -1;
    }
    if (a[key] > b[key]) {
      return descending ? -1 : 1;
    }
    return 0;
  });
};

// Get unique values from array
export const getUniqueValues = (array, key) => {
  return [...new Set(array.map(item => item[key]))];
};

// Group array by key
export const groupByKey = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Generate random color
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Check if device is tablet
export const isTablet = () => {
  const aspectRatio = height / width;
  return aspectRatio < 1.6;
};

// Get status bar height
export const getStatusBarHeight = () => {
  return isIOS ? (isTablet() ? 24 : 44) : 0;
};

// Get safe area insets
export const getSafeAreaInsets = () => {
  if (isIOS) {
    return {
      top: isTablet() ? 24 : 44,
      bottom: isTablet() ? 20 : 34,
      left: 0,
      right: 0,
    };
  }
  
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
};