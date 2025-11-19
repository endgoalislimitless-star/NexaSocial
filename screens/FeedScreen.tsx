import React, { useState, useCallback } from "react";
import { StyleSheet, RefreshControl, View, Image } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ScreenFlatList } from "@/components/ScreenFlatList";
import { PostCard } from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { getPosts, toggleLike, Post, addNotification } from "@/utils/storage";
import { Spacing } from "@/constants/theme";

export default function FeedScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadPosts = async () => {
    const allPosts = await getPosts();
    setPosts(allPosts);
  };

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleLike = async (post: Post) => {
    if (!user) return;

    await toggleLike(post.id, user.id);
    await loadPosts();

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

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../assets/placeholders/empty-state.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText style={styles.emptyTitle}>No posts yet</ThemedText>
      <ThemedText style={styles.emptySubtitle} lightColor="#6c757d" darkColor="#6c757d">
        Be the first to share something
      </ThemedText>
    </View>
  );

  return (
    <ScreenFlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PostCard
          post={item}
          currentUserId={user?.id}
          onPress={() => navigation.navigate("PostDetail" as never, { postId: item.id } as never)}
          onLike={() => handleLike(item)}
          onComment={() => navigation.navigate("PostDetail" as never, { postId: item.id } as never)}
          onUserPress={() => {
            if (item.userId === user?.id) {
              navigation.navigate("ProfileTab" as never);
            } else {
              navigation.navigate("UserProfile" as never, { userId: item.userId } as never);
            }
          }}
        />
      )}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={posts.length === 0 && styles.emptyList}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.primary}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  emptyImage: {
    width: 200,
    height: 150,
    marginBottom: Spacing.xl,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
  },
});

