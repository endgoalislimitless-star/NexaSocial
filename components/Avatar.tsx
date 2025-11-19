import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { BorderRadius } from "@/constants/theme";

interface AvatarProps {
  avatarIndex: number;
  size?: number;
}

const avatarImages = [
  require("../assets/avatars/avatar-1.png"),
  require("../assets/avatars/avatar-2.png"),
  require("../assets/avatars/avatar-3.png"),
  require("../assets/avatars/avatar-4.png"),
  require("../assets/avatars/avatar-5.png"),
];

export function Avatar({ avatarIndex, size = 40 }: AvatarProps) {
  const safeIndex = avatarIndex % avatarImages.length;

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Image
        source={avatarImages[safeIndex]}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
