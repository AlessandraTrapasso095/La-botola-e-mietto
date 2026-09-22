-- Security hardening:
-- confirm_admin_bank_transfer è SECURITY DEFINER e usa già riferimenti
-- qualificati public.*. Manteniamo quindi un search_path vuoto, coerente
-- con le altre RPC privilegiate del progetto.

alter function public.confirm_admin_bank_transfer(uuid)
set search_path = '';
