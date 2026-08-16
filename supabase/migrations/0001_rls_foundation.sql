-- Phase 0: RLS foundation.
-- Every table in this database has RLS enabled with zero policies, which means
-- every table currently blocks all access. This migration adds just enough to
-- support login + role lookup + reference-data reads. Per-table policies for
-- clients/contractors/projects/tasks/notes/tickets/etc. land in later phases
-- as each of those areas gets built.
--
-- Uses the existing public.auth_role() / public.auth_contractor_id() helpers
-- (already present in this database from the earlier prototyping session) as
-- the single source of truth for role checks, rather than introducing a
-- second equivalent helper.

-- user_profiles: users can see their own row; admin/management can see and
-- update everyone's. No client-side inserts — provisioning happens through a
-- service-role admin API route, not a public insert policy.
create policy "user_profiles_select_own"
  on public.user_profiles for select
  using (id = auth.uid());

create policy "user_profiles_select_all_admin_management"
  on public.user_profiles for select
  using (public.auth_role() in ('admin', 'management'));

create policy "user_profiles_update_admin_management"
  on public.user_profiles for update
  using (public.auth_role() in ('admin', 'management'));

-- Reference data: readable by any authenticated (logged-in) user, writable
-- only by admin.
create policy "pipeline_stages_select_authenticated"
  on public.pipeline_stages for select
  using (auth.role() = 'authenticated');

create policy "pipeline_stages_write_admin"
  on public.pipeline_stages for all
  using (public.auth_role() = 'admin')
  with check (public.auth_role() = 'admin');

create policy "departments_select_authenticated"
  on public.departments for select
  using (auth.role() = 'authenticated');

create policy "departments_write_admin"
  on public.departments for all
  using (public.auth_role() = 'admin')
  with check (public.auth_role() = 'admin');

create policy "stage_task_templates_select_authenticated"
  on public.stage_task_templates for select
  using (auth.role() = 'authenticated');

create policy "stage_task_templates_write_admin"
  on public.stage_task_templates for all
  using (public.auth_role() = 'admin')
  with check (public.auth_role() = 'admin');
