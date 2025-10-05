/*
  # Add AI for Software Engineering Course

  1. Changes
    - Insert new course: AI for Software Engineering
    - Add 4 lessons for the new course covering AI concepts for software engineers
  
  2. Course Details
    - Title: AI for Software Engineering
    - Level: Advanced
    - Duration: 10 weeks
    - Covers practical AI applications in software development
*/

-- Insert AI for Software Engineering course
INSERT INTO courses (title, description, thumbnail, duration, level) VALUES
  ('AI for Software Engineering', 'Explore how artificial intelligence transforms software development with machine learning, automation, and intelligent systems', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg', '10 weeks', 'Advanced');

-- Insert lessons for AI for Software Engineering
INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Introduction to AI in Software', 'Understand how AI is reshaping software development and engineering practices', 1
FROM courses WHERE title = 'AI for Software Engineering';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Machine Learning Basics', 'Learn fundamental ML concepts and how to integrate them into applications', 2
FROM courses WHERE title = 'AI for Software Engineering';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'AI-Powered Code Generation', 'Explore tools like GitHub Copilot and how AI assists in writing code', 3
FROM courses WHERE title = 'AI for Software Engineering';

INSERT INTO lessons (course_id, title, content, order_index)
SELECT id, 'Building Intelligent Systems', 'Design and deploy AI-powered features in production applications', 4
FROM courses WHERE title = 'AI for Software Engineering';
