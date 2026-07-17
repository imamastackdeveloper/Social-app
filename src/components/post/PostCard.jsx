import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import { formatRelativeTime, truncateText } from '../../utils/helpers';
import { getUsers } from '../../utils/storage';

/**
 * PostCard component for displaying a post in the feed
 * Shows author info, description preview, image, like/comment counts
 * Supports bookmark functionality (bonus feature)
 */
const PostCard = ({ post }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { getLikeCount, getCommentCount, toggleLike, isLikedByUser, toggleBookmark, isBookmarked } = usePosts();
  const navigate = useNavigate();

  const likeCount = getLikeCount(post.id);
  const commentCount = getCommentCount(post.id);
  const liked = isLikedByUser(post.id);
  const bookmarked = isBookmarked(post.id);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    toggleLike(post.id);
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    toggleBookmark(post.id);
  };

  const handleCommentClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { message: 'Please login to interact' } });
    }
  };

  const handleAuthorClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/profile/${post.authorId}`);
  };

  // Find author info from localStorage
  const users = getUsers();
  const author = users.find((u) => u.id === post.authorId);

  if (!author) return null;

  return (
    <div className="card overflow-hidden animate-fade-in hover:shadow-md transition-shadow duration-200">
      {/* Author header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={author.avatar}
              name={author.name}
              size="md"
              onClick={handleAuthorClick}
            />
            <div>
              <button
                onClick={handleAuthorClick}
                className="font-semibold text-gray-900 dark:text-white hover:underline text-sm"
              >
                {author.name}
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Visibility badge */}
            <Badge variant={post.isPublic ? 'public' : 'private'}>
              {post.isPublic ? 'Public' : 'Private'}
            </Badge>

            {/* Bookmark button */}
            <button
              onClick={handleBookmark}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark post'}
            >
              <svg
                className={`w-4 h-4 ${bookmarked ? 'text-primary-500 fill-primary-500' : 'text-gray-400'}`}
                fill={bookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {post.description && (
          <Link to={`/posts/${post.id}`} className="block mt-3">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {post.description}
            </p>
          </Link>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <Link to={`/posts/${post.id}`}>
          <div className="mt-2">
            <img
              src={post.image}
              alt="Post content"
              className="w-full max-h-96 object-cover"
            />
          </div>
        </Link>
      )}

      {/* Like and Comment counts */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {likeCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </span>
              {likeCount}
            </span>
          )}
          {commentCount > 0 && (
            <span>{commentCount} Comment{commentCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-1 flex items-center border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            liked
              ? 'text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
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
          Like
        </button>
        <button
          onClick={handleCommentClick}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Comment
        </button>
      </div>
    </div>
  );
};

export default PostCard;
