/*
  # Update RLS Policies for Authenticated Users

  1. Changes
    - Drop existing permissive RLS policies on user_progress table
    - Create new restrictive policies that require authentication
    - Ensure users can only access their own progress data
  
  2. Security
    - Users must be authenticated to manage their progress
    - Users can only view, insert, and update their own progress records
    - Policies now properly check auth.uid() for user identification
*/

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

-- Create restrictive policies for authenticated users only
CREATE POLICY "Authenticated users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

