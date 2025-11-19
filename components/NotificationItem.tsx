import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Avatar } from "@/components/Avatar";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Notification } from "@/utils/storage";

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
}

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { theme } = useTheme();

  const getIcon = () => {
    switch (notification.type) {
      case "like":
        return <Feather name="heart" size={20} color="#dc3545" />;
      case "comment":
        return <Feather name="message-circle" size={20} color={theme.primary} />;
      case "follow":
        return <Feather name="user-plus" size={20} color={theme.success} />;
    }
  };

  const getMessage = () => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return `commented: ${notification.text}`;
      case "follow":
        return "started following you";
    }
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Pressable
      style={[
        styles.container,
        !notification.read && { backgroundColor: theme.backgroundDefault },
      ]}
      onPress={onPress}
    >
      <Avatar avatarIndex={notification.fromAvatarIndex} size={44} />
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.text}>
            <ThemedText style={styles.name}>{notification.fromDisplayName}</ThemedText>
            {" "}
            <ThemedText lightColor="#6c757d" darkColor="#6c757d">
              {getMessage()}
            </ThemedText>
          </ThemedText>
          <ThemedText style={styles.time} lightColor="#6c757d" darkColor="#6c757d">
            {timeAgo(notification.createdAt)}
          </ThemedText>
        </View>
      </View>
      <View style={styles.iconContainer}>{getIcon()}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 15,
  },
  name: {
    fontWeight: "600",
  },
  time: {
    fontSize: 13,
    marginTop: 4,
  },
  iconContainer: {
    marginLeft: Spacing.sm,
  },
});
