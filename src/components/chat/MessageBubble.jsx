import { useState } from 'react';
import Avatar from '../ui/Avatar';
import { formatRelativeTime } from '../../utils/helpers';
import { clsx } from 'clsx';

const MessageBubble = ({ message, isOwn, showAvatar, friendAvatar, friendName, onImageClick }) => {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className={clsx('flex gap-2 mb-2', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && (
        <div className="flex-shrink-0 mt-auto">
          {showAvatar ? (
            <Avatar src={friendAvatar} name={friendName} size="sm" />
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>
      )}

      <div className={clsx('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
        {message.type === 'text' && (
          <div
            className={clsx(
              'px-4 py-2 text-sm leading-relaxed',
              isOwn
                ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm max-w-[70%] ml-auto'
                : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-2xl rounded-bl-sm max-w-[70%]'
            )}
          >
            {message.content}
          </div>
        )}

        {message.type === 'image' && (
          <div
            className="rounded-lg overflow-hidden cursor-pointer max-w-[280px] border border-gray-200 dark:border-gray-600"
            onClick={() => onImageClick && onImageClick(message.content)}
          >
            <img src={message.content} alt="Shared" className="w-full object-cover max-h-64" />
          </div>
        )}

        {message.type === 'video' && (
          <div className="rounded-lg overflow-hidden max-w-[280px] border border-gray-200 dark:border-gray-600">
            {!videoError ? (
              <video
                src={message.content}
                controls
                className="w-full max-h-64"
                onError={() => setVideoError(true)}
              />
            ) : (
              <div className="p-4 bg-gray-100 dark:bg-gray-700 text-sm text-gray-500 dark:text-gray-400 text-center">
                Video unavailable
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 mt-0.5 px-1">
          {message.aiGenerated && (
            <span className="text-yellow-500 text-xs" title="AI Generated">✨</span>
          )}
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatRelativeTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
