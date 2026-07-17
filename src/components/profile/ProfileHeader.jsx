import { useNavigate } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatJoinedDate } from '../../utils/helpers';

/**
 * ProfileHeader component for displaying user profile information
 * Shows cover image, avatar, name, bio, location, and joined date
 * Includes Edit Profile button when viewing own profile
 */
const ProfileHeader = ({ user, isOwnProfile = false }) => {
  const navigate = useNavigate();

  return (
    <div className="card overflow-hidden">
      {/* Cover image */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-primary-500 to-primary-700">
        {user?.coverImage && (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile info */}
      <div className="px-4 sm:px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12 sm:-mt-16">
          <Avatar
            src={user?.avatar}
            name={user?.name}
            size="2xl"
            className="border-4 border-white dark:border-gray-800 shadow-lg"
          />
          <div className="flex-1 text-center sm:text-left pb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h1>
            {user?.bio && (
              <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-lg">
                {user.bio}
              </p>
            )}
          </div>
          {isOwnProfile && (
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard/settings')}
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* User details */}
        <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
          {user?.location && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{user.location}</span>
            </div>
          )}
          {user?.joinedAt && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Joined {formatJoinedDate(user.joinedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
