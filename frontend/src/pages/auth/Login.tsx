import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, Beaker, Lightbulb, FileText, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Login Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-10 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ResearchIP</h1>
            <p className="text-gray-600">Research & IP Management Platform</p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0 h-5 w-5 mt-0.5" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150 ease-in-out"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-blue-700 hover:underline"
            > 
            Sign up here
          </Link>
        </div>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo accounts</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setEmail('researcher@example.com');
                  setPassword('password');
                }}
              >
                <Beaker className="w-4 h-4 mr-2 text-blue-600" />
                Researcher
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setEmail('ipr@example.com');
                  setPassword('password');
                }}
              >
                <FileText className="w-4 h-4 mr-2 text-teal-600" />
                IPR Officer
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setEmail('innovation@example.com');
                  setPassword('password');
                }}
              >
                <Lightbulb className="w-4 h-4 mr-2 text-amber-500" />
                Innovation
              </button>
              <button
                type="button"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setEmail('startup@example.com');
                  setPassword('password');
                }}
              >
                <Rocket className="w-4 h-4 mr-2 text-purple-600" />
                Startup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Side */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-900 to-blue-700 text-white p-12 flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold">Integrated Research & IP Management</h2>
          <p className="mt-4 text-xl text-blue-100">A comprehensive platform for research, IP rights, innovation, and startup management.</p>

          <div className="mt-12 space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg">
                <Beaker className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Research Management</h3>
                <p className="mt-1 text-blue-100">Track research projects, manage grants, and collaborate with team members.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">IP Rights Protection</h3>
                <p className="mt-1 text-blue-100">Streamline patent filing, manage trademarks, and protect intellectual property.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg">
                <Lightbulb className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Innovation Hub</h3>
                <p className="mt-1 text-blue-100">Capture ideas, track prototypes, and connect with funding opportunities.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg">
                <Rocket className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium">Startup Incubator</h3>
                <p className="mt-1 text-blue-100">Connect with mentors, track progress, and allocate resources efficiently.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto text-sm text-blue-200">
          © 2025 ResearchIP. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;