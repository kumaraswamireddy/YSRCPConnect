import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, DIMENSIONS, POST_CONTENT_TYPES, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../utils/constants';
import { useFeed } from '../../hooks/useFeed';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../contexts/LoadingContext';
import MediaUpload from '../../components/media/MediaUpload';
import VerificationBadge from '../../components/common/VerificationBadge';

const CreatePostScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector((state) => state.auth);
  const { addPost } = useFeed();
  const { canCreateOfficialPosts, canBroadcast } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  
  const contentRef = useRef(null);
  const fullContentRef = useRef(null);
  
  // Get post type from route params
  const isOfficial = route.params?.isOfficial || false;
  const isBroadcast = route.params?.isBroadcast || false;
  
  const [content, setContent] = useState('');
  const [fullContent, setFullContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [contentType, setContentType] = useState(POST_CONTENT_TYPES.TEXT);
  const [showFullContentInput, setShowFullContentInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Update content type based on media files
  useEffect(() => {
    if (mediaFiles.length > 0) {
      const firstFile = mediaFiles[0];
      if (firstFile.type.startsWith('image/')) {
        setContentType(POST_CONTENT_TYPES.IMAGE);
      } else if (firstFile.type.startsWith('video/')) {
        setContentType(POST_CONTENT_TYPES.VIDEO);
      }
    } else {
      setContentType(POST_CONTENT_TYPES.TEXT);
    }
  }, [mediaFiles]);

  // Handle keyboard height
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handle content change
  const handleContentChange = (text) => {
    setContent(text);
    
    // Auto-show full content input if content is long
    if (text.length > 300 && !showFullContentInput) {
      setShowFullContentInput(true);
    }
  };

  // Handle full content change
  const handleFullContentChange = (text) => {
    setFullContent(text);
  };

  // Handle media pick
  const handlePickMedia = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library to upload media.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Determine media type based on current content
      const mediaType = contentType === POST_CONTENT_TYPES.VIDEO
        ? ImagePicker.MediaTypeOptions.Videos
        : ImagePicker.MediaTypeOptions.Images;

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Limit to 10 files
        const newFiles = result.assets.slice(0, 10 - mediaFiles.length);
        setMediaFiles([...mediaFiles, ...newFiles]);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert(
        'Error',
        'An error occurred while selecting media. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Handle camera capture
  const handleCaptureMedia = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your camera to capture media.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: contentType === POST_CONTENT_TYPES.VIDEO
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Limit to 10 files
        if (mediaFiles.length < 10) {
          setMediaFiles([...mediaFiles, result.assets[0]]);
        } else {
          Alert.alert(
            'Maximum Files Reached',
            'You can only upload up to 10 files.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error capturing media:', error);
      Alert.alert(
        'Error',
        'An error occurred while capturing media. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Handle media removal
  const handleRemoveMedia = (index) => {
    const newFiles = [...mediaFiles];
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);
  };

  // Handle post submission
  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Content Required', 'Please enter some content for your post.');
      return;
    }

    try {
      setIsSubmitting(true);
      showLoading('Creating post...');

      // Prepare post data
      const postData = {
        content: content.trim(),
        content_type: contentType,
        is_official: isOfficial,
        is_broadcast: isBroadcast,
      };

      // Add full content if provided
      if (fullContent.trim()) {
        postData.full_content = fullContent.trim();
      }

      // Add media files if any
      if (mediaFiles.length > 0) {
        postData.media_urls = mediaFiles.map(file => file.uri);
      }

      // Create post
      await addPost(postData);

      // Show success message
      Alert.alert(
        'Success',
        isBroadcast 
          ? SUCCESS_MESSAGES.POST_CREATED + ' Your broadcast has been sent to all party members.'
          : isOfficial
            ? SUCCESS_MESSAGES.POST_CREATED + ' Your official post has been published.'
            : SUCCESS_MESSAGES.POST_CREATED,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to feed
              navigation.dispatch(StackActions.popToTop());
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Error',
        error.message || ERROR_MESSAGES.UPLOAD_FAILED,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (content.trim() || mediaFiles.length > 0) {
      Alert.alert(
        'Discard Post?',
        'Are you sure you want to discard this post? Any content will be lost.',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  // Get post type label
  const getPostTypeLabel = () => {
    if (isBroadcast) return 'Broadcast Post';
    if (isOfficial) return 'Official Post';
    return 'Create Post';
  };

  // Get post type color
  const getPostTypeColor = () => {
    if (isBroadcast) return COLORS.ERROR;
    if (isOfficial) return COLORS.PRIMARY;
    return COLORS.TEXT_PRIMARY;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: getPostTypeColor() }]}>
          {getPostTypeLabel()}
        </Text>
        
        <TouchableOpacity
          style={[
            styles.postButton,
            (!content.trim() || isSubmitting) && styles.disabledPostButton
          ]}
          onPress={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={COLORS.BACKGROUND} />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.userInfo}>
          <Image
            source={{ uri: user?.profile_pic_url }}
            style={styles.userAvatar}
          />
          <View style={styles.userDetails}>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{user?.name}</Text>
              <VerificationBadge
                user={user}
                size="small"
                style={styles.verificationBadge}
              />
            </View>
            {(user?.position || user?.committee_name) && (
              <Text style={styles.userPosition}>
                {user?.position && user?.committee_name
                  ? `${user.position}, ${user.committee_name}`
                  : user?.position || user?.committee_name}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            ref={contentRef}
            style={styles.contentInput}
            placeholder={
              isBroadcast
                ? "What's your broadcast message?"
                : isOfficial
                  ? "What's your official announcement?"
                  : "What's on your mind?"
            }
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={content}
            onChangeText={handleContentChange}
            maxLength={5000}
            returnKeyType="next"
            onSubmitEditing={() => fullContentRef.current?.focus()}
          />
          
          {showFullContentInput && (
            <View style={styles.fullContentContainer}>
              <Text style={styles.fullContentLabel}>
                Additional Content (Optional)
              </Text>
              <TextInput
                ref={fullContentRef}
                style={styles.fullContentInput}
                placeholder="Add more details here..."
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={fullContent}
                onChangeText={handleFullContentChange}
                maxLength={10000}
                returnKeyType="done"
              />
            </View>
          )}
        </View>

        <MediaUpload
          mediaFiles={mediaFiles}
          onPickMedia={handlePickMedia}
          onCaptureMedia={handleCaptureMedia}
          onRemoveMedia={handleRemoveMedia}
          maxFiles={10}
        />

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowFullContentInput(!showFullContentInput)}
          >
            <Icon
              name={showFullContentInput ? 'expand-less' : 'expand-more'}
              size={24}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.optionText}>
              {showFullContentInput ? 'Hide' : 'Add'} More Content
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.PADDING.LG,
    paddingVertical: DIMENSIONS.PADDING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  cancelButton: {
    paddingVertical: DIMENSIONS.PADDING.XS,
  },
  cancelButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.PRIMARY,
  },
  title: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
  },
  postButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: DIMENSIONS.PADDING.MD,
    paddingVertical: DIMENSIONS.PADDING.XS,
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
  },
  disabledPostButton: {
    backgroundColor: COLORS.BORDER,
  },
  postButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    padding: DIMENSIONS.PADDING.LG,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: DIMENSIONS.PADDING.MD,
  },
  userDetails: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  verificationBadge: {
    marginLeft: DIMENSIONS.PADDING.XS,
  },
  userPosition: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: DIMENSIONS.PADDING.LG,
  },
  contentInput: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  fullContentContainer: {
    marginTop: DIMENSIONS.PADDING.MD,
  },
  fullContentLabel: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  fullContentInput: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    paddingHorizontal: DIMENSIONS.PADDING.MD,
    paddingVertical: DIMENSIONS.PADDING.MD,
  },
  optionsContainer: {
    marginTop: DIMENSIONS.PADDING.MD,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DIMENSIONS.PADDING.SM,
  },
  optionText: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.PRIMARY,
    marginLeft: DIMENSIONS.PADDING.SM,
  },
});

export default CreatePostScreen;