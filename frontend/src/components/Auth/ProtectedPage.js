import './Auth.css';

const ProtectedPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="protected-container">
      <div className="protected-header">
        <h2>Protected Dashboard</h2>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      
      <div className="welcome-message">
        <h3>Welcome, {user.username}!</h3>
        <p>You have successfully accessed the protected area.</p>
        <p>Your user ID: {user.id}</p>
      </div>

      <div className="protected-content">
        <h4>You are viewing this page because you are authenticated.</h4>
      </div>
    </div>
  );
};

export default ProtectedPage;