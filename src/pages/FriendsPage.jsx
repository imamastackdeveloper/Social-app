import { useMemo } from 'react';
import useAuth from '../hooks/useAuth';
import useFriends from '../hooks/useFriends';
import FriendCard from '../components/friends/FriendCard';
import { getFriendsOf } from '../utils/friendHelpers';

const FriendsPage = () => {
  const { currentUser } = useAuth();
  const { unfriend } = useFriends();

  const friends = useMemo(() => {
    if (!currentUser) return [];
    return getFriendsOf(currentUser.id);
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Friends</h1>
      {friends.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No friends yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Go to People to connect with others.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} onUnfriend={unfriend} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
