import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BackButton } from '../../shared/back-button/BackButton';
import './HabitTracker.scss';

interface Habit {
  id: number;
  name: string;
  description: string;
  category: string;
  color: string;
  streak: number;
  completedDates: string[];
  createdAt: Date;
}

const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'health',
    color: '#667eea'
  });

  const categories = [
    { value: 'health', label: '💪 Health', color: '#2ed573' },
    { value: 'productivity', label: '📈 Productivity', color: '#3742fa' },
    { value: 'learning', label: '📚 Learning', color: '#ff6348' },
    { value: 'mindfulness', label: '🧘 Mindfulness', color: '#a55eea' },
    { value: 'social', label: '👥 Social', color: '#26de81' },
    { value: 'creative', label: '🎨 Creative', color: '#fd79a8' }
  ];

  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
  ];

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const parsedHabits = JSON.parse(savedHabits).map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt)
      }));
      setHabits(parsedHabits);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: Date.now(),
      name: newHabit.name.trim(),
      description: newHabit.description.trim(),
      category: newHabit.category,
      color: newHabit.color,
      streak: 0,
      completedDates: [],
      createdAt: new Date()
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: '', description: '', category: 'health', color: '#667eea' });
    setShowAddForm(false);
  };

  const toggleHabit = (habitId: number, date: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(date);
        const updatedDates = isCompleted
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date];
        
        return {
          ...habit,
          completedDates: updatedDates,
          streak: calculateStreak(updatedDates)
        };
      }
      return habit;
    }));
  };

  const calculateStreak = (completedDates: string[]) => {
    if (completedDates.length === 0) return 0;
    
    const sortedDates = completedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const today = new Date().toISOString().split('T')[0];
    
    if (!sortedDates.includes(today)) return 0;
    
    let streak = 1;
    const currentDate = new Date(today);
    
    for (let i = 1; i < sortedDates.length; i++) {
      currentDate.setDate(currentDate.getDate() - 1);
      const expectedDate = currentDate.toISOString().split('T')[0];
      
      if (sortedDates[i] === expectedDate) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const deleteHabit = (habitId: number) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const getDatesForWeek = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getCategoryInfo = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[0];
  };

  const weekDates = getDatesForWeek();
  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => 
    habit.completedDates.includes(new Date().toISOString().split('T')[0])
  ).length;

  return (
    <div className="habit-tracker min-vh-100">
      <BackButton />
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} xl={10}>
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-4 fw-bold text-white mb-2 habit-title">
                🎯 Habit Tracker
              </h1>
              <p className="lead text-white-50 mb-0">Build better habits, one day at a time</p>
            </div>

            {/* Stats Section */}
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100 glass-card">
                  <Card.Body className="text-center">
                    <div className="display-6 mb-2">📊</div>
                    <h3 className="h2 fw-bold text-primary mb-1">{totalHabits}</h3>
                    <p className="text-muted mb-0">Total Habits</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100 glass-card">
                  <Card.Body className="text-center">
                    <div className="display-6 mb-2">✅</div>
                    <h3 className="h2 fw-bold text-success mb-1">{completedToday}</h3>
                    <p className="text-muted mb-0">Completed Today</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm h-100 glass-card">
                  <Card.Body className="text-center">
                    <div className="display-6 mb-2">🔥</div>
                    <h3 className="h2 fw-bold text-warning mb-1">
                      {Math.max(...habits.map(h => h.streak), 0)}
                    </h3>
                    <p className="text-muted mb-0">Best Streak</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Add Habit Section */}
            <Card className="border-0 shadow mb-4 glass-card">
              <Card.Body>
                {!showAddForm ? (
                  <div className="text-center">
                    <button 
                      className="btn btn-primary btn-lg px-4"
                      onClick={() => setShowAddForm(true)}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add New Habit
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="h5 fw-bold mb-0">Add New Habit</h3>
                      <button 
                        className="btn btn-outline-danger btn-sm rounded-circle"
                        onClick={() => setShowAddForm(false)}
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label fw-semibold">Habit Name</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={newHabit.name}
                          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                          placeholder="e.g., Drink 8 glasses of water"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Description (Optional)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newHabit.description}
                          onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                          placeholder="Brief description of your habit"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Category</label>
                        <select
                          className="form-select"
                          value={newHabit.category}
                          onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Color</label>
                        <div className="d-flex gap-2 flex-wrap">
                          {colors.map(color => (
                            <button
                              key={color}
                              type="button"
                              className={`btn p-0 border-2 ${newHabit.color === color ? 'border-dark' : 'border-light'}`}
                              onClick={() => setNewHabit({ ...newHabit, color })}
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: color,
                                borderRadius: '50%'
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-primary"
                            onClick={addHabit}
                            disabled={!newHabit.name.trim()}
                          >
                            Add Habit
                          </button>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => setShowAddForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Habits List */}
            <Card className="border-0 shadow glass-card">
              <Card.Body>
                {habits.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="display-1 mb-3">🎯</div>
                    <h4 className="text-muted">No habits yet</h4>
                    <p className="text-muted">Add your first habit to get started!</p>
                  </div>
                ) : (
                  <div>
                    {/* Week Header */}
                    <div className="row align-items-center mb-3 pb-2 border-bottom">
                      <div className="col-md-4">
                        <h6 className="fw-bold text-muted mb-0">Habit</h6>
                      </div>
                      <div className="col-md-6">
                        <div className="row text-center">
                          {weekDates.map(date => (
                            <div key={date} className="col">
                              <div className="small fw-semibold text-muted">
                                {getDayName(date)}
                              </div>
                              <div className="small text-muted">
                                {new Date(date).getDate()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-2 text-center">
                        <h6 className="fw-bold text-muted mb-0">Streak</h6>
                      </div>
                    </div>

                    {/* Habits */}
                    {habits.map(habit => {
                      const categoryInfo = getCategoryInfo(habit.category);
                      return (
                        <div key={habit.id} className="row align-items-center py-3 border-bottom">
                          <div className="col-md-4">
                            <div className="d-flex align-items-center">
                              <div 
                                className="rounded-circle me-3"
                                style={{ 
                                  width: '16px', 
                                  height: '16px', 
                                  backgroundColor: habit.color 
                                }}
                              />
                              <div className="flex-grow-1">
                                <h6 className="fw-semibold mb-1">{habit.name}</h6>
                                <div className="small text-muted">
                                  <span className="badge bg-light text-dark me-2">
                                    {categoryInfo.label}
                                  </span>
                                  {habit.description && (
                                    <span>• {habit.description}</span>
                                  )}
                                </div>
                              </div>
                              <button
                                className="btn btn-outline-danger btn-sm ms-2"
                                onClick={() => deleteHabit(habit.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="row text-center">
                              {weekDates.map(date => (
                                <div key={date} className="col">
                                  <button
                                    className={`btn btn-sm rounded-circle ${
                                      habit.completedDates.includes(date) 
                                        ? 'btn-success' 
                                        : 'btn-outline-secondary'
                                    }`}
                                    onClick={() => toggleHabit(habit.id, date)}
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      backgroundColor: habit.completedDates.includes(date) 
                                        ? habit.color 
                                        : 'transparent',
                                      borderColor: habit.color
                                    }}
                                  >
                                    {habit.completedDates.includes(date) ? '✓' : ''}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="col-md-2 text-center">
                            <div className="fw-bold text-primary h5 mb-0">{habit.streak}</div>
                            <div className="small text-muted">days</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HabitTracker;
