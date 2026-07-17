import { useState, useCallback } from 'react';
import {
  getPosts as fetchPosts,
  setPosts as savePosts,
  getComments as fetchComments,
  setComments as saveComments,
  getLikes as fetchLikes,
  setLikes as saveLikes,
  getBookmarks as fetchBookmarks,
  setBookmarks as saveBookmarks,
  generateId,
} from '../utils/storage';
import useAuth from './useAuth';

/**
 * Custom hook for managing posts, comments, likes, and bookmarks
 * Centralizes all post-related CRUD operations
 */
const usePosts = () => {
  const { currentUser } = useAuth();
  const [posts, setPostsState] = useState(() => fetchPosts());
  const [comments, setCommentsState] = useState(() => fetchComments());
  const [likes, setLikesState] = useState(() => fetchLikes());
  const [bookmarks, setBookmarksState] = useState(() => fetchBookmarks());

  // Refresh all data from localStorage
  const refreshPosts = useCallback(() => {
    setPostsState(fetchPosts());
  }, []);

  const refreshComments = useCallback(() => {
    setCommentsState(fetchComments());
  }, []);

  const refreshLikes = useCallback(() => {
    setLikesState(fetchLikes());
  }, []);

  const refreshBookmarks = useCallback(() => {
    setBookmarksState(fetchBookmarks());
  }, []);

  // Create a new post
  const createPost = useCallback((postData) => {
    if (!currentUser) return null;
    const newPost = {
      id: generateId('post'),
      authorId: currentUser.id,
      description: postData.description,
      image: postData.image || '',
      isPublic: postData.isPublic !== undefined ? postData.isPublic : true,
      isDraft: postData.isDraft !== undefined ? postData.isDraft : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const allPosts = fetchPosts();
    allPosts.unshift(newPost);
    savePosts(allPosts);
    setPostsState(allPosts);
    return newPost;
  }, [currentUser]);

  // Update an existing post
  const updatePost = useCallback((postId, postData) => {
    const allPosts = fetchPosts();
    const updatedPosts = allPosts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          description: postData.description !== undefined ? postData.description : post.description,
          image: postData.image !== undefined ? postData.image : post.image,
          isPublic: postData.isPublic !== undefined ? postData.isPublic : post.isPublic,
          isDraft: postData.isDraft !== undefined ? postData.isDraft : post.isDraft,
          updatedAt: new Date().toISOString(),
        };
      }
      return post;
    });
    savePosts(updatedPosts);
    setPostsState(updatedPosts);
  }, []);

  // Delete a post
  const deletePost = useCallback((postId) => {
    const allPosts = fetchPosts();
    const filteredPosts = allPosts.filter((post) => post.id !== postId);
    savePosts(filteredPosts);
    setPostsState(filteredPosts);

    // Also delete associated comments and likes
    const allComments = fetchComments();
    saveComments(allComments.filter((c) => c.postId !== postId));
    setCommentsState(allComments.filter((c) => c.postId !== postId));

    const allLikes = fetchLikes();
    saveLikes(allLikes.filter((l) => l.postId !== postId));
    setLikesState(allLikes.filter((l) => l.postId !== postId));
  }, []);

  // Toggle post visibility (public/private)
  const togglePostVisibility = useCallback((postId) => {
    const allPosts = fetchPosts();
    const updatedPosts = allPosts.map((post) => {
      if (post.id === postId) {
        return { ...post, isPublic: !post.isPublic, updatedAt: new Date().toISOString() };
      }
      return post;
    });
    savePosts(updatedPosts);
    setPostsState(updatedPosts);
  }, []);

  // Publish a draft post
  const publishDraft = useCallback((postId) => {
    const allPosts = fetchPosts();
    const updatedPosts = allPosts.map((post) => {
      if (post.id === postId) {
        return { ...post, isDraft: false, updatedAt: new Date().toISOString() };
      }
      return post;
    });
    savePosts(updatedPosts);
    setPostsState(updatedPosts);
  }, []);

  // Toggle like on a post
  const toggleLike = useCallback((postId) => {
    if (!currentUser) return;
    const allLikes = fetchLikes();
    const existingLike = allLikes.find(
      (l) => l.postId === postId && l.userId === currentUser.id
    );

    let updatedLikes;
    if (existingLike) {
      updatedLikes = allLikes.filter((l) => l.id !== existingLike.id);
    } else {
      updatedLikes = [
        ...allLikes,
        {
          id: generateId('like'),
          postId,
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    saveLikes(updatedLikes);
    setLikesState(updatedLikes);
  }, [currentUser]);

  // Check if current user liked a post
  const isLikedByUser = useCallback(
    (postId) => {
      if (!currentUser) return false;
      return likes.some((l) => l.postId === postId && l.userId === currentUser.id);
    },
    [likes, currentUser]
  );

  // Get like count for a post
  const getLikeCount = useCallback(
    (postId) => {
      return likes.filter((l) => l.postId === postId).length;
    },
    [likes]
  );

  // Get comment count for a post
  const getCommentCount = useCallback(
    (postId) => {
      return comments.filter((c) => c.postId === postId).length;
    },
    [comments]
  );

  // Add a comment to a post
  const addComment = useCallback(
    (postId, text) => {
      if (!currentUser) return null;
      const newComment = {
        id: generateId('comment'),
        postId,
        authorId: currentUser.id,
        text,
        createdAt: new Date().toISOString(),
      };
      const allComments = fetchComments();
      allComments.push(newComment);
      saveComments(allComments);
      setCommentsState(allComments);
      return newComment;
    },
    [currentUser]
  );

  // Delete a comment
  const deleteComment = useCallback((commentId) => {
    const allComments = fetchComments();
    const filtered = allComments.filter((c) => c.id !== commentId);
    saveComments(filtered);
    setCommentsState(filtered);
  }, []);

  // Get comments for a specific post
  const getPostComments = useCallback(
    (postId) => {
      return comments.filter((c) => c.postId === postId);
    },
    [comments]
  );

  // Toggle bookmark on a post
  const toggleBookmark = useCallback(
    (postId) => {
      if (!currentUser) return;
      const allBookmarks = fetchBookmarks();
      const existing = allBookmarks.find(
        (b) => b.postId === postId && b.userId === currentUser.id
      );

      let updatedBookmarks;
      if (existing) {
        updatedBookmarks = allBookmarks.filter((b) => b.id !== existing.id);
      } else {
        updatedBookmarks = [
          ...allBookmarks,
          {
            id: generateId('bookmark'),
            postId,
            userId: currentUser.id,
            createdAt: new Date().toISOString(),
          },
        ];
      }

      saveBookmarks(updatedBookmarks);
      setBookmarksState(updatedBookmarks);
    },
    [currentUser]
  );

  // Check if a post is bookmarked
  const isBookmarked = useCallback(
    (postId) => {
      if (!currentUser) return false;
      return bookmarks.some((b) => b.postId === postId && b.userId === currentUser.id);
    },
    [bookmarks, currentUser]
  );

  return {
    posts,
    comments,
    likes,
    bookmarks,
    createPost,
    updatePost,
    deletePost,
    togglePostVisibility,
    publishDraft,
    toggleLike,
    isLikedByUser,
    getLikeCount,
    getCommentCount,
    addComment,
    deleteComment,
    getPostComments,
    toggleBookmark,
    isBookmarked,
    refreshPosts,
    refreshComments,
    refreshLikes,
    refreshBookmarks,
  };
};

export default usePosts;
