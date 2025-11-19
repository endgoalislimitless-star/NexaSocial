import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Post {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarIndex: number;
  imageUri?: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  createdAt: number;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarIndex: number;
  text: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow";
  fromUserId: string;
  fromUsername: string;
  fromDisplayName: string;
  fromAvatarIndex: number;
  postId?: string;
  text?: string;
  createdAt: number;
  read: boolean;
}

export async function getPosts(): Promise<Post[]> {
  try {
    const posts = await AsyncStorage.getItem("posts");
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error("Failed to get posts:", error);
    return [];
  }
}

export async function savePost(post: Post): Promise<void> {
  try {
    const posts = await getPosts();
    posts.unshift(post);
    await AsyncStorage.setItem("posts", JSON.stringify(posts));
  } catch (error) {
    console.error("Failed to save post:", error);
    throw error;
  }
}

export async function toggleLike(postId: string, userId: string): Promise<void> {
  try {
    const posts = await getPosts();
    const postIndex = posts.findIndex((p) => p.id === postId);
    
    if (postIndex !== -1) {
      const post = posts[postIndex];
      const likeIndex = post.likes.indexOf(userId);
      
      if (likeIndex === -1) {
        post.likes.push(userId);
      } else {
        post.likes.splice(likeIndex, 1);
      }
      
      posts[postIndex] = post;
      await AsyncStorage.setItem("posts", JSON.stringify(posts));
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
    throw error;
  }
}

export async function addComment(postId: string, comment: Comment): Promise<void> {
  try {
    const posts = await getPosts();
    const postIndex = posts.findIndex((p) => p.id === postId);
    
    if (postIndex !== -1) {
      posts[postIndex].comments.push(comment);
      await AsyncStorage.setItem("posts", JSON.stringify(posts));
    }
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
}

export async function getNotifications(userId: string): Promise<Notification[]> {
  try {
    const notifications = await AsyncStorage.getItem(`notifications_${userId}`);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error("Failed to get notifications:", error);
    return [];
  }
}

export async function addNotification(userId: string, notification: Notification): Promise<void> {
  try {
    const notifications = await getNotifications(userId);
    notifications.unshift(notification);
    await AsyncStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
  } catch (error) {
    console.error("Failed to add notification:", error);
  }
}

export async function markNotificationsAsRead(userId: string): Promise<void> {
  try {
    const notifications = await getNotifications(userId);
    const updated = notifications.map((n) => ({ ...n, read: true }));
    await AsyncStorage.setItem(`notifications_${userId}`, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
  }
}

export async function searchUsers(query: string): Promise<any[]> {
  try {
    const users = await AsyncStorage.getItem("users");
    const userList = users ? JSON.parse(users) : [];
    
    if (!query) return userList.map(({ password, ...user }: any) => user);
    
    return userList
      .filter((u: any) => 
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.displayName.toLowerCase().includes(query.toLowerCase())
      )
      .map(({ password, ...user }: any) => user);
  } catch (error) {
    console.error("Failed to search users:", error);
    return [];
  }
}

export async function getUserById(userId: string): Promise<any | null> {
  try {
    const users = await AsyncStorage.getItem("users");
    const userList = users ? JSON.parse(users) : [];
    const user = userList.find((u: any) => u.id === userId);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  } catch (error) {
    console.error("Failed to get user by id:", error);
    return null;
  }
}
