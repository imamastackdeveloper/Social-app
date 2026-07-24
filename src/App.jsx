import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './dashboard/DashboardLayout';
import { getDarkMode } from './utils/storage';

const FeedPage = lazy(() => import('./pages/FeedPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PeoplePage = lazy(() => import('./pages/PeoplePage'));
const FriendRequestsPage = lazy(() => import('./pages/FriendRequestsPage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const PostsDashboard = lazy(() => import('./dashboard/PostsDashboard'));
const CreatePost = lazy(() => import('./dashboard/CreatePost'));
const EditPost = lazy(() => import('./dashboard/EditPost'));
const ProfileSettings = lazy(() => import('./dashboard/ProfileSettings'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

const App = () => {
  useEffect(() => {
    const isDark = getDarkMode();
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          {/* Public routes with Navbar and Footer */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <FeedPage />
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />

          {/* Auth pages - no Navbar/Footer */}
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoader />}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<PageLoader />}>
                <SignupPage />
              </Suspense>
            }
          />

          {/* Post detail with Navbar */}
          <Route
            path="/posts/:postId"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <PostDetailPage />
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />

          {/* Profile with Navbar */}
          <Route
            path="/profile/:userId"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <ProfilePage />
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />

          {/* People - Protected */}
          <Route
            path="/people"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <PeoplePage />
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />

          {/* Friend Requests - Protected */}
          <Route
            path="/requests"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <FriendRequestsPage />
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />

          {/* Friends List - Protected */}
          <Route
            path="/friends"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <FriendsPage />
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />

          {/* Chat - Protected */}
          <Route
            path="/chat"
            element={
              <Suspense fallback={<PageLoader />}>
                <ChatPage />
              </Suspense>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <Suspense fallback={<PageLoader />}>
                <ChatPage />
              </Suspense>
            }
          />

          {/* Dashboard routes - protected with sidebar */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/posts" replace />} />
            <Route
              path="posts"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PostsDashboard />
                </Suspense>
              }
            />
            <Route
              path="create"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CreatePost />
                </Suspense>
              }
            />
            <Route
              path="edit/:postId"
              element={
                <Suspense fallback={<PageLoader />}>
                  <EditPost />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<PageLoader />}>
                  <ProfileSettings />
                </Suspense>
              }
            />
          </Route>

          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <NotFoundPage />
                  </Suspense>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
