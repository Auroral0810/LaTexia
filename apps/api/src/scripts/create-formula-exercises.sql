-- 公式训练题目表
CREATE TABLE IF NOT EXISTS formula_exercises (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    latex TEXT NOT NULL,
    difficulty VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    hint TEXT,
    status VARCHAR(20) DEFAULT 'published',
    sort_order INTEGER DEFAULT 0,
    attempt_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    created_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_formula_exercises_difficulty ON formula_exercises (difficulty);
CREATE INDEX IF NOT EXISTS idx_formula_exercises_category ON formula_exercises (category);
CREATE INDEX IF NOT EXISTS idx_formula_exercises_status ON formula_exercises (status);
