import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get<Todo[]>('/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const response = await axios.post<Todo>('/todos', { text: newTodo });
    setTodos([...todos, response.data]);
    setNewTodo('');
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const response = await axios.put<Todo>(`/todos/${id}`, {
      ...todo,
      completed: !todo.completed
    });
    setTodos(todos.map(t => t.id === id ? response.data : t));
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`/todos/${id}`);
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div>
      <h1>할 일 목록</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="새 할 일"
      />
      <button onClick={addTodo}>추가</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              className={todo.completed ? 'completed' : undefined}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
