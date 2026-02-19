
export interface Subsection {
  title: string;
  id: string;
}

export interface Section {
  title: string;
  content: string; // Markdown supported
  code?: string;
  subsections?: Subsection[];
}

export interface Chapter {
  id: number;
  title: string;
  desc: string;
  sections: Section[];
}

export const chaptersData: Record<number, Chapter> = {
  1: {
    id: 1,
    title: 'LaTeX 入门',
    desc: '安装配置、文档结构、基本命令',
    sections: [
      {
        title: '什么是 LaTeX？',
        content: `LaTeX 是一种基于 TeX 的排版系统，广泛用于学术界的论文、书籍和幻灯片制作。与 Word 等“所见即所得”的编辑器不同，LaTeX 使用标记语言来描述文档结构和样式。

**为什么选择 LaTeX？**

- **专业排版**：自动处理复杂的数学公式、参考文献和断行。
- **结构化写作**：专注于内容而非格式。
- **跨平台**：纯文本文件，易于版本控制。`,
        subsections: [
            { title: 'LaTeX 的历史', id: 'history' },
            { title: '与其他编辑器的对比', id: 'compare' }
        ]
      },
      {
        title: '环境安装',
        content: `工欲善其事，必先利其器。我们推荐安装 TeX Live (Windows/Linux) 或 MacTeX (macOS)。

如果不想安装庞大的发行版，可以使用在线编辑器如 Overleaf (本站 Latexia 就是一个在线练习平台！)。`,
        subsections: [
            { title: '本地安装', id: 'local-install' },
            { title: '在线使用', id: 'online-use' }
        ]
      },
      {
        title: '基本文档结构',
        content: '每个 LaTeX 文档都以 `\\documentclass` 指令开始，随后是导言区（Preamble）和正文区（Document Environment）。',
        code: `\\documentclass{article} % 文档类

\\usepackage[utf8]{inputenc} % 导言区：加载宏包

\\title{我的第一份 LaTeX 文档}
\\author{Latexia User}
\\date{\\today}

\\begin{document} % 正文区开始

\\maketitle % 生成标题

Hello, World! 这是我的第一份 LaTeX 文档。

\\end{document} % 正文区结束`,
        subsections: [
            { title: '导言区', id: 'preamble' },
            { title: '文档类', id: 'documentclass' }
        ]
      },
      {
        title: '排版中文',
        content: `在 LaTeX 中排版中文需要使用 \`ctex\` 宏包或者 \`xeCJK\` 宏包。推荐使用 \`ctexart\` 文档类。`,
        code: `\\documentclass[UTF8]{ctexart}

\\begin{document}
你好，LaTeX！
\\end{document}`,
        subsections: [
             { title: 'ctex 宏包', id: 'ctex-pkg' },
             { title: '字体设置', id: 'font-setup' }
        ]
      },
      {
        title: '常用文本命令',
        content: `LaTeX 命令通常以反斜杠 \`\\\` 开头。

### 常用样式

| 命令 | 说明 | 示例 |
| :--- | :--- | :--- |
| \`\\textbf{...}\` | 加粗 | \\textbf{Bold} |
| \`\\textit{...}\` | 斜体 | \\textit{Italic} |
| \`\\underline{...}\` | 下划线 | \\underline{Underline} |

### 标题结构

- \`\\section{...}\`: 一级标题
- \`\\subsection{...}\`: 二级标题
- \`\\subsubsection{...}\`: 三级标题

### 渲染效果预览

**加粗文本**
*斜体文本*
<u>下划线</u>

# 一级标题
## 二级标题`,
        code: `\\textbf{加粗文本}
\\textit{斜体文本}
\\underline{下划线}

\\section{一级标题}
\\subsection{二级标题}

换行需要使用双反斜杠 \\\\ 或者留空行。`,
        subsections: [
            { title: '字体命令', id: 'font-cmds' },
            { title: '段落命令', id: 'para-cmds' }
        ]
      },
      {
        title: '列表环境',
        content: `LaTeX 提供了有序列表 \`enumerate\` 和无序列表 \`itemize\`。

### 代码结构

使用 \`\\begin{...}\` 和 \`\\end{...}\` 包裹列表项，每项使用 \`\\item\` 标记。

### 渲染效果预览

**无序列表**：

- 第一点
- 第二点

**有序列表**：

1. 第一步
2. 第二步`,
        code: `\\begin{itemize}
  \\item 第一点
  \\item 第二点
\\end{itemize}

\\begin{enumerate}
  \\item 第一步
  \\item 第二步
\\end{enumerate}`,
        subsections: [
            { title: '无序列表', id: 'itemize' },
            { title: '有序列表', id: 'enumerate' }
        ]
      },
      {
        title: '特殊字符',
        content: `有些字符在 LaTeX 中有特殊含义（保留字符），如 \`% $ & { } _ ^ # ~ \\\`。

如果需要在文档中显示它们，必须使用反斜杠 \`\\\` 进行转义。

### 常见转义字符

| 符号 | 用途 | 转义输入 | 显示结果 |
| :--- | :--- | :--- | :--- |
| \`%\` | 注释 | \`\\%\` | % |
| \`$\` | 数学模式 | \`\\$\` | $ |
| \`&\` | 对齐/表格 | \`\\&\` | & |
| \`_\` | 下标 | \`\\_\` | _ |
| \`{\` | 组开始 | \`\\{\` | { |
| \`}\` | 组结束 | \`\\}\` | } |
| \`#\` | 参数 | \`\\#\` | # |

注意：反斜杠 \`\\\` 本身不能用 \`\\\\\` 转义（那是换行！），需要使用 \`\\textbackslash\` 命令。`,
        code: `\\% 
\\$ 
\\& 
\\_ 
\\{ \\}`,
        subsections: [
            { title: '转义字符', id: 'escape' },
            { title: '空格处理', id: 'spaces' }
        ]
      },
      {
        title: '注释与引用',
        content: '使用 `%` 进行单行注释。引用参考文献将在后续章节详细介绍。',
        subsections: []
      }
    ]
  },
  2: {
    id: 2,
    title: '文本排版',
    desc: '字体、段落、间距、对齐方式',
    sections: [
      {
        title: '字体样式',
        content: 'LaTeX 提供了丰富的字体样式命令。',
        code: `\\textrm{罗马字体 (Roman)}
\\textsf{无衬线字体 (Sans Serif)}
\\texttt{打字机字体 (Typewriter)}

\\emph{强调 (Emphasis)}`
      },
      {
        title: '字号大小',
        content: `从极小到极大，LaTeX 预定义了多种字号。

### 字号列表

| 命令 | 相对大小 |
| :--- | :--- |
| \`\\tiny\` | <span style="font-size: 0.5rem">极小</span> |
| \`\\scriptsize\` | <span style="font-size: 0.6rem">脚本</span> |
| \`\\footnotesize\` | <span style="font-size: 0.7rem">脚注</span> |
| \`\\small\` | <span style="font-size: 0.8rem">小号</span> |
| \`\\normalsize\` | <span style="font-size: 1rem">正常</span> |
| \`\\large\` | <span style="font-size: 1.2rem">大号</span> |
| \`\\Large\` | <span style="font-size: 1.4rem">更大</span> |
| \`\\LARGE\` | <span style="font-size: 1.6rem">特大</span> |
| \`\\huge\` | <span style="font-size: 1.8rem">巨大</span> |
| \`\\Huge\` | <span style="font-size: 2.2rem">最大</span> |`,
        code: `\\tiny 极小
\\scriptsize 脚本
\\footnotesize 脚注
\\small 小号
\\normalsize 正常
\\large 大号
\\Large 更大
\\LARGE 特大
\\huge 巨大
\\Huge 最大`
      },
      {
        title: '段落对齐',
        content: '默认情况下，LaTeX 会两端对齐文本。你可以使用环境来改变对齐方式。',
        code: `\\begin{center}
  居中对齐文本
\\end{center}

\\begin{flushleft}
  左对齐文本
\\end{flushleft}

\\begin{flushright}
  右对齐文本
\\end{flushright}`
      }
    ]
  },
  3: {
    id: 3,
    title: '数学公式基础',
    desc: '行内公式、行间公式、常用符号',
    sections: [
      {
        title: '行内与行间公式',
        content: `LaTeX 最强大的功能之一就是数学公式排版。

### 行内公式 (Inline Math)

行内公式嵌入在文本段落中，使用单美元符号 \`$\` 包裹。

例如：输入 \`$E = mc^2$\`，显示为 $E = mc^2$。

### 行间公式 (Display Math)

行间公式会独占一行居中显示，使用双美元符号 \`$$\` 或 \`\\[ ... \\]\` 包裹。

例如：
\`\`\`latex
$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$
\`\`\`

渲染结果：

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$`,
        code: `行内公式：$a^2 + b^2 = c^2$

行间公式：
\\[
  \\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
\\]`
      },
      {
        title: '上下标',
        content: `数学公式中经常使用上标和下标。

- 上标使用 caret 符号 \`^\`
- 下标使用下划线 \`_\`

如果上下标包含多个字符，需要用花括号 \`{}\` 包裹。

### 示例

- \`x^2\` $\\to$ $x^2$
- \`a_1\` $\\to$ $a_1$
- \`e^{x+y}\` $\\to$ $e^{x+y}$
- \`x_{i+1}\` $\\to$ $x_{i+1}$

### 组合使用

\`x_1^2 + x_2^2\` 渲染为：

$$ x_1^2 + x_2^2 $$`,
        code: `x^{2} + y^{2} = z^{2}

a_{1}, a_{2}, \\dots, a_{n}`
      },
      {
        title: '希腊字母',
        content: `LaTeX 支持所有的希腊字母输入。

| 命令 | 显示 | 命令 | 显示 |
| :--- | :--- | :--- | :--- |
| \`\\alpha\` | $\\alpha$ | \`\\beta\` | $\\beta$ |
| \`\\gamma\` | $\\gamma$ | \`\\Gamma\` | $\\Gamma$ |
| \`\\delta\` | $\\delta$ | \`\\Delta\` | $\\Delta$ |
| \`\\pi\` | $\\pi$ | \`\\Pi\` | $\\Pi$ |
| \`\\theta\` | $\\theta$ | \`\\phi\` | $\\phi$ |
| \`\\sigma\` | $\\sigma$ | \`\\Sigma\` | $\\Sigma$ |
| \`\\omega\` | $\\omega$ | \`\\Omega\` | $\\Omega$ |

注意：大写希腊字母通常首字母大写即可（如 \`\\Gamma\`）。`,
        code: `\\alpha, \\beta, \\gamma, \\delta
\\pi, \\theta, \\phi
\\Delta, \\Sigma, \\Omega`
      }
    ]
  }
  // Add placeholder for others if needed or just handle undefined
};
