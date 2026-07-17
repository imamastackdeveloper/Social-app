const KEYS = {
  USERS: 'socialapp_users',
  POSTS: 'socialapp_posts',
  COMMENTS: 'socialapp_comments',
  LIKES: 'socialapp_likes',
  CURRENT_USER: 'socialapp_currentUser',
  BOOKMARKS: 'socialapp_bookmarks',
  DARK_MODE: 'socialapp_darkMode',
};

/**
 * Generate a unique ID with a prefix using Date.now() + Math.random()
 * Ensures uniqueness by combining timestamp with random number
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generic localStorage helpers - never access localStorage directly from components
 */
export const getUsers = () => {
  try {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setUsers = (users) => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const getPosts = () => {
  try {
    const data = localStorage.getItem(KEYS.POSTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setPosts = (posts) => {
  localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
};

export const getComments = () => {
  try {
    const data = localStorage.getItem(KEYS.COMMENTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setComments = (comments) => {
  localStorage.setItem(KEYS.COMMENTS, JSON.stringify(comments));
};

export const getLikes = () => {
  try {
    const data = localStorage.getItem(KEYS.LIKES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setLikes = (likes) => {
  localStorage.setItem(KEYS.LIKES, JSON.stringify(likes));
};

export const getCurrentUser = () => {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem(KEYS.CURRENT_USER);
};

export const getBookmarks = () => {
  try {
    const data = localStorage.getItem(KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const setBookmarks = (bookmarks) => {
  localStorage.setItem(KEYS.BOOKMARKS, JSON.stringify(bookmarks));
};

export const getDarkMode = () => {
  try {
    const data = localStorage.getItem(KEYS.DARK_MODE);
    return data ? JSON.parse(data) : false;
  } catch {
    return false;
  }
};

export const setDarkMode = (value) => {
  localStorage.setItem(KEYS.DARK_MODE, JSON.stringify(value));
};
