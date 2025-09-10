create table public.questions (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  text text not null,
  allowed_votes numeric not null default '1'::numeric,
  used boolean not null default false,
  published_when date null,
  constraint questions_pkey primary key (id),
  constraint questions_text_key unique (text)
) TABLESPACE pg_default;

create index questions_used_published_idx on public.questions (used, published_when);

create index questions_published_when_idx on public.questions (published_when);

create table public.friends (
    id uuid not null default gen_random_uuid (),
    created_at timestamp
    with
        time zone not null default now(),
        name text not null,
        url_pic text null,
        constraint friends_pkey primary key (id)
) TABLESPACE pg_default;

create table public.vote (
    id uuid not null default gen_random_uuid (),
    created_at timestamp
    with
        time zone not null default now(),
        friend_id uuid null,
        question_id uuid null,
        constraint vote_pkey primary key (id),
        constraint vote_friend_id_fkey foreign KEY (friend_id) references friends (id) on update CASCADE on delete CASCADE,
        constraint vote_question_id_fkey foreign KEY (question_id) references questions (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

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