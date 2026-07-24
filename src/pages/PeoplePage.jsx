import { useMemo } from 'react';
import useAuth from '../hooks/useAuth';
import useFriends from '../hooks/useFriends';
import FriendRequestCard from '../components/friends/FriendRequestCard';
import { getUsers } from '../utils/storage';
import { getFriendRequestStatus } from '../utils/friendHelpers';

const PeoplePage = () => {
  const { currentUser } = useAuth();
  const { sendRequest, cancelRequest, acceptRequest, rejectRequest } = useFriends();

  const people = useMemo(() => {
    if (!currentUser) return [];
    const users = getUsers();
    const others = users.filter((u) => u.id !== currentUser.id);

    const suggested = [];
    const incomingFirst = [];

    others.forEach((user) => {
      const status = getFriendRequestStatus(currentUser.id, user.id);
      if (status === 'none') {
        suggested.push({ user, order: 2 });
      } else if (status === 'request_received') {
        incomingFirst.push({ user, order: 1 });
      } else if (status === 'request_sent') {
        suggested.push({ user, order: 3 });
      }
    });

    return [...incomingFirst, ...suggested]
      .sort((a, b) => a.order - b.order)
      .map((item) => item.user);
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">People You May Know</h1>
      {people.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No people to show</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Check back later for new suggestions.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {people.map((user) => {
            const status = getFriendRequestStatus(currentUser.id, user.id);
            return (
              <FriendRequestCard
                key={user.id}
                user={user}
                type={status === 'request_received' ? 'received' : status}
                onSendRequest={sendRequest}
                onCancelRequest={cancelRequest}
                onAccept={acceptRequest}
                onReject={rejectRequest}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
