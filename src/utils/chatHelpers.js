import { getMessages, getFriendRequests, getUsers } from './storage';
import { areFriends } from './friendHelpers';

export const getConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

export const getMessagesForConversation = (userId1, userId2) => {
  const conversationId = getConversationId(userId1, userId2);
  const allMessages = getMessages();
  return allMessages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

export const getConversations = (currentUserId) => {
  const allMessages = getMessages();
  const users = getUsers();
  const friendIds = getFriendRequests()
    .filter(
      (r) =>
        r.status === 'accepted' &&
        (r.fromUserId === currentUserId || r.toUserId === currentUserId)
    )
    .map((r) =>
      r.fromUserId === currentUserId ? r.toUserId : r.fromUserId
    );

  const conversationMap = {};

  friendIds.forEach((friendId) => {
    if (!areFriends(currentUserId, friendId)) return;

    const conversationId = getConversationId(currentUserId, friendId);
    const messages = allMessages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const friend = users.find((u) => u.id === friendId);

    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const unreadCount = messages.filter(
        (m) => m.receiverId === currentUserId && !m.read
      ).length;

      conversationMap[friendId] = {
        friendId,
        friend,
        lastMessage,
        unreadCount,
        updatedAt: lastMessage.timestamp,
      };
    } else if (friend) {
      conversationMap[friendId] = {
        friendId,
        friend,
        lastMessage: null,
        unreadCount: 0,
        updatedAt: '',
      };
    }
  });

  return Object.values(conversationMap).sort((a, b) => {
    if (!a.lastMessage && !b.lastMessage) return 0;
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
};

export const getTotalUnreadCount = (currentUserId) => {
  const allMessages = getMessages();
  return allMessages.filter(
    (m) => m.receiverId === currentUserId && !m.read
  ).length;
};

export const markMessagesAsRead = (currentUserId, otherUserId) => {
  const conversationId = getConversationId(currentUserId, otherUserId);
  const allMessages = getMessages();
  const updated = allMessages.map((m) => {
    if (m.conversationId === conversationId && m.receiverId === currentUserId && !m.read) {
      return { ...m, read: true };
    }
    return m;
  });
  localStorage.setItem('messages', JSON.stringify(updated));
  return updated;
};
