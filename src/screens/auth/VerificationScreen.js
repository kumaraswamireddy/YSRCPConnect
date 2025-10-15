import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, DIMENSIONS, SCREEN_NAMES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../contexts/LoadingContext';
import { clearError } from '../../store/authSlice';

const VerificationScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isLoading, error, user } = useSelector((state) => state.auth);
  const { requestUserVerification, logout } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [documents, setDocuments] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notesRef = useRef(null);

  const handlePickDocument = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library to upload verification documents.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        
        // Check if document already exists
        const isDuplicate = documents.some(doc => doc.uri === selectedAsset.uri);
        
        if (!isDuplicate) {
          setDocuments([...documents, selectedAsset]);
        } else {
          Alert.alert('Duplicate Document', 'This document has already been added.');
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert(
        'Error',
        'An error occurred while selecting the document. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleRemoveDocument = (index) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newDocuments = [...documents];
            newDocuments.splice(index, 1);
            setDocuments(newDocuments);
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (documents.length === 0) {
      Alert.alert(
        'Documents Required',
        'Please upload at least one verification document.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSubmitting(true);
      showLoading('Submitting verification request...');
      
      // Convert documents to URIs for API
      const documentUris = documents.map(doc => doc.uri);
      
      await requestUserVerification(documentUris, notes);
      
      Alert.alert(
        'Verification Request Submitted',
        'Your verification request has been submitted successfully. You will be notified once it has been reviewed.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to main app
              navigation.dispatch(
                StackActions.replace(SCREEN_NAMES.FEED)
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error('Verification request error:', error);
      Alert.alert(
        'Verification Request Failed',
        error.message || 'An error occurred while submitting your verification request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
      hideLoading();
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Verification',
      'You can skip verification for now and request it later from your profile settings. However, you will have limited access to certain features until verified.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'default',
          onPress: () => {
            // Navigate to main app
            navigation.dispatch(
              StackActions.replace(SCREEN_NAMES.FEED)
            );
          },
        },
      ]
    );
  };

  const handleBack = async () => {
    try {
      showLoading('Signing out...');
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      hideLoading();
    }
  };

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Verification Required</Text>
            <Text style={styles.subtitle}>
              Committee members need to verify their identity to access all features
            </Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon name="info" size={24} color={COLORS.INFO} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Why Verification?</Text>
                <Text style={styles.infoText}>
                  Verification ensures the authenticity of committee members and prevents unauthorized access to sensitive features.
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Icon name="verified-user" size={24} color={COLORS.PRIMARY} />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Benefits</Text>
                <Text style={styles.infoText}>
                  Verified members can create official posts, access exclusive content, and have a verified badge on their profile.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Upload Documents</Text>
            <Text style={styles.sectionSubtitle}>
              Please upload clear photos of your party ID, appointment letter, or other official documents
            </Text>
            
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePickDocument}
              activeOpacity={0.8}
            >
              <Icon name="cloud-upload" size={32} color={COLORS.PRIMARY} />
              <Text style={styles.uploadButtonText}>Add Document</Text>
              <Text style={styles.uploadSubtext}>
                JPG, PNG or PDF (Max 10MB)
              </Text>
            </TouchableOpacity>

            {documents.length > 0 && (
              <View style={styles.documentsContainer}>
                <Text style={styles.documentsTitle}>
                  Uploaded Documents ({documents.length})
                </Text>
                {documents.map((doc, index) => (
                  <View key={index} style={styles.documentItem}>
                    <Image
                      source={{ uri: doc.uri }}
                      style={styles.documentImage}
                    />
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>
                        Document {index + 1}
                      </Text>
                      <Text style={styles.documentSize}>
                        {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveDocument(index)}
                    >
                      <Icon name="delete" size={24} color={COLORS.ERROR} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
            <Text style={styles.sectionSubtitle}>
              Provide any additional information that might help with verification
            </Text>
            
            <TextInput
              ref={notesRef}
              style={styles.notesInput}
              placeholder="Enter any additional notes here..."
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="done"
              onSubmitEditing={() => notesRef.current?.blur()}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                (documents.length === 0 || isSubmitting) && styles.disabledButton
              ]}
              onPress={handleSubmit}
              disabled={documents.length === 0 || isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.BACKGROUND} />
              ) : (
                <Text style={styles.submitButtonText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
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
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingHorizontal: DIMENSIONS.PADDING.LG,
    paddingTop: DIMENSIONS.PADDING.LG,
    paddingBottom: DIMENSIONS.PADDING.MD,
  },
  backButton: {
    padding: DIMENSIONS.PADDING.SM,
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: DIMENSIONS.FONT_SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.SM,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.PADDING.LG,
    paddingBottom: DIMENSIONS.PADDING.XL,
  },
  infoContainer: {
    marginBottom: DIMENSIONS.PADDING.XL,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: DIMENSIONS.PADDING.LG,
    alignItems: 'flex-start',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: DIMENSIONS.PADDING.MD,
  },
  infoTitle: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.XS,
  },
  infoText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  sectionContainer: {
    marginBottom: DIMENSIONS.PADDING.XL,
  },
  sectionTitle: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  sectionSubtitle: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: DIMENSIONS.PADDING.MD,
    lineHeight: 20,
  },
  uploadButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    borderStyle: 'dashed',
    borderRadius: DIMENSIONS.BORDER_RADIUS.LG,
    paddingVertical: DIMENSIONS.PADDING.XL,
    alignItems: 'center',
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  uploadButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginTop: DIMENSIONS.PADDING.SM,
  },
  uploadSubtext: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginTop: DIMENSIONS.PADDING.XS,
  },
  documentsContainer: {
    marginTop: DIMENSIONS.PADDING.MD,
  },
  documentsTitle: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    padding: DIMENSIONS.PADDING.MD,
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  documentImage: {
    width: 60,
    height: 60,
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
    marginRight: DIMENSIONS.PADDING.MD,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  documentSize: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  removeButton: {
    padding: DIMENSIONS.PADDING.SM,
  },
  notesInput: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    paddingHorizontal: DIMENSIONS.PADDING.MD,
    paddingVertical: DIMENSIONS.PADDING.MD,
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    minHeight: 100,
  },
  buttonContainer: {
    marginTop: DIMENSIONS.PADDING.XL,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderRadius: DIMENSIONS.BORDER_RADIUS.LG,
    paddingVertical: DIMENSIONS.PADDING.MD,
    alignItems: 'center',
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  skipButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
  },
  submitButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: DIMENSIONS.BORDER_RADIUS.LG,
    paddingVertical: DIMENSIONS.PADDING.MD,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: COLORS.BORDER,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.LG,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
  },
});

export default VerificationScreen;