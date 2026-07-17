import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/post/PostForm';
import useAuth from '../hooks/useAuth';
import usePosts from '../hooks/usePosts';

/**
 * Edit Post page in Dashboard
 * Loads existing post data and allows editing
 * Redirects to Dashboard Posts if user edits another person's post
 * Buttons behave exactly like Create (Publish + Save Draft)
 */
const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { posts, updatePost, refreshPosts } = usePosts();
  const [toast, setToast] = useState('');

  // Find the post
  const post = posts.find((p) => p.id === postId);

  // Redirect if editing another person's post
  useEffect(() => {
    if (post && post.authorId !== currentUser?.id) {
      navigate('/dashboard/posts');
    }
  }, [post, currentUser, navigate]);

  // Redirect if post not found
  useEffect(() => {
    if (postId && !post) {
      navigate('/dashboard/posts');
    }
  }, [postId, post, navigate]);

  if (!post) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  const handleSubmit = (data) => {
    updatePost(postId, data);
    refreshPosts();

    if (data.isDraft) {
      setToast('Post saved as draft');
      setTimeout(() => setToast(''), 3000);
    } else {
      navigate('/dashboard/posts');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Edit Post
      </h1>

      <div className="card p-6">
        {toast && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{toast}</p>
          </div>
        )}

        <PostForm
          initialData={post}
          onSubmit={handleSubmit}
          isEditing={true}
          onCancel={() => navigate('/dashboard/posts')}
        />
      </div>
    </div>
  );
};

export default EditPost;
