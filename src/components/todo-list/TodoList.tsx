import React, { useState, useEffect } from 'react';
import { BackButton } from '../../shared/back-button/BackButton';
import './TodoList.scss';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('personal');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { value: 'personal', label: '👤 Personal', color: '#667eea' },
    { value: 'work', label: '💼 Work', color: '#f093fb' },
    { value: 'shopping', label: '🛒 Shopping', color: '#4facfe' },
    { value: 'health', label: '🏥 Health', color: '#43e97b' },
    { value: 'education', label: '📚 Education', color: '#fa709a' },
    { value: 'finance', label: '💰 Finance', color: '#fee140' }
  ];

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!inputText.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputText.trim(),
      completed: false,
      priority,
      category,
      createdAt: new Date()
    };

    setTodos([newTodo, ...todos]);
    setInputText('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'completed') return todo.completed && matchesSearch;
    if (filter === 'pending') return !todo.completed && matchesSearch;
    return todo.category === filter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0];
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-list">
        <BackButton />
      <div className="todo-container">
        <div className="header">
          <h1 className="title">✅ Todo List</h1>
          <p className="subtitle">Stay organized and productive</p>
          
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <span className="progress-text">
              {completedCount} of {totalCount} tasks completed
            </span>
          </div>
        </div>

        <div className="add-todo-section">
          <div className="input-group">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What needs to be done?"
              className="todo-input"
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button onClick={addTodo} className="add-btn">
              ➕
            </button>
          </div>

          <div className="options-row">
            <div className="option-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="priority-select"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="option-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search todos..."
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({todos.length})
            </button>
            <button
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({todos.filter(t => !t.completed).length})
            </button>
            <button
              className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        <div className="todos-section">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>
                {searchTerm ? 'No todos match your search' : 'No todos yet. Add one above!'}
              </p>
            </div>
          ) : (
            <div className="todos-list">
              {filteredTodos.map(todo => {
                const categoryInfo = getCategoryInfo(todo.category);
                return (
                  <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                    <div className="todo-content">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="checkbox"
                      >
                        {todo.completed ? '✅' : '⭕'}
                      </button>

                      <div className="todo-details">
                        <div className="todo-text">{todo.text}</div>
                        <div className="todo-meta">
                          <span 
                            className="category-tag"
                            style={{ backgroundColor: categoryInfo.color }}
                          >
                            {categoryInfo.label}
                          </span>
                          <span 
                            className="priority-tag"
                            style={{ backgroundColor: getPriorityColor(todo.priority) }}
                          >
                            {todo.priority.toUpperCase()}
                          </span>
                          <span className="date-tag">
                            {todo.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="todo-actions">
                      <button
                        onClick={() => {
                          const newText = prompt('Edit todo:', todo.text);
                          if (newText && newText.trim()) {
                            editTodo(todo.id, newText.trim());
                          }
                        }}
                        className="edit-btn"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
