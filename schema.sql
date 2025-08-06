-- 创建 todos 表
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    important INTEGER DEFAULT 0,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    completed_at TEXT,
    user_id TEXT DEFAULT 'default'
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_completed ON todos(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_created_at ON todos(created_at);

-- 插入示例数据
INSERT OR IGNORE INTO todos (text, important, completed, created_at) VALUES 
('欢迎使用 D1 数据库版本！', 1, 0, CURRENT_TIMESTAMP),
('这是一个示例任务', 0, 0, CURRENT_TIMESTAMP),
('已完成任务示例', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);