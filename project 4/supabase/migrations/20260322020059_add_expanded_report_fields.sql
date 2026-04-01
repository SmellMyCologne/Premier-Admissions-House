/*
  # Add expanded report fields for premium analysis

  1. Modified Tables
    - `analysis_results`
      - `executive_read` (text) - Senior admissions officer executive summary
      - `core_strengths` (jsonb) - Array of identified strengths with specific detail
      - `critical_liabilities` (jsonb) - Array of candid liabilities/risks
      - `ranked_improvements` (jsonb) - Prioritized improvement actions
      - `essay_angles` (jsonb) - Array of essay angle objects with title and description
      - `action_plan` (jsonb) - 90-day structured action plan with timeframes
      - `final_advisory` (text) - Senior advisor closing summary

  2. Notes
    - All new columns are nullable to maintain backward compatibility with existing rows
    - Existing rows will have NULL values for these fields until regenerated
    - No destructive changes to existing columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analysis_results' AND column_name = 'executive_read'
  ) THEN
    ALTER TABLE analysis_results ADD COLUMN executive_read text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analysis_results' AND column_name = 'core_strengths'
  ) THEN
    ALTER TABLE analysis_results ADD COLUMN core_strengths jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analysis_results' AND column_name = 'critical_liabilities'
  ) THEN
    ALTER TABLE analysis_results ADD COLUMN critical_liabilities jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analysis_results' AND column_name = 'ranked_improvements'
  ) THEN
    ALTER TABLE analysis_results ADD COLUMN ranked_improvements jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analysis_results' AND column_name = 'essay_angles'
  ) THEN
    ALTER TABLE analysis_results ADD COLUMN essay_angles jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analysis_results' AND column_name = 'action_plan'
  ) THEN
    ALTER TABLE analysis_results ADD COLUMN action_plan jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analysis_results' AND column_name = 'final_advisory'
  ) THEN
    ALTER TABLE analysis_results ADD COLUMN final_advisory text;
  END IF;
END $$;