ALTER TABLE buses
ADD COLUMN departure_date VARCHAR(10) NOT NULL DEFAULT '2024-03-25';

-- Update existing records to have today's date
UPDATE buses
SET departure_date = '2024-03-25'
WHERE departure_date = '2024-03-25'; 