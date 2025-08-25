-- Seed Filipino foods with local nutrition data
INSERT INTO filipino_foods (name, name_filipino, category, serving_size, calories, protein, carbs, fats, fiber, sodium, regions, season, estimated_cost, cooking_methods, meal_types) VALUES

-- Rice and Grains
('White Rice', 'Bigas na Puti', 'carbs', '1 cup cooked', 205, 4.3, 45, 0.4, 0.6, 2, ARRAY['nationwide'], 'year-round', 15.00, ARRAY['steamed', 'boiled'], ARRAY['breakfast', 'lunch', 'dinner']),
('Brown Rice', 'Brown Rice', 'carbs', '1 cup cooked', 216, 5, 45, 1.8, 3.5, 10, ARRAY['nationwide'], 'year-round', 25.00, ARRAY['steamed', 'boiled'], ARRAY['breakfast', 'lunch', 'dinner']),
('Sinangag', 'Sinangag', 'carbs', '1 cup', 280, 6, 50, 6, 1, 400, ARRAY['nationwide'], 'year-round', 20.00, ARRAY['fried'], ARRAY['breakfast']),

-- Proteins - Meat
('Chicken Breast', 'Dibdib ng Manok', 'protein', '100g', 165, 31, 0, 3.6, 0, 74, ARRAY['nationwide'], 'year-round', 180.00, ARRAY['grilled', 'fried', 'boiled', 'adobo'], ARRAY['lunch', 'dinner']),
('Chicken Thigh', 'Hita ng Manok', 'protein', '100g', 209, 26, 0, 11, 0, 84, ARRAY['nationwide'], 'year-round', 150.00, ARRAY['grilled', 'fried', 'adobo', 'tinola'], ARRAY['lunch', 'dinner']),
('Pork Belly', 'Liempo', 'protein', '100g', 518, 9, 0, 53, 0, 37, ARRAY['nationwide'], 'year-round', 280.00, ARRAY['grilled', 'fried', 'adobo'], ARRAY['lunch', 'dinner']),
('Pork Shoulder', 'Kasim', 'protein', '100g', 297, 20, 0, 24, 0, 62, ARRAY['nationwide'], 'year-round', 220.00, ARRAY['adobo', 'stewed', 'roasted'], ARRAY['lunch', 'dinner']),
('Beef', 'Karne ng Baka', 'protein', '100g', 250, 26, 0, 15, 0, 72, ARRAY['nationwide'], 'year-round', 450.00, ARRAY['grilled', 'stewed', 'kaldereta'], ARRAY['lunch', 'dinner']),

-- Proteins - Seafood
('Bangus', 'Bangus', 'protein', '100g', 150, 20, 0, 7, 0, 78, ARRAY['nationwide'], 'year-round', 180.00, ARRAY['grilled', 'fried', 'steamed'], ARRAY['breakfast', 'lunch', 'dinner']),
('Tilapia', 'Tilapia', 'protein', '100g', 128, 26, 0, 2.7, 0, 52, ARRAY['nationwide'], 'year-round', 120.00, ARRAY['grilled', 'fried', 'steamed'], ARRAY['lunch', 'dinner']),
('Galunggong', 'Galunggong', 'protein', '100g', 88, 20, 0, 1, 0, 104, ARRAY['nationwide'], 'year-round', 80.00, ARRAY['fried', 'grilled'], ARRAY['breakfast', 'lunch', 'dinner']),
('Pusit', 'Pusit', 'protein', '100g', 92, 15.6, 3.1, 1.4, 0, 44, ARRAY['coastal'], 'year-round', 200.00, ARRAY['grilled', 'adobo', 'fried'], ARRAY['lunch', 'dinner']),
('Hipon', 'Hipon', 'protein', '100g', 99, 18, 0.9, 1.7, 0, 111, ARRAY['coastal'], 'year-round', 350.00, ARRAY['boiled', 'grilled', 'tempura'], ARRAY['lunch', 'dinner']),

-- Proteins - Others
('Itlog', 'Itlog', 'protein', '1 large egg', 70, 6, 0.6, 5, 0, 70, ARRAY['nationwide'], 'year-round', 8.00, ARRAY['boiled', 'fried', 'scrambled'], ARRAY['breakfast', 'lunch', 'dinner']),
('Tokwa', 'Tokwa', 'protein', '100g', 76, 8, 1.9, 4.8, 0.4, 7, ARRAY['nationwide'], 'year-round', 25.00, ARRAY['fried', 'steamed', 'adobo'], ARRAY['lunch', 'dinner']),

-- Vegetables
('Kangkong', 'Kangkong', 'vegetables', '1 cup chopped', 11, 2.6, 1.8, 0.1, 2.1, 113, ARRAY['nationwide'], 'year-round', 15.00, ARRAY['sauteed', 'boiled'], ARRAY['lunch', 'dinner']),
('Malunggay', 'Malunggay', 'vegetables', '1 cup leaves', 13, 2, 1.7, 0.2, 0.9, 9, ARRAY['nationwide'], 'year-round', 10.00, ARRAY['boiled', 'soup'], ARRAY['lunch', 'dinner']),
('Sitaw', 'Sitaw', 'vegetables', '1 cup', 34, 2, 8, 0.1, 3.6, 7, ARRAY['nationwide'], 'year-round', 20.00, ARRAY['sauteed', 'boiled'], ARRAY['lunch', 'dinner']),
('Talong', 'Talong', 'vegetables', '1 medium', 20, 0.8, 4.8, 0.2, 2.5, 1, ARRAY['nationwide'], 'year-round', 12.00, ARRAY['grilled', 'fried', 'torta'], ARRAY['lunch', 'dinner']),
('Ampalaya', 'Ampalaya', 'vegetables', '1 cup sliced', 16, 1, 3.4, 0.2, 2.6, 6, ARRAY['nationwide'], 'year-round', 25.00, ARRAY['sauteed', 'soup'], ARRAY['lunch', 'dinner']),
('Okra', 'Okra', 'vegetables', '1 cup sliced', 33, 1.9, 7.5, 0.2, 3.2, 8, ARRAY['nationwide'], 'year-round', 18.00, ARRAY['sauteed', 'soup'], ARRAY['lunch', 'dinner']),
('Pechay', 'Pechay', 'vegetables', '1 cup chopped', 9, 1.1, 1.5, 0.2, 0.7, 46, ARRAY['nationwide'], 'year-round', 12.00, ARRAY['sauteed', 'soup'], ARRAY['lunch', 'dinner']),
('Cabbage', 'Repolyo', 'vegetables', '1 cup chopped', 22, 1.1, 5.2, 0.1, 2.2, 16, ARRAY['nationwide'], 'year-round', 15.00, ARRAY['sauteed', 'soup'], ARRAY['lunch', 'dinner']),

-- Fruits
('Saging', 'Saging', 'fruits', '1 medium', 105, 1.3, 27, 0.4, 3.1, 1, ARRAY['nationwide'], 'year-round', 8.00, ARRAY['fresh', 'boiled'], ARRAY['breakfast', 'merienda']),
('Mangga', 'Mangga', 'fruits', '1 cup sliced', 107, 0.8, 28, 0.5, 3, 3, ARRAY['nationwide'], 'march-june', 50.00, ARRAY['fresh'], ARRAY['breakfast', 'merienda']),
('Papaya', 'Papaya', 'fruits', '1 cup cubed', 55, 0.9, 14, 0.2, 2.5, 4, ARRAY['nationwide'], 'year-round', 20.00, ARRAY['fresh'], ARRAY['breakfast', 'merienda']),
('Pineapple', 'Pinya', 'fruits', '1 cup chunks', 82, 0.9, 22, 0.2, 2.3, 2, ARRAY['mindanao', 'bicol'], 'year-round', 30.00, ARRAY['fresh'], ARRAY['merienda']),
('Coconut', 'Niyog', 'fruits', '1 cup shredded', 283, 2.7, 12, 27, 7.2, 16, ARRAY['nationwide'], 'year-round', 25.00, ARRAY['fresh', 'grated'], ARRAY['merienda', 'cooking']),

-- Traditional Filipino Dishes (Estimated per serving)
('Adobo na Manok', 'Adobo na Manok', 'protein', '1 serving', 320, 28, 8, 18, 1, 1200, ARRAY['nationwide'], 'year-round', 80.00, ARRAY['braised'], ARRAY['lunch', 'dinner']),
('Sinigang na Baboy', 'Sinigang na Baboy', 'protein', '1 bowl', 280, 22, 12, 15, 3, 800, ARRAY['nationwide'], 'year-round', 100.00, ARRAY['soup'], ARRAY['lunch', 'dinner']),
('Tinola', 'Tinola', 'protein', '1 bowl', 180, 20, 8, 6, 2, 600, ARRAY['nationwide'], 'year-round', 70.00, ARRAY['soup'], ARRAY['lunch', 'dinner']),
('Pinakbet', 'Pinakbet', 'vegetables', '1 serving', 120, 8, 15, 4, 5, 400, ARRAY['ilocos', 'luzon'], 'year-round', 50.00, ARRAY['sauteed'], ARRAY['lunch', 'dinner']),

-- Snacks and Merienda
('Pandesal', 'Pandesal', 'carbs', '1 piece', 138, 4.5, 27, 1.2, 1, 230, ARRAY['nationwide'], 'year-round', 3.00, ARRAY['baked'], ARRAY['breakfast', 'merienda']),
('Turon', 'Turon', 'carbs', '1 piece', 180, 2, 35, 4, 2, 5, ARRAY['nationwide'], 'year-round', 15.00, ARRAY['fried'], ARRAY['merienda']),
('Halo-halo', 'Halo-halo', 'carbs', '1 serving', 350, 8, 65, 8, 4, 150, ARRAY['nationwide'], 'year-round', 80.00, ARRAY['mixed'], ARRAY['merienda']),

-- Beverages
('Coconut Water', 'Tubig ng Niyog', 'beverages', '1 cup', 46, 1.7, 8.9, 0.5, 2.6, 252, ARRAY['nationwide'], 'year-round', 20.00, ARRAY['fresh'], ARRAY['merienda']),
('Calamansi Juice', 'Kalamansi Juice', 'beverages', '1 cup', 25, 0.2, 7, 0.1, 0.3, 2, ARRAY['nationwide'], 'year-round', 15.00, ARRAY['fresh'], ARRAY['merienda']),

-- Cooking Ingredients
('Coconut Oil', 'Langis ng Niyog', 'fats', '1 tablespoon', 117, 0, 0, 13.6, 0, 0, ARRAY['nationwide'], 'year-round', 8.00, ARRAY['cooking'], ARRAY['cooking']),
('Olive Oil', 'Olive Oil', 'fats', '1 tablespoon', 119, 0, 0, 13.5, 0, 0.3, ARRAY['nationwide'], 'year-round', 15.00, ARRAY['cooking'], ARRAY['cooking']);

-- Update common_in_ph flag for imported items
UPDATE filipino_foods SET common_in_ph = false WHERE name IN ('Brown Rice', 'Olive Oil');

-- Add seasonal information
UPDATE filipino_foods SET season = 'rainy' WHERE name IN ('Ampalaya', 'Okra');
UPDATE filipino_foods SET season = 'dry' WHERE name IN ('Mangga');

-- Add regional specialties
UPDATE filipino_foods SET regions = ARRAY['visayas', 'mindanao'] WHERE name = 'Pusit';
UPDATE filipino_foods SET regions = ARRAY['ilocos'] WHERE name = 'Pinakbet';
UPDATE filipino_foods SET regions = ARRAY['bicol'] WHERE name = 'Pineapple';