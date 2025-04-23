import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState<{
      name: string;
      email: string;
      password: string;
      role: 'researcher' | 'ipr_officer' | 'innovation_manager' | 'startup_founder' | 'admin';
      department: string;
      bio: string;
  }>({
      name: '',
      email: '',
      password: '',
      role: 'researcher',
      department: '',
      bio: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 p-10 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">Join ResearchIP today!</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
            <AlertCircle className="text-red-500 mr-3 h-5 w-5 mt-0.5" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full p-2 border rounded"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Password"
            className="w-full p-2 border rounded"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="researcher">Researcher</option>
            <option value="ipr_officer">IPR Officer</option>
            <option value="innovation_manager">Innovation Manager</option>
            <option value="startup_founder">Startup Founder</option>
          </select>

          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Department"
            className="w-full p-2 border rounded"
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Short Bio"
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
