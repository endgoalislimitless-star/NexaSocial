import React, { useState, useCallback } from "react";
import { StyleSheet, View, Image } from "react-native";
import { useFocusEffect, useRoute, useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { getPosts, toggleLike, getUserById, Post } from "@/utils/storage";
import { Spacing } from "@/constants/theme";

export default function UserProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { user: currentUser } = useAuth();
  const { userId } = route.params as { userId: string };
  const [user, setUser] = useState<any | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const loadUserProfile = async () => {
    const userData = await getUserById(userId);
    setUser(userData);

    const allPosts = await getPosts();
    const userPosts = allPosts.filter((p) => p.userId === userId);
    setPosts(userPosts);
  };

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
    }, [userId])
  );

  const handleLike = async (post: Post) => {
    if (!currentUser) return;
    await toggleLike(post.id, currentUser.id);
    await loadUserProfile();
  };

  if (!user) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText>User not found</ThemedText>
      </View>
    );
  }

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <Avatar avatarIndex={user.avatarIndex} size={80} />

        <View style={styles.profileInfo}>
          <ThemedText style={styles.displayName}>{user.displayName}</ThemedText>
          <ThemedText style={styles.username} lightColor="#6c757d" darkColor="#6c757d">
            @{user.username}
          </ThemedText>
          {user.bio ? (
            <ThemedText style={styles.bio}>{user.bio}</ThemedText>
          ) : null}
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <ThemedText style={styles.statNumber}>{posts.length}</ThemedText>
            <ThemedText style={styles.statLabel} lightColor="#6c757d" darkColor="#6c757d">
              Posts
            </ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={styles.statNumber}>
              {posts.reduce((sum, p) => sum + p.likes.length, 0)}
            </ThemedText>
            <ThemedText style={styles.statLabel} lightColor="#6c757d" darkColor="#6c757d">
              Likes
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.postsSection}>
        <ThemedText style={styles.sectionTitle}>Posts</ThemedText>
        {posts.length === 0 ? (
          <View style={styles.emptyPosts}>
            <Image
              source={require("../assets/placeholders/empty-state.png")}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <ThemedText style={styles.emptyTitle}>No posts yet</ThemedText>
            <ThemedText style={styles.emptySubtitle} lightColor="#6c757d" darkColor="#6c757d">
              This user hasn't shared anything yet
            </ThemedText>
          </View>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUser?.id}
              onPress={() => navigation.navigate("PostDetail" as never, { postId: post.id } as never)}
              onLike={() => handleLike(post)}
              onComment={() => navigation.navigate("PostDetail" as never, { postId: post.id } as never)}
              onUserPress={() => {}}
            />
          ))
        )}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    alignItems: "center",
  },
  profileInfo: {
    gap: Spacing.xs,
    alignItems: "center",
  },
  displayName: {
    fontSize: 24,
    fontWeight: "700",
  },
  username: {
    fontSize: 16,
  },
  bio: {
    fontSize: 15,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  stats: {
    flexDirection: "row",
    gap: Spacing["2xl"],
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  postsSection: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  emptyPosts: {
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing["3xl"],
  },
  emptyImage: {
    width: 150,
    height: 120,
    marginBottom: Spacing.lg,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
});

