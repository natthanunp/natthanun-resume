-- Insert portfolio info
insert into public.portfolio_info (
  full_name,
  title,
  tagline,
  about_me,
  email,
  location,
  github_url,
  linkedin_url,
  years_experience,
  projects_delivered
) values (
  'Natthanun Puntanee',
  'Software Engineer',
  'Building Large-Scale Applications with Modern Technologies',
  'With over 6 years of experience in software development, I specialize in building scalable, high-performance applications using modern technologies. My expertise spans across mobile development with Flutter and React Native, web development with Vue/Nuxt, and backend services with Node.js and Spring Boot.

I''m passionate about creating solutions that make a real impact, whether it''s handling 9TB of data per day or building mobile applications for millions of users. I believe in writing clean, maintainable code and implementing robust testing strategies.',
  'natthanunp@pm.me',
  'Bangkok / Thailand',
  'https://github.com/natthanunp',
  'https://linkedin.com/in/natthanunp',
  6,
  10
) on conflict (id) do nothing;

-- Insert experiences
insert into public.experiences (company, position, start_date, end_date, location, description, is_current, order_index) values
(
  'Palo IT Thailand',
  'Intermediate Software Engineer',
  'Sep 2021',
  null,
  'Thailand',
  array[
    'Developed the full-stack development of a mobile application and its Backend for Frontend (BFF) using React Native for a top 3 insurance company',
    'Drove the development of a mobile application for a high-traffic loyalty platform in Thailand using Flutter, with a strong focus on E2E testing using Flutter integration tests and Cucumber',
    'Integrated GA4 analytics for user insights',
    'Designed and implemented gamification services delivering diverse user outcomes (Points, Coupons, Message Notifications) triggered by real-time transaction events',
    'Architected and developed a messaging service, replacing a legacy system with Firebase for push notifications and AWS SES for email',
    'Implemented bulk communication capabilities for large user audiences',
    'Developed an intuitive email editor enabling users to design custom email templates',
    'Built a corporate web portal empowering users to design, create, and update their item entities',
    'Developed a transaction service to manage point adjustments, including voiding and burning customer points'
  ],
  true,
  1
),
(
  'Sertis',
  'Software Engineer',
  'Nov 2019',
  'Aug 2021',
  'Thailand',
  array[
    'Designed and developed several large scale products for clients such as e-KYC and chatbot gateway with a performance in mind',
    'Worked closely with Machine Learning Engineering and Data Engineering team',
    'Focused on building scalable and performant solutions'
  ],
  false,
  2
),
(
  'Refinitiv',
  'Associate Software Engineer',
  'Feb 2019',
  'Sep 2019',
  'Thailand',
  array[
    'Developed, integrated, and supported Elektron Tick History web service which handle 9 TB data per day',
    'Automated testing with Robot Framework and Selenium',
    'Worked closely with Amazon Web Services'
  ],
  false,
  3
);

-- Insert skills
insert into public.skills (category, name, order_index) values
('Mobile Development', 'Flutter', 1),
('Mobile Development', 'React Native', 2),
('Frontend Development', 'Vue.js/Nuxt.js', 3),
('Frontend Development', 'React.js/Next.js', 4),
('Backend Development', 'Node.js', 5),
('Backend Development', 'Spring Boot (Kotlin/Java)', 6),
('Cloud & DevOps', 'Amazon Web Services', 7),
('Cloud & DevOps', 'Google Cloud', 8),
('Cloud & DevOps', 'CI/CD Pipelines', 9),
('Testing & Quality', 'E2E Testing', 10),
('Testing & Quality', 'Cucumber', 11),
('Testing & Quality', 'Flutter Integration Test', 12),
('Analytics & Tools', 'Google Analytics 4', 13),
('Analytics & Tools', 'Firebase Cloud Messaging Analytics', 14);

-- Insert dog photos
insert into public.dog_photos (name, description, image_url, order_index) values
('Paopao the Japanese Spitz', 'Paopao is a fluffy Japanese Spitz who brings endless joy and happiness.', '/images/paopao.jpg', 1),
('Paopao and Pepo', 'Paopao the Japanese Spitz and Pepo the Chihuahua together - the best duo!', '/images/paopao-pepo.jpg', 2);
