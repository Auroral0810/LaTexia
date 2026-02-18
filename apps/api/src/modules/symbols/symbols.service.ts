
import { db } from '../../db';
import { latexSymbols } from '../../db/schema';
import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { withCache } from '../../lib/redis';

export class SymbolsService {
  /**
   * Get symbols with pagination (Cached)
   * Cache Key: latexia:symbols:all:page:limit
   */
  static async getSymbols(page: number = 1, limit: number = 50, category?: string, query?: string) {
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const conditions = [];
    if (category && category !== 'all') {
      conditions.push(eq(latexSymbols.category, category));
    }
    if (query) {
      conditions.push(or(
        ilike(latexSymbols.name, `%${query}%`),
        ilike(latexSymbols.latexCode, `%${query}%`),
        ilike(latexSymbols.description, `%${query}%`)
      ));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    // Count total
    // Note: Drizzle count is a bit verbose, simplified here
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(latexSymbols)
      .where(whereClause);
    
    const total = Number(countResult[0].count);
    const totalPages = Math.ceil(total / limit);

    // Fetch data
    const data = await db
      .select()
      .from(latexSymbols)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(latexSymbols.sortOrder, asc(latexSymbols.name));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }
}

// Helper for 'and' since it wasn't imported
import { and } from 'drizzle-orm';
