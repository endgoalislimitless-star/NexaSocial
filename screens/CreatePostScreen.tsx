import React, { useState } from "react";
import { View, StyleSheet, Alert, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { savePost } from "@/utils/storage";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!caption.trim() && !imageUri) {
      Alert.alert("Error", "Please add a caption or image");
      return;
    }

    if (!user) return;

    setIsLoading(true);
    try {
      await savePost({
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarIndex: user.avatarIndex,
        imageUri: imageUri || undefined,
        caption: caption.trim(),
        likes: [],
        comments: [],
        createdAt: Date.now(),
      });

      Alert.alert("Success", "Post created successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenKeyboardAwareScrollView contentContainerStyle={styles.container}>
      <Pressable
        style={[
          styles.imagePicker,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.backgroundTertiary },
          Shadows.small,
        ]}
        onPress={pickImage}
      >
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            <Pressable
              style={[styles.removeButton, { backgroundColor: theme.backgroundRoot }]}
              onPress={() => setImageUri(null)}
            >
              <Feather name="x" size={20} color={theme.text} />
            </Pressable>
          </>
        ) : (
          <View style={styles.placeholderContent}>
            <Feather name="image" size={48} color={theme.textSecondary} />
            <ThemedText style={styles.placeholderText} lightColor="#6c757d" darkColor="#6c757d">
              Tap to add a photo
            </ThemedText>
          </View>
        )}
      </Pressable>

      <View style={styles.form}>
        <Input
          placeholder="Write a caption..."
          value={caption}
          onChangeText={setCaption}
          multiline
          maxLength={500}
        />
        <View style={styles.characterCount}>
          <ThemedText style={styles.countText} lightColor="#6c757d" darkColor="#6c757d">
            {caption.length}/500
          </ThemedText>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          onPress={handlePost}
          disabled={isLoading}
        >
          {isLoading ? "Posting..." : "Share Post"}
        </Button>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  imagePicker: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.medium,
  },
  placeholderContent: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: Spacing.md,
    fontSize: 16,
  },
  form: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  characterCount: {
    alignItems: "flex-end",
  },
  countText: {
    fontSize: 12,
  },
  actions: {
    marginBottom: Spacing.lg,
  },
});

