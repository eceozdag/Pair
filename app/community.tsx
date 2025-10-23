import Colors from '../constants/colors';
import { useApp, Post } from '../contexts/AppContext';
import { Heart, MessageCircle, Wine } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function PostCard({ post }: { post: Post }) {
  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
        <View style={styles.postHeaderText}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.postTime}>{formatTimeAgo(post.timestamp)}</Text>
        </View>
      </View>

      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}

      <View style={styles.postContent}>
        {post.wine && (
          <View style={styles.wineInfo}>
            <Wine size={16} color={Colors.light.primary} />
            <View style={styles.wineText}>
              <Text style={styles.wineName}>{post.wine.name}</Text>
              <Text style={styles.wineDetails}>{post.wine.type} • {post.wine.region}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {post.rating}</Text>
            </View>
          </View>
        )}

        {post.food && (
          <View style={styles.foodInfo}>
            <Text style={styles.foodLabel}>Paired with</Text>
            <Text style={styles.foodName}>{post.food}</Text>
          </View>
        )}

        <Text style={styles.caption}>{post.caption}</Text>

        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={20} color={Colors.light.textSecondary} />
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageCircle size={20} color={Colors.light.textSecondary} />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function CommunityScreen() {
  const { posts } = useApp();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Discover Pairings</Text>
        <Text style={styles.pageSubtitle}>
          Explore wine and food combinations from our community
        </Text>

        <View style={styles.postsContainer}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>

        {posts.length === 0 && (
          <View style={styles.emptyState}>
            <Wine size={64} color={Colors.light.textSecondary} />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>
              Be the first to share a pairing!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  postsContainer: {
    gap: 20,
  },
  postCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.border,
  },
  postHeaderText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  postTime: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: Colors.light.border,
  },
  postContent: {
    padding: 16,
    gap: 12,
  },
  wineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
  },
  wineText: {
    flex: 1,
  },
  wineName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  wineDetails: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  ratingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.light.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  foodInfo: {
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
  },
  foodLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    textTransform: 'capitalize',
  },
  caption: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
  },
  postActions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.light.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  emptySubtext: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
