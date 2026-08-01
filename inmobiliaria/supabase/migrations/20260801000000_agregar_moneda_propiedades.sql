alter table public.propiedades
add column if not exists moneda text default 'Pesos';

update public.propiedades
set moneda = 'Pesos'
where moneda is null or moneda = '';
