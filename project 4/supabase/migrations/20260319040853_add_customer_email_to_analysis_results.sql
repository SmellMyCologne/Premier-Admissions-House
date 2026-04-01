/*
  # Add customer email to analysis_results

  1. Modified Tables
    - `analysis_results`
      - Added `customer_email` (text, nullable) - Email from Stripe checkout, stored after successful payment for follow-up

  2. Notes
    - Column is nullable because it is only populated post-payment
    - No default value; remains NULL until a payment is completed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'analysis_results' AND column_name = 'customer_email'
  ) THEN
    ALTER TABLE analysis_results ADD COLUMN customer_email text;
  END IF;
END $$;
