import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FeedScreen from "@/screens/FeedScreen";
import PostDetailScreen from "@/screens/PostDetailScreen";
import UserProfileScreen from "@/screens/UserProfileScreen";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";

export type FeedStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
  UserProfile: { userId: string };
};

const Stack = createNativeStackNavigator<FeedStackParamList>();

export default function FeedStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Nexa" />,
        }}
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
