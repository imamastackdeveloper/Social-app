# SocialApp — A Facebook-Inspired Social Media Platform

A fully client-side social media web app where users can sign up, create posts, like, comment, and manage their profile — built entirely with React and localStorage, no backend required.

---

## 🔗 Live Demo

**[https://your-live-demo-link.vercel.app]

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

## 🗄 localStorage Data Structure

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

