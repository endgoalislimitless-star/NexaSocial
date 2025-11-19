import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { Input } from "@/components/Input";
import { UserListItem } from "@/components/UserListItem";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { searchUsers } from "@/utils/storage";
import { Spacing } from "@/constants/theme";

export default function SearchScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const search = async () => {
      const users = await searchUsers(query);
      const filtered = users.filter((u) => u.id !== user?.id);
      setResults(filtered);
    };
    search();
  }, [query, user]);

  return (
    <ScreenScrollView>
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.backgroundDefault }]}>
          <Feather name="search" size={20} color={theme.textSecondary} />
          <Input
            style={styles.searchInput}
            placeholder="Search users..."
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="users" size={64} color={theme.textSecondary} style={styles.emptyIcon} />
          <ThemedText style={styles.emptyTitle}>
            {query ? "No users found" : "Search for users"}
          </ThemedText>
          <ThemedText style={styles.emptySubtitle} lightColor="#6c757d" darkColor="#6c757d">
            {query ? "Try a different search term" : "Enter a username or name to search"}
          </ThemedText>
        </View>
      ) : (
        <View>
          {results.map((resultUser) => (
            <UserListItem
              key={resultUser.id}
              user={resultUser}
              onPress={() =>
                navigation.navigate("UserProfile" as never, { userId: resultUser.id } as never)
              }
            />
          ))}
        </View>
      )}
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
  },
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

