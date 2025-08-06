const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'todos.json');

// 中间件
app.use(express.json());
app.use(express.static(__dirname));

// CORS支持
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 读取todos数据
async function readTodos() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// 写入todos数据
async function writeTodos(todos) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2));
        return true;
    } catch (error) {
        console.error('写入文件失败:', error);
        return false;
    }
}

// API路由
app.get('/api/todos', async (req, res) => {
    try {
        const todos = await readTodos();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: '读取数据失败' });
    }
});

app.post('/api/todos', async (req, res) => {
    try {
        const todos = req.body;
        const success = await writeTodos(todos);
        if (success) {
            res.json({ message: '保存成功' });
        } else {
            res.status(500).json({ error: '保存失败' });
        }
    } catch (error) {
        res.status(500).json({ error: '保存失败' });
    }
});

// 主页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;