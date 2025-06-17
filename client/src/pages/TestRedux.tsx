import { useAuth } from '@/hooks/useAuth';

export default function TestRedux() {
  const { user, isAuthenticated, loading, login, register, logout } = useAuth();

  const handleLogin = async () => {
    await login('test@example.com', 'password123');
  };

  const handleRegister = async () => {
    await register('Test User', 'test@example.com', 'password123');
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Redux Auth Test</h1>
      <div className="space-y-4">
        <div>
          <p>Auth Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          {user && (
            <div>
              <p>User: {user.name}</p>
              <p>Email: {user.email}</p>
            </div>
          )}
        </div>
        <div className="space-x-4">
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
          <button
            onClick={handleRegister}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Register
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 