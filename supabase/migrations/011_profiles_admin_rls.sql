-- Permite que admins da igreja criem e atualizem perfis de membros

create policy "church_admin pode criar perfis"
  on profiles for insert
  with check (
    exists (
      select 1 from church_users
      where user_id = auth.uid()
        and role in ('super_admin', 'church_admin', 'secretary')
    )
  );

create policy "church_admin pode atualizar perfis da igreja"
  on profiles for update
  using (
    exists (
      select 1 from church_users cu
      where cu.church_id = auth_church_id()
        and cu.user_id = profiles.id
        and auth_role(cu.church_id) in ('super_admin', 'church_admin', 'secretary')
    )
  );
