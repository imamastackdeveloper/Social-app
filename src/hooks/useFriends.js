import { useState, useCallback, useEffect } from 'react';
import { getFriendRequests, setFriendRequests, generateId } from '../utils/storage';
import useAuth from './useAuth';

const useFriends = () => {
  const { currentUser } = useAuth();
  const [friendRequests, setFriendRequestsState] = useState(() => getFriendRequests());

  const refresh = useCallback(() => {
    setFriendRequestsState(getFriendRequests());
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'friendRequests') {
        refresh();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refresh]);

  const sendRequest = useCallback(
    (toUserId) => {
      if (!currentUser) return;
      const newRequest = {
        id: generateId('req'),
        fromUserId: currentUser.id,
        toUserId,
        status: 'pending',
        sentAt: new Date().toISOString(),
        respondedAt: null,
      };
      const updated = [...getFriendRequests(), newRequest];
      setFriendRequests(updated);
      setFriendRequestsState(updated);
    },
    [currentUser]
  );

  const cancelRequest = useCallback(
    (toUserId) => {
      if (!currentUser) return;
      const updated = getFriendRequests().filter(
        (r) => !(r.fromUserId === currentUser.id && r.toUserId === toUserId && r.status === 'pending')
      );
      setFriendRequests(updated);
      setFriendRequestsState(updated);
    },
    [currentUser]
  );

  const acceptRequest = useCallback(
    (fromUserId) => {
      if (!currentUser) return;
      const updated = getFriendRequests().map((r) => {
        if (r.fromUserId === fromUserId && r.toUserId === currentUser.id && r.status === 'pending') {
          return { ...r, status: 'accepted', respondedAt: new Date().toISOString() };
        }
        return r;
      });
      setFriendRequests(updated);
      setFriendRequestsState(updated);
    },
    [currentUser]
  );

  const rejectRequest = useCallback(
    (fromUserId) => {
      if (!currentUser) return;
      const updated = getFriendRequests().map((r) => {
        if (r.fromUserId === fromUserId && r.toUserId === currentUser.id && r.status === 'pending') {
          return { ...r, status: 'rejected', respondedAt: new Date().toISOString() };
        }
        return r;
      });
      setFriendRequests(updated);
      setFriendRequestsState(updated);
    },
    [currentUser]
  );

  const unfriend = useCallback(
    (otherUserId) => {
      if (!currentUser) return;
      const updated = getFriendRequests().filter(
        (r) =>
          !(
            r.status === 'accepted' &&
            ((r.fromUserId === currentUser.id && r.toUserId === otherUserId) ||
              (r.fromUserId === otherUserId && r.toUserId === currentUser.id))
          )
      );
      setFriendRequests(updated);
      setFriendRequestsState(updated);
    },
    [currentUser]
  );

  return {
    friendRequests,
    refresh,
    sendRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    unfriend,
  };
};

export default useFriends;
