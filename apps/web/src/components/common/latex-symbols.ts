/**
 * LaTeX 符号与模板数据
 * 参考 MathType 符号面板分类，涵盖常用数学符号、公式模板
 */

export interface SymbolItem {
  /** 显示用的 LaTeX（用于 KaTeX 渲染按钮） */
  display: string;
  /** 插入到编辑器的 LaTeX 代码 */
  code: string;
  /** 鼠标悬停提示 */
  tip?: string;
}

export interface SymbolGroup {
  /** 分组标题 */
  title: string;
  /** 分组内的符号列表 */
  items: SymbolItem[];
}

export interface SymbolCategory {
  /** 分类名称 */
  name: string;
  /** 分类图标（用 KaTeX 渲染的 LaTeX） */
  icon: string;
  /** 该分类下的分组 */
  groups: SymbolGroup[];
}

// ─── 所有符号分类 ───────────────────────────────────────────

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  // ==================== 1. 希腊字母 ====================
  {
    name: '希腊字母',
    icon: '\\alpha\\beta',
    groups: [
      {
        title: '小写 Lowercase',
        items: [
          { display: '\\alpha', code: '\\alpha', tip: 'alpha' },
          { display: '\\beta', code: '\\beta', tip: 'beta' },
          { display: '\\gamma', code: '\\gamma', tip: 'gamma' },
          { display: '\\delta', code: '\\delta', tip: 'delta' },
          { display: '\\epsilon', code: '\\epsilon', tip: 'epsilon' },
          { display: '\\varepsilon', code: '\\varepsilon', tip: 'varepsilon' },
          { display: '\\zeta', code: '\\zeta', tip: 'zeta' },
          { display: '\\eta', code: '\\eta', tip: 'eta' },
          { display: '\\theta', code: '\\theta', tip: 'theta' },
          { display: '\\vartheta', code: '\\vartheta', tip: 'vartheta' },
          { display: '\\iota', code: '\\iota', tip: 'iota' },
          { display: '\\kappa', code: '\\kappa', tip: 'kappa' },
          { display: '\\lambda', code: '\\lambda', tip: 'lambda' },
          { display: '\\mu', code: '\\mu', tip: 'mu' },
          { display: '\\nu', code: '\\nu', tip: 'nu' },
          { display: '\\xi', code: '\\xi', tip: 'xi' },
          { display: 'o', code: 'o', tip: 'omicron' },
          { display: '\\pi', code: '\\pi', tip: 'pi' },
          { display: '\\varpi', code: '\\varpi', tip: 'varpi' },
          { display: '\\rho', code: '\\rho', tip: 'rho' },
          { display: '\\varrho', code: '\\varrho', tip: 'varrho' },
          { display: '\\sigma', code: '\\sigma', tip: 'sigma' },
          { display: '\\varsigma', code: '\\varsigma', tip: 'varsigma' },
          { display: '\\tau', code: '\\tau', tip: 'tau' },
          { display: '\\upsilon', code: '\\upsilon', tip: 'upsilon' },
          { display: '\\phi', code: '\\phi', tip: 'phi' },
          { display: '\\varphi', code: '\\varphi', tip: 'varphi' },
          { display: '\\chi', code: '\\chi', tip: 'chi' },
          { display: '\\psi', code: '\\psi', tip: 'psi' },
          { display: '\\omega', code: '\\omega', tip: 'omega' },
        ],
      },
      {
        title: '大写 Uppercase',
        items: [
          { display: '\\Gamma', code: '\\Gamma' },
          { display: '\\Delta', code: '\\Delta' },
          { display: '\\Theta', code: '\\Theta' },
          { display: '\\Lambda', code: '\\Lambda' },
          { display: '\\Xi', code: '\\Xi' },
          { display: '\\Pi', code: '\\Pi' },
          { display: '\\Sigma', code: '\\Sigma' },
          { display: '\\Upsilon', code: '\\Upsilon' },
          { display: '\\Phi', code: '\\Phi' },
          { display: '\\Psi', code: '\\Psi' },
          { display: '\\Omega', code: '\\Omega' },
        ],
      },
    ],
  },

  // ==================== 2. 分数微分 ====================
  {
    name: '分数微分',
    icon: '\\frac{x}{y}',
    groups: [
      {
        title: '分数 Fractions',
        items: [
          { display: '\\frac{a}{b}', code: '\\frac{a}{b}', tip: '分数' },
          { display: 'x\\frac{a}{b}', code: 'x\\frac{a}{b}', tip: '带系数分数' },
          { display: '\\tfrac{a}{b}', code: '\\tfrac{a}{b}', tip: '行内分数' },
          { display: '\\dfrac{a}{b}', code: '\\dfrac{a}{b}', tip: '行间分数' },
          { display: '\\cfrac{1}{a+\\cfrac{1}{b}}', code: '\\cfrac{1}{a+\\cfrac{1}{b}}', tip: '连分数' },
        ],
      },
      {
        title: '微分 Derivatives',
        items: [
          { display: '\\mathrm{d}t', code: '\\mathrm{d}t', tip: 'dt' },
          { display: '\\frac{\\mathrm{d}y}{\\mathrm{d}x}', code: '\\frac{\\mathrm{d}y}{\\mathrm{d}x}', tip: 'dy/dx' },
          { display: '\\partial t', code: '\\partial t', tip: '偏微分' },
          { display: '\\frac{\\partial y}{\\partial x}', code: '\\frac{\\partial y}{\\partial x}', tip: '偏导数' },
          { display: '\\frac{\\partial^2}{\\partial x_1 \\partial x_2}y', code: '\\frac{\\partial^2}{\\partial x_1 \\partial x_2}y', tip: '二阶偏导' },
          { display: '\\nabla\\psi', code: '\\nabla\\psi', tip: '梯度' },
        ],
      },
      {
        title: '导数 Derivative Notations',
        items: [
          { display: "f'", code: "f'", tip: '一阶导' },
          { display: "f''", code: "f''", tip: '二阶导' },
          { display: 'f^{(n)}', code: 'f^{(n)}', tip: 'n阶导' },
          { display: '\\dot{a}', code: '\\dot{a}', tip: '一阶时间导' },
          { display: '\\ddot{a}', code: '\\ddot{a}', tip: '二阶时间导' },
        ],
      },
    ],
  },

  // ==================== 3. 根式角标 ====================
  {
    name: '根式角标',
    icon: '\\sqrt{e^x}',
    groups: [
      {
        title: '根式 Radicals',
        items: [
          { display: '\\sqrt{x}', code: '\\sqrt{x}', tip: '平方根' },
          { display: '\\sqrt[n]{x}', code: '\\sqrt[n]{x}', tip: 'n次根' },
        ],
      },
      {
        title: '上下标 Sub & Super',
        items: [
          { display: 'x^{a}', code: 'x^{a}', tip: '上标' },
          { display: 'x_{a}', code: 'x_{a}', tip: '下标' },
          { display: 'x_{a}^{b}', code: 'x_{a}^{b}', tip: '上下标' },
          { display: '{}_{a}^{b}x', code: '{}_{a}^{b}x', tip: '左侧上下标' },
          { display: '{}_{1}^{2}X_{3}^{4}', code: '{}_{1}^{2}X_{3}^{4}', tip: '四角标' },
        ],
      },
      {
        title: '重音符 Accents',
        items: [
          { display: '\\hat{a}', code: '\\hat{a}', tip: 'hat' },
          { display: '\\check{a}', code: '\\check{a}', tip: 'check' },
          { display: '\\grave{a}', code: '\\grave{a}', tip: 'grave' },
          { display: '\\acute{a}', code: '\\acute{a}', tip: 'acute' },
          { display: '\\tilde{a}', code: '\\tilde{a}', tip: 'tilde' },
          { display: '\\breve{a}', code: '\\breve{a}', tip: 'breve' },
          { display: '\\bar{a}', code: '\\bar{a}', tip: 'bar' },
          { display: '\\vec{a}', code: '\\vec{a}', tip: 'vec' },
          { display: '\\overline{abc}', code: '\\overline{abc}', tip: '上划线' },
          { display: '\\underline{abc}', code: '\\underline{abc}', tip: '下划线' },
          { display: '\\widehat{abc}', code: '\\widehat{abc}', tip: '宽hat' },
          { display: '\\widetilde{abc}', code: '\\widetilde{abc}', tip: '宽tilde' },
          { display: '\\overrightarrow{AB}', code: '\\overrightarrow{AB}', tip: '向量' },
          { display: '\\overleftarrow{AB}', code: '\\overleftarrow{AB}', tip: '左箭头' },
          { display: '\\overbrace{abc}', code: '\\overbrace{abc}^{n}', tip: '上括号' },
          { display: '\\underbrace{abc}', code: '\\underbrace{abc}_{n}', tip: '下括号' },
        ],
      },
    ],
  },

  // ==================== 4. 极限对数 ====================
  {
    name: '极限对数',
    icon: '\\lim_{n \\to \\infty}',
    groups: [
      {
        title: '极限 Limits',
        items: [
          { display: '\\lim a', code: '\\lim a', tip: 'lim' },
          { display: '\\lim_{x \\to 0}', code: '\\lim_{x \\to 0}', tip: 'lim x→0' },
          { display: '\\lim_{x \\to \\infty}', code: '\\lim_{x \\to \\infty}', tip: 'lim x→∞' },
          { display: '\\max_{x}', code: '\\max_{x}', tip: 'max' },
          { display: '\\min_{x}', code: '\\min_{x}', tip: 'min' },
          { display: '\\sup t', code: '\\sup t', tip: 'sup' },
          { display: '\\inf s', code: '\\inf s', tip: 'inf' },
          { display: '\\limsup w', code: '\\limsup w', tip: 'limsup' },
          { display: '\\liminf v', code: '\\liminf v', tip: 'liminf' },
        ],
      },
      {
        title: '对数指数 Logarithms',
        items: [
          { display: '\\log_{a} b', code: '\\log_{a} b', tip: 'log' },
          { display: '\\lg b', code: '\\lg b', tip: 'lg' },
          { display: '\\ln b', code: '\\ln b', tip: 'ln' },
          { display: '\\exp a', code: '\\exp a', tip: 'exp' },
          { display: 'e^{x}', code: 'e^{x}', tip: 'e^x' },
          { display: '10^{x}', code: '10^{x}', tip: '10^x' },
        ],
      },
      {
        title: '模运算 Modular',
        items: [
          { display: 'a \\bmod b', code: 'a \\bmod b', tip: 'mod' },
          { display: 'a \\equiv b \\pmod{m}', code: 'a \\equiv b \\pmod{m}', tip: 'congruence' },
          { display: '\\gcd(m,n)', code: '\\gcd(m,n)', tip: 'gcd' },
        ],
      },
    ],
  },

  // ==================== 5. 三角函数 ====================
  {
    name: '三角函数',
    icon: '\\sin\\alpha',
    groups: [
      {
        title: '基本三角 Trigonometric',
        items: [
          { display: '\\sin\\theta', code: '\\sin\\theta' },
          { display: '\\cos\\theta', code: '\\cos\\theta' },
          { display: '\\tan\\theta', code: '\\tan\\theta' },
          { display: '\\cot\\theta', code: '\\cot\\theta' },
          { display: '\\sec\\theta', code: '\\sec\\theta' },
          { display: '\\csc\\theta', code: '\\csc\\theta' },
        ],
      },
      {
        title: '反三角 Inverse',
        items: [
          { display: '\\arcsin x', code: '\\arcsin x' },
          { display: '\\arccos x', code: '\\arccos x' },
          { display: '\\arctan x', code: '\\arctan x' },
          { display: '\\sin^{-1} x', code: '\\sin^{-1} x' },
        ],
      },
      {
        title: '双曲 Hyperbolic',
        items: [
          { display: '\\sinh x', code: '\\sinh x' },
          { display: '\\cosh x', code: '\\cosh x' },
          { display: '\\tanh x', code: '\\tanh x' },
          { display: '\\coth x', code: '\\coth x' },
        ],
      },
    ],
  },

  // ==================== 6. 积分运算 ====================
  {
    name: '积分运算',
    icon: '\\int_{a}^{b}',
    groups: [
      {
        title: '积分 Integrals',
        items: [
          { display: '\\int', code: '\\int', tip: '不定积分' },
          { display: '\\int_{a}^{b}', code: '\\int_{a}^{b}', tip: '定积分' },
          { display: '\\int\\!\\!\\int', code: '\\iint', tip: '二重积分' },
          { display: '\\int\\!\\!\\int\\!\\!\\int', code: '\\iiint', tip: '三重积分' },
          { display: '\\oint', code: '\\oint', tip: '环路积分' },
          { display: '\\int_{0}^{\\infty}', code: '\\int_{0}^{\\infty}', tip: '0到∞积分' },
          { display: '\\int_{-\\infty}^{+\\infty}', code: '\\int_{-\\infty}^{+\\infty}', tip: '全实数积分' },
        ],
      },
      {
        title: '积分公式模板',
        items: [
          { display: '\\int f(x)\\,\\mathrm{d}x', code: '\\int f(x)\\,\\mathrm{d}x', tip: '标准积分' },
          { display: '\\int_{a}^{b} f(x)\\,\\mathrm{d}x', code: '\\int_{a}^{b} f(x)\\,\\mathrm{d}x', tip: '定积分模板' },
          { display: '\\int_{0}^{\\infty} e^{-x^2}\\,\\mathrm{d}x', code: '\\int_{0}^{\\infty} e^{-x^2}\\,\\mathrm{d}x', tip: '高斯积分' },
        ],
      },
    ],
  },

  // ==================== 7. 大型运算 ====================
  {
    name: '大型运算',
    icon: '\\sum_{i=0}^{n}',
    groups: [
      {
        title: '求和 Summation',
        items: [
          { display: '\\sum', code: '\\sum' },
          { display: '\\sum_{i=1}^{n}', code: '\\sum_{i=1}^{n}', tip: '求和' },
          { display: '\\sum_{k=0}^{\\infty}', code: '\\sum_{k=0}^{\\infty}', tip: '无穷级数' },
          { display: '\\displaystyle\\sum_{i=1}^{n} a_i', code: '\\sum_{i=1}^{n} a_i', tip: '求和公式' },
        ],
      },
      {
        title: '连乘 Product',
        items: [
          { display: '\\prod', code: '\\prod' },
          { display: '\\prod_{i=1}^{n}', code: '\\prod_{i=1}^{n}' },
          { display: '\\coprod', code: '\\coprod' },
        ],
      },
      {
        title: '其他大型运算',
        items: [
          { display: '\\bigcup', code: '\\bigcup' },
          { display: '\\bigcap', code: '\\bigcap' },
          { display: '\\bigoplus', code: '\\bigoplus' },
          { display: '\\bigotimes', code: '\\bigotimes' },
          { display: '\\bigvee', code: '\\bigvee' },
          { display: '\\bigwedge', code: '\\bigwedge' },
          { display: '\\bigsqcup', code: '\\bigsqcup' },
          { display: '\\biguplus', code: '\\biguplus' },
        ],
      },
    ],
  },

  // ==================== 8. 括号取整 ====================
  {
    name: '括号取整',
    icon: '\\{[()]\\}',
    groups: [
      {
        title: '括号 Brackets',
        items: [
          { display: '(a)', code: '(a)' },
          { display: '[a]', code: '[a]' },
          { display: '\\{a\\}', code: '\\{a\\}' },
          { display: '\\langle a \\rangle', code: '\\langle a \\rangle', tip: '尖括号' },
          { display: '|a|', code: '|a|', tip: '绝对值' },
          { display: '\\|a\\|', code: '\\|a\\|', tip: '范数' },
          { display: '\\lfloor a \\rfloor', code: '\\lfloor a \\rfloor', tip: '下取整' },
          { display: '\\lceil a \\rceil', code: '\\lceil a \\rceil', tip: '上取整' },
        ],
      },
      {
        title: '自动伸缩 Auto-sized',
        items: [
          { display: '\\left( \\frac{a}{b} \\right)', code: '\\left( \\frac{a}{b} \\right)', tip: '自适应圆括号' },
          { display: '\\left[ \\frac{a}{b} \\right]', code: '\\left[ \\frac{a}{b} \\right]', tip: '自适应方括号' },
          { display: '\\left\\{ \\frac{a}{b} \\right\\}', code: '\\left\\{ \\frac{a}{b} \\right\\}', tip: '自适应花括号' },
          { display: '\\left| \\frac{a}{b} \\right|', code: '\\left| \\frac{a}{b} \\right|', tip: '自适应绝对值' },
        ],
      },
    ],
  },

  // ==================== 9. 数组矩阵 ====================
  {
    name: '数组矩阵',
    icon: '\\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix}',
    groups: [
      {
        title: '矩阵 Matrices',
        items: [
          {
            display: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
            code: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
            tip: '圆括号矩阵',
          },
          {
            display: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
            code: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
            tip: '方括号矩阵',
          },
          {
            display: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}',
            code: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}',
            tip: '行列式',
          },
          {
            display: '\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}',
            code: '\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}',
            tip: '花括号矩阵',
          },
          {
            display: '\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}',
            code: '\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}',
            tip: '双竖线矩阵',
          },
        ],
      },
      {
        title: '矩阵模板',
        items: [
          {
            display: '\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}',
            code: '\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}',
            tip: '2×2 单位矩阵',
          },
          {
            display: '\\begin{pmatrix} a_{11} & \\cdots & a_{1n} \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} \\end{pmatrix}',
            code: '\\begin{pmatrix} a_{11} & \\cdots & a_{1n} \\\\ \\vdots & \\ddots & \\vdots \\\\ a_{m1} & \\cdots & a_{mn} \\end{pmatrix}',
            tip: 'm×n 矩阵',
          },
        ],
      },
      {
        title: '分段函数',
        items: [
          {
            display: 'f(x)=\\begin{cases} a & x>0 \\\\ b & x\\le 0 \\end{cases}',
            code: 'f(x)=\\begin{cases} a & x>0 \\\\ b & x\\le 0 \\end{cases}',
            tip: '分段函数',
          },
        ],
      },
    ],
  },

  // ==================== 10. 二元运算符 ====================
  {
    name: '运算符号',
    icon: '+\\,-\\,\\times',
    groups: [
      {
        title: '二元运算 Binary Operations',
        items: [
          { display: '+', code: '+' },
          { display: '-', code: '-' },
          { display: '\\times', code: '\\times', tip: '乘号' },
          { display: '\\div', code: '\\div', tip: '除号' },
          { display: '\\pm', code: '\\pm', tip: '±' },
          { display: '\\mp', code: '\\mp', tip: '∓' },
          { display: '\\cdot', code: '\\cdot', tip: '点乘' },
          { display: '\\star', code: '\\star' },
          { display: '\\ast', code: '\\ast' },
          { display: '\\circ', code: '\\circ' },
          { display: '\\bullet', code: '\\bullet' },
          { display: '\\cap', code: '\\cap', tip: '∩ 交集' },
          { display: '\\cup', code: '\\cup', tip: '∪ 并集' },
          { display: '\\setminus', code: '\\setminus', tip: '差集' },
          { display: '\\oplus', code: '\\oplus', tip: '⊕' },
          { display: '\\otimes', code: '\\otimes', tip: '⊗' },
          { display: '\\odot', code: '\\odot', tip: '⊙' },
          { display: '\\wedge', code: '\\wedge', tip: '∧ 逻辑与' },
          { display: '\\vee', code: '\\vee', tip: '∨ 逻辑或' },
          { display: '\\diamond', code: '\\diamond' },
          { display: '\\triangleleft', code: '\\triangleleft' },
          { display: '\\triangleright', code: '\\triangleright' },
        ],
      },
      {
        title: '二元关系 Binary Relations',
        items: [
          { display: '<', code: '<' },
          { display: '>', code: '>' },
          { display: '=', code: '=' },
          { display: '\\ne', code: '\\ne', tip: '≠' },
          { display: '\\le', code: '\\le', tip: '≤' },
          { display: '\\ge', code: '\\ge', tip: '≥' },
          { display: '\\ll', code: '\\ll', tip: '≪' },
          { display: '\\gg', code: '\\gg', tip: '≫' },
          { display: '\\sim', code: '\\sim', tip: '~' },
          { display: '\\simeq', code: '\\simeq', tip: '≃' },
          { display: '\\approx', code: '\\approx', tip: '≈' },
          { display: '\\cong', code: '\\cong', tip: '≅' },
          { display: '\\equiv', code: '\\equiv', tip: '≡' },
          { display: '\\doteq', code: '\\doteq' },
          { display: '\\subset', code: '\\subset', tip: '⊂' },
          { display: '\\supset', code: '\\supset', tip: '⊃' },
          { display: '\\subseteq', code: '\\subseteq', tip: '⊆' },
          { display: '\\supseteq', code: '\\supseteq', tip: '⊇' },
          { display: '\\in', code: '\\in', tip: '∈' },
          { display: '\\ni', code: '\\ni', tip: '∋' },
          { display: '\\notin', code: '\\notin', tip: '∉' },
          { display: '\\propto', code: '\\propto', tip: '∝' },
          { display: '\\perp', code: '\\perp', tip: '⊥' },
          { display: '\\parallel', code: '\\parallel', tip: '∥' },
          { display: '\\vdash', code: '\\vdash', tip: '⊢' },
          { display: '\\dashv', code: '\\dashv', tip: '⊣' },
          { display: '\\models', code: '\\models', tip: '⊨' },
        ],
      },
    ],
  },

  // ==================== 11. 箭头符号 ====================
  {
    name: '箭头符号',
    icon: '\\leftarrow\\rightarrow',
    groups: [
      {
        title: '箭头 Arrows',
        items: [
          { display: '\\leftarrow', code: '\\leftarrow', tip: '←' },
          { display: '\\rightarrow', code: '\\rightarrow', tip: '→' },
          { display: '\\uparrow', code: '\\uparrow', tip: '↑' },
          { display: '\\downarrow', code: '\\downarrow', tip: '↓' },
          { display: '\\leftrightarrow', code: '\\leftrightarrow', tip: '↔' },
          { display: '\\updownarrow', code: '\\updownarrow', tip: '↕' },
          { display: '\\Leftarrow', code: '\\Leftarrow', tip: '⇐' },
          { display: '\\Rightarrow', code: '\\Rightarrow', tip: '⇒' },
          { display: '\\Uparrow', code: '\\Uparrow', tip: '⇑' },
          { display: '\\Downarrow', code: '\\Downarrow', tip: '⇓' },
          { display: '\\Leftrightarrow', code: '\\Leftrightarrow', tip: '⇔' },
          { display: '\\Updownarrow', code: '\\Updownarrow', tip: '⇕' },
          { display: '\\mapsto', code: '\\mapsto', tip: '↦' },
          { display: '\\longmapsto', code: '\\longmapsto', tip: '⟼' },
          { display: '\\longrightarrow', code: '\\longrightarrow', tip: '⟶' },
          { display: '\\longleftarrow', code: '\\longleftarrow', tip: '⟵' },
          { display: '\\longleftrightarrow', code: '\\longleftrightarrow', tip: '⟷' },
          { display: '\\Longrightarrow', code: '\\Longrightarrow', tip: '⟹' },
          { display: '\\Longleftarrow', code: '\\Longleftarrow', tip: '⟸' },
          { display: '\\hookrightarrow', code: '\\hookrightarrow', tip: '↪' },
          { display: '\\hookleftarrow', code: '\\hookleftarrow', tip: '↩' },
          { display: '\\nearrow', code: '\\nearrow', tip: '↗' },
          { display: '\\searrow', code: '\\searrow', tip: '↘' },
          { display: '\\swarrow', code: '\\swarrow', tip: '↙' },
          { display: '\\nwarrow', code: '\\nwarrow', tip: '↖' },
          { display: '\\to', code: '\\to', tip: '→ (to)' },
          { display: '\\gets', code: '\\gets', tip: '← (gets)' },
          { display: '\\iff', code: '\\iff', tip: '⟺ (iff)' },
          { display: '\\implies', code: '\\implies', tip: '⟹ (implies)' },
          { display: '\\impliedby', code: '\\impliedby', tip: '⟸ (impliedby)' },
        ],
      },
    ],
  },

  // ==================== 12. 其他符号 ====================
  {
    name: '其他符号',
    icon: '\\infty\\forall',
    groups: [
      {
        title: '逻辑集合 Logic & Sets',
        items: [
          { display: '\\forall', code: '\\forall', tip: '∀' },
          { display: '\\exists', code: '\\exists', tip: '∃' },
          { display: '\\nexists', code: '\\nexists', tip: '∄' },
          { display: '\\neg', code: '\\neg', tip: '¬' },
          { display: '\\land', code: '\\land', tip: '∧' },
          { display: '\\lor', code: '\\lor', tip: '∨' },
          { display: '\\emptyset', code: '\\emptyset', tip: '∅' },
          { display: '\\varnothing', code: '\\varnothing', tip: '∅' },
          { display: '\\therefore', code: '\\therefore', tip: '∴' },
          { display: '\\because', code: '\\because', tip: '∵' },
        ],
      },
      {
        title: '其他 Miscellaneous',
        items: [
          { display: '\\infty', code: '\\infty', tip: '∞' },
          { display: '\\aleph', code: '\\aleph' },
          { display: '\\hbar', code: '\\hbar' },
          { display: '\\ell', code: '\\ell' },
          { display: '\\wp', code: '\\wp' },
          { display: '\\Re', code: '\\Re', tip: '实部' },
          { display: '\\Im', code: '\\Im', tip: '虚部' },
          { display: '\\angle', code: '\\angle', tip: '角度' },
          { display: '\\triangle', code: '\\triangle', tip: '三角形' },
          { display: '\\square', code: '\\square', tip: '正方形' },
          { display: '\\clubsuit', code: '\\clubsuit' },
          { display: '\\diamondsuit', code: '\\diamondsuit' },
          { display: '\\heartsuit', code: '\\heartsuit' },
          { display: '\\spadesuit', code: '\\spadesuit' },
          { display: '\\flat', code: '\\flat' },
          { display: '\\natural', code: '\\natural' },
          { display: '\\sharp', code: '\\sharp' },
          { display: '\\checkmark', code: '\\checkmark' },
          { display: '\\maltese', code: '\\maltese' },
        ],
      },
      {
        title: '点号 Dots',
        items: [
          { display: '\\cdots', code: '\\cdots', tip: '水平居中点' },
          { display: '\\ldots', code: '\\ldots', tip: '水平底部点' },
          { display: '\\vdots', code: '\\vdots', tip: '垂直点' },
          { display: '\\ddots', code: '\\ddots', tip: '对角点' },
        ],
      },
      {
        title: '数学字体 Math Fonts',
        items: [
          { display: '\\mathbb{R}', code: '\\mathbb{R}', tip: '黑板粗体' },
          { display: '\\mathbb{N}', code: '\\mathbb{N}', tip: '自然数集' },
          { display: '\\mathbb{Z}', code: '\\mathbb{Z}', tip: '整数集' },
          { display: '\\mathbb{Q}', code: '\\mathbb{Q}', tip: '有理数集' },
          { display: '\\mathbb{C}', code: '\\mathbb{C}', tip: '复数集' },
          { display: '\\mathcal{L}', code: '\\mathcal{L}', tip: '花体' },
          { display: '\\mathfrak{g}', code: '\\mathfrak{g}', tip: '哥特体' },
          { display: '\\mathrm{ABC}', code: '\\mathrm{ABC}', tip: '罗马体' },
          { display: '\\mathbf{v}', code: '\\mathbf{v}', tip: '粗体' },
          { display: '\\mathit{abc}', code: '\\mathit{abc}', tip: '斜体' },
        ],
      },
      {
        title: '空格 Spacing',
        items: [
          { display: 'a\\,b', code: '\\,', tip: '小空格' },
          { display: 'a\\;b', code: '\\;', tip: '中空格' },
          { display: 'a\\quad b', code: '\\quad', tip: '大空格' },
          { display: 'a\\qquad b', code: '\\qquad', tip: '双大空格' },
        ],
      },
    ],
  },
];
