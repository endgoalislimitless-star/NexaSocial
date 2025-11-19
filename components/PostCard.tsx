import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { Avatar } from "@/components/Avatar";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { Post } from "@/utils/storage";

interface PostCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onUserPress?: () => void;
  currentUserId?: string;
}

export function PostCard({ 
  post, 
  onPress, 
  onLike, 
  onComment, 
  onUserPress,
  currentUserId 
}: PostCardProps) {
  const { theme } = useTheme();
  const isLiked = currentUserId ? post.likes.includes(currentUserId) : false;

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLike?.();
  };

  return (
    <Pressable
      style={[
        styles.container,
        { backgroundColor: theme.backgroundRoot },
        Shadows.small,
      ]}
      onPress={onPress}
    >
      <Pressable style={styles.header} onPress={onUserPress}>
        <Avatar avatarIndex={post.avatarIndex} size={40} />
        <View style={styles.headerText}>
          <ThemedText style={styles.displayName}>{post.displayName}</ThemedText>
          <ThemedText style={styles.username} lightColor="#6c757d" darkColor="#6c757d">
            @{post.username}
          </ThemedText>
        </View>
      </Pressable>

      {post.imageUri ? (
        <Image source={{ uri: post.imageUri }} style={styles.image} resizeMode="cover" />
      ) : null}

      <View style={styles.content}>
        <ThemedText style={styles.caption}>{post.caption}</ThemedText>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={handleLike}>
          <Feather
            name={isLiked ? "heart" : "heart"}
            size={22}
            color={isLiked ? "#dc3545" : theme.textSecondary}
            fill={isLiked ? "#dc3545" : "none"}
          />
          <ThemedText style={styles.actionText} lightColor="#6c757d" darkColor="#6c757d">
            {post.likes.length}
          </ThemedText>
        </Pressable>

        <Pressable style={styles.action} onPress={onComment}>
          <Feather name="message-circle" size={22} color={theme.textSecondary} />
          <ThemedText style={styles.actionText} lightColor="#6c757d" darkColor="#6c757d">
            {post.comments.length}
          </ThemedText>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  headerText: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: "600",
  },
  username: {
    fontSize: 14,
    marginTop: 2,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  content: {
    padding: Spacing.md,
  },
  caption: {
    fontSize: 15,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.lg,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: 14,
  },
});
