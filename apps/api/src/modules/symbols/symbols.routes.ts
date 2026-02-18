
import { Hono } from 'hono';
import { SymbolsService } from './symbols.service';

const router = new Hono();

/**
 * GET /api/symbols
 * Query Params: page, limit, category, q
 */
router.get('/', async (c) => {
  try {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 50;
    const category = c.req.query('category');
    const q = c.req.query('q');

    const result = await SymbolsService.getSymbols(page, limit, category, q);
    
    return c.json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    console.error('Failed to fetch symbols:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

export default router;
