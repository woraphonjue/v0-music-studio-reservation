-- Insert sample rooms
INSERT INTO public.rooms (name, type, description, capacity, hourly_rate, amenities, image_url) VALUES
('Practice Room A', 'practice', 'Cozy practice space perfect for solo sessions or small bands', 4, 200.00, ARRAY['drums', 'amps', 'soundproof', 'air-conditioning'], '/placeholder.svg?height=400&width=600'),
('Practice Room B', 'practice', 'Spacious room with premium equipment', 6, 250.00, ARRAY['drums', 'amps', 'bass-amp', 'soundproof', 'air-conditioning', 'mirrors'], '/placeholder.svg?height=400&width=600'),
('Recording Studio', 'recording', 'Professional recording studio with top-tier equipment', 8, 500.00, ARRAY['recording-booth', 'mixing-console', 'microphones', 'monitors', 'soundproof', 'air-conditioning'], '/placeholder.svg?height=400&width=600'),
('Rehearsal Hall', 'rehearsal', 'Large space for full band rehearsals and performances', 12, 350.00, ARRAY['full-drum-kit', 'multiple-amps', 'PA-system', 'stage', 'soundproof', 'air-conditioning'], '/placeholder.svg?height=400&width=600');

-- Insert sample room images for carousel
INSERT INTO public.room_images (room_id, image_url, display_order)
SELECT id, '/placeholder.svg?height=400&width=600', 1
FROM public.rooms WHERE name = 'Practice Room A';

INSERT INTO public.room_images (room_id, image_url, display_order)
SELECT id, '/placeholder.svg?height=400&width=600', 2
FROM public.rooms WHERE name = 'Practice Room A';

INSERT INTO public.room_images (room_id, image_url, display_order)
SELECT id, '/placeholder.svg?height=400&width=600', 3
FROM public.rooms WHERE name = 'Practice Room A';

-- Insert sample private classes
INSERT INTO public.private_classes (instructor_name, instrument, description, hourly_rate, duration_minutes, image_url) VALUES
('Sarah Johnson', 'Guitar', 'Professional guitar instructor with 10+ years experience. Specializes in rock, blues, and jazz.', 800.00, 60, '/placeholder.svg?height=300&width=400'),
('Mike Chen', 'Drums', 'Expert drummer offering lessons for all skill levels. Focus on technique and rhythm.', 750.00, 60, '/placeholder.svg?height=300&width=400'),
('Emily Rodriguez', 'Piano', 'Classical and contemporary piano instruction. Perfect for beginners to advanced students.', 850.00, 60, '/placeholder.svg?height=300&width=400'),
('David Kim', 'Bass', 'Bass guitar specialist with experience in funk, rock, and jazz. Learn groove and theory.', 700.00, 60, '/placeholder.svg?height=300&width=400');
