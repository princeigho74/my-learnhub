import { BookOpen } from 'lucide-react';
import { Course } from '../lib/supabase';

interface CourseCardProps {
  course: Course;
  isCompleted: boolean;
  onClick: () => void;
}

export default function CourseCard({ course, isCompleted, onClick }: CourseCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Completed
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
            {course.level}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <BookOpen size={16} />
            <span>{course.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
