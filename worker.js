export default {
	async fetch(request, env, ctx) {
		const { method } = request;
		const url = new URL(request.url);
		const path = url.pathname;

		// 设置 CORS 头
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		};

		// 处理 OPTIONS 请求
		if (method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		// 获取用户ID（从查询参数或默认）
		const userId = url.searchParams.get('user_id') || 'default';

		try {
			// API 路由
			if (path === '/api/todos' && method === 'GET') {
				const todos = await getTodos(env.DB, userId);
				return new Response(JSON.stringify(todos), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders }
				});
			}

			if (path === '/api/todos' && method === 'POST') {
				const todo = await request.json();
				const newTodo = await createTodo(env.DB, todo, userId);
				return new Response(JSON.stringify(newTodo), {
					status: 201,
					headers: { 'Content-Type': 'application/json', ...corsHeaders }
				});
			}

			if (path === '/api/todos' && method === 'PUT') {
				const todos = await request.json();
				await updateTodos(env.DB, todos, userId);
				return new Response(JSON.stringify({ message: '更新成功' }), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders }
				});
			}

			if (path === '/api/todos' && method === 'DELETE') {
				const id = parseInt(url.searchParams.get('id'));
				await deleteTodo(env.DB, id, userId);
				return new Response(JSON.stringify({ message: '删除成功' }), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders }
				});
			}

			// 健康检查
			if (path === '/health') {
				return new Response(JSON.stringify({ status: 'OK', database: 'D1' }), {
					headers: { 'Content-Type': 'application/json', ...corsHeaders }
				});
			}

			return new Response('Not Found', { status: 404 });

		} catch (error) {
			console.error('API Error:', error);
			return new Response(JSON.stringify({ error: error.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json', ...corsHeaders }
			});
		}
	}
};

// 获取所有 todos
async function getTodos(db, userId) {
	const { results } = await db.prepare(`
		SELECT * FROM todos 
		WHERE user_id = ? 
		ORDER BY 
			CASE WHEN completed = 0 THEN 0 ELSE 1 END,
			CASE WHEN important = 1 THEN 0 ELSE 1 END,
			created_at DESC
	`).bind(userId).all();
	return results;
}

// 创建新的 todo
async function createTodo(db, todo, userId) {
	const result = await db.prepare(`
		INSERT INTO todos (text, important, completed, created_at, user_id)
		VALUES (?, ?, ?, ?, ?)
	`).bind(
		todo.text,
		todo.important ? 1 : 0,
		todo.completed ? 1 : 0,
		todo.createdAt || new Date().toISOString(),
		userId
	).run();

	return {
		id: result.lastInsertRowid,
		...todo,
		createdAt: todo.createdAt || new Date().toISOString(),
		createdAtFormatted: new Date().toLocaleString('zh-CN'),
		completedAt: null
	};
}

// 更新 todos
async function updateTodos(db, todos, userId) {
	// 先删除用户的所有 todos
	await db.prepare('DELETE FROM todos WHERE user_id = ?').bind(userId).run();

	// 重新插入所有 todos
	for (const todo of todos) {
		await db.prepare(`
			INSERT INTO todos (id, text, important, completed, created_at, completed_at, user_id)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`).bind(
			todo.id,
			todo.text,
			todo.important ? 1 : 0,
			todo.completed ? 1 : 0,
			todo.createdAt,
			todo.completedAt,
			userId
		).run();
	}
}

// 删除单个 todo
async function deleteTodo(db, id, userId) {
	const result = await db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?').bind(id, userId).run();
	if (result.changes === 0) {
		throw new Error('Todo not found');
	}
}