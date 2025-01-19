import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Home = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to TaskMaster
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Organize your tasks efficiently and boost your productivity
      </p>
      {user ? (
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            Welcome back, {user.email}!
          </p>
          <Link
            to="/tasks"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Your Tasks
          </Link>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Register
          </Link>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Task Management
          </h2>
          <p className="text-gray-600">
            Create, organize, and track your tasks with ease
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Priority Levels
          </h2>
          <p className="text-gray-600">
            Set priorities and focus on what matters most
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Real-time Updates
          </h2>
          <p className="text-gray-600">
            Stay synchronized with instant task updates
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 