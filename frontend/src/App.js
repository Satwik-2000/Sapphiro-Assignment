import { useState, useEffect } from 'react';
import TodoList from './components/TodoList/TodoList';
import UserProfileForm from './components/UserProfileForm/UserProfileForm';
import TaskManager from './components/TaskManager/TaskManager';
import LoginForm from './components/Auth/LoginForm';
import ProtectedPage from './components/Auth/ProtectedPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('todo');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const navigationStyle = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  };

  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const authButtonStyle = {
    ...buttonStyle,
    backgroundColor: isAuthenticated ? '#28a745' : '#dc3545'
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sapphiro ToDo App</h1>
        {isAuthenticated && (
          <div className="user-info">
            Welcome, {user?.username}!
          </div>
        )}
      </header>
      
      <div style={navigationStyle}>
        <button style={buttonStyle} onClick={() => setCurrentView('todo')}>Todo List</button>
        <button style={buttonStyle} onClick={() => setCurrentView('profile')}>Profile Form</button>
        <button style={buttonStyle} onClick={() => setCurrentView('tasks')}>Task Manager</button>
        <button style={buttonStyle} onClick={() => setCurrentView('auth')}>
          {isAuthenticated ? 'Protected Page' : 'Authentication'}
        </button>
        
        {isAuthenticated && (
          <button style={authButtonStyle} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
      <main className="App-main">
        {currentView === 'todo' && <TodoList />}
        {currentView === 'profile' && <UserProfileForm />}
        {currentView === 'tasks' && (
          isAuthenticated ? (
            <TaskManager />
          ) : (
            <div className="login-prompt" style={{ textAlign: 'center' }}>
              <p>Please log in to access the Task Manager.</p>
              <button style={buttonStyle} onClick={() => setCurrentView('auth')}>
                Go to Authentication
              </button>
            </div>
          )
        )}
        {currentView === 'auth' && (
          isAuthenticated ? <ProtectedPage /> : <LoginForm onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App;