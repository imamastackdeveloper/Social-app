import ConversationItem from './ConversationItem';

const ConversationList = ({ conversations, activeFriendId, onSelect }) => {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet.</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start chatting with your friends.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.friendId}
          conversation={conv}
          isActive={conv.friendId === activeFriendId}
          onClick={() => onSelect(conv.friendId)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
