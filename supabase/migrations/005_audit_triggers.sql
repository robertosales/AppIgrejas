-- ============================================================
-- App Igrejas — Migration 005: Audit triggers automáticos
-- ============================================================

-- Registra automaticamente alterações sensíveis
create or replace function log_audit_event()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.audit_logs (church_id, user_id, action, entity_type, entity_id, metadata)
  values (
    coalesce(new.church_id, old.church_id),
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id, old.id),
    jsonb_build_object(
      'old_data', case when tg_op in ('UPDATE', 'DELETE') then row_to_json(old)::jsonb else null end,
      'new_data', case when tg_op in ('INSERT', 'UPDATE') then row_to_json(new)::jsonb else null end
    )
  );
  return new;
end;
$$;

-- Triggers para tabelas sensíveis
create trigger audit_care_cases after insert or update or delete on care_cases
  for each row execute function log_audit_event();

create trigger audit_church_users after insert or update or delete on church_users
  for each row execute function log_audit_event();

create trigger audit_subscriptions after insert or update or delete on subscriptions
  for each row execute function log_audit_event();

create trigger audit_billing_invoices after insert or update or delete on billing_invoices
  for each row execute function log_audit_event();
