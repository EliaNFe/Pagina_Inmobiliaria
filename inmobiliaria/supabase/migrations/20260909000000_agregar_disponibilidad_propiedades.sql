-- Conserva las publicaciones actuales como disponibles.
-- Marcar una propiedad como no disponible no elimina sus datos ni fotos.
alter table public.propiedades
add column if not exists disponible boolean not null default true;
