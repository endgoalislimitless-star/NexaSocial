import React, { useState } from "react";
import { View, StyleSheet, Pressable, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Typography } from "@/constants/theme";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(username, password);
    } catch (error) {
      Alert.alert("Error", "Invalid credentials");
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
        <ThemedText style={[Typography.h1, styles.title]}>Welcome to Nexa</ThemedText>
        <ThemedText style={styles.subtitle} lightColor="#6c757d" darkColor="#6c757d">
          Connect with people around the world
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
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <Button
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </Button>
      </View>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText} lightColor="#6c757d" darkColor="#6c757d">
          Don't have an account?{" "}
        </ThemedText>
        <Pressable onPress={() => navigation.navigate("Signup" as never)}>
          <ThemedText style={[styles.link, { color: theme.primary }]}>Sign Up</ThemedText>
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

