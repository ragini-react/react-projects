import React, { useState, useEffect, useRef } from 'react';
import { BackButton } from '../../shared/back-button/BackButton';
import './PomodoroTimer.scss';

interface PomodoroSession {
  id: number;
  type: 'work' | 'short-break' | 'long-break';
  duration: number;
  completedAt: Date;
}

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<'work' | 'short-break' | 'long-break'>('work');
  const [completedSessions, setCompletedSessions] = useState<PomodoroSession[]>([]);
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4
  });
  const [showSettings, setShowSettings] = useState(false);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartWork, setAutoStartWork] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        completedAt: new Date(session.completedAt)
      }));
      setCompletedSessions(parsedSessions);
    }

    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoroSessions', JSON.stringify(completedSessions));
  }, [completedSessions]);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    
    // Play notification sound (simulated)
    playNotificationSound();

    // Add completed session to history
    const newSession: PomodoroSession = {
      id: Date.now(),
      type: currentSession,
      duration: getDurationForSession(currentSession),
      completedAt: new Date()
    };
    setCompletedSessions(prev => [newSession, ...prev]);

    // Determine next session type
    if (currentSession === 'work') {
      const workSessions = completedSessions.filter(s => s.type === 'work').length + 1;
      const nextSession = workSessions % settings.sessionsUntilLongBreak === 0 ? 'long-break' : 'short-break';
      setCurrentSession(nextSession);
      setTimeLeft(getDurationForSession(nextSession) * 60);
      
      if (autoStartBreaks) {
        setTimeout(() => setIsActive(true), 1000);
      }
    } else {
      setCurrentSession('work');
      setTimeLeft(settings.workDuration * 60);
      
      if (autoStartWork) {
        setTimeout(() => setIsActive(true), 1000);
      }
    }
  };

  const playNotificationSound = () => {
    // Simulate notification sound
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: `${currentSession === 'work' ? 'Work' : 'Break'} session completed!`,
        icon: '🍅'
      });
    }
  };

  const getDurationForSession = (sessionType: string) => {
    switch (sessionType) {
      case 'work': return settings.workDuration;
      case 'short-break': return settings.shortBreakDuration;
      case 'long-break': return settings.longBreakDuration;
      default: return settings.workDuration;
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getDurationForSession(currentSession) * 60);
  };

  const skipSession = () => {
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return '#e74c3c';
      case 'short-break': return '#3498db';
      case 'long-break': return '#9b59b6';
      default: return '#e74c3c';
    }
  };

  const getSessionEmoji = () => {
    switch (currentSession) {
      case 'work': return '🍅';
      case 'short-break': return '☕';
      case 'long-break': return '🌴';
      default: return '🍅';
    }
  };

  const getSessionLabel = () => {
    switch (currentSession) {
      case 'work': return 'Work Session';
      case 'short-break': return 'Short Break';
      case 'long-break': return 'Long Break';
      default: return 'Work Session';
    }
  };

  const getTodaysSessions = () => {
    const today = new Date().toDateString();
    return completedSessions.filter(session => 
      session.completedAt.toDateString() === today
    );
  };

  const getWorkSessionsToday = () => {
    return getTodaysSessions().filter(session => session.type === 'work').length;
  };

  const progress = ((getDurationForSession(currentSession) * 60 - timeLeft) / (getDurationForSession(currentSession) * 60)) * 100;

  return (
    <div className="pomodoro-timer">
      <BackButton />
      <div className="timer-container">
        <div className="header">
          <h1 className="title">🍅 Pomodoro Timer</h1>
          <p className="subtitle">Stay focused and productive</p>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-number">{getWorkSessionsToday()}</span>
              <span className="stat-label">Sessions Today</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <span className="stat-number">{completedSessions.filter(s => s.type === 'work').length}</span>
              <span className="stat-label">Total Sessions</span>
            </div>
          </div>
        </div>

        <div className="timer-section">
          <div className="session-info">
            <div className="session-emoji">{getSessionEmoji()}</div>
            <h2 className="session-label">{getSessionLabel()}</h2>
          </div>

          <div className="timer-display">
            <div 
              className="timer-circle"
              style={{ 
                background: `conic-gradient(${getSessionColor()} ${progress * 3.6}deg, #f1f3f4 0deg)` 
              }}
            >
              <div className="timer-inner">
                <span className="time-text">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="timer-controls">
            <button 
              onClick={toggleTimer}
              className={`control-btn primary ${isActive ? 'pause' : 'play'}`}
            >
              {isActive ? '⏸️' : '▶️'}
            </button>
            
            <button 
              onClick={resetTimer}
              className="control-btn secondary"
            >
              🔄
            </button>
            
            <button 
              onClick={skipSession}
              className="control-btn secondary"
            >
              ⏭️
            </button>
          </div>

          <div className="auto-start-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(e) => setAutoStartBreaks(e.target.checked)}
              />
              <span className="checkmark"></span>
              Auto-start breaks
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoStartWork}
                onChange={(e) => setAutoStartWork(e.target.checked)}
              />
              <span className="checkmark"></span>
              Auto-start work sessions
            </label>
          </div>
        </div>

        <div className="settings-section">
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️ Settings
          </button>

          {showSettings && (
            <div className="settings-panel">
              <h3>Timer Settings</h3>
              
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Work Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.workDuration}
                    onChange={(e) => setSettings({
                      ...settings,
                      workDuration: parseInt(e.target.value) || 25
                    })}
                    className="setting-input"
                  />
                </div>

                <div className="setting-item">
                  <label>Short Break (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.shortBreakDuration}
                    onChange={(e) => setSettings({
                      ...settings,
                      shortBreakDuration: parseInt(e.target.value) || 5
                    })}
                    className="setting-input"
                  />
                </div>

                <div className="setting-item">
                  <label>Long Break (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings({
                      ...settings,
                      longBreakDuration: parseInt(e.target.value) || 15
                    })}
                    className="setting-input"
                  />
                </div>

                <div className="setting-item">
                  <label>Sessions until long break</label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={settings.sessionsUntilLongBreak}
                    onChange={(e) => setSettings({
                      ...settings,
                      sessionsUntilLongBreak: parseInt(e.target.value) || 4
                    })}
                    className="setting-input"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="history-section">
          <h3 className="section-title">Today's Sessions</h3>
          
          {getTodaysSessions().length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <p>No sessions completed today. Start your first session!</p>
            </div>
          ) : (
            <div className="sessions-list">
              {getTodaysSessions().slice(0, 10).map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-type">
                    <span className="type-emoji">
                      {session.type === 'work' ? '🍅' : session.type === 'short-break' ? '☕' : '🌴'}
                    </span>
                    <span className="type-label">
                      {session.type === 'work' ? 'Work' : 
                       session.type === 'short-break' ? 'Short Break' : 'Long Break'}
                    </span>
                  </div>
                  <div className="session-duration">
                    {session.duration} min
                  </div>
                  <div className="session-time">
                    {session.completedAt.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
