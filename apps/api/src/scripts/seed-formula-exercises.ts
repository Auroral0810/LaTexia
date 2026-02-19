import { db } from '../db';
import { formulaExercises } from '../db/schema';

const SEED_DATA = [
  // ===== easy =====
  { title: '质能方程', latex: 'E = mc^2', difficulty: 'easy', category: 'physics' },
  { title: '牛顿第二定律', latex: '\\vec{F} = m\\vec{a}', difficulty: 'easy', category: 'physics' },
  { title: '希腊字母求和', latex: '\\alpha + \\beta = \\gamma', difficulty: 'easy', category: 'greek' },
  { title: '简单分数', latex: '\\frac{a}{b}', difficulty: 'easy', category: 'arithmetic' },
  { title: '平方根', latex: '\\sqrt{a^2 + b^2}', difficulty: 'easy', category: 'arithmetic' },
  { title: '一元二次方程顶点', latex: 'x = \\frac{-b}{2a}', difficulty: 'easy', category: 'algebra' },
  { title: '圆的面积', latex: 'S = \\pi r^2', difficulty: 'easy', category: 'geometry' },
  { title: '勾股定理', latex: 'a^2 + b^2 = c^2', difficulty: 'easy', category: 'geometry' },
  { title: '三角函数定义', latex: '\\sin\\theta = \\frac{\\text{opposite}}{\\text{hypotenuse}}', difficulty: 'easy', category: 'geometry' },
  { title: '对数恒等式', latex: '\\log_a b = \\frac{\\ln b}{\\ln a}', difficulty: 'easy', category: 'algebra' },
  { title: '指数法则', latex: 'a^m \\cdot a^n = a^{m+n}', difficulty: 'easy', category: 'algebra' },
  { title: '绝对值', latex: '|x| = \\begin{cases} x & x \\geq 0 \\\\ -x & x < 0 \\end{cases}', difficulty: 'easy', category: 'algebra' },

  // ===== medium =====
  { title: '一元二次求根公式', latex: '\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}', difficulty: 'medium', category: 'algebra' },
  { title: '高斯积分', latex: '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}', difficulty: 'medium', category: 'calculus' },
  { title: '巴塞尔问题', latex: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}', difficulty: 'medium', category: 'calculus' },
  { title: '二项式系数', latex: '\\binom{n}{k} = \\frac{n!}{k!(n-k)!}', difficulty: 'medium', category: 'algebra' },
  { title: 'sinc 极限', latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', difficulty: 'medium', category: 'calculus' },
  { title: '欧拉公式', latex: 'e^{i\\pi} + 1 = 0', difficulty: 'medium', category: 'algebra' },
  { title: '导数链式法则', latex: '\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}', difficulty: 'medium', category: 'calculus' },
  { title: '泰勒展开 (e^x)', latex: 'e^x = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}', difficulty: 'medium', category: 'calculus' },
  { title: '分部积分', latex: '\\int u \\, dv = uv - \\int v \\, du', difficulty: 'medium', category: 'calculus' },
  { title: '矩阵乘法 2x2', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} e \\\\ f \\end{pmatrix} = \\begin{pmatrix} ae+bf \\\\ ce+df \\end{pmatrix}', difficulty: 'medium', category: 'matrix' },
  { title: '行列式 2x2', latex: '\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc', difficulty: 'medium', category: 'matrix' },
  { title: '偏导数', latex: '\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x+h, y) - f(x, y)}{h}', difficulty: 'medium', category: 'calculus' },
  { title: '正态分布密度', latex: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}', difficulty: 'medium', category: 'algebra' },

  // ===== hard =====
  { title: '麦克斯韦旋度方程', latex: '\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}', difficulty: 'hard', category: 'physics' },
  { title: '薛定谔方程', latex: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi = \\hat{H} \\Psi', difficulty: 'hard', category: 'physics' },
  { title: '柯西积分公式', latex: 'f(a) = \\frac{1}{2\\pi i} \\oint_\\gamma \\frac{f(z)}{z-a} \\, dz', difficulty: 'hard', category: 'calculus' },
  { title: '斯托克斯定理', latex: '\\oint_{\\partial \\Sigma} \\vec{F} \\cdot d\\vec{r} = \\iint_\\Sigma (\\nabla \\times \\vec{F}) \\cdot d\\vec{S}', difficulty: 'hard', category: 'calculus' },
  { title: '傅里叶变换', latex: '\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x) e^{-2\\pi i x \\xi} \\, dx', difficulty: 'hard', category: 'calculus' },
  { title: '黎曼 zeta 函数', latex: '\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}', difficulty: 'hard', category: 'algebra' },
  { title: '拉格朗日方程', latex: '\\frac{d}{dt} \\frac{\\partial L}{\\partial \\dot{q}} - \\frac{\\partial L}{\\partial q} = 0', difficulty: 'hard', category: 'physics' },
  { title: '广义相对论场方程', latex: 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4} T_{\\mu\\nu}', difficulty: 'hard', category: 'physics' },
  { title: '贝叶斯定理', latex: 'P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}', difficulty: 'hard', category: 'algebra' },
  { title: '3x3 行列式展开', latex: '\\det(A) = a_{11}(a_{22}a_{33}-a_{23}a_{32}) - a_{12}(a_{21}a_{33}-a_{23}a_{31}) + a_{13}(a_{21}a_{32}-a_{22}a_{31})', difficulty: 'hard', category: 'matrix' },
];

async function seed() {
  console.log('Seeding formula exercises...');
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
  console.log(`Inserted ${SEED_DATA.length} formula exercises.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
