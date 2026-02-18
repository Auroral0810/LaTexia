import { Hono } from 'hono';
import { ToolsService } from './tools.service';

const router = new Hono();

/**
 * GET /api/tools
 * 获取所有精选资源
 */
router.get('/', async (c) => {
  try {
    const tools = await ToolsService.getAllTools();
    return c.json({
      success: true,
      data: tools,
    });
  } catch (error) {
    console.error('Failed to fetch tools:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

/**
 * GET /api/tools/:category
 * 按分类获取资源
 */
router.get('/:category', async (c) => {
  const category = c.req.param('category');
  try {
    const tools = await ToolsService.getToolsByCategory(category);
    return c.json({
      success: true,
      data: tools,
    });
  } catch (error) {
    console.error(`Failed to fetch tools for category ${category}:`, error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

export default router;
