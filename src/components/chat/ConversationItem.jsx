import Avatar from '../ui/Avatar';
import { formatRelativeTime } from '../../utils/helpers';
import { truncateText } from '../../utils/helpers';
import { clsx } from 'clsx';

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const { friend, lastMessage, unreadCount } = conversation;

  if (!friend) return null;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50',
        isActive && 'bg-blue-50 border-l-4 border-blue-600 dark:bg-blue-900/20'
      )}
    >
      <Avatar src={friend.avatar} name={friend.name} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={clsx('text-sm font-medium truncate', unreadCount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300')}>
            {friend.name}
          </span>
          {lastMessage && (
            <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2">
              {formatRelativeTime(lastMessage.timestamp)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-0.5">
          {lastMessage ? (
            <p className={clsx('text-xs truncate', unreadCount > 0 ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-500 dark:text-gray-400')}>
              {lastMessage.senderId === friend.id ? '' : 'You: '}
              {lastMessage.type === 'text' ? truncateText(lastMessage.content, 40) : lastMessage.type === 'image' ? '📷 Photo' : '🎬 Video'}
            </p>
          ) : (
            <p className="text-xs text-gray-400 dark:text-gray-500 italic">Start a conversation</p>
          )}
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-blue-600 rounded-full flex-shrink-0 ml-2">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
