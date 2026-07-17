import { useParams } from 'react-router-dom';
import ProfileHeader from '../components/profile/ProfileHeader';
import PostCard from '../components/post/PostCard';
import useAuth from '../hooks/useAuth';
import usePosts from '../hooks/usePosts';
import { getUsers } from '../utils/storage';

/**
 * Profile Page
 * Displays user profile with cover image, avatar, bio, location
 * Shows all public published posts by this user
 * Own profile shows Edit Profile button
 */
const ProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { posts } = usePosts();

  // Find user from localStorage
  const users = getUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          User Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          This user doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser.id === userId;

  // Get public, published posts by this user, newest first
  const userPosts = posts
    .filter(
      (post) =>
        post.authorId === userId &&
        post.isPublic === true &&
        post.isDraft === false
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      {/* User's posts */}
      {userPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No public posts yet
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
