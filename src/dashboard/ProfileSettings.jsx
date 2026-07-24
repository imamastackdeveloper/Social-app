import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import AIProfileOptimize from '../components/ai/AIProfileOptimize';
import { fileToBase64 } from '../utils/helpers';

/**
 * Profile Settings page
 * Edit name, bio, location, avatar with live preview
 * Bio max 150 characters with live character counter
 * Updates both currentUser and users array immediately
 */
const ProfileSettings = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '');
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
      bio: currentUser?.bio || '',
      location: currentUser?.location || '',
    },
  });

  const bio = watch('bio', '');
  const maxBioLength = 150;

  // Sync initial data
  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.name || '');
      setValue('bio', currentUser.bio || '');
      setValue('location', currentUser.location || '');
      setAvatarPreview(currentUser.avatar || '');
    }
  }, [currentUser, setValue]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setAvatarPreview(base64);
      } catch {
        console.error('Failed to convert avatar to base64');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    setSuccessMessage('');

    const result = updateCurrentUser({
      name: data.name,
      bio: data.bio,
      location: data.location,
      avatar: avatarPreview,
    });

    setSaving(false);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Profile Settings
      </h1>

      <div className="card p-6">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">
              {successMessage}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <Avatar
                src={avatarPreview}
                name={currentUser?.name}
                size="xl"
              />
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Change Photo
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <Input
            label="Name"
            placeholder="Enter your name"
            error={errors.name?.message}
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              {...register('bio')}
              placeholder="Tell us about yourself"
              rows={3}
              maxLength={maxBioLength}
              className="input-field resize-none"
            />
            {/* Live character counter */}
            <p
              className={`mt-1 text-xs text-right ${
                bio.length > maxBioLength
                  ? 'text-red-500'
                  : bio.length > maxBioLength * 0.8
                  ? 'text-yellow-500'
                  : 'text-gray-400'
              }`}
            >
              {bio.length}/{maxBioLength}
            </p>

            {/* AI Profile Optimizer */}
            <div className="mt-3">
              <AIProfileOptimize
                bio={bio}
                name={watch('name', '')}
                location={watch('location', '')}
                onUseSuggestion={(suggestion) => setValue('bio', suggestion)}
              />
            </div>
          </div>

          {/* Location */}
          <Input
            label="Location"
            placeholder="Where are you from?"
            {...register('location')}
          />

          {/* Save button */}
          <div className="pt-2">
            <Button type="submit" loading={saving} variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
