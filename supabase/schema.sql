-- Tables for categories, surveys, their questions and answers. Run once in the Supabase SQL editor.

create table public.categories (
  id bigint generated always as identity primary key,
  name text not null
);

alter table public.categories enable row level security;

create policy "Anyone can read categories" on public.categories for select to anon using (true);

create table public.surveys (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  end_date date,
  category_id bigint not null references public.categories (id),
  created_at timestamptz not null default now()
);

create table public.questions (
  id bigint generated always as identity primary key,
  survey_id bigint not null references public.surveys (id) on delete cascade,
  position integer not null,
  text text not null,
  is_multiple_choice boolean not null default false
);

create table public.answers (
  id bigint generated always as identity primary key,
  question_id bigint not null references public.questions (id) on delete cascade,
  position integer not null,
  text text not null,
  votes integer not null default 0
);

-- The app has no login, so anonymous visitors may read and create surveys.
alter table public.surveys enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;

create policy "Anyone can read surveys" on public.surveys for select to anon using (true);
create policy "Anyone can create surveys" on public.surveys for insert to anon with check (true);
create policy "Anyone can read questions" on public.questions for select to anon using (true);
create policy "Anyone can create questions" on public.questions for insert to anon with check (true);
create policy "Anyone can read answers" on public.answers for select to anon using (true);
create policy "Anyone can create answers" on public.answers for insert to anon with check (true);

-- Saves a survey with all questions and answers in one transaction, so a failed request
-- never leaves a half-saved survey behind. Returns the id of the new survey.
-- survey_questions: [{ "text": "...", "isMultipleChoice": false, "answers": ["...", "..."] }]
create or replace function public.create_survey(
  survey_title text,
  survey_description text,
  survey_end_date date,
  survey_category_id bigint,
  survey_questions jsonb
)
returns bigint
language plpgsql
security invoker
as $$
declare
  new_survey_id bigint;
  new_question_id bigint;
  question jsonb;
  question_position integer := 0;
  answer_text text;
  answer_position integer;
begin
  insert into public.surveys (title, description, end_date, category_id)
  values (survey_title, survey_description, survey_end_date, survey_category_id)
  returning id into new_survey_id;

  for question in select * from jsonb_array_elements(survey_questions) loop
    insert into public.questions (survey_id, position, text, is_multiple_choice)
    values (new_survey_id, question_position, question ->> 'text', (question ->> 'isMultipleChoice')::boolean)
    returning id into new_question_id;

    answer_position := 0;
    for answer_text in select jsonb_array_elements_text(question -> 'answers') loop
      insert into public.answers (question_id, position, text)
      values (new_question_id, answer_position, answer_text);
      answer_position := answer_position + 1;
    end loop;

    question_position := question_position + 1;
  end loop;

  return new_survey_id;
end;
$$;

grant execute on function public.create_survey(text, text, date, bigint, jsonb) to anon;
