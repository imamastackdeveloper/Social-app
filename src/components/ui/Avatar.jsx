import { clsx } from 'clsx';
import { getInitials } from '../../utils/helpers';

/**
 * Reusable Avatar component
 * Displays user image or falls back to initials
 * Supports multiple sizes
 */
const Avatar = ({
  src,
  alt = 'User avatar',
  name = '',
  size = 'md',
  className = '',
  onClick,
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-32 h-32 text-4xl',
  };

  const initials = getInitials(name);

  // Generate a consistent color based on the name
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-red-500',
  ];

  const colorIndex = name
    ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    : 0;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={clsx(
          'rounded-full object-cover flex-shrink-0',
          sizes[size],
          onClick && 'cursor-pointer',
          className
        )}
        onClick={onClick}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0',
        sizes[size],
        colors[colorIndex],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
