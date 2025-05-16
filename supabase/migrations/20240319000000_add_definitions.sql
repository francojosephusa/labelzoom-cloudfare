-- Create definitions table
CREATE TABLE IF NOT EXISTS definitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    term TEXT NOT NULL,
    definition TEXT NOT NULL,
    category TEXT NOT NULL,
    examples JSONB,
    safety_info TEXT,
    related_terms JSONB,
    source TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_definitions_term ON definitions (term);

-- Add RLS policies
ALTER TABLE definitions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
    ON definitions
    FOR SELECT
    TO public
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert"
    ON definitions
    FOR INSERT
    TO authenticated
    WITH CHECK (true); 