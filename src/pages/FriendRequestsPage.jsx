import { useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useFriends from '../hooks/useFriends';
import FriendRequestCard from '../components/friends/FriendRequestCard';
import { getUsers } from '../utils/storage';
import { clsx } from 'clsx';

const FriendRequestsPage = () => {
  const { currentUser } = useAuth();
  const { friendRequests, acceptRequest, rejectRequest, cancelRequest } = useFriends();
  const [activeTab, setActiveTab] = useState('received');

  const users = getUsers();

  const receivedRequests = useMemo(() => {
    if (!currentUser) return [];
    return friendRequests
      .filter((r) => r.toUserId === currentUser.id && r.status === 'pending')
      .map((r) => ({
        ...r,
        user: users.find((u) => u.id === r.fromUserId),
      }))
      .filter((r) => r.user);
  }, [friendRequests, currentUser, users]);

  const sentRequests = useMemo(() => {
    if (!currentUser) return [];
    return friendRequests
      .filter((r) => r.fromUserId === currentUser.id && r.status === 'pending')
      .map((r) => ({
        ...r,
        user: users.find((u) => u.id === r.toUserId),
      }))
      .filter((r) => r.user);
  }, [friendRequests, currentUser, users]);

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Friend Requests</h1>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('received')}
          className={clsx(
            'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'received'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          Received {receivedRequests.length > 0 && `(${receivedRequests.length})`}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={clsx(
            'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors',
            activeTab === 'sent'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          )}
        >
          Sent {sentRequests.length > 0 && `(${sentRequests.length})`}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'received' ? (
        receivedRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No received requests</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">When someone sends you a friend request, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {receivedRequests.map((r) => (
              <FriendRequestCard
                key={r.id}
                user={r.user}
                type="received"
                onAccept={acceptRequest}
                onReject={rejectRequest}
              />
            ))}
          </div>
        )
      ) : sentRequests.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No sent requests</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Friend requests you send will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sentRequests.map((r) => (
            <FriendRequestCard
              key={r.id}
              user={r.user}
              type="sent"
              onCancelRequest={cancelRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequestsPage;
