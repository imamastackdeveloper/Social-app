import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';

/**
 * PostActions component for like/unlike functionality
 * Used in PostDetail page for the full like button
 */
const PostActions = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const { toggleLike, isLikedByUser, getLikeCount } = usePosts();
  const navigate = useNavigate();

  const liked = isLikedByUser(postId);
  const likeCount = getLikeCount(postId);

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    toggleLike(postId);
  };

  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          liked
            ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'
        }`}
      >
        <svg
          className={`w-5 h-5 ${liked ? 'fill-primary-500' : ''}`}
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
        {liked ? 'Unlike' : 'Like'}
        {likeCount > 0 && <span className="ml-1">({likeCount})</span>}
      </button>
    </div>
  );
};

export default PostActions;
