INSERT INTO products (id, sku, name, slug, description, short_description, price, compare_at_price, status, category, brand, is_featured, created_at, updated_at, version)
VALUES 
  (gen_random_uuid(), 'AYUR-002', 'Diabetes Care Supplement', 'diabetes-care-supplement', 
   'Ayurvedic herbal formula with karela, jamun, and gudmar to support healthy blood sugar levels naturally.', 
   'Natural blood sugar support supplement', 
   '599', '749', 'ACTIVE', 'Supplements', 'Himalaya', true, NOW(), NOW(), '0'),
   
  (gen_random_uuid(), 'AYUR-003', 'Liver Oil Extract', 'liver-oil-extract', 
   'Premium liver oil extract with hepatoprotective herbs for liver health and detoxification.', 
   'Liver health and detox support', 
   '799', '999', 'ACTIVE', 'Supplements', 'Himalaya', true, NOW(), NOW(), '0'),
   
  (gen_random_uuid(), 'AYUR-004', 'Ayurvedic Hair Oil', 'ayurvedic-hair-oil', 
   'Premium Ayurvedic hair oil with bhringraj, amla, and hibiscus for thick, lustrous hair growth.', 
   'Natural hair growth oil', 
   '649', '799', 'ACTIVE', 'Hair Care', 'Himalaya', true, NOW(), NOW(), '0'),
   
  (gen_random_uuid(), 'AYUR-005', 'Active Protein Powder', 'active-protein-powder', 
   'Herbal protein blend with ashwagandha, shatavari, and moringa for muscle strength and vitality.', 
   'Herbal protein supplement', 
   '899', '1099', 'ACTIVE', 'Supplements', 'Himalaya', true, NOW(), NOW(), '0')
ON CONFLICT (slug) DO NOTHING;
