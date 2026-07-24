import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/Button';
import AIPostAssistant from '../ai/AIPostAssistant';
import { fileToBase64 } from '../../utils/helpers';

const PostForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const [saving, setSaving] = useState(false);
  const imageInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: initialData?.description || '',
      visibility: initialData?.isPublic !== undefined ? (initialData.isPublic ? 'public' : 'private') : 'public',
    },
  });

  const description = watch('description', '');
  const maxChars = 1000;

  // Sync initial data when it changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setValue('description', initialData.description || '');
      setValue('visibility', initialData.isPublic ? 'public' : 'private');
      setImagePreview(initialData.image || '');
    }
  }, [initialData, setValue]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setImagePreview(base64);
      } catch {
        console.error('Failed to convert image to base64');
      }
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const onFormSubmit = async (data) => {
    setSaving(true);
    try {
      await onSubmit({
        description: data.description,
        image: imagePreview,
        isPublic: data.visibility === 'public',
        isDraft: false,
      });
    } finally {
      setSaving(false);
    }
  };

  const onSaveDraft = async () => {
    setSaving(true);
    try {
      const data = watch();
      await onSubmit({
        description: data.description,
        image: imagePreview,
        isPublic: data.visibility === 'public',
        isDraft: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAIContent = (content) => {
    setValue('description', content);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* AI Writing Assistant */}
      <AIPostAssistant onUseContent={handleAIContent} />

      {/* Description field */}
      <div>
        <textarea
          {...register('description', {
            required: 'Description is required',
            minLength: {
              value: 10,
              message: 'Description must be at least 10 characters',
            },
          })}
          placeholder="What's on your mind?"
          rows={4}
          className="input-field resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
        {/* Live character counter (bonus feature) */}
        <p
          className={`mt-1 text-xs text-right ${
            description.length > maxChars
              ? 'text-red-500'
              : description.length > maxChars * 0.8
              ? 'text-yellow-500'
              : 'text-gray-400'
          }`}
        >
          {description.length}/{maxChars}
        </p>
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Image
        </label>
        <div className="flex items-center gap-3">
          <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Choose an image
            </span>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Live image preview (bonus feature) */}
      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
            aria-label="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Visibility toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Visibility
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="public"
              {...register('visibility')}
              className="w-4 h-4 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Public</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="private"
              {...register('visibility')}
              className="w-4 h-4 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Private</span>
          </label>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={saving} variant="primary">
          Publish
        </Button>
        <Button
          type="button"
          onClick={onSaveDraft}
          loading={saving}
          variant="secondary"
        >
          Save as Draft
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="ghost">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default PostForm;
