import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/post/PostForm';
import usePosts from '../hooks/usePosts';

/**
 * Create Post page in Dashboard
 * Uses PostForm for description, image upload, visibility
 * Supports saving as draft or publishing
 * Shows toast messages for actions
 */
const CreatePost = () => {
  const { createPost } = usePosts();
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [formKey, setFormKey] = useState(0);

  const handleSubmit = (data) => {
    createPost(data);

    if (data.isDraft) {
      setToast('Post saved as draft');
      setFormKey((prev) => prev + 1);
      setTimeout(() => setToast(''), 3000);
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Create Post
      </h1>

      <div className="card p-6">
        {toast && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">{toast}</p>
          </div>
        )}

        <PostForm key={formKey} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreatePost;
