import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Avatar } from "@/components/Avatar";
import { Spacing } from "@/constants/theme";

interface UserListItemProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    bio: string;
    avatarIndex: number;
  };
  onPress?: () => void;
}

export function UserListItem({ user, onPress }: UserListItemProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Avatar avatarIndex={user.avatarIndex} size={48} />
      <View style={styles.textContainer}>
        <ThemedText style={styles.displayName}>{user.displayName}</ThemedText>
        <ThemedText style={styles.username} lightColor="#6c757d" darkColor="#6c757d">
          @{user.username}
        </ThemedText>
        {user.bio ? (
          <ThemedText style={styles.bio} lightColor="#6c757d" darkColor="#6c757d" numberOfLines={1}>
            {user.bio}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  textContainer: {
    marginLeft: Spacing.md,
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
  bio: {
    fontSize: 14,
    marginTop: 4,
  },
});
