-- Update existing resumes to have default values for the new columns
ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS template_name VARCHAR(255) DEFAULT 'classic';

ALTER TABLE resumes
ADD COLUMN IF NOT EXISTS public_url VARCHAR(255) DEFAULT NULL;

-- Update existing records to have values for the new columns
UPDATE resumes
SET is_public = false,
    template_name = 'classic'
WHERE is_public IS NULL OR template_name IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_resume_public ON resumes (is_public);
CREATE INDEX IF NOT EXISTS idx_resume_public_url ON resumes (public_url);
