import { db } from './index';
import { users, problemCategories, problems, latexSymbols, learnChapters, toolRecommendations } from './schema';

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

    // 6. 插入学习资源
    console.log('🛠️ Seeding tool recommendations...');
    const toolData = [
      {
        name: 'Overleaf Learn LaTeX',
        url: 'https://www.overleaf.com/learn',
        description: '最受欢迎的在线 LaTeX 编辑器 + 完整教程库，从“30分钟入门”到表格、图表、参考文献等高级主题，全部支持一键在 Overleaf 中编辑运行。',
        level: '入门到高级',
        category: 'tutorial',
        isFeatured: true,
        sortOrder: 1,
      },
      {
        name: 'Learn LaTeX (learnlatex.org)',
        url: 'https://www.learnlatex.org/en/',
        description: 'LaTeX 项目团队成员亲自编写的 16 节短课，内容精炼、可直接在线编辑示例，安装+基础+结构一步步教。',
        level: '入门',
        category: 'tutorial',
        isFeatured: true,
        sortOrder: 2,
      },
      {
        name: 'LaTeX-Tutorial.com',
        url: 'https://latex-tutorial.com/',
        description: '简洁清晰的步步教程，配完整代码示例，专为科研论文/报告设计，适合快速上手。',
        level: '入门 / 进阶',
        category: 'tutorial',
        isFeatured: false,
        sortOrder: 3,
      },
      {
        name: 'UseOctree Learn LaTeX',
        url: 'https://www.useoctree.com/learn/latex',
        description: '2025 年更新的完整初学者教程，覆盖文档结构、数学公式、表格、引用等，界面现代。',
        level: '入门',
        category: 'tutorial',
        isFeatured: false,
        sortOrder: 4,
      },
      {
        name: 'Javatpoint LaTeX Tutorial',
        url: 'https://www.javatpoint.com/latex-tutorial',
        description: '结构化教程 + 大量示例代码，适合有编程基础的初学者，包含环境搭建和常用命令。',
        level: '入门',
        category: 'tutorial',
        isFeatured: false,
        sortOrder: 5,
      },
      {
        name: 'LaTeX Wikibooks',
        url: 'https://en.wikibooks.org/wiki/LaTeX',
        description: '开放式维基百科风格的全面手册，从零基础到高级宏、自定义样式，几乎所有主题都有。',
        level: '入门到高级',
        category: 'reference',
        isFeatured: true,
        sortOrder: 6,
      },
      {
        name: 'Getting to Grips with LaTeX',
        url: 'http://www.andy-roberts.net/writing/latex',
        description: '经典免费教程，内容平衡，适合从入门过渡到进阶的科研写作。',
        level: '入门到进阶',
        category: 'tutorial',
        isFeatured: false,
        sortOrder: 7,
      },
      {
        name: 'The LaTeX Project 官方文档',
        url: 'https://www.latex-project.org/help/documentation/',
        description: 'LaTeX 核心团队维护的官方参考文档、发布说明和进阶指南。',
        level: '进阶到高级',
        category: 'reference',
        isFeatured: true,
        sortOrder: 8,
      },
      {
        name: 'TeX Users Group (TUG)',
        url: 'https://www.tug.org/',
        description: 'TeX/LaTeX 官方用户组织，提供资源链接、会议资料、新闻和进一步学习路径。',
        level: '所有层次',
        category: 'community',
        isFeatured: false,
        sortOrder: 9,
      },
      {
        name: 'CTAN - 综合 TeX 档案网',
        url: 'https://www.ctan.org/',
        description: '所有 LaTeX 包的中央仓库，可搜索包名、下载文档，是进阶必备工具站。',
        level: '高级',
        category: 'tool',
        isFeatured: true,
        sortOrder: 10,
      },
      {
        name: 'TeX - LaTeX Stack Exchange',
        url: 'https://tex.stackexchange.com/',
        description: '全球最大的 LaTeX 问答社区，搜任何问题几乎都有答案，包含高级宏、排版技巧。',
        level: '进阶到高级',
        category: 'community',
        isFeatured: false,
        sortOrder: 11,
      },
      {
        name: 'Detexify',
        url: 'https://detexify.kirelabs.org/',
        description: '“手画符号找命令”神器，画出符号就能得到 LaTeX 代码 + 所需包，学习符号最快方式。',
        level: '所有层次',
        category: 'tool',
        isFeatured: true,
        sortOrder: 12,
      },
      {
        name: 'TeXample.net',
        url: 'https://www.texample.net/',
        description: '海量 LaTeX 示例库（尤其是 TikZ/PGF 绘图），适合想做复杂图表/海报的进阶用户。',
        level: '进阶到高级',
        category: 'reference',
        isFeatured: false,
        sortOrder: 13,
      },
      {
        name: 'Harvard Library LaTeX Resources',
        url: 'https://guides.library.harvard.edu/overleaf/latex',
        description: '顶尖大学图书馆整理的资源合集，包含模板、符号列表、进阶链接，质量极高。',
        level: '入门到进阶',
        category: 'reference',
        isFeatured: false,
        sortOrder: 14,
      },
      {
        name: 'The Not So Short Introduction',
        url: 'https://tobi.oetiker.ch/lshort/',
        description: '经典“不太短的 LaTeX 介绍”（lshort）官方托管站点，PDF + 更新链接，进阶必读。',
        level: '入门到进阶',
        category: 'tutorial',
        isFeatured: false,
        sortOrder: 15,
      },
    ];

    await db.insert(toolRecommendations).values(toolData).onConflictDoNothing();

    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main().then(() => process.exit(0));
