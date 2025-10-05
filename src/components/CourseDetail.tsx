import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle } from 'lucide-react';
import { supabase, Course, Lesson } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
}

export default function CourseDetail({ courseId, onBack }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadCourseDetails();
  }, [courseId]);

  const loadCourseDetails = async () => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (courseError) throw courseError;

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (progressError) throw progressError;

      setCourse(courseData);
      setLessons(lessonsData || []);
      setIsCompleted(progressData?.completed || false);
    } catch (error) {
      console.error('Error loading course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    setCompleting(true);
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user?.id,
          course_id: courseId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,course_id'
        });

      if (error) throw error;

      setIsCompleted(true);
    } catch (error) {
      console.error('Error marking course complete:', error);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const progress = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Courses</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-80">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <span className="inline-block bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                {course.level}
              </span>
              <h1 className="text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-lg text-gray-200 mb-4">{course.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle size={18} />
                  <span>{lessons.length} Lessons</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Progress</h2>
                <p className="text-gray-600">Track your learning journey</p>
              </div>
              {!isCompleted ? (
                <button
                  onClick={handleMarkComplete}
                  disabled={completing}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  {completing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Mark as Completed</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-lg flex items-center gap-2">
                  <CheckCircle size={20} />
                  <span>Completed!</span>
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-medium text-gray-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Lessons</h2>
          {lessons.length > 0 ? (
            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600">{lesson.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No lessons available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
