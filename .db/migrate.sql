create or replace function get_question_votes(qid uuid)
returns table(friend text, votes bigint) as $$
  select f.name, count(v.*) as votes
  from vote v
  join friends f on f.id = v.friend_id
  where v.question_id = qid
  group by f.name
  order by votes desc;
$$ language sql stable;

create or replace function get_random_question()
returns setof questions as $$
begin
  return query
  select *
  from questions
  where used = false
  order by random()
  limit 1;
end;
$$ language plpgsql;

create index questions_used_published_idx on public.questions (used, published_when);
create index questions_published_when_idx on public.questions (published_when);