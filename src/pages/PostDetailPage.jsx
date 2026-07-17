import { useParams, useNavigate, Link } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import PostActions from '../components/post/PostActions';
import CommentSection from '../components/post/CommentSection';
import useAuth from '../hooks/useAuth';
import { formatFullDate } from '../utils/helpers';
import { getPosts, getUsers } from '../utils/storage';

/**
 * Post Detail Page
 * Shows full post with author info, image, like/comment functionality
 * Guests can view but must login to interact
 */
const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Find post from localStorage
  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Post Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          This post may have been deleted or doesn&apos;t exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-primary-500 hover:text-primary-600 font-medium"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  // Find author info
  const users = getUsers();
  const author = users.find((u) => u.id === post.authorId);

  if (!author) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Author information not found.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="card overflow-hidden">
        {/* Author header */}
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${author.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar src={author.avatar} name={author.name} size="md" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white hover:underline">
                  {author.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFullDate(post.createdAt)}
                </p>
              </div>
            </Link>
            <Badge variant={post.isPublic ? 'public' : 'private'}>
              {post.isPublic ? 'Public' : 'Private'}
            </Badge>
          </div>

          {/* Full description */}
          {post.description && (
            <p className="mt-4 text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {post.description}
            </p>
          )}
        </div>

        {/* Full image */}
        {post.image && (
          <div className="mt-2">
            <img
              src={post.image}
              alt="Post content"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Like actions */}
        <div className="px-4">
          <PostActions postId={post.id} />
        </div>

        {/* Comments section */}
        <div className="p-4">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
