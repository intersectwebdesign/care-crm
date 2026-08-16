-- Phase 3: RLS for projects/tasks/notes/project_activity.
--
-- Visibility rule shared by all four tables: admin/management/coordinator
-- see everything; support_worker sees a project only if they're the
-- assigned carer (via client_assignments) for a client project, or it's
-- their own contractor onboarding project.

create or replace function public.can_view_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.auth_role() in ('admin', 'management', 'coordinator')
    or exists (
      select 1 from projects p
      join client_assignments ca on ca.client_id = p.client_id
      where p.id = p_project_id
        and ca.contractor_id = public.auth_contractor_id()
    )
    or exists (
      select 1 from projects p
      where p.id = p_project_id
        and p.contractor_id = public.auth_contractor_id()
    )
$$;

revoke all on function public.can_view_project(uuid) from public;
revoke execute on function public.can_view_project(uuid) from anon;
grant execute on function public.can_view_project(uuid) to authenticated;

-- projects
create policy "projects_select_visible"
  on public.projects for select
  using (public.can_view_project(id));

create policy "projects_write_admin_management_coordinator"
  on public.projects for all
  using (public.auth_role() in ('admin', 'management', 'coordinator'))
  with check (public.auth_role() in ('admin', 'management', 'coordinator'));

-- tasks: visible if the parent project is visible.
create policy "tasks_select_visible"
  on public.tasks for select
  using (public.can_view_project(project_id));

create policy "tasks_write_admin_management_coordinator"
  on public.tasks for all
  using (public.auth_role() in ('admin', 'management', 'coordinator'))
  with check (public.auth_role() in ('admin', 'management', 'coordinator'));

-- support_worker: can update (status/completed_at, enforced in the UI —
-- not column-restricted at the RLS layer) only tasks assigned to them.
create policy "tasks_update_own_assigned_support_worker"
  on public.tasks for update
  using (public.auth_role() = 'support_worker' and assigned_to = auth.uid())
  with check (public.auth_role() = 'support_worker' and assigned_to = auth.uid());

-- notes: visible if the project is visible, and either external, authored
-- by the viewer, or the viewer is office staff. Internal notes stay
-- office-only even for the assigned support_worker.
create policy "notes_select_visible"
  on public.notes for select
  using (
    public.can_view_project(project_id)
    and (
      visibility = 'external'
      or author_id = auth.uid()
      or public.auth_role() in ('admin', 'management', 'coordinator')
    )
  );

create policy "notes_insert_visible"
  on public.notes for insert
  with check (public.can_view_project(project_id));

-- project_activity: visible if the project is visible, and note-activity
-- entries respect the same internal/external split as the notes table
-- itself (the activity summary can contain up to 140 chars of note body).
create policy "project_activity_select_visible"
  on public.project_activity for select
  using (
    public.can_view_project(project_id)
    and (
      activity_type != 'note'
      or metadata->>'visibility' != 'internal'
      or public.auth_role() in ('admin', 'management', 'coordinator')
    )
  );

-- client_assignments: writes restricted to office staff (select policies
-- already exist from migration 0002).
