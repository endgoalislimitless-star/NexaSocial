import React, { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { NotificationItem } from "@/components/NotificationItem";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { getNotifications, markNotificationsAsRead, Notification } from "@/utils/storage";
import { Spacing } from "@/constants/theme";

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = async () => {
    if (!user) return;
    const notifs = await getNotifications(user.id);
    setNotifications(notifs);
    await markNotificationsAsRead(user.id);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [user])
  );

  const handleNotificationPress = (notification: Notification) => {
    if (notification.postId) {
      navigation.navigate("PostDetail" as never, { postId: notification.postId } as never);
    } else if (notification.type === "follow") {
      navigation.navigate("UserProfile" as never, { userId: notification.fromUserId } as never);
    }
  };

  return (
    <ScreenScrollView>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="bell" size={64} color={theme.textSecondary} style={styles.emptyIcon} />
          <ThemedText style={styles.emptyTitle}>No notifications yet</ThemedText>
          <ThemedText style={styles.emptySubtitle} lightColor="#6c757d" darkColor="#6c757d">
            When someone likes or comments on your posts, you'll see it here
          </ThemedText>
        </View>
      ) : (
        <View>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onPress={() => handleNotificationPress(notification)}
            />
          ))}
        </View>
      )}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing["5xl"],
  },
  emptyIcon: {
    marginBottom: Spacing.xl,
    opacity: 0.3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
  },
});

