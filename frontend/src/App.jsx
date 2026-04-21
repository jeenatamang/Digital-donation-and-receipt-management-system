import { useState } from 'react';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <div>

      {isAuthenticated ? (
        <AdminDashboard />
      ) : (
        <AuthPage onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;