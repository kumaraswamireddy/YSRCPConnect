import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { COLORS, DIMENSIONS } from '../../utils/constants';
import PostCard from '../feed/PostCard';
import EmptyState from '../common/EmptyState';
import LoadingSpinner from '../common/LoadingSpinner';

const UserPostsTab = ({
  posts,
  onPostPress,
  onRefresh,
  refreshing,
  loading,
  isOfficialTab = false,
}) => {
  // Handle post press
  const handlePostPress = useCallback((postId) => {
    if (onPostPress) {
      onPostPress(postId);
    }
  }, [onPostPress]);

  // Render post item
  const renderPost = useCallback(({ item }) => (
    <PostCard
      post={item}
      onPress={() => handlePostPress(item.id)}
      onLike={() => {}} // We don't need to handle like here as it's handled in the parent
      onShare={() => {}} // We don't need to handle share here as it's handled in the parent
      onReport={() => {}} // We don't need to handle report here as it's handled in the parent
      style={styles.postCard}
    />
  ), [handlePostPress]);

  // Render footer
  const renderFooter = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        </View>
      );
    }

    return null;
  }, [loading]);

  // Render empty state
  const renderEmptyState = useCallback(() => {
    const emptyStateProps = {
      icon: isOfficialTab ? 'verified' : 'post-add',
      title: isOfficialTab ? 'No Official Posts' : 'No Posts',
      message: isOfficialTab
        ? 'This user hasn\'t created any official posts yet.'
        : 'This user hasn\'t created any posts yet.',
    };

    return <EmptyState {...emptyStateProps} />;
  }, [isOfficialTab]);

  // Key extractor
  const keyExtractor = useCallback((item) => item.id, []);

  // Show loading spinner if still loading and no posts
  if (loading && posts.length === 0) {
    return <LoadingSpinner message="Loading posts..." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  listContainer: {
    padding: DIMENSIONS.PADDING.MD,
  },
  postCard: {
    marginBottom: DIMENSIONS.PADDING.MD,
  },
  footerContainer: {
    paddingVertical: DIMENSIONS.PADDING.LG,
    alignItems: 'center',
  },
});

export default UserPostsTab;