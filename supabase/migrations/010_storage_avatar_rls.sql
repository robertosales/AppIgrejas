-- Politicas de acesso ao storage para avatares de membros

create policy "avatars são legíveis por usuários autenticados"
  on storage.objects for select
  using (
    bucket_id = 'church_media'
    and (storage.foldername(name))[1] = 'avatars'
    and auth.role() = 'authenticated'
  );

create policy "usuários autenticados podem enviar avatares"
  on storage.objects for insert
  with check (
    bucket_id = 'church_media'
    and (storage.foldername(name))[1] = 'avatars'
    and auth.role() = 'authenticated'
  );

create policy "usuários podem atualizar seus próprios avatares"
  on storage.objects for update
  using (
    bucket_id = 'church_media'
    and (storage.foldername(name))[1] = 'avatars'
    and (storage.foldername(name))[2] = auth.uid()::text
    and auth.role() = 'authenticated'
  );
