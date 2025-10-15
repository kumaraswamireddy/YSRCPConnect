import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import { COLORS, DIMENSIONS, POST_CONTENT_TYPES } from '../../utils/constants';
import { formatTime, formatNumber, truncateText, isVideoPost, isImagePost } from '../../utils/helpers';
import VerificationBadge from '../common/VerificationBadge';
import UserAvatar from '../common/UserAvatar';

const PostCard = ({
  post,
  onLike,
  onShare,
  onReport,
  onPress,
  onUserPress,
  style,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Handle like button press
  const handleLikePress = () => {
    if (onLike) {
      onLike();
    }
  };

  // Handle share button press
  const handleSharePress = async () => {
    try {
      await Share.share({
        message: post.content,
        url: post.media_urls && post.media_urls.length > 0 ? post.media_urls[0] : undefined,
        title: 'YSRCPConnect Post',
      });
      
      if (onShare) {
        onShare();
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  // Handle report button press
  const handleReportPress = () => {
    Alert.alert(
      'Report Post',
      'Why are you reporting this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Spam',
          onPress: () => onReport && onReport('spam'),
        },
        {
          text: 'Inappropriate',
          onPress: () => onReport && onReport('inappropriate'),
        },
        {
          text: 'Misinformation',
          onPress: () => onReport && onReport('misinformation'),
        },
      ]
    );
  };

  // Handle post press
  const handlePostPress = () => {
    if (onPress) {
      onPress();
    }
  };

  // Handle user press
  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress();
    }
  };

  // Handle image load start
  const handleImageLoadStart = () => {
    setIsImageLoading(true);
  };

  // Handle image load end
  const handleImageLoadEnd = () => {
    setIsImageLoading(false);
  };

  // Handle video load start
  const handleVideoLoadStart = () => {
    setIsVideoLoading(true);
  };

  // Handle video load
  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  // Handle video press
  const handleVideoPress = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  // Render media content
  const renderMedia = () => {
    if (!post.media_urls || post.media_urls.length === 0) {
      return null;
    }

    // Single image or video
    if (post.media_urls.length === 1) {
      const mediaUrl = post.media_urls[0];
      
      if (isVideoPost(post)) {
        return (
          <View style={styles.mediaContainer}>
            <Video
              source={{ uri: mediaUrl }}
              style={styles.video}
              resizeMode="cover"
              onLoad={handleVideoLoad}
              onLoadStart={handleVideoLoadStart}
              paused={!isVideoPlaying}
              repeat={false}
              controls={true}
            />
            {isVideoLoading && (
              <View style={styles.mediaLoading}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
              </View>
            )}
          </View>
        );
      } else {
        return (
          <View style={styles.mediaContainer}>
            <FastImage
              source={{ uri: mediaUrl }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={handleImageLoadStart}
              onLoadEnd={handleImageLoadEnd}
            />
            {isImageLoading && (
              <View style={styles.mediaLoading}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
              </View>
            )}
          </View>
        );
      }
    }

    // Multiple images
    if (post.media_urls.length > 1) {
      return (
        <View style={styles.multiImageContainer}>
          {post.media_urls.slice(0, 4).map((mediaUrl, index) => (
            <View key={index} style={styles.multiImageItem}>
              <FastImage
                source={{ uri: mediaUrl }}
                style={styles.multiImage}
                resizeMode="cover"
              />
              {index === 3 && post.media_urls.length > 4 && (
                <View style={styles.moreImagesOverlay}>
                  <Text style={styles.moreImagesText}>
                    +{post.media_urls.length - 4}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  // Render post header
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleUserPress}>
        <UserAvatar
          source={{ uri: post.author.profile_pic_url }}
          size={40}
        />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <View style={styles.authorInfo}>
          <TouchableOpacity onPress={handleUserPress}>
            <Text style={styles.authorName}>{post.author.name}</Text>
          </TouchableOpacity>
          <VerificationBadge user={post.author} size="small" />
        </View>
        
        <View style={styles.postMeta}>
          {(post.author.position || post.author.committee_name) && (
            <Text style={styles.authorPosition}>
              {post.author.position && post.author.committee_name
                ? `${post.author.position}, ${post.author.committee_name}`
                : post.author.position || post.author.committee_name}
            </Text>
          )}
          <Text style={styles.postTime}>{formatTime(post.created_at)}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <Icon name="more-vert" size={20} color={COLORS.TEXT_SECONDARY} />
      </TouchableOpacity>
    </View>
  );

  // Render post content
  const renderContent = () => (
    <View style={styles.contentContainer}>
      <TouchableOpacity onPress={handlePostPress}>
        <Text style={styles.content}>
          {post.full_content
            ? truncateText(post.content, 300)
            : post.content}
        </Text>
        {post.full_content && post.content.length > 300 && (
          <Text style={styles.readMoreText}>Read more</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // Render post actions
  const renderActions = () => (
    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleLikePress}
      >
        <Icon
          name={post.is_liked ? 'favorite' : 'favorite-border'}
          size={20}
          color={post.is_liked ? COLORS.LIKE : COLORS.TEXT_SECONDARY}
        />
        {post.like_count > 0 && (
          <Text style={styles.actionText}>
            {formatNumber(post.like_count)}
          </Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handlePostPress}
      >
        <Icon name="comment" size={20} color={COLORS.TEXT_SECONDARY} />
        {post.comment_count > 0 && (
          <Text style={styles.actionText}>
            {formatNumber(post.comment_count)}
          </Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleSharePress}
      >
        <Icon name="share" size={20} color={COLORS.TEXT_SECONDARY} />
        {post.share_count > 0 && (
          <Text style={styles.actionText}>
            {formatNumber(post.share_count)}
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.spacer} />
      
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleReportPress}
      >
        <Icon name="flag" size={20} color={COLORS.TEXT_SECONDARY} />
      </TouchableOpacity>
    </View>
  );

  // Render official badge
  const renderOfficialBadge = () => {
    if (!post.is_official) {
      return null;
    }

    return (
      <View style={styles.officialBadge}>
        <Icon name="verified" size={16} color={COLORS.BACKGROUND} />
        <Text style={styles.officialBadgeText}>Official</Text>
      </View>
    );
  };

  // Render broadcast badge
  const renderBroadcastBadge = () => {
    if (!post.is_broadcast) {
      return null;
    }

    return (
      <View style={styles.broadcastBadge}>
        <Icon name="campaign" size={16} color={COLORS.BACKGROUND} />
        <Text style={styles.broadcastBadgeText}>Broadcast</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderHeader()}
      
      <View style={styles.postContent}>
        {renderOfficialBadge()}
        {renderBroadcastBadge()}
        {renderContent()}
        {renderMedia()}
      </View>
      
      {renderActions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    marginBottom: DIMENSIONS.PADDING.MD,
    borderRadius: DIMENSIONS.BORDER_RADIUS.LG,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    padding: DIMENSIONS.PADDING.MD,
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: DIMENSIONS.PADDING.MD,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  postMeta: {
    marginTop: 2,
  },
  authorPosition: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  postTime: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
  },
  moreButton: {
    padding: DIMENSIONS.PADDING.XS,
  },
  postContent: {
    paddingHorizontal: DIMENSIONS.PADDING.MD,
  },
  officialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    alignSelf: 'flex-start',
    paddingHorizontal: DIMENSIONS.PADDING.SM,
    paddingVertical: DIMENSIONS.PADDING.XS,
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  officialBadgeText: {
    fontSize: DIMENSIONS.FONT_SIZES.XS,
    color: COLORS.BACKGROUND,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  broadcastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ERROR,
    alignSelf: 'flex-start',
    paddingHorizontal: DIMENSIONS.PADDING.SM,
    paddingVertical: DIMENSIONS.PADDING.XS,
    borderRadius: DIMENSIONS.BORDER_RADIUS.SM,
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  broadcastBadgeText: {
    fontSize: DIMENSIONS.FONT_SIZES.XS,
    color: COLORS.BACKGROUND,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  contentContainer: {
    marginBottom: DIMENSIONS.PADDING.SM,
  },
  content: {
    fontSize: DIMENSIONS.FONT_SIZES.MD,
    color: COLORS.TEXT_PRIMARY,
    lineHeight: 22,
  },
  readMoreText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.PRIMARY,
    marginTop: DIMENSIONS.PADDING.XS,
  },
  mediaContainer: {
    marginBottom: DIMENSIONS.PADDING.SM,
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  video: {
    width: '100%',
    height: 200,
  },
  mediaLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiImageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: DIMENSIONS.PADDING.SM,
    borderRadius: DIMENSIONS.BORDER_RADIUS.MD,
    overflow: 'hidden',
  },
  multiImageItem: {
    width: '50%',
    height: 150,
    position: 'relative',
  },
  multiImage: {
    width: '100%',
    height: '100%',
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    fontSize: DIMENSIONS.FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.BACKGROUND,
  },
  actions: {
    flexDirection: 'row',
    padding: DIMENSIONS.PADDING.MD,
    paddingTop: 0,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: DIMENSIONS.PADDING.LG,
  },
  actionText: {
    fontSize: DIMENSIONS.FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: DIMENSIONS.PADDING.XS,
  },
  spacer: {
    flex: 1,
  },
});

export default PostCard;