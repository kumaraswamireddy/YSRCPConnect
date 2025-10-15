import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { COLORS, DIMENSIONS, UPLOAD_LIMITS } from '../../utils/constants';
import { getFileExtension, getFileType, getFileName } from '../../utils/helpers';

const MediaUpload = ({
  mediaFiles,
  onPickMedia,
  onCaptureMedia,
  onRemoveMedia,
  maxFiles = 10,
}) => {
  // Render media item
  const renderMediaItem = ({ item, index }) => {
    const fileType = getFileType(item.type);
    const fileName = getFileName(item.uri);
    
    return (
      <View style={styles.mediaItem}>
        {fileType === 'image' ? (
          <FastImage
            source={{ uri: item.uri }}
            style={styles.mediaThumbnail}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.videoThumbnail}>
            <Video
              source={{ uri: item.uri }}
              style={styles.videoPlayer}
              resizeMode="cover"
              paused={true}
              muted={true}
              repeat={false}
              controls={false}
            />
            <View style={styles.videoOverlay}>
              <Icon name="play-circle-filled" size={32} color={COLORS.BACKGROUND} />
            </View>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemoveMedia(index)}
        >
          <Icon name="close" size={16} color={COLORS.BACKGROUND} />
        </TouchableOpacity>
        
        <View style={styles.mediaInfo}>
          <Text style={styles.mediaFileName} numberOfLines={1}>
            {fileName}
          </Text>
          <Text style={styles.mediaFileSize}>
            {(item.fileSize / (1024 * 1024)).toFixed(2)} MB
          </Text>
        </View>
      </View>
    );
  };

  // Render upload buttons
  const renderUploadButtons = () => {
    if (mediaFiles.length >= maxFiles) {
      return (
        <View style={styles.maxFilesContainer}>
          <Icon name="info" size={20} color={COLORS.INFO} />
          <Text style={styles.maxFilesText}>
            Maximum {maxFiles} files reached
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.uploadButtonsContainer}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={onPickMedia}
        >
          <Icon name="photo-library" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.uploadButtonText}>Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={onCaptureMedia}
        >
          <Icon name="camera-alt" size={24} color={COLORS.PRIMARY} />
          <Text style={styles.uploadButtonText}>Camera</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render media list
  const renderMediaList = () => {
    if (mediaFiles.length === 0) {
      return null;
    }

    return (
      <View style={styles.mediaListContainer}>
        <Text style={styles.mediaListTitle}>
          Media ({mediaFiles.length}/{maxFiles})
        </Text>
        
        <FlatList
          data={mediaFiles}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => `${item.uri}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaListContent}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderMediaList()}
      {renderUploadButtons()}
      
      <View style={styles.uploadInfoContainer}>
        <Text style={styles.uploadInfoText}>
          Supported formats: JPG, PNG, GIF, MP4, MOV
        </Text>
        <Text style={styles.uploadInfoText}>
          Max file size: Images {UPLOAD_LIMITS.MAX_IMAGE_SIZE / (1024 * 1024)}MB, 
          Videos {UPLOAD_LIMITS.MAX_VIDEO_SIZE / (1024 * 1024)}MB
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: DIMENSIONS.PADDING.MD,
  },
  mediaListContainer: {
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  mediaListTitle: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  mediaListContent: {
    paddingRight: DIMENSIONS.PADDING.MD,
  },
  mediaItem: {
    width: 120,
    marginRight: DIMENSIONS.PADDING.SM,
    position: 'relative',
  },
  mediaThumbnail: {
    width: 120,
    height: 120,
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
  },
  videoThumbnail: {
    width: 120,
    height: 120,
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    overflow: 'hidden',
  },
  videoPlayer: {
    width: 120,
    height: 120,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaInfo: {
    marginTop: DIMENSIONS.PADDING.XS,
  },
  mediaFileName: {
    fontSize: DIMENSIONS.FONT_SIZES.XS,
    color: COLORS.TEXT_PRIMARY,
  },
  mediaFileSize: {
    fontSize: DIMENSIONS.FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  uploadButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: DIMENSIONS.PADDING.MD,
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    width: 100,
  },
  uploadButtonText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    marginTop: DIMENSIONS.PADDING.XS,
  },
  maxFilesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: DIMENSIONS.PADDING.MD,
    backgroundColor: '#FFF8E1',
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  maxFilesText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.WARNING,
    marginLeft: DIMENSIONS.PADDING.SM,
  },
  uploadInfoContainer: {
    marginTop: DIMENSIONS.PADDING.SM,
  },
  uploadInfoText: {
    fontSize: DIMENSIONS.FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: 2,
  },
});

export default MediaUpload;