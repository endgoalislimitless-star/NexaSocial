import React, { useState } from "react";
import { View, StyleSheet, Pressable, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography } from "@/constants/theme";

export default function SignupScreen() {
  const navigation = useNavigation();
  const { signup } = useAuth();
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !displayName || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await signup(username, password, displayName);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenKeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText style={[Typography.h1, styles.title]}>Create Account</ThemedText>
        <ThemedText style={styles.subtitle} lightColor="#6c757d" darkColor="#6c757d">
          Join Nexa and start connecting
        </ThemedText>
      </View>

      <View style={styles.form}>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <Button
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText} lightColor="#6c757d" darkColor="#6c757d">
          Already have an account?{" "}
        </ThemedText>
        <Pressable onPress={() => navigation.navigate("Login" as never)}>
          <ThemedText style={[styles.link, { color: theme.primary }]}>Log In</ThemedText>
        </Pressable>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  form: {
    gap: Spacing.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing["2xl"],
  },
  footerText: {
    fontSize: 15,
  },
  link: {
    fontSize: 15,
    fontWeight: "600",
  },
});

