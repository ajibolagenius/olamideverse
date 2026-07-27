-- Comment threading: one level of replies under a top-level comment.
-- Kept to a single level (reply to a top-level comment only, no
-- reply-to-a-reply) to match the flat, editorial comment list rather than
-- forum-style infinite nesting.

alter table public.comments
  add column parent_id uuid references public.comments (id) on delete cascade;

create index comments_parent_id_idx on public.comments (parent_id, created_at);

create or replace function public.enforce_comment_reply_shape()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  parent public.comments%rowtype;
begin
  if new.parent_id is null then
    return new;
  end if;

  select * into parent from public.comments where id = new.parent_id;

  if not found then
    raise exception 'Cannot reply — the original comment is gone.'
      using errcode = 'P0001';
  end if;

  if parent.parent_id is not null then
    raise exception 'Replies can only be one level deep.'
      using errcode = 'P0001';
  end if;

  if parent.thread_id <> new.thread_id then
    raise exception 'Reply must belong to the same thread as its parent.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists comments_reply_shape on public.comments;
create trigger comments_reply_shape
  before insert on public.comments
  for each row execute function public.enforce_comment_reply_shape();
