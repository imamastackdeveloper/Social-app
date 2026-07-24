import { getPendingReceivedCount } from '../../utils/friendHelpers';
import useAuth from '../../hooks/useAuth';

const RequestBadge = ({ className = '' }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const count = getPendingReceivedCount(currentUser.id);
  if (count === 0) return null;

  return (
    <span
      className={`absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full ${className}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
};

export default RequestBadge;
