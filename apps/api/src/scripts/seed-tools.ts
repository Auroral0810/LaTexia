
import { db } from '../db';
import { toolRecommendations } from '../db/schema/system';
import { sql } from 'drizzle-orm';

const toolsData = [
    {
        name: "Overleaf Learn LaTeX",
        description: "最受欢迎的在线 LaTeX 编辑器 + 完整教程库，从“30分钟入门”到表格、图表、参考文献等高级主题，全部支持一键在 Overleaf 中编辑运行。",
        url: "https://www.overleaf.com/learn",
        category: "tutorial",
        level: "入门到高级",
        isFeatured: true,
        sortOrder: 1
    },
    {
        name: "Learn LaTeX (learnlatex.org)",
        description: "LaTeX 项目团队成员亲自编写的 16 节短课，内容精炼、可直接在线编辑示例，安装+基础+结构一步步教。",
        url: "https://www.learnlatex.org/en/",
        category: "tutorial",
        level: "入门",
        isFeatured: true,
        sortOrder: 2
    },
    {
        name: "LaTeX-Tutorial.com",
        description: "简洁清晰的步步教程，配完整代码示例，专为科研论文/报告设计，适合快速上手。",
        url: "https://latex-tutorial.com/",
        category: "tutorial",
        level: "入门 / 进阶",
        isFeatured: false,
        sortOrder: 3
    },
    {
        name: "UseOctree Learn LaTeX",
        description: "2025 年更新的完整初学者教程，覆盖文档结构、数学公式、表格、引用等，界面现代。",
        url: "https://www.useoctree.com/learn/latex",
        category: "tutorial",
        level: "入门",
        isFeatured: false,
        sortOrder: 4
    },
    {
        name: "Javatpoint LaTeX Tutorial",
        description: "结构化教程 + 大量示例代码，适合有编程基础的初学者，包含环境搭建和常用命令。",
        url: "https://www.javatpoint.com/latex-tutorial",
        category: "tutorial",
        level: "入门",
        isFeatured: false,
        sortOrder: 5
    },
    {
        name: "LaTeX Wikibooks",
        description: "开放式维基百科风格的全面手册，从零基础到高级宏、自定义样式，几乎所有主题都有。",
        url: "https://en.wikibooks.org/wiki/LaTeX",
        category: "reference",
        level: "入门到高级",
        isFeatured: true,
        sortOrder: 6
    },
    {
        name: "Getting to Grips with LaTeX",
        description: "经典免费教程，内容平衡，适合从入门过渡到进阶的科研写作。",
        url: "http://www.andy-roberts.net/writing/latex",
        category: "tutorial",
        level: "入门到进阶",
        isFeatured: false,
        sortOrder: 7
    },
    {
        name: "The LaTeX Project 官方文档",
        description: "LaTeX 核心团队维护的官方参考文档、发布说明和进阶指南。",
        url: "https://www.latex-project.org/help/documentation/",
        category: "reference",
        level: "进阶到高级",
        isFeatured: true,
        sortOrder: 8
    },
    {
        name: "TeX Users Group (TUG)",
        description: "TeX/LaTeX 官方用户组织，提供资源链接、会议资料、新闻和进一步学习路径。",
        url: "https://www.tug.org/",
        category: "community",
        level: "所有层次",
        isFeatured: false,
        sortOrder: 9
    },
    {
        name: "CTAN - 综合 TeX 档案网",
        description: "所有 LaTeX 包的中央仓库，可搜索包名、下载文档，是进阶必备工具站。",
        url: "https://www.ctan.org/",
        category: "tool",
        level: "高级",
        isFeatured: true,
        sortOrder: 10
    },
    {
        name: "TeX - LaTeX Stack Exchange",
        description: "全球最大的 LaTeX 问答社区，搜任何问题几乎都有答案，包含高级宏、排版技巧。",
        url: "https://tex.stackexchange.com/",
        category: "community",
        level: "进阶到高级",
        isFeatured: false,
        sortOrder: 11
    },
    {
        name: "Detexify",
        description: "“手画符号找命令”神器，画出符号就能得到 LaTeX 代码 + 所需包，学习符号最快方式。",
        url: "https://detexify.kirelabs.org/",
        category: "tool",
        level: "所有层次",
        isFeatured: true,
        sortOrder: 12
    },
    {
        name: "TeXample.net",
        description: "海量 LaTeX 示例库（尤其是 TikZ/PGF 绘图），适合想做复杂图表/海报的进阶用户。",
        url: "https://www.texample.net/",
        category: "reference",
        level: "进阶到高级",
        isFeatured: false,
        sortOrder: 13
    },
    {
        name: "Harvard Library LaTeX Resources",
        description: "顶尖大学图书馆整理的资源合集，包含模板、符号列表、进阶链接，质量极高。",
        url: "https://guides.library.harvard.edu/overleaf/latex",
        category: "reference",
        level: "入门到进阶",
        isFeatured: false,
        sortOrder: 14
    },
    {
        name: "The Not So Short Introduction",
        description: "经典“不太短的 LaTeX 介绍”（lshort）官方托管站点，PDF + 更新链接，进阶必读。",
        url: "https://tobi.oetiker.ch/lshort/",
        category: "tutorial",
        level: "入门到进阶",
        isFeatured: false,
        sortOrder: 15
    }
];

async function main() {
    console.log('Seeding tools...');

    // Clear existing tools
    await db.delete(toolRecommendations);

    // Insert new tools
    await db.insert(toolRecommendations).values(toolsData);

    console.log('Seeding completed.');
    process.exit(0);
}

main().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
