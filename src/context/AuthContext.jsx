import { createContext, useState, useCallback, useEffect } from 'react';
import {
  getUsers,
  setUsers,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  generateId,
} from '../utils/storage';

/**
 * Authentication Context
 * Manages user authentication state, session persistence,
 * signup, login, logout, and profile update operations
 */
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setUserState] = useState(() => getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getCurrentUser());

  // Sync state with localStorage on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserState(user);
      setIsAuthenticated(true);
    }
  }, []);

  /**
   * Sign up a new user
   * Validates uniqueness of email, creates user record,
   * and stores password only in users array (never in currentUser)
   */
  const signup = useCallback((userData) => {
    const users = getUsers();
    const emailExists = users.some(
      (user) => user.email.toLowerCase() === userData.email.toLowerCase()
    );

    if (emailExists) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: generateId('user'),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      bio: '',
      location: '',
      avatar: '',
      coverImage: '',
      joinedAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    return { success: true, message: 'Account created successfully' };
  }, []);

  /**
   * Login with email and password
   * Returns safe user object without password
   */
  const login = useCallback((email, password) => {
    const users = getUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    // Create safe user object without password
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      avatar: user.avatar,
      coverImage: user.coverImage,
      joinedAt: user.joinedAt,
    };

    setCurrentUser(safeUser);
    setUserState(safeUser);
    setIsAuthenticated(true);

    return { success: true, message: 'Login successful' };
  }, []);

  /**
   * Logout - clear current user session
   */
  const logout = useCallback(() => {
    clearCurrentUser();
    setUserState(null);
    setIsAuthenticated(false);
  }, []);

  /**
   * Update current user profile
   * Syncs changes to both currentUser and users array
   */
  const updateCurrentUser = useCallback(
    (updatedData) => {
      if (!currentUser) return { success: false, message: 'Not authenticated' };

      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      setUserState(updatedUser);

      // Also update in users array
      const users = getUsers();
      const updatedUsers = users.map((user) => {
        if (user.id === currentUser.id) {
          return { ...user, ...updatedData };
        }
        return user;
      });
      setUsers(updatedUsers);

      return { success: true, message: 'Profile updated successfully' };
    },
    [currentUser]
  );

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
