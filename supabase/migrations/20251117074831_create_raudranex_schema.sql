/*
  # Create Raudranex Space Technology Database Schema

  1. New Tables
    - `contact_inquiries` - Store contact form submissions
    - `career_applications` - Store job applications and resume data
    - `blog_posts` - Store news and update posts
    - `job_listings` - Store active job openings

  2. Security
    - Enable RLS on all tables
    - Create public read/write policies for forms
    - Create public read policies for published content

  3. Key Features
    - Timestamps for all submissions
    - Support for file attachments via storage URLs
    - Status tracking for applications and inquiries
*/

-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_listings table
CREATE TABLE IF NOT EXISTS job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  requirements text NOT NULL,
  employment_type text DEFAULT 'Full-time',
  experience_level text,
  salary_range text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create career_applications table
CREATE TABLE IF NOT EXISTS career_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES job_listings(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  resume_url text,
  cover_letter text,
  status text DEFAULT 'submitted',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  category text,
  image_url text,
  author text DEFAULT 'Raudranex Team',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Enable RLS for all tables
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Contact Inquiries - Anyone can submit
CREATE POLICY "Anyone can submit contact inquiries"
  ON contact_inquiries
  FOR INSERT
  WITH CHECK (true);

-- Job Listings - Public read active listings only
CREATE POLICY "Active job listings are publicly readable"
  ON job_listings
  FOR SELECT
  USING (is_active = true);

-- Career Applications - Anyone can submit
CREATE POLICY "Anyone can submit career applications"
  ON career_applications
  FOR INSERT
  WITH CHECK (true);

-- Blog Posts - Public read published posts only
CREATE POLICY "Published blog posts are publicly readable"
  ON blog_posts
  FOR SELECT
  USING (is_published = true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS contact_inquiries_email_idx ON contact_inquiries(email);
CREATE INDEX IF NOT EXISTS career_applications_email_idx ON career_applications(email);
CREATE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS job_listings_active_idx ON job_listings(is_active);
