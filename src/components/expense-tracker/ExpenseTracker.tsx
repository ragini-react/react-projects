import React, { useState, useEffect } from 'react';
import { BackButton } from '../../shared/back-button/BackButton';
import './ExpenseTracker.scss';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [filter, setFilter] = useState('all');

  const categories = [
    { value: 'food', label: '🍔 Food', color: '#ff6b6b' },
    { value: 'transport', label: '🚗 Transport', color: '#4ecdc4' },
    { value: 'entertainment', label: '🎬 Entertainment', color: '#45b7d1' },
    { value: 'shopping', label: '🛍️ Shopping', color: '#96ceb4' },
    { value: 'bills', label: '💡 Bills', color: '#feca57' },
    { value: 'health', label: '🏥 Health', color: '#ff9ff3' },
    { value: 'education', label: '📚 Education', color: '#54a0ff' },
    { value: 'other', label: '📦 Other', color: '#5f27cd' }
  ];

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return;

    const newExpense: Expense = {
      id: Date.now(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0],
      type
    };

    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    if (filter === 'income') return expense.type === 'income';
    if (filter === 'expense') return expense.type === 'expense';
    return expense.category === filter;
  });

  const totalIncome = expenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const totalExpenses = expenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);

  const balance = totalIncome - totalExpenses;

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[categories.length - 1];
  };

  return (
    <div className="expense-tracker">
      <div className="tracker-container">
        <div className="header">
          <h1 className="title">💰 Expense Tracker</h1>
          <p className="subtitle">Track your income and expenses</p>
        </div>

        <div className="summary-cards">
          <div className="summary-card income">
            <div className="card-icon">💚</div>
            <div className="card-content">
              <span className="card-label">Total Income</span>
              <span className="card-amount">₹{totalIncome.toFixed(2)}</span>
            </div>
          </div>

          <div className="summary-card expense">
            <div className="card-icon">💸</div>
            <div className="card-content">
              <span className="card-label">Total Expenses</span>
              <span className="card-amount">₹{totalExpenses.toFixed(2)}</span>
            </div>
          </div>

          <div className={`summary-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
            <div className="card-icon">{balance >= 0 ? '💰' : '⚠️'}</div>
            <div className="card-content">
              <span className="card-label">Balance</span>
              <span className="card-amount">₹{balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="add-transaction">
          <h3 className="section-title">Add Transaction</h3>
          
          <div className="transaction-form">
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <div className="type-selector">
                  <button
                    className={`type-btn ${type === 'income' ? 'active' : ''}`}
                    onClick={() => setType('income')}
                  >
                    💚 Income
                  </button>
                  <button
                    className={`type-btn ${type === 'expense' ? 'active' : ''}`}
                    onClick={() => setType('expense')}
                  >
                    💸 Expense
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {type === 'expense' && (
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button onClick={addExpense} className="add-btn">
              ➕ Add Transaction
            </button>
          </div>
        </div>

        <div className="transactions-section">
          <div className="section-header">
            <h3 className="section-title">Recent Transactions</h3>
            
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-tab ${filter === 'income' ? 'active' : ''}`}
                onClick={() => setFilter('income')}
              >
                Income
              </button>
              <button
                className={`filter-tab ${filter === 'expense' ? 'active' : ''}`}
                onClick={() => setFilter('expense')}
              >
                Expenses
              </button>
            </div>
          </div>

          <div className="transactions-list">
            {filteredExpenses.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>No transactions found</p>
              </div>
            ) : (
              filteredExpenses.map(expense => {
                const categoryInfo = getCategoryInfo(expense.category);
                return (
                  <div key={expense.id} className="transaction-item">
                    <div className="transaction-info">
                      <div 
                        className="transaction-category"
                        style={{ backgroundColor: categoryInfo.color }}
                      >
                        {expense.type === 'income' ? '💚' : categoryInfo.label.split(' ')[0]}
                      </div>
                      <div className="transaction-details">
                        <span className="transaction-description">
                          {expense.description}
                        </span>
                        <span className="transaction-date">{expense.date}</span>
                      </div>
                    </div>
                    <div className="transaction-actions">
                      <span className={`transaction-amount ${expense.type}`}>
                        {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="delete-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
