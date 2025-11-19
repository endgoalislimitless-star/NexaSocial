import React, { useState, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useFocusEffect, useRoute, useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import { getPosts, toggleLike, addComment, Post, addNotification } from "@/utils/storage";
import { Spacing } from "@/constants/theme";

export default function PostDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { postId } = route.params as { postId: string };
  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");

  const loadPost = async () => {
    const posts = await getPosts();
    const foundPost = posts.find((p) => p.id === postId);
    setPost(foundPost || null);
  };

  useFocusEffect(
    useCallback(() => {
      loadPost();
    }, [postId])
  );

  const handleLike = async () => {
    if (!user || !post) return;
    await toggleLike(post.id, user.id);
    await loadPost();

    if (!post.likes.includes(user.id) && post.userId !== user.id) {
      await addNotification(post.userId, {
        id: Date.now().toString(),
        type: "like",
        fromUserId: user.id,
        fromUsername: user.username,
        fromDisplayName: user.displayName,
        fromAvatarIndex: user.avatarIndex,
        postId: post.id,
        createdAt: Date.now(),
        read: false,
      });
    }
  };

  const handleAddComment = async () => {
    if (!user || !post || !commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarIndex: user.avatarIndex,
      text: commentText.trim(),
      createdAt: Date.now(),
    };

    await addComment(post.id, newComment);
    await loadPost();
    setCommentText("");

    if (post.userId !== user.id) {
      await addNotification(post.userId, {
        id: Date.now().toString(),
        type: "comment",
        fromUserId: user.id,
        fromUsername: user.username,
        fromDisplayName: user.displayName,
        fromAvatarIndex: user.avatarIndex,
        postId: post.id,
        text: commentText.trim(),
        createdAt: Date.now(),
        read: false,
      });
    }
  };

  if (!post) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>Post not found</ThemedText>
      </View>
    );
  }

  return (
    <ScreenKeyboardAwareScrollView>
      <PostCard
        post={post}
        currentUserId={user?.id}
        onLike={handleLike}
        onUserPress={() => {
          if (post.userId === user?.id) {
            navigation.navigate("ProfileTab" as never);
          } else {
            navigation.navigate("UserProfile" as never, { userId: post.userId } as never);
          }
        }}
      />

      <View style={styles.commentsSection}>
        <ThemedText style={styles.sectionTitle}>
          Comments ({post.comments.length})
        </ThemedText>

        {post.comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <Avatar avatarIndex={comment.avatarIndex} size={36} />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <ThemedText style={styles.commentName}>{comment.displayName}</ThemedText>
                <ThemedText style={styles.commentUsername} lightColor="#6c757d" darkColor="#6c757d">
                  @{comment.username}
                </ThemedText>
              </View>
              <ThemedText style={styles.commentText}>{comment.text}</ThemedText>
            </View>
          </View>
        ))}

        {post.comments.length === 0 && (
          <ThemedText style={styles.noComments} lightColor="#6c757d" darkColor="#6c757d">
            No comments yet. Be the first to comment!
          </ThemedText>
        )}
      </View>

      <View style={styles.addComment}>
        <Input
          placeholder="Add a comment..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <Button
          onPress={handleAddComment}
          disabled={!commentText.trim()}
        >
          Post Comment
        </Button>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commentsSection: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  comment: {
    flexDirection: "row",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: 4,
  },
  commentName: {
    fontSize: 15,
    fontWeight: "600",
  },
  commentUsername: {
    fontSize: 13,
  },
  commentText: {
    fontSize: 15,
  },
  noComments: {
    fontSize: 15,
    textAlign: "center",
    paddingVertical: Spacing.xl,
  },
  addComment: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});

