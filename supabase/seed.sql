-- Test data: categories and surveys that are running, ending soon, without end date and already ended.
-- Run once after schema.sql in the Supabase SQL editor. End dates are relative to today,
-- so the "ending soon" and "past" cases stay valid whenever the script is run.

insert into public.categories (name) values
  ('Team Activities'),
  ('Health & Wellness'),
  ('Gaming & Entertainment'),
  ('Education & Learning'),
  ('Lifestyle & Preferences'),
  ('Technology & Innovation');

select public.create_survey(
  'Let''s Plan the Next Team Event Together',
  'We want to create team activities that everyone will enjoy – share your preferences and ideas in our survey to help us plan better experiences together.',
  current_date + 1,
  (select id from public.categories where name = 'Team Activities'),
  '[
    {"text": "Which date would work best for you?", "isMultipleChoice": false,
     "answers": ["Friday afternoon next week", "Saturday next week", "Friday in two weeks", "Saturday in two weeks"]},
    {"text": "Choose the activities you prefer", "isMultipleChoice": true,
     "answers": ["Outdoor adventure like kayaking", "Office costume party", "Bouldering + pizza & beer", "Beach party + music & cocktails", "Escape room"]},
    {"text": "How long would you prefer the event to last?", "isMultipleChoice": false,
     "answers": ["Half a day", "Full day", "Evening only"]}
  ]'::jsonb
);

select public.create_survey(
  'Fit & Wellness Survey',
  'Help us choose the wellness offers for the next quarter.',
  current_date + 2,
  (select id from public.categories where name = 'Health & Wellness'),
  '[
    {"text": "Which offer would you use most?", "isMultipleChoice": false,
     "answers": ["Weekly yoga class", "Running group", "Massage days", "Healthy cooking workshop"]},
    {"text": "When would you like to take part?", "isMultipleChoice": true,
     "answers": ["Before work", "During lunch break", "After work"]}
  ]'::jsonb
);

select public.create_survey(
  'Gaming Habits and Favorite Games',
  'We are planning a games evening – tell us what you like to play.',
  current_date + 3,
  (select id from public.categories where name = 'Gaming & Entertainment'),
  '[
    {"text": "Which kind of games do you enjoy most?", "isMultipleChoice": true,
     "answers": ["Board games", "Video games", "Card games", "Quiz games"]},
    {"text": "How often would you join a games evening?", "isMultipleChoice": false,
     "answers": ["Every week", "Once a month", "Only now and then"]}
  ]'::jsonb
);

select public.create_survey(
  'Which Workshop Should We Offer Next?',
  'Vote for the topic of our next internal workshop.',
  current_date + 10,
  (select id from public.categories where name = 'Education & Learning'),
  '[
    {"text": "Which topic interests you most?", "isMultipleChoice": false,
     "answers": ["Presentation skills", "Time management", "Accessibility basics", "Git for beginners"]},
    {"text": "Which format do you prefer?", "isMultipleChoice": false,
     "answers": ["On site", "Online", "Hybrid"]}
  ]'::jsonb
);

select public.create_survey(
  'Office Lunch Preferences',
  null,
  null,
  (select id from public.categories where name = 'Lifestyle & Preferences'),
  '[
    {"text": "What should we order for the monthly team lunch?", "isMultipleChoice": true,
     "answers": ["Pizza", "Sushi", "Salad bowls", "Burgers", "Curry"]}
  ]'::jsonb
);

select public.create_survey(
  'Which Tools Help You Most?',
  'We are reviewing our software licences and want to keep the tools you really use.',
  current_date + 20,
  (select id from public.categories where name = 'Technology & Innovation'),
  '[
    {"text": "Which tools do you use every day?", "isMultipleChoice": true,
     "answers": ["Chat", "Video calls", "Shared documents", "Task board"]},
    {"text": "Which tool is missing the most?", "isMultipleChoice": false,
     "answers": ["Whiteboard app", "Password manager", "Screen recorder"]}
  ]'::jsonb
);

select public.create_survey(
  'Summer Party Feedback',
  'Thanks for celebrating with us – how did you like the summer party?',
  current_date - 5,
  (select id from public.categories where name = 'Team Activities'),
  '[
    {"text": "How did you like the location?", "isMultipleChoice": false,
     "answers": ["Loved it", "It was okay", "Let''s find a new one"]},
    {"text": "What should we keep for next year?", "isMultipleChoice": true,
     "answers": ["Barbecue", "Live music", "Games", "Photo booth"]}
  ]'::jsonb
);

select public.create_survey(
  'Step Challenge Results',
  'The step challenge is over – tell us how it went for you.',
  current_date - 12,
  (select id from public.categories where name = 'Health & Wellness'),
  '[
    {"text": "Did the challenge motivate you to move more?", "isMultipleChoice": false,
     "answers": ["Yes, a lot", "A little", "Not really"]}
  ]'::jsonb
);

select public.create_survey(
  'Laptop Upgrade Survey',
  null,
  current_date - 30,
  (select id from public.categories where name = 'Technology & Innovation'),
  '[
    {"text": "Which operating system do you prefer?", "isMultipleChoice": false,
     "answers": ["Windows", "macOS", "Linux"]},
    {"text": "Which accessories do you need?", "isMultipleChoice": true,
     "answers": ["Second monitor", "Headset", "Docking station", "Ergonomic mouse"]}
  ]'::jsonb
);

-- Gives every answer a realistic number of votes so the results are not empty.
update public.answers set votes = floor(random() * 20)::integer;
