-- Phase 1: RLS for clients/contractors/pipeline_stage_history, plus the
-- move_pipeline_stage RPC used by the kanban boards to move a card between
-- stages. Project/task creation on the Active transition is already handled
-- by the existing ensure_project_and_stage_tasks trigger — this function
-- only needs to update current_stage_id and log history atomically.

-- clients: admin/management/coordinator see and edit everything.
-- support_worker sees only clients they're assigned to via client_assignments.
create policy "clients_select_admin_management_coordinator"
  on public.clients for select
  using (public.auth_role() in ('admin', 'management', 'coordinator'));

create policy "clients_select_assigned_support_worker"
  on public.clients for select
  using (
    public.auth_role() = 'support_worker'
    and exists (
      select 1 from public.client_assignments ca
      where ca.client_id = clients.id
        and ca.contractor_id = public.auth_contractor_id()
    )
  );

create policy "clients_write_admin_management_coordinator"
  on public.clients for all
  using (public.auth_role() in ('admin', 'management', 'coordinator'))
  with check (public.auth_role() in ('admin', 'management', 'coordinator'));

-- contractors: staff HR pipeline stays admin/management/coordinator only —
-- support_workers don't browse each other's onboarding records.
create policy "contractors_select_admin_management_coordinator"
  on public.contractors for select
  using (public.auth_role() in ('admin', 'management', 'coordinator'));

create policy "contractors_write_admin_management_coordinator"
  on public.contractors for all
  using (public.auth_role() in ('admin', 'management', 'coordinator'))
  with check (public.auth_role() in ('admin', 'management', 'coordinator'));

-- client_assignments: needed for the support_worker policy above to be
-- checkable, and useful in its own right ahead of Phase 3.
create policy "client_assignments_select_admin_management_coordinator"
  on public.client_assignments for select
  using (public.auth_role() in ('admin', 'management', 'coordinator'));

create policy "client_assignments_select_own_support_worker"
  on public.client_assignments for select
  using (
    public.auth_role() = 'support_worker'
    and contractor_id = public.auth_contractor_id()
  );

create policy "client_assignments_write_admin_management_coordinator"
  on public.client_assignments for all
  using (public.auth_role() in ('admin', 'management', 'coordinator'))
  with check (public.auth_role() in ('admin', 'management', 'coordinator'));

-- pipeline_stage_history: audit trail, office-facing only.
create policy "pipeline_stage_history_select_admin_management_coordinator"
  on public.pipeline_stage_history for select
  using (public.auth_role() in ('admin', 'management', 'coordinator'));

-- Move a client/contractor card to a new pipeline stage. Runs as the
-- function owner (bypasses RLS) so it can write current_stage_id and
-- pipeline_stage_history atomically; the role check below is the real
-- authorization gate, not RLS.
create or replace function public.move_pipeline_stage(
  p_entity_id uuid,
  p_entity_type pipeline_type,
  p_new_stage_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_from_stage_id uuid;
  v_changed_by text;
begin
  if public.auth_role() not in ('admin', 'management', 'coordinator') then
    raise exception 'Not authorized to move pipeline stage';
  end if;

  select coalesce(full_name, id::text) into v_changed_by
  from user_profiles where id = auth.uid();

  if p_entity_type = 'client' then
    select current_stage_id into v_from_stage_id from clients where id = p_entity_id;
    update clients set current_stage_id = p_new_stage_id where id = p_entity_id;
  else
    select current_stage_id into v_from_stage_id from contractors where id = p_entity_id;
    update contractors set current_stage_id = p_new_stage_id where id = p_entity_id;
  end if;

  insert into pipeline_stage_history (entity_type, client_id, contractor_id, from_stage_id, to_stage_id, changed_by)
  values (
    p_entity_type,
    case when p_entity_type = 'client' then p_entity_id else null end,
    case when p_entity_type = 'staff' then p_entity_id else null end,
    v_from_stage_id,
    p_new_stage_id,
    v_changed_by
  );
end;
$$;

-- Supabase auto-grants EXECUTE to anon/authenticated/service_role on newly
-- created functions via default privileges, so "revoke all from public"
-- alone does not remove anon's explicit grant — it must be revoked directly.
revoke all on function public.move_pipeline_stage(uuid, pipeline_type, uuid) from public;
revoke execute on function public.move_pipeline_stage(uuid, pipeline_type, uuid) from anon;
grant execute on function public.move_pipeline_stage(uuid, pipeline_type, uuid) to authenticated;
