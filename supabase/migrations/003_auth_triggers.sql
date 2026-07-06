-- ============================================================
-- App Igrejas — Migration 003: Auth triggers e funções auxiliares
-- ============================================================

-- Cria perfil automaticamente quando usuário se cadastra
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Função para convidar usuário para uma igreja
create or replace function invite_church_user(
  p_church_id uuid,
  p_email text,
  p_role app_role
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_invite_id uuid;
begin
  -- Verifica se usuário já existe pelo email
  select id into v_user_id from auth.users where email = p_email;

  if v_user_id is null then
    -- Usuário ainda não existe — criaremos um registro de convite
    v_invite_id := uuid_generate_v4();
    -- TODO: criar tabela de invites para fluxo assíncrono
    return v_invite_id;
  end if;

  -- Verifica se já está vinculado
  if exists (
    select 1 from church_users
    where church_id = p_church_id and user_id = v_user_id
  ) then
    raise exception 'Usuário já vinculado a esta igreja';
  end if;

  -- Vincula o usuário à igreja
  insert into church_users (church_id, user_id, role)
  values (p_church_id, v_user_id, p_role);

  return v_user_id;
end;
$$;

-- Função para contar membros ativos de uma igreja
create or replace function count_active_members(p_church_id uuid)
returns integer
language sql
stable
as $$
  select count(*)::integer
  from members
  where church_id = p_church_id and is_active = true;
$$;

-- Função para verificar se igreja atingiu limite de membros
create or replace function check_member_limit(p_church_id uuid)
returns boolean
language sql
stable
as $$
  select count(*) < (
    select max_members from churches where id = p_church_id
  )
  from members
  where church_id = p_church_id and is_active = true;
$$;
