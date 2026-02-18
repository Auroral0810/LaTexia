export const metadata = {
  title: '符号查询',
  description: 'LaTeX 符号速查表',
};

export default function SymbolsPage() {
  const symbolGroups = [
    {
      name: '希腊字母',
      symbols: [
        { latex: '\\alpha', display: 'α' }, { latex: '\\beta', display: 'β' },
        { latex: '\\gamma', display: 'γ' }, { latex: '\\delta', display: 'δ' },
        { latex: '\\epsilon', display: 'ε' }, { latex: '\\zeta', display: 'ζ' },
        { latex: '\\eta', display: 'η' }, { latex: '\\theta', display: 'θ' },
        { latex: '\\lambda', display: 'λ' }, { latex: '\\mu', display: 'μ' },
        { latex: '\\pi', display: 'π' }, { latex: '\\sigma', display: 'σ' },
        { latex: '\\phi', display: 'φ' }, { latex: '\\omega', display: 'ω' },
      ],
    },
    {
      name: '运算符',
      symbols: [
        { latex: '\\pm', display: '±' }, { latex: '\\times', display: '×' },
        { latex: '\\div', display: '÷' }, { latex: '\\cdot', display: '·' },
        { latex: '\\leq', display: '≤' }, { latex: '\\geq', display: '≥' },
        { latex: '\\neq', display: '≠' }, { latex: '\\approx', display: '≈' },
        { latex: '\\infty', display: '∞' }, { latex: '\\partial', display: '∂' },
        { latex: '\\nabla', display: '∇' }, { latex: '\\sum', display: '∑' },
        { latex: '\\prod', display: '∏' }, { latex: '\\int', display: '∫' },
      ],
    },
    {
      name: '箭头',
      symbols: [
        { latex: '\\rightarrow', display: '→' }, { latex: '\\leftarrow', display: '←' },
        { latex: '\\Rightarrow', display: '⇒' }, { latex: '\\Leftarrow', display: '⇐' },
        { latex: '\\leftrightarrow', display: '↔' }, { latex: '\\uparrow', display: '↑' },
        { latex: '\\downarrow', display: '↓' }, { latex: '\\mapsto', display: '↦' },
      ],
    },
    {
      name: '集合与逻辑',
      symbols: [
        { latex: '\\in', display: '∈' }, { latex: '\\notin', display: '∉' },
        { latex: '\\subset', display: '⊂' }, { latex: '\\supset', display: '⊃' },
        { latex: '\\cup', display: '∪' }, { latex: '\\cap', display: '∩' },
        { latex: '\\forall', display: '∀' }, { latex: '\\exists', display: '∃' },
        { latex: '\\neg', display: '¬' }, { latex: '\\land', display: '∧' },
        { latex: '\\lor', display: '∨' }, { latex: '\\emptyset', display: '∅' },
      ],
    },
  ];

  return (
    <div className="container py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">符号查询</h1>
        <p className="mt-2 text-muted-foreground">点击符号复制对应的 LaTeX 命令</p>
      </div>

      <div className="space-y-8">
        {symbolGroups.map((group) => (
          <div key={group.name}>
            <h2 className="font-semibold text-lg mb-4">{group.name}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2">
              {group.symbols.map((sym) => (
                <button
                  key={sym.latex}
                  className="group flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card p-3 hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                  title={`复制 ${sym.latex}`}
                >
                  <span className="text-2xl leading-none">{sym.display}</span>
                  <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors truncate max-w-full">
                    {sym.latex}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
