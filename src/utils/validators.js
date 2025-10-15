import { VALIDATION_RULES } from './constants';

// Validation result object
const createValidationResult = (isValid, errors = {}) => ({
  isValid,
  errors,
});

// Validate user profile data
export const validateProfile = (profileData) => {
  const errors = {};

  // Name validation
  if (profileData.name) {
    const nameError = validateName(profileData.name);
    if (nameError) errors.name = nameError;
  }

  // Email validation
  if (profileData.email) {
    const emailError = validateEmail(profileData.email);
    if (emailError) errors.email = emailError;
  }

  // Bio validation
  if (profileData.bio) {
    const bioError = validateBio(profileData.bio);
    if (bioError) errors.bio = bioError;
  }

  // Position validation
  if (profileData.position) {
    const positionError = validatePosition(profileData.position);
    if (positionError) errors.position = positionError;
  }

  // Committee name validation
  if (profileData.committee_name) {
    const committeeError = validateCommitteeName(profileData.committee_name);
    if (committeeError) errors.committee_name = committeeError;
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate post data
export const validatePost = (postData) => {
  const errors = {};

  // Content validation
  if (!postData.content || postData.content.trim().length === 0) {
    errors.content = 'Post content cannot be empty';
  } else if (postData.content.length < VALIDATION_RULES.POST_CONTENT.MIN_LENGTH) {
    errors.content = 'Post content is too short';
  } else if (postData.content.length > VALIDATION_RULES.POST_CONTENT.MAX_LENGTH) {
    errors.content = 'Post content is too long';
  }

  // Full content validation (optional)
  if (postData.full_content && postData.full_content.length > VALIDATION_RULES.POST_FULL_CONTENT.MAX_LENGTH) {
    errors.full_content = 'Full content is too long';
  }

  // Content type validation
  if (!postData.content_type || !['text', 'image', 'video'].includes(postData.content_type)) {
    errors.content_type = 'Invalid content type';
  }

  // Media validation for non-text posts
  if (postData.content_type !== 'text') {
    if (!postData.media_urls || postData.media_urls.length === 0) {
      errors.media = 'Media is required for non-text posts';
    }
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate verification request
export const validateVerificationRequest = (requestData) => {
  const errors = {};

  // Documents validation
  if (!requestData.documents || requestData.documents.length === 0) {
    errors.documents = 'At least one document is required';
  } else {
    // Check if all documents are valid URLs
    const invalidDocuments = requestData.documents.filter(doc => !isValidUrl(doc));
    if (invalidDocuments.length > 0) {
      errors.documents = 'Invalid document URLs';
    }
  }

  // Notes validation (optional)
  if (requestData.notes && requestData.notes.length > 500) {
    errors.notes = 'Notes are too long (max 500 characters)';
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate role selection
export const validateRoleSelection = (role) => {
  const errors = {};

  if (!role) {
    errors.role = 'Role is required';
  } else if (!['worker', 'committee'].includes(role)) {
    errors.role = 'Invalid role';
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate notification preferences
export const validateNotificationPreferences = (preferences) => {
  const errors = {};

  // Check if all preferences are boolean
  Object.keys(preferences).forEach(key => {
    if (typeof preferences[key] !== 'boolean') {
      errors[key] = `${key} must be a boolean value`;
    }
  });

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate feed preferences
export const validateFeedPreferences = (preferences) => {
  const errors = {};

  // Check if all preferences are boolean
  Object.keys(preferences).forEach(key => {
    if (typeof preferences[key] !== 'boolean') {
      errors[key] = `${key} must be a boolean value`;
    }
  });

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate official profile data
export const validateOfficialProfile = (officialData) => {
  const errors = {};

  // Official title validation
  if (!officialData.official_title || officialData.official_title.trim().length === 0) {
    errors.official_title = 'Official title is required';
  } else if (officialData.official_title.length > VALIDATION_RULES.POSITION.MAX_LENGTH) {
    errors.official_title = 'Official title is too long';
  }

  // Constituency validation (optional)
  if (officialData.constituency && officialData.constituency.length > VALIDATION_RULES.POSITION.MAX_LENGTH) {
    errors.constituency = 'Constituency name is too long';
  }

  // Bio validation (optional)
  if (officialData.bio && officialData.bio.length > VALIDATION_RULES.BIO.MAX_LENGTH) {
    errors.bio = 'Bio is too long';
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate search query
export const validateSearchQuery = (query) => {
  const errors = {};

  if (!query || query.trim().length === 0) {
    errors.query = 'Search query cannot be empty';
  } else if (query.trim().length < 2) {
    errors.query = 'Search query is too short';
  } else if (query.trim().length > 100) {
    errors.query = 'Search query is too long';
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate report data
export const validateReportData = (reportData) => {
  const errors = {};

  // Reason validation
  if (!reportData.reason) {
    errors.reason = 'Report reason is required';
  } else if (!['spam', 'inappropriate', 'misinformation', 'other'].includes(reportData.reason)) {
    errors.reason = 'Invalid report reason';
  }

  // Description validation (optional)
  if (reportData.description && reportData.description.length > 500) {
    errors.description = 'Description is too long (max 500 characters)';
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Basic validation functions
export const validateName = (name) => {
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

export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return 'Email cannot be empty';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }
  
  return null;
};

export const validateBio = (bio) => {
  if (bio && bio.length > VALIDATION_RULES.BIO.MAX_LENGTH) {
    return 'Bio is too long';
  }
  
  return null;
};

export const validatePosition = (position) => {
  if (!position || position.trim().length === 0) {
    return 'Position cannot be empty';
  }
  
  if (position.length > VALIDATION_RULES.POSITION.MAX_LENGTH) {
    return 'Position is too long';
  }
  
  return null;
};

export const validateCommitteeName = (committeeName) => {
  if (!committeeName || committeeName.trim().length === 0) {
    return 'Committee name cannot be empty';
  }
  
  if (committeeName.length > VALIDATION_RULES.COMMITTEE_NAME.MAX_LENGTH) {
    return 'Committee name is too long';
  }
  
  return null;
};

export const validateUrl = (url) => {
  if (!url || url.trim().length === 0) {
    return 'URL cannot be empty';
  }
  
  try {
    new URL(url);
    return null;
  } catch (e) {
    return 'Invalid URL format';
  }
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Validate file
export const validateFile = (file) => {
  const errors = {};

  if (!file) {
    errors.file = 'File is required';
    return createValidationResult(false, errors);
  }

  // File name validation
  if (!file.name || file.name.trim().length === 0) {
    errors.name = 'File name is required';
  }

  // File type validation
  if (!file.type) {
    errors.type = 'File type is required';
  }

  // File size validation
  if (!file.size) {
    errors.size = 'File size is required';
  } else if (file.size <= 0) {
    errors.size = 'File size must be greater than 0';
  }

  // URI validation (for React Native)
  if (!file.uri) {
    errors.uri = 'File URI is required';
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate image file
export const validateImageFile = (file) => {
  const fileValidation = validateFile(file);
  
  if (!fileValidation.isValid) {
    return fileValidation;
  }

  const errors = {};

  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    errors.type = 'File must be an image';
  }

  // Check supported image types
  const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    errors.type = 'Unsupported image format';
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};

// Validate video file
export const validateVideoFile = (file) => {
  const fileValidation = validateFile(file);
  
  if (!fileValidation.isValid) {
    return fileValidation;
  }

  const errors = {};

  // Check if it's a video
  if (!file.type.startsWith('video/')) {
    errors.type = 'File must be a video';
  }

  // Check supported video types
  const supportedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
  if (!supportedTypes.includes(file.type)) {
    errors.type = 'Unsupported video format';
  }

  return createValidationResult(Object.keys(errors).length === 0, errors);
};