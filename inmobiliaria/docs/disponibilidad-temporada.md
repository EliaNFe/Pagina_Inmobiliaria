# Disponibilidad de temporada

La funcionalidad usa exclusivamente `operacion = 'Alquiler temporada'` y la tabla existente `bloqueos_temporada`. No ejecutar migraciones para esta implementación.

El calendario consulta los rangos ACTIVO que intersectan el mes visible, sin caché, al abrir, navegar, recuperar foco y cada 60 segundos. Mientras carga o ante un error no muestra días disponibles. Las fechas DATE se comparan como YYYY-MM-DD; ambos extremos están ocupados. El mes inicial corresponde a Argentina. La selección pública reutiliza el enlace de contacto de la propiedad. No genera reservas.

En la edición administrativa se seleccionan dos días o se completan Desde/Hasta (para un único día, repetir la fecha). Bloquear inserta una fila; liberar actualiza ACTIVO a CANCELADO y conserva el historial. Los cambios se registran mediante registrarActividad como edición de propiedad, con rango e identificador de bloqueo. El listado del calendario muestra los bloqueos activos que intersectan el mes; el historial administrativo registra las cancelaciones.

## Verificación pendiente en Supabase

El repositorio no contiene las políticas RLS y esta sesión no dispone de acceso al esquema remoto. No se han inspeccionado ni cambiado las políticas desplegadas. Antes de habilitar la funcionalidad, revisar en SQL Editor (consultas de solo lectura):

```sql
select tablename, rowsecurity from pg_tables
where schemaname = 'public' and tablename in ('propiedades', 'bloqueos_temporada', 'actividad_admin');
select tablename, policyname, roles, cmd, qual, with_check from pg_policies
where schemaname = 'public' and tablename in ('propiedades', 'bloqueos_temporada', 'actividad_admin');
select grantee, privilege_type from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'bloqueos_temporada';
```

Requisitos: RLS habilitada; anon solo SELECT de rangos ACTIVO de propiedades publicadas de temporada; administradores SELECT de todos sus bloqueos, INSERT y UPDATE con USING/WITH CHECK acordes a la autorización existente; sin DELETE público. Verificar acceso de auditoría existente. No aplicar una política genérica `true` para escrituras. Una política SELECT ausente puede devolver cero filas sin error: comprobar un bloqueo conocido usando anon, además de probar intentos de escritura anónimos y sesiones sin autorización.

Las acciones usan getUser y el cliente de sesión con clave anon, respetando RLS, igual que property-actions. El proyecto actual considera administrativas las sesiones autenticadas; no existe un rol adicional en el código. Confirmar que las cuentas de Supabase Auth sean exclusivamente administrativas o que las políticas existentes distingan administradores. Nunca habilitar registro público con políticas de escritura que solo requieran authenticated.

## Concurrencia

El servidor verifica cruces ACTIVO con `fecha_desde <= hasta AND fecha_hasta >= desde` antes de insertar. Esto cubre límites inclusivos y rangos entre meses, pero SELECT e INSERT no son una transacción: dos solicitudes simultáneas pueden pasar ambas comprobaciones. Para garantizar ausencia de solapamientos bajo concurrencia hace falta soporte atómico en la base (restricción de exclusión o RPC transaccional con bloqueo por propiedad). No se agregó porque el pedido prohíbe modificar la estructura. Si la base ya tiene una restricción de exclusión, el error 23P01 se traduce a un mensaje claro. La auditoría conserva el comportamiento existente: un fallo se registra en logs y no revierte la operación.

## Prueba funcional con una propiedad de temporada

1. Bloquear 15/01/2027–19/01/2027: una sola fila y cinco días ocupados; comprobar extremos en público.
2. Intentar 19/01/2027–22/01/2027: rechazo por superposición. 20/01/2027–22/01/2027: permitido.
3. Cancelar el primer bloqueo: fila CANCELADO conservada y fechas libres tras refrescar; evento en actividad.
4. Bloquear entre meses y entre años; navegar a ambos meses. Probar febrero bisiesto y una fecha imposible.
5. Confirmar que no aparece en Venta o Alquiler. Probar sesión vencida, RLS denegada y fallo de red: sin calendario falsamente libre.
6. Comprobar en móvil y teclado, seleccionar un día libre y verificar nombre/fecha en WhatsApp. Un día ocupado no permite consulta.
