import { db } from '../db';
import { formulaExercises } from '../db/schema';

const SEED_DATA = [
  // ===== easy (Arithmetic, Basic Algebra, Basic Greek) =====
  { title: '简单加法', latex: 'a + b = c', difficulty: 'easy', category: 'arithmetic' },
  { title: '简单减法', latex: 'x - y = z', difficulty: 'easy', category: 'arithmetic' },
  { title: '乘法等式', latex: 'a \\times b = ab', difficulty: 'easy', category: 'arithmetic' },
  { title: '除法表示', latex: 'a \\div b = \\frac{a}{b}', difficulty: 'easy', category: 'arithmetic' },
  { title: '平方项', latex: 'x^2', difficulty: 'easy', category: 'arithmetic' },
  { title: '立方项', latex: 'x^3', difficulty: 'easy', category: 'arithmetic' },
  { title: '希腊字母 Pi', latex: '\\pi', difficulty: 'easy', category: 'greek' },
  { title: '希腊字母 Omega', latex: '\\Omega', difficulty: 'easy', category: 'greek' },
  { title: '希腊字母 Delta', latex: '\\Delta', difficulty: 'easy', category: 'greek' },
  { title: '希腊字母 Theta', latex: '\\theta', difficulty: 'easy', category: 'greek' },
  { title: '平方根', latex: '\\sqrt{x}', difficulty: 'easy', category: 'arithmetic' },
  { title: '绝对值', latex: '|x|', difficulty: 'easy', category: 'arithmetic' },
  { title: '等于', latex: '= ', difficulty: 'easy', category: 'arithmetic' },
  { title: '不等于', latex: '\\neq', difficulty: 'easy', category: 'arithmetic' },
  { title: '约等于', latex: '\\approx', difficulty: 'easy', category: 'arithmetic' },
  { title: '小于等于', latex: '\\leq', difficulty: 'easy', category: 'arithmetic' },
  { title: '大于等于', latex: '\\geq', difficulty: 'easy', category: 'arithmetic' },
  { title: '正负号', latex: '\\pm', difficulty: 'easy', category: 'arithmetic' },
  { title: '无穷大', latex: '\\infty', difficulty: 'easy', category: 'arithmetic' },
  { title: '空集', latex: '\\emptyset', difficulty: 'easy', category: 'set' },
  { title: '交集', latex: 'A \\cap B', difficulty: 'easy', category: 'set' },
  { title: '并集', latex: 'A \\cup B', difficulty: 'easy', category: 'set' },
  { title: '属于', latex: 'x \\in A', difficulty: 'easy', category: 'set' },
  { title: '子集', latex: 'A \\subseteq B', difficulty: 'easy', category: 'set' },
  { title: '线性方程', latex: 'y = kx + b', difficulty: 'easy', category: 'algebra' },
  { title: '比例关系', latex: '\\frac{y}{x} = k', difficulty: 'easy', category: 'algebra' },
  { title: '余弦函数', latex: '\\cos x', difficulty: 'easy', category: 'trigonometry' },
  { title: '正弦函数', latex: '\\sin x', difficulty: 'easy', category: 'trigonometry' },
  { title: '正切函数', latex: '\\tan x', difficulty: 'easy', category: 'trigonometry' },
  { title: '对数', latex: '\\log x', difficulty: 'easy', category: 'algebra' },
  { title: '自然对数', latex: '\\ln x', difficulty: 'easy', category: 'algebra' },
  { title: '指数函数', latex: 'e^x', difficulty: 'easy', category: 'algebra' },
  { title: '简单极限', latex: '\\lim_{x \\to 0} x', difficulty: 'easy', category: 'calculus' },
  { title: '百分比', latex: 'x\\%', difficulty: 'easy', category: 'arithmetic' },

  // ===== medium (Intermediate Algebra, Calculus, Statistics) =====
  { title: '求和符号', latex: '\\sum_{i=1}^{n} i', difficulty: 'medium', category: 'discrete' },
  { title: '连乘符号', latex: '\\prod_{i=1}^{n} a_i', difficulty: 'medium', category: 'discrete' },
  { title: '一元二次方程', latex: 'ax^2 + bx + c = 0', difficulty: 'medium', category: 'algebra' },
  { title: '完全平方公式', latex: '(a+b)^2 = a^2 + 2ab + b^2', difficulty: 'medium', category: 'algebra' },
  { title: '平方差公式', latex: 'a^2 - b^2 = (a+b)(a-b)', difficulty: 'medium', category: 'algebra' },
  { title: '多项式', latex: 'P(x) = a_n x^n + \\dots + a_0', difficulty: 'medium', category: 'algebra' },
  { title: '二项式展开', latex: '(x+y)^n = \\sum_{k=0}^n \\binom{n}{k} x^{n-k} y^k', difficulty: 'medium', category: 'algebra' },
  { title: '组合数公式', latex: 'C_n^k = \\frac{n!}{k!(n-k)!}', difficulty: 'medium', category: 'discrete' },
  { title: '排列数公式', latex: 'A_n^k = \\frac{n!}{(n-k)!}', difficulty: 'medium', category: 'discrete' },
  { title: '不定积分', latex: '\\int f(x) dx = F(x) + C', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\int_a^b f(x) dx', difficulty: 'medium', category: 'calculus' },
  { title: '导数定义', latex: 'f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}', difficulty: 'medium', category: 'calculus' },
  { title: '导数乘法法则', latex: '(uv)\' = u\'v + uv\'', difficulty: 'medium', category: 'calculus' },
  { title: '导数除法法则', latex: '(\\frac{u}{v})\' = \\frac{u\'v - uv\'}{v^2}', difficulty: 'medium', category: 'calculus' },
  { title: '三角恒等式', latex: '\\sin^2 x + \\cos^2 x = 1', difficulty: 'medium', category: 'trigonometry' },
  { title: '倍角公式', latex: '\\sin(2x) = 2\\sin x \\cos x', difficulty: 'medium', category: 'trigonometry' },
  { title: '虚数单位', latex: 'i^2 = -1', difficulty: 'medium', category: 'algebra' },
  { title: '复数表示', latex: 'z = a + bi', difficulty: 'medium', category: 'algebra' },
  { title: '极坐标', latex: '(r, \\theta)', difficulty: 'medium', category: 'algebra' },
  { title: '向量点积', latex: '\\vec{a} \\cdot \\vec{b} = |a||b|\\cos\\theta', difficulty: 'medium', category: 'vector' },
  { title: '向量叉积模长', latex: '|\\vec{a} \\times \\vec{b}| = |a||b|\\sin\\theta', difficulty: 'medium', category: 'vector' },
  { title: '行列式记法', latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', difficulty: 'medium', category: 'matrix' },
  { title: '单位矩阵', latex: 'I = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}', difficulty: 'medium', category: 'matrix' },
  { title: '平均值', latex: '\\bar{x} = \\frac{1}{n} \\sum_{i=1}^n x_i', difficulty: 'medium', category: 'statistics' },
  { title: '方差', latex: 's^2 = \\frac{1}{n-1} \\sum_{i=1}^n (x_i - \\bar{x})^2', difficulty: 'medium', category: 'statistics' },
  { title: '标准差', latex: '\\sigma = \\sqrt{E[(X-\\mu)^2]}', difficulty: 'medium', category: 'statistics' },
  { title: '几何级数求和', latex: '\\sum_{n=0}^{\\infty} r^n = \\frac{1}{1-r}', difficulty: 'medium', category: 'calculus' },
  { title: '弧长公式', latex: 'd s = \\sqrt{d x^2 + d y^2}', difficulty: 'medium', category: 'calculus' },
  { title: '曲率公式', latex: '\\kappa = \\frac{|y\'\'|}{(1+y\'^2)^{3/2}}', difficulty: 'medium', category: 'calculus' },
  { title: '多元函数全微分', latex: 'dz = \\frac{\\partial z}{\\partial x}dx + \\frac{\\partial z}{\\partial y}dy', difficulty: 'medium', category: 'calculus' },
  { title: '分段函数', latex: 'f(x) = \\begin{cases} x, & x \\geq 0 \\\\ -x, & x < 0 \\end{cases}', difficulty: 'medium', category: 'algebra' },
  { title: '取模运算', latex: 'a \\equiv b \\pmod{n}', difficulty: 'medium', category: 'number-theory' },

  // ===== hard (Advanced Calculus, Physics, Linear Algebra, etc.) =====
  { title: '欧拉恒等式', latex: 'e^{i\\theta} = \\cos\\theta + i\\sin\\theta', difficulty: 'hard', category: 'algebra' },
  { title: '斯特林公式', latex: 'n! \\approx \\sqrt{2\\pi n} (\\frac{n}{e})^n', difficulty: 'hard', category: 'calculus' },
  { title: '拉普拉斯变换', latex: '\\mathcal{L}\\{f(t)\\} = \\int_0^\\infty e^{-st} f(t) dt', difficulty: 'hard', category: 'calculus' },
  { title: '逆变换公式', latex: 'f(t) = \\frac{1}{2\\pi i} \\int_{c-i\\infty}^{c+i\\infty} e^{st} F(s) ds', difficulty: 'hard', category: 'calculus' },
  { title: '微积分基本定理', latex: '\\int_a^b f(x) dx = F(b) - F(a)', difficulty: 'hard', category: 'calculus' },
  { title: '高斯散度定理', latex: '\\iiint_V (\\nabla \\cdot \\vec{F}) dV = \\oiint_S \\vec{F} \\cdot d\\vec{S}', difficulty: 'hard', category: 'calculus' },
  { title: '格林公式', latex: '\\oint_C (P dx + Q dy) = \\iint_D (\\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y}) dA', difficulty: 'hard', category: 'calculus' },
  { title: '薛定谔方程(定态)', latex: '\\hat{H}\\psi = E\\psi', difficulty: 'hard', category: 'physics' },
  { title: '海森堡不确定性原理', latex: '\\Delta x \\Delta p \\geq \\frac{\\hbar}{2}', difficulty: 'hard', category: 'physics' },
  { title: '狄拉克符号', latex: '\\langle \\phi | \\psi \\rangle', difficulty: 'hard', category: 'physics' },
  { title: '爱因斯坦场方程', latex: 'R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}', difficulty: 'hard', category: 'physics' },
  { title: '洛伦兹力', latex: '\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})', difficulty: 'hard', category: 'physics' },
  { title: '奈奎斯特判据', latex: 'Z = P - 2N', difficulty: 'hard', category: 'control' },
  { title: '状态空间方程', latex: '\\dot{x} = Ax + Bu', difficulty: 'hard', category: 'control' },
  { title: '齐次线性方程组', latex: 'A\\mathbf{x} = \\mathbf{0}', difficulty: 'hard', category: 'matrix' },
  { title: '特征值方程', latex: 'A\\mathbf{v} = \\lambda\\mathbf{v}', difficulty: 'hard', category: 'matrix' },
  { title: 'SVD分解', latex: 'A = U \\Sigma V^T', difficulty: 'hard', category: 'matrix' },
  { title: 'QR分解', latex: 'A = QR', difficulty: 'hard', category: 'matrix' },
  { title: '卷积公式', latex: '(f * g)(t) = \\int_{-\\infty}^{\\infty} f(\\tau) g(t-\\tau) d\\tau', difficulty: 'hard', category: 'calculus' },
  { title: '熵的定义', latex: 'S = -k_B \\sum p_i \\ln p_i', difficulty: 'hard', category: 'physics' },
  { title: '黑体辐射公式', latex: 'B_\\nu(T) = \\frac{2h\\nu^3}{c^2} \\frac{1}{e^{h\\nu/k_BT}-1}', difficulty: 'hard', category: 'physics' },
  { title: '伯努利方程', latex: 'P + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{const}', difficulty: 'hard', category: 'physics' },
  { title: '纳维-斯托克斯方程', latex: '\\rho(\\frac{\\partial \\mathbf{v}}{\\partial t} + \\mathbf{v} \\cdot \\nabla \\mathbf{v}) = -\\nabla p + \\mu \\nabla^2 \\mathbf{v} + \\mathbf{f}', difficulty: 'hard', category: 'physics' },
  { title: '黎曼和', latex: '\\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i^*) \\Delta x_i', difficulty: 'hard', category: 'calculus' },
  { title: '三维旋转矩阵', latex: 'R_z(\\theta) = \\begin{pmatrix} \\cos\\theta \u0026 -\\sin\\theta \u0026 0 \\\\ \\sin\\theta \u0026 \\cos\\theta \u0026 0 \\\\ 0 \u0026 0 \u0026 1 \\end{pmatrix}', difficulty: 'hard', category: 'matrix' },
  { title: '极化公式', latex: '\\langle u, v \\rangle = \\frac{1}{4}(||u+v||^2 - ||u-v||^2)', difficulty: 'hard', category: 'vector' },
  { title: '莫比乌斯函数', latex: '\\mu(n) = \\begin{cases} 1 & n=1 \\\\ (-1)^k & n=p_1\\dots p_k \\\\ 0 & \\text{otherwise} \\end{cases}', difficulty: 'hard', category: 'number-theory' },
  { title: '欧拉函数', latex: '\\phi(n) = n \\prod_{p|n} (1 - \\frac{1}{p})', difficulty: 'hard', category: 'number-theory' },
  { title: '勒让德多项式', latex: 'P_n(x) = \\frac{1}{2^n n!} \\frac{d^n}{dx^n} (x^2-1)^n', difficulty: 'hard', category: 'calculus' },
  { title: '伽马函数', latex: '\\Gamma(z) = \\int_0^\\infty t^{z-1} e^-t dt', difficulty: 'hard', category: 'calculus' },
  { title: '切比雪夫不等式', latex: 'P(|X-\\mu| \\geq k\\sigma) \\leq \\frac{1}{k^2}', difficulty: 'hard', category: 'statistics' },
  { title: '大数定律', latex: '\\lim_{n \\to \\infty} P(|\\frac{S_n}{n} - \mu| < \\epsilon) = 1', difficulty: 'hard', category: 'statistics' },
  { title: '中心极限定理', latex: '\\sqrt{n}(\\bar{X}_n - \\mu) \\xrightarrow{d} N(0, \\sigma^2)', difficulty: 'hard', category: 'statistics' },
  { title: 'Logistic 函数', latex: 'f(x) = \\frac{L}{1 + e^{-k(x-x_0)}}', difficulty: 'hard', category: 'algebra' },
];

async function seed() {
  console.log('Seeding 100 formula exercises...');
  // Optional: clear existing if needed, but here we just add
  for (const item of SEED_DATA) {
    await db.insert(formulaExercises).values({
      title: item.title,
      latex: item.latex,
      difficulty: item.difficulty,
      category: item.category,
      status: 'published',
      createdBy: 'system',
    });
  }
  console.log(`Successfully inserted ${SEED_DATA.length} formula exercises.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
