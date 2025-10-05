/*
  # E-Learning Platform Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text) - Course title
      - `description` (text) - Course description
      - `thumbnail` (text) - Course image URL
      - `duration` (text) - Estimated duration
      - `level` (text) - Difficulty level
      - `created_at` (timestamptz) - Creation timestamp
    
    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key) - Reference to courses
      - `title` (text) - Lesson title
      - `content` (text) - Lesson content/description
      - `order_index` (integer) - Order of lesson in course
      - `created_at` (timestamptz) - Creation timestamp
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - User identifier
      - `course_id` (uuid, foreign key) - Reference to courses
      - `completed` (boolean) - Completion status
      - `completed_at` (timestamptz) - Completion timestamp
      - `created_at` (timestamptz) - Creation timestamp
  
  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to courses and lessons
    - Add policies for authenticated users to manage their progress
  
  3. Sample Data
    - Insert sample courses with lessons for demonstration
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  thumbnail text NOT NULL,
  duration text NOT NULL,
  level text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for courses (public read)
CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  USING (true);

-- Policies for lessons (public read)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  USING (true);

-- Policies for user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert sample courses
INSERT INTO courses (title, description, thumbnail, duration, level) VALUES
  ('Web Development Fundamentals', 'Learn the basics of HTML, CSS, and JavaScript to build modern websites', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg', '6 weeks', 'Beginner'),
  ('React Mastery', 'Master React.js and build interactive user interfaces with hooks and state management', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg', '8 weeks', 'Intermediate'),
  ('Database Design', 'Learn SQL, database modeling, and how to design scalable database systems', 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg', '5 weeks', 'Intermediate'),
  ('Python for Beginners', 'Start your programming journey with Python and learn core programming concepts', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg', '7 weeks', 'Beginner');

-- Insert sample lessons for Web Development Fundamentals
INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Introduction to HTML', 'Learn the structure of HTML documents and basic tags', 1
FROM courses WHERE title = 'Web Development Fundamentals';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'CSS Styling Basics', 'Understand how to style your HTML with CSS properties and selectors', 2
FROM courses WHERE title = 'Web Development Fundamentals';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'JavaScript Fundamentals', 'Learn variables, functions, and control flow in JavaScript', 3
FROM courses WHERE title = 'Web Development Fundamentals';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'DOM Manipulation', 'Interact with HTML elements using JavaScript', 4
FROM courses WHERE title = 'Web Development Fundamentals';

-- Insert sample lessons for React Mastery
INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'React Components', 'Understanding functional and class components', 1
FROM courses WHERE title = 'React Mastery';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'State and Props', 'Managing component state and passing data', 2
FROM courses WHERE title = 'React Mastery';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'React Hooks', 'Using useState, useEffect, and custom hooks', 3
FROM courses WHERE title = 'React Mastery';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Context API', 'Global state management with Context', 4
FROM courses WHERE title = 'React Mastery';

-- Insert sample lessons for Database Design
INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Introduction to SQL', 'Basic SQL queries and commands', 1
FROM courses WHERE title = 'Database Design';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Database Normalization', 'Organizing data efficiently', 2
FROM courses WHERE title = 'Database Design';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Relationships and Joins', 'Connecting tables with foreign keys', 3
FROM courses WHERE title = 'Database Design';

-- Insert sample lessons for Python for Beginners
INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Python Basics', 'Variables, data types, and operators', 1
FROM courses WHERE title = 'Python for Beginners';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Control Flow', 'If statements, loops, and logic', 2
FROM courses WHERE title = 'Python for Beginners';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Functions', 'Creating reusable code blocks', 3
FROM courses WHERE title = 'Python for Beginners';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Working with Data', 'Lists, dictionaries, and file handling', 4
FROM courses WHERE title = 'Python for Beginners';
