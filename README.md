# SocialApp — A Facebook-Inspired Social Media Platform

A fully client-side social media web app where users can sign up, create posts, like, comment, and manage their profile — built entirely with React and localStorage, no backend required.

---

## 🔗 Live Demo

**[https://social-app-seven-green.vercel.app/]

---

## 📸 Screenshots

| Feed Page | Create Post |
|---|---|
| ![Feed Page](![alt text](image.png)) | ![Create Post](![alt text](image-1.png)) |

| Profile Page | Dashboard |
|---|---|
| ![Profile Page](![alt text](image-2.png)) | ![Dashboard](![alt text](image-3.png)) |

---

## 🛠 Tech Stack

- **React (Vite)** — frontend framework and build tool
- **React Router v6** — client-side routing, dynamic routes, protected routes
- **Tailwind CSS** — utility-first styling and responsive design
- **React Hook Form** — form handling and validation across the app
- **Context API** — global authentication state
- **localStorage** — persistent data storage (users, posts, comments, likes)
- **clsx** — conditional class name management
- **React.lazy + Suspense** — code splitting for page-level components

---

## ✨ Features

- User signup and login with form validation
- Session persistence across page refreshes
- Public feed showing all published posts
- Create, edit, and delete posts with image upload and live preview
- Save posts as drafts or publish them instantly
- Toggle posts between public and private visibility
- Like and unlike posts (logged-in users only)
- Comment on posts, with the ability to delete your own comments
- Public user profiles with avatar, bio, location, and post history
- Editable profile settings with live avatar and bio updates
- Protected dashboard routes — inaccessible without login
- Fully responsive design across mobile and desktop
- Empty states for feeds, posts, and comments

---

## 📁 Folder Structure

```
social-app/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── post/
│   │   │   ├── PostCard.jsx
│   │   │   ├── PostForm.jsx
│   │   │   ├── PostActions.jsx
│   │   │   └── CommentSection.jsx
│   │   ├── profile/
│   │   │   └── ProfileHeader.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       ├── Avatar.jsx
│   │       └── Badge.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── usePosts.js
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── FeedPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── NotFoundPage.jsx
│   │   └── dashboard/
│   │       ├── DashboardLayout.jsx
│   │       ├── PostsDashboard.jsx
│   │       ├── CreatePost.jsx
│   │       ├── EditPost.jsx
│   │       └── ProfileSettings.jsx
│   ├── utils/
│   │   ├── storage.js
│   │   └── helpers.js
│   ├── App.jsx
│   └── main.jsx
```

---

## 🗥 localStorage Data Structure

All application data is stored under five keys in `localStorage`.

**`users`** — array of registered users
```json
[
  {
    "id": "usr_1703001234_abc",
    "name": "Asad Khan",
    "email": "asad@test.com",
    "password": "Password123",
    "bio": "React developer from Lahore",
    "location": "Lahore, Pakistan",
    "avatar": "data:image/jpeg;base64,...",
    "coverImage": null,
    "joinedAt": "2025-01-15T10:00:00Z"
  }
]
```

**`posts`** — array of all posts
```json
[
  {
    "id": "post_1703001234_xyz",
    "authorId": "usr_1703001234_abc",
    "description": "Hello everyone! This is my first post.",
    "image": "data:image/jpeg;base64,...",
    "isPublic": true,
    "isDraft": false,
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  }
]
```

**`comments`** — array of all comments
```json
[
  {
    "id": "cmt_1703001234",
    "postId": "post_1703001234_xyz",
    "authorId": "usr_1703001234_abc",
    "text": "Great post!",
    "createdAt": "2025-01-15T10:05:00Z"
  }
]
```

**`likes`** — array of all likes
```json
[
  {
    "id": "like_1703001234",
    "postId": "post_1703001234_xyz",
    "userId": "usr_1703001234_abc",
    "createdAt": "2025-01-15T10:03:00Z"
  }
]
```

---

## 📚 What I Learned

Building SocialApp taught me how to structure a mid-sized React application from scratch without relying on a backend. I learned how to design a Context API layer that manages authentication state cleanly across the entire app, and how to persist that state through localStorage so sessions survive page refreshes. Working with React Hook Form across multiple pages showed me how to handle validation, error messages, and complex fields like password confirmation and file uploads in a consistent way. I also gained a much deeper understanding of React Router v6, particularly around protected routes, nested dashboard routes, and lazy loading pages with Suspense to improve performance. Beyond the technical side, this project pushed me to think in reusable components rather than one-off UI blocks, which made the codebase far easier to maintain and extend as features grew.

---

## ⚠️ Known Limitations

- All data is stored in the browser's localStorage, so it does not sync across devices or browsers.
- Clearing browser storage or cache will permanently delete all users, posts, comments, and likes.
- Passwords are stored in plain text since there is no backend to hash or secure them.
- There is no real-time updates between users — data only refreshes on page load or action.
- Image uploads are stored as base64 strings, which is not scalable for large images or many posts.
- With a real backend (Node.js, Express, MongoDB), this app would support persistent multi-user data, secure authentication with hashed passwords, real-time notifications, and proper media storage.

---

---

# 🧩 Part 2 — Friends, Real-Time Chat & AI Integration

This section extends the original SocialApp (Assignment 1) with three major feature sets: a full friend system, real-time one-to-one chat with media support, and AI-powered features using the OpenAI API.

> Built on top of Assignment 1 — all core features (auth, posts, profiles, protected routes) remain unchanged and fully functional.

---

## ✨ Assignment 2 Features

### 👥 Friend System
- Discover new people on the **People You May Know** page, sorted by relationship status
- Send, cancel, accept, and reject friend requests
- Dedicated **Friend Requests** page with Received and Sent tabs
- **Friends List** page showing all accepted friends with Message and Unfriend actions
- Profile page dynamically shows the correct relationship button (Add Friend / Request Sent / Accept & Reject / Message & Unfriend)
- Navbar notification bell showing pending friend request count

### 💬 Real-Time One-to-One Chat
- Facebook Messenger–style chat interface with a conversation sidebar and message panel
- Send text messages, images, and videos with live preview before sending
- Messages sync in real time across browser tabs using the native `storage` event — no backend or WebSocket library required
- Unread message counts, online status indicator, and auto-scroll to the latest message
- Chat is restricted to friends only — non-friends are redirected away

### 🤖 AI Integration (OpenAI — gpt-4o-mini)
- **AI Writing Assistant** — generates post descriptions from a short prompt on Create/Edit Post
- **AI Comment Suggestions** — suggests a relevant comment on any post with one click
- **AI Profile Optimisation** — rewrites your bio into a more polished, engaging version
- **AI Chat Suggestions (Mode 1)** — automatically suggests 3 quick reply chips after every incoming message
- **AI Auto-Reply (Mode 2)** — optional mode where AI replies on the user's behalf, clearly marked with a ✨ sparkle icon and an always-visible banner

---

## 🧠 How the AI Features Work

All AI features call the OpenAI Chat Completions API (`gpt-4o-mini`) through a single shared client in `lib/openai.js`. Every call uses a scoped system prompt and a `max_tokens: 300` limit to keep responses fast and cost-controlled.

| Feature | What It Sends | What It Returns |
|---|---|---|
| Post Assistant | A short user idea/prompt | A ready-to-use post description (JSON) |
| Comment Suggest | The post's description | A short, natural comment suggestion |
| Profile Optimise | Current bio, name, location | An improved bio under 150 characters |
| Chat Suggestions | Last 5 messages in the conversation | 3 short reply options (JSON) |
| Auto-Reply | Last 5 messages in the conversation | One natural reply, sent after a short delay |

Every AI action shows a loading state while waiting, lets the user review/edit the result before it's used, and fails gracefully — a failed API call never crashes the app or silently posts content on the user's behalf (except the explicitly opted-in Auto-Reply mode).

---

## ⚡ Real-Time Chat Architecture

This app has no backend, so real-time messaging is simulated using the browser's built-in `storage` event instead of WebSockets or a service like Firebase.

**How it works:**
1. When a message is sent, it's written to the `messages` key in `localStorage`.
2. Any other open tab on the same origin automatically receives a native `storage` event when that key changes.
3. Each chat component listens for this event inside a `useEffect`, and re-reads the `messages` array from `localStorage` whenever it fires.
4. The UI updates instantly — no polling, no manual refresh.
5. The listener is always removed in the `useEffect` cleanup function to avoid memory leaks and stale state.

This means two people can genuinely chat "in real time" by opening the app in two separate browser tabs (or two different browsers), each logged in as a different user.

**Conversation IDs** are generated by sorting both user IDs alphabetically before joining them (`[id1, id2].sort().join('_')`), so the same conversation ID is produced regardless of who initiates the chat.

---

## 🗄 New localStorage Keys (Assignment 2)

**`friendRequests`** — every friend request ever sent
```json
[
  {
    "id": "req_1703001234",
    "fromUserId": "usr_abc",
    "toUserId": "usr_xyz",
    "status": "pending",
    "sentAt": "2025-01-15T10:00:00Z",
    "respondedAt": null
  }
]
```

**`messages`** — every chat message across all conversations
```json
[
  {
    "id": "msg_1703001234",
    "conversationId": "usr_abc_usr_xyz",
    "senderId": "usr_abc",
    "receiverId": "usr_xyz",
    "type": "text",
    "content": "Hey, how are you?",
    "timestamp": "2025-01-15T10:05:00Z",
    "read": false,
    "aiGenerated": false
  }
]
```

**`aiSettings`** — per-user AI chat preferences
```json
{
  "usr_abc": {
    "aiChatEnabled": false,
    "aiPersonality": "friendly"
  }
}
```

---

## 📸 Additional Screenshots

| People Page | Chat with AI Reply Chips |
|---|---|
| ![People Page](![alt text](image-4.png)) | ![Chat AI Chips](![alt text](image-6.png)) |

| AI Post Generation | AI Auto-Reply Active |
|---|---|
| ![AI Post Generation](![alt text](image-7.png)) | ![AI Auto-Reply](![alt text](image-5.png)) |

---
