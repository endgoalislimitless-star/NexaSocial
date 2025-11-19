import React, { useState } from "react";
import { View, StyleSheet, Alert, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";

const AVATAR_OPTIONS = [0, 1, 2, 3, 4];

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarIndex || 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Error", "Display name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarIndex: selectedAvatar,
      });

      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenKeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <ThemedText style={styles.label}>Avatar</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.avatarList}
        >
          {AVATAR_OPTIONS.map((index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedAvatar(index)}
              style={[
                styles.avatarOption,
                selectedAvatar === index && styles.avatarOptionSelected,
              ]}
            >
              <Avatar avatarIndex={index} size={64} />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Display Name</ThemedText>
        <Input
          placeholder="Enter display name"
          value={displayName}
          onChangeText={setDisplayName}
          maxLength={50}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Bio</ThemedText>
        <Input
          placeholder="Tell us about yourself..."
          value={bio}
          onChangeText={setBio}
          multiline
          maxLength={150}
        />
        <ThemedText style={styles.counter} lightColor="#6c757d" darkColor="#6c757d">
          {bio.length}/150
        </ThemedText>
      </View>

      <Button
        onPress={handleSave}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  avatarList: {
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  avatarOption: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderColor: "transparent",
  },
  avatarOptionSelected: {
    borderColor: "#4361ee",
  },
  counter: {
    fontSize: 12,
    textAlign: "right",
    marginTop: Spacing.xs,
  },
});

