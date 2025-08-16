
-- 1. Enable the pg_net extension
create extension if not exists pg_net with schema extensions;

-- 2. Create a security definer function to get the project URL from the vault
create or replace function get_project_url()
returns text
language sql
security definer
as $$
  select decrypted_secret from vault.decrypted_secrets where name = 'supabase_url';
$$;

-- 3. Trigger for new order notifications to admin
create or replace function trigger_new_order_notification()
returns trigger
language plpgsql
as $$
begin
  perform extensions.http_request(
    get_project_url() || '/functions/v1/new-order-notification',
    'POST',
    '{"Content-Type":"application/json"}',
    '{}',
    '1000'
  );
  return new;
end;
$$;

create or replace trigger on_new_order
  after insert on public.orders
  for each row
  execute function trigger_new_order_notification();

-- 4. Trigger for order status updates to users
create or replace function trigger_order_status_update_notification()
returns trigger
language plpgsql
as $$
begin
  perform extensions.http_request(
    get_project_url() || '/functions/v1/order-status-update-notification',
    'POST',
    '{"Content-Type":"application/json"}',
    json_build_object('record', new, 'old_record', old)::text,
    '1000'
  );
  return new;
end;
$$;

create or replace trigger on_order_status_update
  after update of status on public.orders
  for each row
  execute function trigger_order_status_update_notification();
