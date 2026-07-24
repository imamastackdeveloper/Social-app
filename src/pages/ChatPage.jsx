import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import useAuth from '../hooks/useAuth';
import useChat from '../hooks/useChat';
import { areFriends, getFriendsOf } from '../utils/friendHelpers';
import { getAiSettings, setAiSettings as saveAiSettings, getUsers, setUsers as saveUsers } from '../utils/storage';
import { fileToBase64 } from '../utils/helpers';
import Avatar from '../components/ui/Avatar';
import ConversationList from '../components/chat/ConversationList';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import AISuggestionChips from '../components/chat/AISuggestionChips';
import AIChatBanner from '../components/chat/AIChatBanner';
import TypingIndicator from '../components/chat/TypingIndicator';
import MediaPreview from '../components/chat/MediaPreview';
import Modal from '../components/ui/Modal';
import openai from '../lib/openai';

const ChatPage = () => {
  const { userId: friendId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { conversations, getConversationMessages, sendMessage, markRead, refreshConversations, refreshMessages } = useChat();

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessagesState] = useState([]);
  const [aiSettings, setAiSettings] = useState({ aiChatEnabled: false, aiPersonality: 'friendly' });
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreview, setPendingPreview] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const aiSuggestionsShownForRef = useRef(new Set());

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load AI settings
  useEffect(() => {
    if (currentUser) {
      const settings = getAiSettings();
      if (settings[currentUser.id]) {
        setAiSettings(settings[currentUser.id]);
      }
    }
  }, [currentUser]);

  // Set selected friend
  useEffect(() => {
    if (friendId && currentUser) {
      const users = getUsers();
      const friend = users.find((u) => u.id === friendId);
      if (friend) {
        if (!areFriends(currentUser.id, friendId)) {
          navigate('/friends');
          return;
        }
        setSelectedFriend(friend);
        setMobileShowChat(true);

        const now = new Date().toISOString();
        const updatedUsers = users.map((u) =>
          u.id === currentUser.id ? { ...u, lastSeen: now } : u
        );
        saveUsers(updatedUsers);
      }
    } else {
      setSelectedFriend(null);
      setMobileShowChat(false);
    }
  }, [friendId, currentUser, navigate]);

  // Load messages
  useEffect(() => {
    if (currentUser && selectedFriend) {
      const msgs = getConversationMessages(selectedFriend.id);
      setMessagesState(msgs);
      markRead(selectedFriend.id);
      refreshConversations();
    }
  }, [currentUser, selectedFriend, getConversationMessages, markRead, refreshConversations]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, aiSuggestions]);

  // Listen for storage events (real-time)
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'messages' && currentUser && selectedFriend) {
        const msgs = getConversationMessages(selectedFriend.id);
        setMessagesState(msgs);
        markRead(selectedFriend.id);
        refreshConversations();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [currentUser, selectedFriend, getConversationMessages, markRead, refreshConversations]);

  // AI Suggestions (Mode 1) - generate when new friend message arrives
  useEffect(() => {
    if (!selectedFriend || !currentUser || messages.length === 0) {
      setAiSuggestions([]);
      return;
    }

    const lastMsg = messages[messages.length - 1];

    if (lastMsg.senderId === currentUser.id) {
      setAiSuggestions([]);
      return;
    }

    if (aiSuggestionsShownForRef.current.has(lastMsg.id)) {
      return;
    }

    aiSuggestionsShownForRef.current.add(lastMsg.id);

    generateSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, selectedFriend, currentUser]);

  // AI Auto-reply (Mode 2)
  useEffect(() => {
    if (!selectedFriend || !currentUser || messages.length === 0 || !aiSettings.aiChatEnabled) return;

    const lastMsg = messages[messages.length - 1];

    if (lastMsg.senderId === currentUser.id || lastMsg.aiGenerated) return;

    const timer = setTimeout(() => {
      generateAutoReply();
    }, 1500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, selectedFriend, currentUser, aiSettings.aiChatEnabled]);

  const generateSuggestions = async (_lastMsg) => {
    if (!currentUser || !selectedFriend) return;
    setAiLoading(true);
    try {
      const recentMessages = messages.slice(-5);
      const conversationContext = recentMessages
        .map((m) => {
          const name = m.senderId === currentUser.id ? currentUser.name : selectedFriend.name;
          return `${name}: ${m.type === 'text' ? m.content : '[media]'}`;
        })
        .join('\n');

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `You are ${currentUser.name}'s messaging assistant. You are helping ${currentUser.name} reply to ${selectedFriend.name}. Recent conversation: ${conversationContext}. Generate 3 short natural reply options. Return JSON: { "suggestions": ["reply1", "reply2", "reply3"] }. Each suggestion under 100 characters. Match the conversational tone.`,
          },
          { role: 'user', content: 'Generate reply suggestions' },
        ],
      });

      const text = response.choices[0].message.content;
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        setAiSuggestions(parsed.suggestions || []);
      }
    } catch {
      // Fail silently for suggestions
    } finally {
      setAiLoading(false);
    }
  };

  const generateAutoReply = async () => {
    if (!currentUser || !selectedFriend) return;
    setAiThinking(true);
    try {
      const recentMessages = messages.slice(-5);
      const conversationContext = recentMessages
        .map((m) => {
          const name = m.senderId === currentUser.id ? currentUser.name : selectedFriend.name;
          return `${name}: ${m.type === 'text' ? m.content : '[media]'}`;
        })
        .join('\n');

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: [
          {
            role: 'system',
            content: `You are replying to ${selectedFriend.name} on behalf of ${currentUser.name}. Recent conversation: ${conversationContext}. Reply naturally as ${currentUser.name} would. Keep it short (1-3 sentences max). Do not reveal you are an AI unless directly asked.`,
          },
          { role: 'user', content: 'Generate an auto-reply' },
        ],
      });

      const reply = response.choices[0].message.content;
      sendMessage(selectedFriend.id, 'text', reply, true);
      const updated = refreshMessages(selectedFriend.id);
      setMessagesState(updated);
      markRead(selectedFriend.id);
      refreshConversations();
      setAiSuggestions([]);
    } catch {
      // Toast-style error in the message area
      const errorMsg = {
        id: 'error-' + Date.now(),
        type: 'text',
        content: '⚠️ AI reply failed — please reply manually',
        senderId: 'system',
        timestamp: new Date().toISOString(),
        isSystemError: true,
      };
      setMessagesState((prev) => [...prev, errorMsg]);
      setTimeout(() => {
        setMessagesState((prev) => prev.filter((m) => m.id !== errorMsg.id));
      }, 5000);
    } finally {
      setAiThinking(false);
    }
  };

  const handleSendText = (text) => {
    if (!selectedFriend) return;
    sendMessage(selectedFriend.id, 'text', text);
    const updated = refreshMessages(selectedFriend.id);
    setMessagesState(updated);
    markRead(selectedFriend.id);
    refreshConversations();
    setAiSuggestions([]);
  };

  const handleFileSelect = async (file) => {
    try {
      const base64 = await fileToBase64(file);
      setPendingFile(file);
      setPendingPreview(base64);
    } catch {
      // error handling
    }
  };

  const handleSendMedia = async () => {
    if (!selectedFriend || !pendingFile) return;
    const isVideo = pendingFile.type.startsWith('video/');
    sendMessage(selectedFriend.id, isVideo ? 'video' : 'image', pendingPreview);
    const updated = refreshMessages(selectedFriend.id);
    setMessagesState(updated);
    markRead(selectedFriend.id);
    refreshConversations();
    setPendingFile(null);
    setPendingPreview('');
    setAiSuggestions([]);
  };

  const handleCancelMedia = () => {
    setPendingFile(null);
    setPendingPreview('');
  };

  const handleChipSelect = () => {
    setAiSuggestions([]);
  };

  const toggleAiMode = (mode) => {
    if (!currentUser) return;
    let newSettings;
    if (mode === 'suggest') {
      newSettings = { ...aiSettings, aiChatEnabled: false };
    } else if (mode === 'auto') {
      newSettings = { ...aiSettings, aiChatEnabled: true };
    } else {
      newSettings = { ...aiSettings, aiChatEnabled: false };
    }
    setAiSettings(newSettings);
    const allSettings = getAiSettings();
    allSettings[currentUser.id] = newSettings;
    saveAiSettings(allSettings);
    setShowAiMenu(false);
  };

  const handleSelectConversation = (fId) => {
    navigate(`/chat/${fId}`);
  };

  const friends = currentUser ? getFriendsOf(currentUser.id) : [];
  const isOnline = selectedFriend?.lastSeen &&
    (Date.now() - new Date(selectedFriend.lastSeen).getTime()) < 5 * 60 * 1000;

  if (!currentUser) return null;

  // No friends state
  if (friends.length === 0 && !friendId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No friends yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Go to People to connect with others.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={clsx(
            'border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0 overflow-y-auto',
            'w-full md:w-80 lg:w-96',
            friendId && mobileShowChat ? 'hidden md:block' : 'block'
          )}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chats</h2>
          </div>
          <ConversationList
            conversations={conversations}
            activeFriendId={friendId}
            onSelect={handleSelectConversation}
          />
        </div>

        {/* Chat Area */}
        <div
          className={clsx(
            'flex-1 flex flex-col min-w-0',
            !friendId || !mobileShowChat ? 'hidden md:flex' : 'flex'
          )}
        >
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
                <button
                  onClick={() => { navigate('/chat'); setMobileShowChat(false); }}
                  className="md:hidden p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/profile/${selectedFriend.id}`)}
                >
                  <Avatar src={selectedFriend.avatar} name={selectedFriend.name} size="md" />
                </div>

                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigate(`/profile/${selectedFriend.id}`)}
                    className="font-semibold text-gray-900 dark:text-white hover:underline text-sm"
                  >
                    {selectedFriend.name}
                  </button>
                  <div className="flex items-center gap-1.5">
                    {isOnline && <span className="w-2 h-2 bg-green-500 rounded-full" />}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                    {aiSettings.aiChatEnabled && (
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 ml-1">✨ {aiSettings.aiPersonality}</span>
                    )}
                  </div>
                </div>

                {/* AI Toggle */}
                <div className="relative">
                  <button
                    onClick={() => setShowAiMenu(!showAiMenu)}
                    className={clsx(
                      'p-2 rounded-full transition-colors',
                      aiSettings.aiChatEnabled
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    )}
                    title="AI Settings"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </button>

                  {showAiMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowAiMenu(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in">
                        <button
                          onClick={() => toggleAiMode('suggest')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Suggest replies only
                        </button>
                        <button
                          onClick={() => toggleAiMode('auto')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Let AI reply for me
                        </button>
                        <button
                          onClick={() => toggleAiMode('off')}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Turn off AI
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* AI Auto-reply Banner */}
              {aiSettings.aiChatEnabled && <AIChatBanner onDisable={() => toggleAiMode('suggest')} />}

              {/* Messages Area */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50 dark:bg-gray-900"
              >
                {messages.map((msg, index) => {
                  if (msg.isSystemError) {
                    return (
                      <div key={msg.id} className="text-center mb-2">
                        <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-full">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }

                  const isOwn = msg.senderId === currentUser.id;
                  const prevMsg = index > 0 ? messages[index - 1] : null;
                  const showAvatar = !isOwn && (!prevMsg || prevMsg.senderId !== msg.senderId);

                  return (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isOwn={isOwn}
                      showAvatar={showAvatar}
                      friendAvatar={selectedFriend.avatar}
                      friendName={selectedFriend.name}
                      onImageClick={setLightboxImage}
                    />
                  );
                })}

                {/* AI Suggestions */}
                {!aiLoading && aiSuggestions.length > 0 && (
                  <AISuggestionChips suggestions={aiSuggestions} onSelect={handleChipSelect} />
                )}

                {/* AI Thinking indicator */}
                {aiThinking && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>

              {/* Media Preview */}
              <MediaPreview file={pendingFile} previewUrl={pendingPreview} onRemove={handleCancelMedia} />

              {/* Send media button */}
              {pendingFile && (
                <div className="px-4 pb-2">
                  <button
                    onClick={handleSendMedia}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send {pendingFile.type.startsWith('video/') ? 'Video' : 'Photo'}
                  </button>
                </div>
              )}

              {/* Message Input */}
              <MessageInput
                onSend={handleSendText}
                onFileSelect={handleFileSelect}
                hasFile={!!pendingFile}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select a conversation to start chatting</h3>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Modal isOpen={!!lightboxImage} onClose={() => setLightboxImage(null)} className="max-w-3xl">
        {lightboxImage && (
          <img src={lightboxImage} alt="Full size" className="w-full rounded-lg" />
        )}
      </Modal>
    </div>
  );
};

export default ChatPage;
