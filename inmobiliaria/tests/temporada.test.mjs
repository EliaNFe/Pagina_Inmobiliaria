import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
// Ejecutar helpers TypeScript puros sin agregar dependencias al proyecto.
const source = fs.readFileSync(new URL('../lib/temporada.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const helpers = { exports: {} }
new Function('exports', 'module', compiled)(helpers.exports, helpers)
const { fechaValida, seSuperponen, esTemporada, mostrarFecha } = helpers.exports

test('valida DATE reales y años bisiestos sin normalizar fechas imposibles', () => {
  for (const fecha of ['2027-01-15', '2028-02-29', '2000-02-29']) assert.equal(fechaValida(fecha), true)
  for (const fecha of ['2027-02-29', '2100-02-29', '2027-04-31', '2027-00-10', '2027-13-01', '2027-01-00', '2027-1-1', null]) assert.equal(fechaValida(fecha), false)
})
test('solapamientos inclusivos, contención, un día y rangos adyacentes', () => {
  const b = { estado: 'ACTIVO', fecha_desde: '2027-01-15', fecha_hasta: '2027-01-19' }
  for (const [desde, hasta] of [['2027-01-19', '2027-01-22'], ['2027-01-10', '2027-01-15'], ['2027-01-16', '2027-01-16'], ['2026-12-01', '2027-02-01']]) assert.equal(seSuperponen(desde, hasta, b), true)
  assert.equal(seSuperponen('2027-01-20', '2027-01-22', b), false)
  assert.equal(seSuperponen('2027-01-15', '2027-01-19', { ...b, estado: 'CANCELADO' }), false)
})
test('temporada exclusiva y formato sin conversión horaria', () => {
  assert.equal(esTemporada('Alquiler temporada'), true)
  for (const op of ['Venta', 'Alquiler', null, undefined]) assert.equal(esTemporada(op), false)
  assert.equal(mostrarFecha('2027-01-01'), '01/01/2027')
})
