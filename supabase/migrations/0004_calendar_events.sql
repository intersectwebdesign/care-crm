-- Calendar: visits, reviews, and other scheduled dates. Distinct from the
-- fixed one-off milestone date columns already on clients/contractors
-- (consent_pre_interview_date, quarterly_review_date, etc.) — this table is
-- for actually scheduling things (a support worker visiting a client at a
-- specific time), which the brief's "record visit dates" is really asking
-- for.

create type calendar_event_type as enum ('visit', 'review', 'meeting', 'other');

create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  event_type calendar_event_type not null default 'visit',
  title text not null,
  notes text,
  start_at timestamptz not null,
  end_at timestamptz,
  client_id uuid references clients(id) on delete cascade,
  contractor_id uuid references contractors(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  created_by uuid references user_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index calendar_events_start_at_idx on calendar_events (start_at);
create index calendar_events_client_id_idx on calendar_events (client_id);
create index calendar_events_contractor_id_idx on calendar_events (contractor_id);
create index calendar_events_project_id_idx on calendar_events (project_id);

create trigger trg_calendar_events_updated_at
  before update on calendar_events
  for each row execute function set_updated_at();

alter table calendar_events enable row level security;

-- admin/management/coordinator: full access (scheduling is an office job).
create policy "calendar_events_all_admin_management_coordinator"
  on calendar_events for all
  using (public.auth_role() in ('admin', 'management', 'coordinator'))
  with check (public.auth_role() in ('admin', 'management', 'coordinator'));

-- support_worker: read-only visibility into their own visits, or events on
-- a client they're assigned to (e.g. a review meeting they should attend).
create policy "calendar_events_select_support_worker"
  on calendar_events for select
  using (
    public.auth_role() = 'support_worker'
    and (
      contractor_id = public.auth_contractor_id()
      or exists (
        select 1 from client_assignments ca
        where ca.client_id = calendar_events.client_id
          and ca.contractor_id = public.auth_contractor_id()
      )
    )
  );
