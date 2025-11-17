/*
  # Insert Initial Sample Data

  1. Sample Job Listings
  2. Sample Blog Posts
  3. This provides initial content for the website

  Note: This data is for demonstration. Update or delete as needed.
*/

INSERT INTO job_listings (title, department, location, description, requirements, employment_type, experience_level, salary_range, is_active)
VALUES
  (
    'Propulsion Systems Engineer',
    'Engineering',
    'Visakhapatnam, India',
    'Design and develop advanced electric propulsion systems. Work on optimization of thruster performance, thermal management, and integration with spacecraft systems.',
    'B.Tech/M.Tech in Aerospace Engineering or Physics. 3+ years of experience with electric propulsion systems or spacecraft design. Strong knowledge of MATLAB, CFD, and CAD tools.',
    'Full-time',
    'Mid-level',
    '₹12,00,000 - ₹18,00,000 PA',
    true
  ),
  (
    'Research Scientist - Ion Thrusters',
    'Research',
    'Visakhapatnam, India',
    'Lead research initiatives on ion thruster technology. Conduct experiments, data analysis, and contribute to patent applications and scientific publications.',
    'Ph.D. in Physics, Aerospace Engineering, or related field. Published research in plasma physics or electric propulsion. Laboratory experience with ion thrusters preferred.',
    'Full-time',
    'Senior',
    '₹15,00,000 - ₹22,00,000 PA',
    true
  ),
  (
    'Electronics & Control Systems Engineer',
    'Engineering',
    'Visakhapatnam, India',
    'Design power electronics and control systems for propulsion units. Develop firmware for thruster operation and monitoring.',
    'B.Tech in Electronics Engineering or equivalent. 2+ years in power electronics or spacecraft systems. Experience with embedded systems and real-time control.',
    'Full-time',
    'Mid-level',
    '₹10,00,000 - ₹15,00,000 PA',
    true
  );

INSERT INTO blog_posts (title, slug, content, excerpt, category, author, is_published, published_at)
VALUES
  (
    'Advancing Electric Propulsion Technology',
    'advancing-electric-propulsion',
    '<p>Electric propulsion has emerged as a game-changer in space technology, offering unprecedented efficiency and performance for satellite operations. At Raudranex, we are at the forefront of developing next-generation electric propulsion systems that push the boundaries of what is possible in space exploration.</p><p>Our research focuses on optimizing arcjet and ion thruster technologies to deliver higher specific impulse, greater fuel efficiency, and improved reliability. These advancements enable satellite constellations to maintain optimal orbits with minimal fuel consumption, extending mission lifespans and reducing operational costs.</p>',
    'Electric propulsion is revolutionizing how we approach satellite operations and deep-space exploration. Discover how Raudranex is leading the charge.',
    'Research',
    'Raudranex Team',
    true,
    now()
  ),
  (
    'The Future of Satellite Propulsion',
    'future-satellite-propulsion',
    '<p>The satellite industry is experiencing explosive growth, with thousands of new satellites launched annually for communication, Earth observation, and scientific research. Each mission demands highly efficient propulsion systems capable of precise orbit adjustments and long-duration operations.</p><p>Raudranex is developing propulsion solutions designed specifically for this evolving landscape. Our MAYUKHA and MIHIRA thrusters represent the next generation of propulsion technology, combining high performance with cost-effectiveness.</p>',
    'Explore the future of satellite propulsion and how innovative thruster technology is enabling a new era of space exploration.',
    'News',
    'Raudranex Team',
    true,
    now() - interval '1 day'
  ),
  (
    'Partnership Announcement: Raudranex Collaborates with Leading Research Institutions',
    'partnership-announcement',
    '<p>We are excited to announce strategic partnerships with leading research institutions and aerospace companies to advance our propulsion technology development.</p><p>These collaborations will accelerate innovation, provide access to world-class testing facilities, and bring together diverse expertise in spacecraft design, materials science, and electrical engineering.</p>',
    'Raudranex announces partnerships with leading research institutions, marking a significant milestone in our propulsion technology journey.',
    'Announcement',
    'Raudranex Team',
    true,
    now() - interval '7 days'
  );
