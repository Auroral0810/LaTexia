import { db } from '../db';
import { formulaExercises } from '../db/schema';

const SEED_DATA_V3 = [
  // ===== 极限 (Limits) - 25 items =====
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{\\tan x - x}{x^3} = \\frac{1}{3}', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{n \\to \\infty} (1 + \\frac{1}{n})^n = e', difficulty: 'easy', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to \\infty} \\frac{\\ln x}{x^k} = 0', difficulty: 'easy', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1', difficulty: 'easy', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2} = \\frac{1}{2}', difficulty: 'easy', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to a} \\frac{f(x) - f(a)}{x - a} = f\'(a)', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0^+} x \\ln x = 0', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} (\\cos x)^{1/x^2} = e^{-1/2}', difficulty: 'hard', category: 'calculus' },
  { title: '极限', latex: '\\lim_{n \\to \\infty} \\sum_{k=1}^n \\frac{1}{n+k} = \\ln 2', difficulty: 'hard', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{\\sin(\\sin x) - x \\cos x}{x^3} = \\frac{1}{3}', difficulty: 'hard', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{\\arcsin x - x}{x^3}', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 1} \\frac{x^n - 1}{x - 1} = n', difficulty: 'easy', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{\\sqrt{1+x} - 1}{x} = \\frac{1}{2}', difficulty: 'easy', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to \\infty} x(\\sqrt{x^2+1} - x)', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{a^x - 1}{x} = \\ln a', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{n \\to \\infty} \\frac{n!}{\\sqrt{2\\pi n}(\\frac{n}{e})^n} = 1', difficulty: 'hard', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{\\tan x - \\sin x}{x^3} = \\frac{1}{2}', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to \\infty} (\\frac{x+a}{x-a})^x = e^{2a}', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1', difficulty: 'easy', category: 'calculus' },
  { title: '极限', latex: '\\lim_{n \\to \\infty} \\sqrt[n]{n} = 1', difficulty: 'easy', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{(1+x)^\\alpha - 1}{x} = \\alpha', difficulty: 'easy', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to \\pi/2} (\\tan x)^{\\cos x}', difficulty: 'hard', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{x - \\sin x}{x^3} = \\frac{1}{6}', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{x \\to 0} \\frac{\\sinh x}{x} = 1', difficulty: 'medium', category: 'calculus' },
  { title: '极限', latex: '\\lim_{n \\to \\infty} \\frac{\\ln n}{n} = 0', difficulty: 'easy', category: 'calculus' },

  // ===== 不定积分 (Indefinite Integrals) - 25 items =====
  { title: '不定积分', latex: '\\int \\frac{1}{x} dx = \\ln |x| + C', difficulty: 'easy', category: 'calculus' },
  { title: '不定积分', latex: '\\int e^x dx = e^x + C', difficulty: 'easy', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\sin x dx = -\\cos x + C', difficulty: 'easy', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\cos x dx = \\sin x + C', difficulty: 'easy', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\sec^2 x dx = \\tan x + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\csc^2 x dx = -\\cot x + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\frac{1}{\\sqrt{1-x^2}} dx = \\arcsin x + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\frac{1}{1+x^2} dx = \\arctan x + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\tan x dx = -\\ln |\\cos x| + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\cot x dx = \\ln |\\sin x| + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\ln x dx = x \\ln x - x + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\frac{1}{x^2+a^2} dx = \\frac{1}{a} \\arctan \\frac{x}{a} + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\frac{1}{x^2-a^2} dx = \\frac{1}{2a} \\ln |\\frac{x-a}{x+a}| + C', difficulty: 'hard', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\sqrt{a^2-x^2} dx = \\frac{x}{2}\\sqrt{a^2-x^2} + \\frac{a^2}{2}\\arcsin\\frac{x}{a} + C', difficulty: 'hard', category: 'calculus' },
  { title: '不定积分', latex: '\\int e^{ax} \\sin bx dx = \\frac{e^{ax}}{a^2+b^2}(a \\sin bx - b \\cos bx) + C', difficulty: 'hard', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\frac{dx}{\\cos x} = \\ln |\\sec x + \\tan x| + C', difficulty: 'hard', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\arcsin x dx = x \\arcsin x + \\sqrt{1-x^2} + C', difficulty: 'hard', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\frac{x}{1+x^2} dx = \\frac{1}{2} \\ln(1+x^2) + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\frac{dx}{x^2-1} = \\frac{1}{2}\\ln|\\frac{x-1}{x+1}| + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int a^x dx = \\frac{a^x}{\\ln a} + C', difficulty: 'easy', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\sinh x dx = \\cosh x + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\cosh x dx = \\sinh x + C', difficulty: 'medium', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\frac{dx}{\\sqrt{x^2+a^2}} = \\ln(x + \\sqrt{x^2+a^2}) + C', difficulty: 'hard', category: 'calculus' },
  { title: '不定积分', latex: '\\int \\frac{dx}{\\sqrt{x^2-a^2}} = \\ln|x + \\sqrt{x^2-a^2}| + C', difficulty: 'hard', category: 'calculus' },
  { title: '不定积分', latex: '\\int x e^x dx = (x-1)e^x + C', difficulty: 'medium', category: 'calculus' },

  // ===== 定积分 (Definite Integrals \u0026 Theorems) - 25 items =====
  { title: '定积分', latex: '\\int_0^{\\pi/2} \\sin^n x dx = \\frac{n-1}{n} \\int_0^{\\pi/2} \\sin^{n-2} x dx', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^r \\sqrt{r^2-x^2} dx = \\frac{\\pi r^2}{4}', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\int_a^b f(x) dx = -\\int_b^a f(x) dx', difficulty: 'easy', category: 'calculus' },
  { title: '定积分', latex: '\\int_a^c f(x) dx = \\int_a^b f(x) dx + \\int_b^c f(x) dx', difficulty: 'easy', category: 'calculus' },
  { title: '定积分', latex: '\\int_{-a}^a f(x) dx = 2 \\int_0^a f(x) dx \\quad (f \\text{ is even})', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\int_{-a}^a f(x) dx = 0 \\quad (f \\text{ is odd})', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^{2\\pi} \\sin^2 x dx = \\pi', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^\pi x \\sin x dx = \\pi', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^1 x^n dx = \\frac{1}{n+1}', difficulty: 'easy', category: 'calculus' },
  { title: '定积分', latex: '\\int_1^e \\frac{1}{x} dx = 1', difficulty: 'easy', category: 'calculus' },
  { title: '定积分', latex: '\\Gamma(n) = \\int_0^\\infty t^{n-1} e^{-t} dt', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^\\infty \\frac{\\sin x}{x} dx = \\frac{\\pi}{2}', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^{\\pi/2} \\ln(\\sin x) dx = -\\frac{\\pi}{2}\\ln 2', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^1 \\frac{\\ln x}{1-x} dx = -\\frac{\\pi^2}{6}', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^\infty e^{-ax} \\cos bx dx = \\frac{a}{a^2+b^2}', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^\infty e^{-ax} \\sin bx dx = \\frac{b}{a^2+b^2}', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^1 \\frac{1}{\\sqrt{1-x^2}} dx = \\frac{\\pi}{2}', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^\\infty \\frac{1}{1+x^2} dx = \\frac{\\pi}{2}', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^1 x^m (1-x)^n dx = \\text{B}(m+1, n+1)', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^{2\\pi} e^{\\cos \\theta} \\cos(\\sin \\theta) d\\theta = 2\\pi', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^\\infty \\frac{dx}{x^4+1} = \\frac{\\pi}{2\\sqrt{2}}', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\frac{d}{dx} \\int_a^x f(t) dt = f(x)', difficulty: 'medium', category: 'calculus' },
  { title: '定积分', latex: '\\frac{d}{dx} \\int_{\\psi(x)}^{\\phi(x)} f(t) dt = f(\\phi(x))\\phi\'(x) - f(\\psi(x))\\psi\'(x)', difficulty: 'hard', category: 'calculus' },
  { title: '定积分', latex: '\\int_0^1 \\frac{x^4(1-x)^4}{1+x^2} dx = \\frac{22}{7} - \\pi', difficulty: 'hard', category: 'calculus' },

  // ===== 方程 \u0026 复杂公式 (Equations \u0026 Random) - 25 items =====
  { title: '方程', latex: '\\nabla^2 \\phi = \\frac{1}{c^2} \\frac{\\partial^2 \\phi}{\\partial t^2}', difficulty: 'hard', category: 'physics' },
  { title: '方程', latex: '\\frac{\\partial u}{\\partial t} - k \\nabla^2 u = 0', difficulty: 'medium', category: 'physics' },
  { title: '方程', latex: 'Ax = b', difficulty: 'easy', category: 'matrix' },
  { title: '方程', latex: '\\det(A - \\lambda I) = 0', difficulty: 'medium', category: 'matrix' },
  { title: '方程', latex: '\\sum_{i=1}^n a_i x_i = b', difficulty: 'easy', category: 'algebra' },
  { title: '方程', latex: '\\frac{dx}{dt} = f(x, t)', difficulty: 'easy', category: 'calculus' },
  { title: '复杂公式', latex: '\\oint_C \\vec{B} \\cdot d\\vec{l} = \\mu_0 I + \\mu_0 \\epsilon_0 \\frac{d\\Phi_E}{dt}', difficulty: 'hard', category: 'physics' },
  { title: '复杂公式', latex: '\\vec{J} = \\sigma \\vec{E}', difficulty: 'easy', category: 'physics' },
  { title: '复杂公式', latex: '\\epsilon_0 \\oint \\vec{E} \\cdot d\\vec{A} = q_{\\text{enc}}', difficulty: 'medium', category: 'physics' },
  { title: '复杂公式', latex: '\\Phi = \\iint_S \\vec{B} \\cdot d\\vec{A}', difficulty: 'medium', category: 'physics' },
  { title: '复杂公式', latex: 'E = h\\nu = \\frac{hc}{\\lambda}', difficulty: 'easy', category: 'physics' },
  { title: '复杂公式', latex: '\\lambda = \\frac{h}{p} = \\frac{h}{mv}', difficulty: 'easy', category: 'physics' },
  { title: '复杂公式', latex: '[\\hat{x}, \\hat{p}] = i\\hbar', difficulty: 'medium', category: 'physics' },
  { title: '复杂公式', latex: '\\langle A \\rangle = \\int \\Psi^* \\hat{A} \\Psi d\\tau', difficulty: 'hard', category: 'physics' },
  { title: '复杂公式', latex: 'S = k_B \\ln W', difficulty: 'easy', category: 'physics' },
  { title: '复杂公式', latex: 'dE = TdS - PdV + \\mu dN', difficulty: 'medium', category: 'physics' },
  { title: '复杂公式', latex: 'PV = nRT', difficulty: 'easy', category: 'physics' },
  { title: '复杂公式', latex: '\\eta = 1 - \\frac{T_L}{T_H}', difficulty: 'easy', category: 'physics' },
  { title: '复杂公式', latex: '\\mathcal{F}\\{f(t)\\} = \\int_{-\\infty}^\\infty f(t) e^{-i\\omega t} dt', difficulty: 'medium', category: 'calculus' },
  { title: '复杂公式', latex: 'f(t) = \\frac{1}{2\\pi} \\int_{-\\infty}^\\infty \\hat{f}(\\omega) e^{i\\omega t} d\\omega', difficulty: 'hard', category: 'calculus' },
  { title: '复杂公式', latex: '\\delta(x) = \\frac{1}{2\\pi} \\int_{-\\infty}^\\infty e^{ikx} dk', difficulty: 'hard', category: 'calculus' },
  { title: '复杂公式', latex: '\\zeta(2) = \\frac{\\pi^2}{6}', difficulty: 'easy', category: 'algebra' },
  { title: '复杂公式', latex: '\\zeta(4) = \\frac{\\pi^4}{90}', difficulty: 'medium', category: 'algebra' },
  { title: '复杂公式', latex: '\\prod_{p \\text{ prime}} \\frac{1}{1 - p^{-s}} = \\sum_{n=1}^\\infty n^{-s}', difficulty: 'hard', category: 'algebra' },
  { title: '复杂公式', latex: '\\pi = 4 \\sum_{k=0}^\\infty \\frac{(-1)^k}{2k+1}', difficulty: 'medium', category: 'calculus' },
];

async function seedV3() {
  console.log('Seeding another 100 formula exercises (V3)...');
  for (const item of SEED_DATA_V3) {
    await db.insert(formulaExercises).values({
      title: item.title,
      latex: item.latex,
      difficulty: item.difficulty,
      category: item.category,
      status: 'published',
      createdBy: 'system',
    });
  }
  console.log(`Successfully inserted ${SEED_DATA_V3.length} formula exercises (V3).`);
  process.exit(0);
}

seedV3().catch((err) => {
  console.error('Seed V3 failed:', err);
  process.exit(1);
});
