import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const diseases = sqliteTable('diseases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  diseaseName: text('disease_name').notNull(),
  medicineMeasures: text('medicine_measures').notNull(),
  fever: integer('fever', { mode: 'boolean' }).default(false),
  headache: integer('headache', { mode: 'boolean' }).default(false),
  cough: integer('cough', { mode: 'boolean' }).default(false),
  nausea: integer('nausea', { mode: 'boolean' }).default(false),
  vomiting: integer('vomiting', { mode: 'boolean' }).default(false),
  chestPain: integer('chest_pain', { mode: 'boolean' }).default(false),
  breathlessness: integer('breathlessness', { mode: 'boolean' }).default(false),
  abdominalPain: integer('abdominal_pain', { mode: 'boolean' }).default(false),
  soreThroat: integer('sore_throat', { mode: 'boolean' }).default(false),
  runnyNose: integer('runny_nose', { mode: 'boolean' }).default(false),
  bodyAches: integer('body_aches', { mode: 'boolean' }).default(false),
  sweating: integer('sweating', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});