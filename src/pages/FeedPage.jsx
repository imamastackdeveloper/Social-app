import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/post/PostCard';
import usePosts from '../hooks/usePosts';
import useAuth from '../hooks/useAuth';
import { searchPosts } from '../utils/helpers';

/**
 * Feed Page - Main timeline showing public, published posts
 * Newest first, supports search filtering (bonus feature)
 * Shows empty state when no posts exist
 */
const FeedPage = () => {
  const { posts, getLikeCount, getCommentCount } = usePosts();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Filter posts: public AND not draft, then apply search, then sort newest first
  const filteredPosts = useMemo(() => {
    let visiblePosts = posts.filter(
      (post) => post.isPublic === true && post.isDraft === false
    );

    // Apply search filter (bonus feature)
    if (searchQuery) {
      visiblePosts = searchPosts(visiblePosts, searchQuery);
    }

    // Sort by newest first
    visiblePosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return visiblePosts;
  }, [posts, searchQuery]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Search results header */}
      {searchQuery && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Search results for &quot;{searchQuery}&quot;
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Posts feed */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
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
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchQuery
              ? 'No posts match your search'
              : 'No posts yet — be the first to share!'}
          </h3>
          {!searchQuery && !isAuthenticated && (
            <p className="text-gray-500 dark:text-gray-400">
              Log in to start posting and connecting with others.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
