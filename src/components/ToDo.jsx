// src/TodoApp.js

import React, { useEffect, useState } from 'react';
import IndexedDBService from '../service/IndexedDBService';

const dbService = new IndexedDBService('TodoDB', 'todos');

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    const initializeApp = async () => {
      const initialTodos = await dbService.initialize();
      setTodos(initialTodos);
    };
    initializeApp();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo) {
      await dbService.Save({ text: newTodo, completed: false });
      setNewTodo('');
      const allTodos = await dbService.GetAll();
      setTodos(allTodos);
    }
  };

  const handleDeleteTodo = async (id) => {
    await dbService.Delete(id);
    const allTodos = await dbService.GetAll();
    setTodos(allTodos);
  };

  const handleMarkAsComplete = async (id) => {
    await dbService.MarkAsComplete(id);
    const allTodos = await dbService.GetAll();
    setTodos(allTodos);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => handleMarkAsComplete(todo.id)}>Complete</button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;