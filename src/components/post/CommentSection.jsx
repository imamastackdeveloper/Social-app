import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import AICommentSuggest from '../ai/AICommentSuggest';
import useAuth from '../../hooks/useAuth';
import usePosts from '../../hooks/usePosts';
import { formatRelativeTime } from '../../utils/helpers';
import { getUsers, getPosts } from '../../utils/storage';

const CommentSection = ({ postId }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { getPostComments, addComment, deleteComment } = usePosts();
  const [commentText, setCommentText] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const comments = getPostComments(postId);
  const users = getUsers();
  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(postId, commentText.trim());
    setCommentText('');
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h3>

      {isAuthenticated ? (
        <div className="space-y-2">
          <form onSubmit={handleSubmitComment} className="flex items-start gap-3">
            <Avatar src={currentUser?.avatar} name={currentUser?.name} size="sm" />
            <div className="flex-1">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="input-field text-sm"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={!commentText.trim()}
              variant="primary"
            >
              Post
            </Button>
          </form>
          {post?.description && (
            <AICommentSuggest
              postDescription={post.description}
              onUseSuggestion={(suggestion) => setCommentText(suggestion)}
            />
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
          <Link to="/login" className="text-primary-500 hover:underline font-medium">
            Login
          </Link>{' '}
          to comment
        </p>
      )}

      <div className="space-y-3">
        {comments.map((comment) => {
          const author = users.find((u) => u.id === comment.authorId);
          if (!author) return null;

          const isOwnComment = currentUser && currentUser.id === comment.authorId;
          const isConfirming = deleteConfirm === comment.id;

          return (
            <div
              key={comment.id}
              className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3"
            >
              <Avatar src={author.avatar} name={author.name} size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {author.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {comment.text}
                </p>
                {/* Inline delete confirmation */}
                {isOwnComment && isConfirming && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-red-600 dark:text-red-400">Delete this comment?</span>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:underline"
                    >
                      No
                    </button>
                  </div>
                )}
              </div>

              {/* Delete button */}
              {isOwnComment && !isConfirming && (
                <button
                  onClick={() => setDeleteConfirm(comment.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label="Delete comment"
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
