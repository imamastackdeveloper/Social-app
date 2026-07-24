import { getFriendRequests, getUsers } from './storage';

export const areFriends = (userId1, userId2) => {
  const requests = getFriendRequests();
  return requests.some(
    (r) =>
      r.status === 'accepted' &&
      ((r.fromUserId === userId1 && r.toUserId === userId2) ||
        (r.fromUserId === userId2 && r.toUserId === userId1))
  );
};

export const getFriendsOf = (userId) => {
  const requests = getFriendRequests();
  const users = getUsers();
  const friendIds = requests
    .filter(
      (r) =>
        r.status === 'accepted' &&
        (r.fromUserId === userId || r.toUserId === userId)
    )
    .map((r) => (r.fromUserId === userId ? r.toUserId : r.fromUserId));
  return users.filter((u) => friendIds.includes(u.id));
};

export const getFriendRequestStatus = (currentUserId, otherUserId) => {
  const requests = getFriendRequests();

  const outgoing = requests.find(
    (r) =>
      r.fromUserId === currentUserId &&
      r.toUserId === otherUserId &&
      r.status === 'pending'
  );
  if (outgoing) return 'request_sent';

  const incoming = requests.find(
    (r) =>
      r.fromUserId === otherUserId &&
      r.toUserId === currentUserId &&
      r.status === 'pending'
  );
  if (incoming) return 'request_received';

  const accepted = requests.find(
    (r) =>
      r.status === 'accepted' &&
      ((r.fromUserId === currentUserId && r.toUserId === otherUserId) ||
        (r.fromUserId === otherUserId && r.toUserId === currentUserId))
  );
  if (accepted) return 'friends';

  return 'none';
};

export const getPendingReceivedCount = (userId) => {
  const requests = getFriendRequests();
  return requests.filter(
    (r) => r.toUserId === userId && r.status === 'pending'
  ).length;
};

export const getMutualFriendsCount = (userId1, userId2) => {
  const friends1 = getFriendsOf(userId1).map((f) => f.id);
  const friends2 = getFriendsOf(userId2).map((f) => f.id);
  return friends1.filter((id) => friends2.includes(id)).length;
};
