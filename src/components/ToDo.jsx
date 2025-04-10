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
    <div className='text-center'>
      <h1 className='display-4 fw-normal mb-5'>
        <svg xmlns="http://www.w3.org/2000/svg" width="76px" height="76px" viewBox="0 0 24 24">
          <g fill="none" fill-rule="evenodd">
            <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
            <path fill="currentColor" d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-2V4H6v16h5v2H6a2 2 0 0 1-2-2zm4 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1m9 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6m-5 3a5 5 0 1 1 10 0a5 5 0 0 1-10 0m5-2.5a1 1 0 0 1 1 1v.5a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1" />
          </g>
        </svg>
        Todo List
      </h1>

      <div className='row mb-5'>
        <input
          type="text"
          className='form-control mb-3'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <button className='btn btn-outline-success' onClick={handleAddTodo}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 21q-.425 0-.712-.288T11 20v-7H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7V4q0-.425.288-.712T12 3t.713.288T13 4v7h7q.425 0 .713.288T21 12t-.288.713T20 13h-7v7q0 .425-.288.713T12 21" />
          </svg>
          Add Todo
        </button>
      </div>

      <ul className='list-group list-group-flush'>
        {todos.map((todo) => (
          <li className='d-flex justify-content-between list-group-item' key={todo.id}>
            <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </div>
            <div>
              {todo.completed ? '' :
                <button className='btn btn-sm btn-outline-primary me-2' onClick={() => handleMarkAsComplete(todo.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 2048 2048">
                    <path fill="currentColor" d="m1491 595l90 90l-749 749l-365-365l90-90l275 275zM1024 0q141 0 272 36t245 103t207 160t160 208t103 245t37 272q0 141-36 272t-103 245t-160 207t-208 160t-245 103t-272 37q-141 0-272-36t-245-103t-207-160t-160-208t-103-244t-37-273q0-141 36-272t103-245t160-207t208-160T751 37t273-37m0 1920q123 0 237-32t214-90t182-141t140-181t91-214t32-238q0-123-32-237t-90-214t-141-182t-181-140t-214-91t-238-32q-123 0-237 32t-214 90t-182 141t-140 181t-91 214t-32 238q0 123 32 237t90 214t141 182t181 140t214 91t238 32" />
                  </svg>
                  &nbsp; Complete
                </button>}
              <button className='btn btn-sm btn-outline-danger' onClick={() => handleDeleteTodo(todo.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                  <path fill="currentColor" d="M20 10.5v.5h8v-.5a4 4 0 0 0-8 0m-2.5.5v-.5a6.5 6.5 0 1 1 13 0v.5h11.25a1.25 1.25 0 1 1 0 2.5h-2.917l-2 23.856A7.25 7.25 0 0 1 29.608 44H18.392a7.25 7.25 0 0 1-7.224-6.644l-2-23.856H6.25a1.25 1.25 0 1 1 0-2.5zm-3.841 26.147a4.75 4.75 0 0 0 4.733 4.353h11.216a4.75 4.75 0 0 0 4.734-4.353L36.324 13.5H11.676zM21.5 20.25a1.25 1.25 0 1 0-2.5 0v14.5a1.25 1.25 0 1 0 2.5 0zM27.75 19c.69 0 1.25.56 1.25 1.25v14.5a1.25 1.25 0 1 1-2.5 0v-14.5c0-.69.56-1.25 1.25-1.25" />
                </svg>
                &nbsp; Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;