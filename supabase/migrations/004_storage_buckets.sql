-- ============================================================
-- App Igrejas — Migration 004: Storage buckets e políticas
-- ============================================================

-- Buckets de armazenamento
insert into storage.buckets (id, name, public) values
  ('church_media', 'church_media', false),
  ('church_logos', 'church_logos', false),
  ('content_uploads', 'content_uploads', false)
on conflict (id) do nothing;

-- Políticas para church_logos
create policy "church_admin pode gerenciar logos"
  on storage.objects for all
  using (
    bucket_id = 'church_logos'
    and exists (
      select 1 from church_users
      where user_id = auth.uid()
        and role in ('super_admin', 'church_admin')
        and is_active = true
    )
  );

create policy "qualquer um pode ler logos"
  on storage.objects for select
  using (bucket_id = 'church_logos');

-- Políticas para church_media
create policy "church_admin e pastor podem gerenciar media"
  on storage.objects for all
  using (
    bucket_id = 'church_media'
    and exists (
      select 1 from church_users
      where user_id = auth.uid()
        and role in ('super_admin', 'church_admin', 'pastor', 'secretary')
        and is_active = true
    )
  );

create policy "membros podem ler media"
  on storage.objects for select
  using (
    bucket_id = 'church_media'
    and exists (
      select 1 from church_users
      where user_id = auth.uid()
        and is_active = true
    )
  );

-- Políticas para content_uploads
create policy "admin pode gerenciar conteudos"
  on storage.objects for all
  using (
    bucket_id = 'content_uploads'
    and exists (
      select 1 from church_users
      where user_id = auth.uid()
        and role in ('super_admin', 'church_admin', 'pastor')
        and is_active = true
    )
  );

create policy "qualquer um pode ler conteudos publicados"
  on storage.objects for select
  using (bucket_id = 'content_uploads');
