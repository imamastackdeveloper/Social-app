import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { truncateText } from '../../utils/helpers';

const FriendCard = ({ friend, onUnfriend }) => {
  const navigate = useNavigate();

  const handleMessage = (e) => {
    e.stopPropagation();
    navigate(`/chat/${friend.id}`);
  };

  const handleUnfriend = (e) => {
    e.stopPropagation();
    onUnfriend(friend.id);
  };

  const handleNameClick = () => {
    navigate(`/profile/${friend.id}`);
  };

  return (
    <div className="card p-4 flex items-center gap-4 animate-fade-in hover:shadow-md transition-shadow">
      <Avatar src={friend.avatar} name={friend.name} size="lg" onClick={handleNameClick} />
      <div className="flex-1 min-w-0">
        <button onClick={handleNameClick} className="font-semibold text-gray-900 dark:text-white hover:underline text-sm">
          {friend.name}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{truncateText(friend.bio, 60)}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button size="sm" variant="primary" onClick={handleMessage}>Message</Button>
        <Button size="sm" variant="secondary" onClick={handleUnfriend}>Unfriend</Button>
      </div>
    </div>
  );
};

export default FriendCard;
