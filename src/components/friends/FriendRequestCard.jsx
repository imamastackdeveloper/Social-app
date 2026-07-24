import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { truncateText } from '../../utils/helpers';
import { getMutualFriendsCount } from '../../utils/friendHelpers';
import useAuth from '../../hooks/useAuth';

const FriendRequestCard = ({ user, type, onSendRequest, onCancelRequest, onAccept, onReject }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleNameClick = () => {
    navigate(`/profile/${user.id}`);
  };

  const mutualCount = currentUser ? getMutualFriendsCount(currentUser.id, user.id) : 0;

  if (type === 'received') {
    return (
      <div className="card p-4 flex items-center gap-4 animate-fade-in">
        <Avatar src={user.avatar} name={user.name} size="lg" onClick={handleNameClick} />
        <div className="flex-1 min-w-0">
          <button onClick={handleNameClick} className="font-semibold text-gray-900 dark:text-white hover:underline text-sm">
            {user.name}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{truncateText(user.bio, 60)}</p>
          {mutualCount > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{mutualCount} mutual friend{mutualCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button size="sm" variant="primary" onClick={() => onAccept(user.id)}>Accept</Button>
          <Button size="sm" variant="secondary" onClick={() => onReject(user.id)}>Reject</Button>
        </div>
      </div>
    );
  }

  if (type === 'sent') {
    return (
      <div className="card p-4 flex items-center gap-4 animate-fade-in">
        <Avatar src={user.avatar} name={user.name} size="lg" onClick={handleNameClick} />
        <div className="flex-1 min-w-0">
          <button onClick={handleNameClick} className="font-semibold text-gray-900 dark:text-white hover:underline text-sm">
            {user.name}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{truncateText(user.bio, 60)}</p>
        </div>
        <div className="flex-shrink-0">
          <Button size="sm" variant="secondary" onClick={() => onCancelRequest(user.id)}>Cancel Request</Button>
        </div>
      </div>
    );
  }

  if (type === 'suggest') {
    return (
      <div className="card p-4 flex items-center gap-4 animate-fade-in">
        <Avatar src={user.avatar} name={user.name} size="lg" onClick={handleNameClick} />
        <div className="flex-1 min-w-0">
          <button onClick={handleNameClick} className="font-semibold text-gray-900 dark:text-white hover:underline text-sm">
            {user.name}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{truncateText(user.bio, 60)}</p>
          {mutualCount > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{mutualCount} mutual friend{mutualCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <Button size="sm" variant="primary" onClick={() => onSendRequest(user.id)}>Add Friend</Button>
        </div>
      </div>
    );
  }

  if (type === 'request_sent') {
    return (
      <div className="card p-4 flex items-center gap-4 animate-fade-in">
        <Avatar src={user.avatar} name={user.name} size="lg" onClick={handleNameClick} />
        <div className="flex-1 min-w-0">
          <button onClick={handleNameClick} className="font-semibold text-gray-900 dark:text-white hover:underline text-sm">
            {user.name}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{truncateText(user.bio, 60)}</p>
          {mutualCount > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{mutualCount} mutual friend{mutualCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed">
            Request Sent
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default FriendRequestCard;
