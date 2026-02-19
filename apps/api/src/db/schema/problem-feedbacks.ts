import { pgTable, uuid, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';
import { problems } from './problems';

export const problemFeedbacks = pgTable('problem_feedbacks', {
  id: uuid('id').defaultRandom().primaryKey(),
  problemId: uuid('problem_id').references(() => problems.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  errorType: varchar('error_type', { length: 50 }).notNull(), // answer_wrong / content_error / typo / other
  description: text('description').notNull(),
  status: varchar('status', { length: 20 }).default('pending'), // pending / processing / resolved / dismissed
  adminNote: text('admin_note'),
  handledBy: uuid('handled_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
