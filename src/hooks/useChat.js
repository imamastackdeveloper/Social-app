import { useState, useCallback, useEffect } from 'react';
import { getMessages as fetchMessages, setMessages as saveMessages, generateId } from '../utils/storage';
import { getMessagesForConversation, getConversations, markMessagesAsRead } from '../utils/chatHelpers';
import useAuth from './useAuth';

const useChat = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversationsState] = useState([]);

  const refreshConversations = useCallback(() => {
    if (currentUser) {
      setConversationsState(getConversations(currentUser.id));
    }
  }, [currentUser]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'messages' || event.key === 'friendRequests') {
        refreshConversations();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshConversations]);

  const getConversationMessages = useCallback(
    (friendId) => {
      if (!currentUser) return [];
      return getMessagesForConversation(currentUser.id, friendId);
    },
    [currentUser]
  );

  const sendMessage = useCallback(
    (receiverId, type = 'text', content = '', aiGenerated = false) => {
      if (!currentUser || !content) return;

      const newMessage = {
        id: generateId('msg'),
        conversationId: [currentUser.id, receiverId].sort().join('_'),
        senderId: currentUser.id,
        receiverId,
        type,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        aiGenerated,
      };

      const allMessages = fetchMessages();
      allMessages.push(newMessage);
      saveMessages(allMessages);

      refreshConversations();
      return newMessage;
    },
    [currentUser, refreshConversations]
  );

  const markRead = useCallback(
    (friendId) => {
      if (!currentUser) return;
      markMessagesAsRead(currentUser.id, friendId);
      refreshConversations();
    },
    [currentUser, refreshConversations]
  );

  return {
    conversations,
    getConversationMessages,
    sendMessage,
    markRead,
    refreshConversations,
    refreshMessages: getConversationMessages,
  };
};

export default useChat;
