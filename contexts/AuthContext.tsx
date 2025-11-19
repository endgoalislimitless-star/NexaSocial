import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarIndex: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const users = await AsyncStorage.getItem("users");
    const userList = users ? JSON.parse(users) : [];
    
    const foundUser = userList.find(
      (u: any) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      await AsyncStorage.setItem("user", JSON.stringify(userWithoutPassword));
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const signup = async (username: string, password: string, displayName: string) => {
    const users = await AsyncStorage.getItem("users");
    const userList = users ? JSON.parse(users) : [];
    
    if (userList.find((u: any) => u.username === username)) {
      throw new Error("Username already exists");
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      displayName,
      bio: "",
      avatarIndex: Math.floor(Math.random() * 5),
    };

    userList.push(newUser);
    await AsyncStorage.setItem("users", JSON.stringify(userList));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    await AsyncStorage.setItem("user", JSON.stringify(userWithoutPassword));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

    const users = await AsyncStorage.getItem("users");
    const userList = users ? JSON.parse(users) : [];
    const userIndex = userList.findIndex((u: any) => u.id === user.id);
    
    if (userIndex !== -1) {
      userList[userIndex] = { ...userList[userIndex], ...updates };
      await AsyncStorage.setItem("users", JSON.stringify(userList));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
