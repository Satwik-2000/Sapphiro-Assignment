import { useState, useEffect } from 'react';
import { taskAPI } from '../../services/api';
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await taskAPI.createTask({
        title: newTask,
        completed: false
      });
      
      setTasks([...tasks, response.data]);
      setNewTask('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add task');
    }
  };

  const toggleTask = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      const response = await taskAPI.updateTask(id, {
        completed: !task.completed
      });
      
      setTasks(tasks.map(task => 
        task.id === id ? response.data : task
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
    }
  };

  if (loading && tasks.length === 0) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-manager-container">
      <h2>Task Manager</h2>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="dismiss-error">×</button>
        </div>
      )}

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          disabled={loading}
        />
        <button 
          onClick={addTask}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      <div className="tasks-header">
        <h3>Tasks ({tasks.length})</h3>
        <button onClick={fetchTasks} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="tasks-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-content">
              <h4>{task.title}</h4>
              <span className="task-status">
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="task-actions">
              <button
                onClick={() => toggleTask(task.id)}
                disabled={loading}
                className={task.completed ? 'undo' : 'complete'}
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                disabled={loading}
                className="delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="no-tasks">
          <p>No tasks found. Add a task to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TaskManager;