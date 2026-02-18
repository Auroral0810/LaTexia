import { db } from './index';
import { users, problemCategories, problems, latexSymbols, learnChapters } from './schema';

async function main() {
  console.log('🌱 Starting seeding...');

  try {
    // 1. 创建测试用户
    console.log('👤 Creating users...');
    const [adminUser] = await db.insert(users).values({
      username: 'admin',
      email: 'admin@latexia.cn',
      role: 'super_admin',
      status: 'active',
    }).onConflictDoUpdate({
      target: users.username,
      set: { role: 'super_admin' }
    }).returning();

    // 2. 创建题目分类
    console.log('📂 Creating categories...');
    const categoriesData = [
      { name: '基础语法', slug: 'basics', icon: 'FileText', sortOrder: 1 },
      { name: '数学公式', slug: 'math', icon: 'Sigma', sortOrder: 2 },
      { name: '排版样式', slug: 'layout', icon: 'Type', sortOrder: 3 },
    ];

    for (const cat of categoriesData) {
      await db.insert(problemCategories).values(cat).onConflictDoUpdate({
        target: problemCategories.slug,
        set: { name: cat.name, icon: cat.icon }
      });
    }

    const allCats = await db.select().from(problemCategories);
    const mathCat = allCats.find((c) => c.slug === 'math');

    // 3. 创建初始题目
    if (mathCat && adminUser) {
      console.log('📝 Creating problems...');
      await db.insert(problems).values([
        {
          title: '简单的行内公式',
          content: '如何在文本中插入行内公式 $a^2 + b^2 = c^2$？',
          type: 'latex_input',
          difficulty: 'easy',
          categoryId: mathCat.id,
          answer: '$a^2 + b^2 = c^2$',
          answerExplanation: '行内公式使用 $ 符号包裹。',
          authorId: adminUser.id,
          score: 5,
        },
        {
          title: '分式书写',
          content: '请写出 LaTeX 中表示五分之三的代码。',
          type: 'latex_input',
          difficulty: 'medium',
          categoryId: mathCat.id,
          answer: '\\frac{3}{5}',
          answerExplanation: '\\frac{分子}{分母}',
          authorId: adminUser.id,
          score: 10,
        },
      ]).onConflictDoNothing();
    }

    // 4. 创建 LaTeX 符号
    console.log('🔣 Creating symbols...');
    await db.insert(latexSymbols).values([
      { name: 'Alpha', latexCode: '\\alpha', category: 'greek', sortOrder: 1 },
      { name: 'Beta', latexCode: '\\beta', category: 'greek', sortOrder: 2 },
      { name: 'Gamma', latexCode: '\\gamma', category: 'greek', sortOrder: 3 },
      { name: 'Sum', latexCode: '\\sum', category: 'math', sortOrder: 4 },
      { name: 'Integral', latexCode: '\\int', category: 'math', sortOrder: 5 },
    ]).onConflictDoNothing();

    // 5. 创建教学章节
    console.log('📚 Creating learn chapters...');
    await db.insert(learnChapters).values([
      {
        title: 'LaTeX 入门',
        titleEn: 'Introduction to LaTeX',
        slug: 'intro',
        content: '# LaTeX 入门\n欢迎来到 LaTeX 的世界！',
        sortOrder: 1,
      },
      {
        title: '数学公式基础',
        titleEn: 'Mathematical Formulas',
        slug: 'math-basic',
        content: '# 数学公式基础\n学习如何排版精美的数学公式。',
        sortOrder: 2,
      },
    ]).onConflictDoUpdate({
      target: learnChapters.slug,
      set: { title: 'LaTeX 入门' } // 简单的更新示例
    });

    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
