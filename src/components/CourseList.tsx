import { useState, useEffect } from 'react';
import { GraduationCap, LogOut } from 'lucide-react';
import { supabase, Course, UserProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import CourseCard from './CourseCard';

interface CourseListProps {
  onCourseSelect: (courseId: string) => void;
}

export default function CourseList({ onCourseSelect }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: true });

      if (coursesError) throw coursesError;

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('completed', true);

      if (progressError) throw progressError;

      setCourses(coursesData || []);
      setCompletedCourses(
        new Set(progressData?.map((p: UserProgress) => p.course_id) || [])
      );
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-end mb-4">
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-white/50 rounded-lg transition-all"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <GraduationCap size={48} className="text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-800">LearnHub</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to LearnHub
            </h2>
            <p className="text-xl text-gray-600">
              Expand your knowledge with our curated courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isCompleted={completedCourses.has(course.id)}
                onClick={() => onCourseSelect(course.id)}
              />
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No courses available yet.</p>
            </div>
          )}
        </div>
      </div>

      <footer className="py-6 bg-white/50 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-2">
            Authored by <span className="font-semibold text-gray-800">Happy Igho Umukoro</span>
          </p>
          <p className="text-gray-600 text-sm">
            <a href="mailto:princeigho74@gmail.com" className="hover:text-blue-600 transition-colors">
              princeigho74@gmail.com
            </a>
            {' • '}
            <a href="tel:+2349020779297" className="hover:text-blue-600 transition-colors">
              +234 902 077 9297
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
