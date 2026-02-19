import { db } from '../../db';
import { formulaExercises, NewFormulaExercise } from '../../db/schema';
import { eq, sql, and } from 'drizzle-orm';

export class FormulaExercisesService {
  static async getRandom(difficulty?: string, limit: number = 10) {
    const conditions = [eq(formulaExercises.status, 'published')];
    if (difficulty && difficulty !== 'all') {
      conditions.push(eq(formulaExercises.difficulty, difficulty));
    }
    return await db
      .select()
      .from(formulaExercises)
      .where(and(...conditions))
      .orderBy(sql`RANDOM()`)
      .limit(limit);
  }

  static async getAll() {
    return await db
      .select()
      .from(formulaExercises)
      .orderBy(formulaExercises.id);
  }

  static async getById(id: number) {
    const rows = await db
      .select()
      .from(formulaExercises)
      .where(eq(formulaExercises.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  static async create(data: NewFormulaExercise) {
    const rows = await db
      .insert(formulaExercises)
      .values(data)
      .returning();
    return rows[0];
  }

  static async update(id: number, data: Partial<NewFormulaExercise>) {
    const rows = await db
      .update(formulaExercises)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(formulaExercises.id, id))
      .returning();
    return rows[0] ?? null;
  }

  static async delete(id: number) {
    const rows = await db
      .delete(formulaExercises)
      .where(eq(formulaExercises.id, id))
      .returning();
    return rows[0] ?? null;
  }

  static async incrementAttempt(id: number, correct: boolean) {
    if (correct) {
      await db
        .update(formulaExercises)
        .set({
          attemptCount: sql`${formulaExercises.attemptCount} + 1`,
          correctCount: sql`${formulaExercises.correctCount} + 1`,
        })
        .where(eq(formulaExercises.id, id));
    } else {
      await db
        .update(formulaExercises)
        .set({
          attemptCount: sql`${formulaExercises.attemptCount} + 1`,
        })
        .where(eq(formulaExercises.id, id));
    }
  }
}
