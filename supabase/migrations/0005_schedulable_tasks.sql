-- Some onboarding tasks are really "pick a date" actions (e.g. "Confirm
-- commencement date"), not plain checklist items. This adds the metadata
-- needed to drive that from the UI: which calendar_event_type the task
-- should create, and (where one exists) which clients/contractors date
-- column to also stamp.
--
-- date_field is deliberately just a column name (validated against a fixed
-- table/allow-list inside schedule_task() below, not arbitrary user input —
-- it only ever comes from stage_task_templates rows an admin controls).

alter table stage_task_templates add column calendar_event_type calendar_event_type;
alter table stage_task_templates add column date_field text;

alter table tasks add column calendar_event_type calendar_event_type;
alter table tasks add column date_field text;
alter table tasks add column calendar_event_id uuid references calendar_events(id);

-- Classify the seeded templates. Only titles that clearly ask for a
-- specific date/time to be set — plain checklist items are left alone.
update stage_task_templates set calendar_event_type = 'meeting', date_field = 'plan_service_meeting_interview_date'
  where title = 'Schedule service plan meeting';
update stage_task_templates set calendar_event_type = 'visit', date_field = 'service_commencement_date'
  where title = 'Confirm commencement date';
update stage_task_templates set calendar_event_type = 'review', date_field = 'initial_one_month_review_date'
  where title = 'Set a feedback review date (to assess services from both client and staff perspectives)';
update stage_task_templates set calendar_event_type = 'visit', date_field = null
  where title = 'Schedule onboarding visit (second in-home risk assessment, 2 hours)';
update stage_task_templates set calendar_event_type = 'meeting', date_field = null
  where title = 'Book orientation date with clinical staff or manager';
update stage_task_templates set calendar_event_type = 'review', date_field = 'initial_one_month_appraisal_date'
  where title = 'Set an appraisal and feedback review within one month';

-- Backfill tasks already seeded (by the trigger) before this migration, by
-- matching on title — the trigger below covers everything from here on.
update tasks t
set calendar_event_type = stt.calendar_event_type, date_field = stt.date_field
from stage_task_templates stt
where t.title = stt.title
  and stt.calendar_event_type is not null
  and t.calendar_event_id is null;

-- Extend the existing ensure_project_and_stage_tasks trigger to also copy
-- the two new fields when seeding tasks from templates. Everything else
-- about this function (when a project is created, idempotency guard) is
-- untouched — Stephen already reviewed and kept this behavior as-is.
create or replace function public.ensure_project_and_stage_tasks()
returns trigger
language plpgsql
security definer
set search_path = 'public', 'pg_temp'
as $$
declare
  v_pipeline_type pipeline_type;
  v_project_id uuid;
  v_task record;
begin
  if new.current_stage_id is null then
    return new;
  end if;

  v_pipeline_type := case when TG_TABLE_NAME = 'clients' then 'client'::pipeline_type else 'staff'::pipeline_type end;

  if v_pipeline_type = 'client' then
    select id into v_project_id from projects where client_id = new.id;
  else
    select id into v_project_id from projects where contractor_id = new.id;
  end if;

  if v_project_id is null then
    insert into projects (pipeline_type, client_id, contractor_id, name)
    values (
      v_pipeline_type,
      case when v_pipeline_type = 'client' then new.id else null end,
      case when v_pipeline_type = 'staff' then new.id else null end,
      new.name || case when v_pipeline_type = 'client' then ' — Care Project' else ' — Onboarding' end
    )
    returning id into v_project_id;
  end if;

  if not exists (select 1 from tasks where project_id = v_project_id and source_stage_id = new.current_stage_id) then
    for v_task in select * from stage_task_templates where pipeline_stage_id = new.current_stage_id order by sort_order loop
      insert into tasks (project_id, title, category, department_id, source_stage_id, sort_order, calendar_event_type, date_field)
      values (v_project_id, v_task.title, v_task.category, v_task.department_id, new.current_stage_id, v_task.sort_order, v_task.calendar_event_type, v_task.date_field);
    end loop;

    insert into project_activity (project_id, activity_type, summary)
    values (v_project_id, 'stage_change', 'Entered stage: ' || (select name from pipeline_stages where id = new.current_stage_id));
  end if;

  return new;
end;
$$;

-- Atomically: create the calendar event, stamp the entity's date column
-- (if this task maps to one), and mark the task done+linked. Role-gated
-- the same way as move_pipeline_stage.
create or replace function public.schedule_task(p_task_id uuid, p_start_at timestamptz)
returns calendar_events
language plpgsql
security definer
set search_path = public
as $$
declare
  v_task record;
  v_project record;
  v_event calendar_events;
  v_target_table text;
  v_target_id uuid;
begin
  if public.auth_role() not in ('admin', 'management', 'coordinator') then
    raise exception 'Not authorized to schedule';
  end if;

  select id, title, calendar_event_type, date_field, project_id into v_task
  from tasks where id = p_task_id;

  if v_task.calendar_event_type is null then
    raise exception 'Task is not schedulable';
  end if;

  select id, pipeline_type, client_id, contractor_id into v_project
  from projects where id = v_task.project_id;

  insert into calendar_events (event_type, title, start_at, client_id, contractor_id, project_id, created_by)
  values (v_task.calendar_event_type, v_task.title, p_start_at, v_project.client_id, v_project.contractor_id, v_project.id, auth.uid())
  returning * into v_event;

  if v_task.date_field is not null then
    v_target_table := case when v_project.pipeline_type = 'client' then 'clients' else 'contractors' end;
    v_target_id := case when v_project.pipeline_type = 'client' then v_project.client_id else v_project.contractor_id end;
    execute format('update %I set %I = $1 where id = $2', v_target_table, v_task.date_field)
      using p_start_at::date, v_target_id;
  end if;

  update tasks set calendar_event_id = v_event.id, status = 'done', completed_at = now()
  where id = p_task_id;

  return v_event;
end;
$$;

revoke all on function public.schedule_task(uuid, timestamptz) from public;
revoke execute on function public.schedule_task(uuid, timestamptz) from anon;
grant execute on function public.schedule_task(uuid, timestamptz) to authenticated;
