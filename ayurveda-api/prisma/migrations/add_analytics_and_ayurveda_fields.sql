-- Migration: Add Analytics and Ayurveda Fields
-- Created: 2025-11-17
-- Description: Adds analytics tables, Ayurveda-specific product fields, and fixes product_images table

-- =============================================
-- 1. Add Ayurveda and subcategory fields to products table
-- =============================================
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS subcategory VARCHAR(200),
  ADD COLUMN IF NOT EXISTS ingredients TEXT,
  ADD COLUMN IF NOT EXISTS benefits TEXT,
  ADD COLUMN IF NOT EXISTS dosha_vata BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS dosha_pitta BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS dosha_kapha BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS usage_instructions TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- Add index for category
CREATE INDEX IF NOT EXISTS idx_product_category ON products(category);

-- =============================================
-- 2. Fix product_images table - add proper ID and fields
-- =============================================
-- Since product_images might have data, we need to carefully migrate it
-- First, check if the table exists
DO $$
BEGIN
  -- Add id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'product_images' AND column_name = 'id'
  ) THEN
    ALTER TABLE product_images
      ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      ADD COLUMN is_primary BOOLEAN DEFAULT false,
      ADD COLUMN created_at TIMESTAMP(6) DEFAULT NOW(),
      ADD COLUMN updated_at TIMESTAMP(6) DEFAULT NOW();

    -- Update url to be NOT NULL if it isn't already
    ALTER TABLE product_images ALTER COLUMN url SET NOT NULL;

    -- Add index
    CREATE INDEX IF NOT EXISTS idx_product_image_product ON product_images(product_id);
  END IF;
END $$;

-- =============================================
-- 3. Create Analytics Tables
-- =============================================

-- User Location Logs Table
CREATE TABLE IF NOT EXISTS user_location_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id VARCHAR(255),
  ip_hash VARCHAR(255),
  country VARCHAR(100),
  region VARCHAR(100),
  city VARCHAR(100),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  timezone VARCHAR(100),
  accuracy VARCHAR(50),
  created_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_location_user ON user_location_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_location_session ON user_location_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_location_country ON user_location_logs(country);
CREATE INDEX IF NOT EXISTS idx_location_created ON user_location_logs(created_at);

-- User Device Logs Table
CREATE TABLE IF NOT EXISTS user_device_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id VARCHAR(255),
  device_type VARCHAR(50),
  os VARCHAR(100),
  browser VARCHAR(100),
  browser_version VARCHAR(50),
  device_ram VARCHAR(50),
  cpu_cores INTEGER,
  network_type VARCHAR(50),
  is_online BOOLEAN DEFAULT true,
  screen_width INTEGER,
  screen_height INTEGER,
  color_scheme VARCHAR(20),
  has_touch BOOLEAN DEFAULT false,
  user_agent VARCHAR(1000),
  created_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_device_user ON user_device_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_device_session ON user_device_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_device_type ON user_device_logs(device_type);
CREATE INDEX IF NOT EXISTS idx_device_created ON user_device_logs(created_at);

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id VARCHAR(255),
  event_type VARCHAR(100) NOT NULL,
  event_data TEXT,
  location_id UUID,
  device_id UUID,
  page_url VARCHAR(1000),
  referrer VARCHAR(1000),
  created_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- Image Uploads Table
CREATE TABLE IF NOT EXISTS image_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(500) NOT NULL,
  original_name VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INTEGER NOT NULL,
  s3_key VARCHAR(1000) NOT NULL,
  s3_bucket VARCHAR(255) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  thumbnail_url VARCHAR(1000),
  width INTEGER,
  height INTEGER,
  uploaded_by UUID,
  created_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_upload_user ON image_uploads(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_upload_created ON image_uploads(created_at);

-- =============================================
-- 4. Add comments for documentation
-- =============================================
COMMENT ON TABLE user_location_logs IS 'Stores user location data for analytics (GDPR-compliant with hashed IPs)';
COMMENT ON TABLE user_device_logs IS 'Stores user device and browser information for analytics';
COMMENT ON TABLE analytics_events IS 'Stores user interaction events for analytics';
COMMENT ON TABLE image_uploads IS 'Stores metadata for uploaded images (S3/Cloudinary)';
