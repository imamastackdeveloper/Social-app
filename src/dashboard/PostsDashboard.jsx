import { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import useAuth from '../hooks/useAuth';
import usePosts from '../hooks/usePosts';
import { truncateText, formatRelativeTime } from '../utils/helpers';

/**
 * Posts Dashboard - Shows all posts (public, private, draft)
 * Includes visibility toggle, draft publish, edit, and delete
 * Uses custom modal for delete confirmation (no browser confirm)
 */
const PostsDashboard = () => {
  const { currentUser } = useAuth();
  const {
    posts,
    deletePost,
    togglePostVisibility,
    publishDraft,
    getLikeCount,
    getCommentCount,
  } = usePosts();

  const [deleteModal, setDeleteModal] = useState(null);

  // Filter posts by current user
  const myPosts = posts
    .filter((post) => post.authorId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleDelete = () => {
    if (deleteModal) {
      deletePost(deleteModal);
      setDeleteModal(null);
    }
  };

  if (myPosts.length === 0) {
    return (
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
          You haven&apos;t created any posts yet. Create your first post!
        </h3>
        <Link
          to="/dashboard/create"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Post
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Posts
        </h1>
        <Link
          to="/dashboard/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Post
        </Link>
      </div>

      {/* Posts table */}
      <div className="space-y-3">
        {myPosts.map((post) => (
          <div
            key={post.id}
            className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            {/* Post info */}
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 dark:text-white font-medium">
                {truncateText(post.description, 100) || 'No description'}
              </p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <Badge variant={post.isDraft ? 'draft' : post.isPublic ? 'public' : 'private'}>
                  {post.isDraft ? 'Draft' : post.isPublic ? 'Public' : 'Private'}
                </Badge>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {getLikeCount(post.id)}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {getCommentCount(post.id)}
                </span>
                <span>{formatRelativeTime(post.createdAt)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {post.isDraft && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => publishDraft(post.id)}
                >
                  Publish
                </Button>
              )}
              {!post.isDraft && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => togglePostVisibility(post.id)}
                >
                  {post.isPublic ? 'Make Private' : 'Make Public'}
                </Button>
              )}
              <Link
                to={`/dashboard/edit/${post.id}`}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={() => setDeleteModal(post.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                aria-label="Delete post"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Post"
      >
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete this post? This action cannot be undone.
          All comments and likes will also be removed.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteModal(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PostsDashboard;
