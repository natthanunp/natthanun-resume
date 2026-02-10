-- Portfolio information table
create table if not exists public.portfolio_info (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Natthanun Puntanee',
  title text not null default 'Software Engineer',
  tagline text not null default 'Building Large-Scale Applications with Modern Technologies',
  about text not null default 'With over 6 years of experience in software development, I specialize in building scalable, high-performance applications using modern technologies.',
  email text not null default 'natthanunp@pm.me',
  location text not null default 'Bangkok / Thailand',
  github_url text,
  linkedin_url text,
  profile_image_url text default '/images/profile.jpg',
  years_experience integer default 6,
  projects_delivered integer default 10,
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.portfolio_info enable row level security;

-- Anyone can read portfolio info
create policy "portfolio_info_select_all" on public.portfolio_info for select using (true);

-- Only authenticated users can update (for admin dashboard)
create policy "portfolio_info_update_auth" on public.portfolio_info for update using (auth.uid() is not null);

-- Insert initial data
insert into public.portfolio_info (name, title, tagline, about, email, location, years_experience, projects_delivered)
values (
  'Natthanun Puntanee',
  'Software Engineer',
  'Building Large-Scale Applications with Modern Technologies',
  'With over 6 years of experience in software development, I specialize in building scalable, high-performance applications using modern technologies. My expertise spans across mobile development with Flutter and React Native, web development with Vue/Nuxt, and backend services with Node.js and Spring Boot.',
  'natthanunp@pm.me',
  'Bangkok / Thailand',
  6,
  10
)
on conflict (id) do nothing;

-- Work experience table
create table if not exists public.work_experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  position text not null,
  location text,
  start_date text not null,
  end_date text,
  is_current boolean default false,
  description text[],
  order_index integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.work_experience enable row level security;

create policy "work_experience_select_all" on public.work_experience for select using (true);
create policy "work_experience_insert_auth" on public.work_experience for insert with check (auth.uid() is not null);
create policy "work_experience_update_auth" on public.work_experience for update using (auth.uid() is not null);
create policy "work_experience_delete_auth" on public.work_experience for delete using (auth.uid() is not null);

-- Insert initial work experience
insert into public.work_experience (company, position, location, start_date, end_date, is_current, description, order_index)
values 
(
  'Palo IT Thailand',
  'Intermediate Software Engineer',
  'Thailand',
  'Sep 2021',
  null,
  true,
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
  1
),
(
  'Sertis',
  'Software Engineer',
  'Thailand',
  'Nov 2019',
  'Aug 2021',
  false,
  array[
    'Designed and developed several large scale products for clients such as e-KYC and chatbot gateway with a performance in mind',
    'Worked closely with Machine Learning Engineering and Data Engineering team',
    'Focused on building scalable and performant solutions'
  ],
  2
),
(
  'Refinitiv',
  'Associate Software Engineer',
  'Thailand',
  'February 2019',
  'September 2019',
  false,
  array[
    'Developed, integrated, and supported Elektron Tick History web service which handle 9 TB data per day',
    'Automated testing with Robot Framework and Selenium',
    'Worked closely with Amazon Web Services'
  ],
  3
)
on conflict (id) do nothing;

-- Skills table
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  order_index integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.skills enable row level security;

create policy "skills_select_all" on public.skills for select using (true);
create policy "skills_insert_auth" on public.skills for insert with check (auth.uid() is not null);
create policy "skills_update_auth" on public.skills for update using (auth.uid() is not null);
create policy "skills_delete_auth" on public.skills for delete using (auth.uid() is not null);

-- Insert initial skills
insert into public.skills (category, name, order_index)
values 
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
('Analytics & Tools', 'Firebase Cloud Messaging Analytics', 14)
on conflict (id) do nothing;

-- Dog pictures table
create table if not exists public.dog_pictures (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text not null,
  order_index integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.dog_pictures enable row level security;

create policy "dog_pictures_select_all" on public.dog_pictures for select using (true);
create policy "dog_pictures_insert_auth" on public.dog_pictures for insert with check (auth.uid() is not null);
create policy "dog_pictures_update_auth" on public.dog_pictures for update using (auth.uid() is not null);
create policy "dog_pictures_delete_auth" on public.dog_pictures for delete using (auth.uid() is not null);

-- Dog likes table
create table if not exists public.dog_likes (
  id uuid primary key default gen_random_uuid(),
  dog_picture_id uuid not null references public.dog_pictures(id) on delete cascade,
  session_id text not null,
  created_at timestamp with time zone default now(),
  unique(dog_picture_id, session_id)
);

alter table public.dog_likes enable row level security;

create policy "dog_likes_select_all" on public.dog_likes for select using (true);
create policy "dog_likes_insert_all" on public.dog_likes for insert with check (true);
create policy "dog_likes_delete_all" on public.dog_likes for delete using (true);

-- Insert initial dog pictures (we'll add real images later)
insert into public.dog_pictures (name, description, image_url, order_index)
values 
(
  'Paopao the Japanese Spitz',
  'Paopao the Japanese Spitz',
  '/images/paopao.jpg',
  1
),
(
  'Paopao and Pepo together',
  'Paopao and Pepo together',
  '/images/paopao-pepo.jpg',
  2
)
on conflict (id) do nothing;
