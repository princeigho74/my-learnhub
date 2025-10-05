import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import Login from './components/Login';
import Signup from './components/Signup';

function AppContent() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showSignup ? (
      <Signup onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onSwitchToSignup={() => setShowSignup(true)} />
    );
  }

  return (
    <>
      {selectedCourseId ? (
        <CourseDetail
          courseId={selectedCourseId}
          onBack={() => setSelectedCourseId(null)}
        />
      ) : (
        <CourseList onCourseSelect={setSelectedCourseId} />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
