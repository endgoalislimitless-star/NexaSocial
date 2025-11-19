import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotificationsScreen from "@/screens/NotificationsScreen";
import PostDetailScreen from "@/screens/PostDetailScreen";
import UserProfileScreen from "@/screens/UserProfileScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { useTheme } from "@/hooks/useTheme";

export type NotificationsStackParamList = {
  Notifications: undefined;
  PostDetail: { postId: string };
  UserProfile: { userId: string };
};

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

export default function NotificationsStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: "Post" }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
        options={{ title: "Profile" }}
      />
    </Stack.Navigator>
  );
}
