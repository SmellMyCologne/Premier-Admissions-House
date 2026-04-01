/*
  # Create analysis_results table

  1. New Tables
    - `analysis_results`
      - `id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `strength_score` (integer) - Overall admissions strength 0-100
      - `positioning` (text) - Positioning summary text
      - `weaknesses` (jsonb) - Array of weakness strings
      - `improvements` (jsonb) - Array of improvement strings
      - `essay_angle` (text) - Essay narrative direction
      - `school_tiers` (jsonb) - Array of school tier objects
      - `profile_summary` (text) - Brief profile summary
      - `is_unlocked` (boolean) - Whether report has been purchased
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `analysis_results` table
    - Add policy for anonymous insert (assessment submissions)
    - Add policy for anonymous select by assessment_id
*/

CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  strength_score integer NOT NULL DEFAULT 0,
  positioning text NOT NULL DEFAULT '',
  weaknesses jsonb NOT NULL DEFAULT '[]'::jsonb,
  improvements jsonb NOT NULL DEFAULT '[]'::jsonb,
  essay_angle text NOT NULL DEFAULT '',
  school_tiers jsonb NOT NULL DEFAULT '[]'::jsonb,
  profile_summary text NOT NULL DEFAULT '',
  is_unlocked boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for analysis results"
  ON analysis_results
  FOR INSERT
  TO anon
  WITH CHECK (
    assessment_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM assessments WHERE assessments.id = analysis_results.assessment_id
    )
  );

CREATE POLICY "Allow public select for analysis results by assessment"
  ON analysis_results
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM assessments WHERE assessments.id = analysis_results.assessment_id
    )
  );

CREATE POLICY "Service role full access to analysis results"
  ON analysis_results
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);