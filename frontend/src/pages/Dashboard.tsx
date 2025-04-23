import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ArrowUpRight,
  Beaker,
  FileText,
  Lightbulb,
  Rocket,
  BarChart,
  Clock,
  Users,
  Activity,
} from 'lucide-react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subDays } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold mt-1 text-gray-900">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </div>
      <div className="mt-3 flex items-center text-sm">
        <span
          className={`${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          } font-medium`}
        >
          {change >= 0 ? '+' : ''}
          {change}%
        </span>
        <span className="text-gray-500 ml-1">from previous month</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Mock data for charts
  const activityData = [
    { name: 'Jan', research: 40, ipr: 24, innovation: 35, startup: 10 },
    { name: 'Feb', research: 30, ipr: 13, innovation: 22, startup: 15 },
    { name: 'Mar', research: 20, ipr: 38, innovation: 28, startup: 18 },
    { name: 'Apr', research: 27, ipr: 18, innovation: 39, startup: 24 },
    { name: 'May', research: 35, ipr: 23, innovation: 25, startup: 31 },
    { name: 'Jun', research: 42, ipr: 36, innovation: 30, startup: 26 },
  ];

  const pieData = [
    { name: 'Research', value: 540, color: '#1E40AF' },
    { name: 'IPR', value: 310, color: '#0D9488' },
    { name: 'Innovation', value: 270, color: '#F59E0B' },
    { name: 'Startup', value: 190, color: '#8B5CF6' },
  ];

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'research',
      title: 'New research project created',
      project: 'Sustainable Energy Solutions',
      time: 'Today at 10:30 AM',
      user: 'Jane Smith',
    },
    {
      id: 2,
      type: 'ipr',
      title: 'Patent application submitted',
      project: 'Neural Network Optimization Method',
      time: 'Yesterday at 4:15 PM',
      user: 'Robert Chen',
    },
    {
      id: 3,
      type: 'innovation',
      title: 'Prototype development started',
      project: 'Smart Home Energy Monitor',
      time: `${format(subDays(new Date(), 2), 'MMM d')} at 11:20 AM`,
      user: 'Sara Johnson',
    },
    {
      id: 4,
      type: 'startup',
      title: 'Funding milestone reached',
      project: 'GreenTech Innovations',
      time: `${format(subDays(new Date(), 3), 'MMM d')} at 9:45 AM`,
      user: 'David Parker',
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: 'Grant Application Deadline',
      project: 'Advanced Materials Research',
      date: 'Jun 15, 2025',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Patent Filing Deadline',
      project: 'AI-Powered Diagnostic Tool',
      date: 'Jun 22, 2025',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Quarterly Report Due',
      project: 'Biofuel Research Initiative',
      date: 'Jun 30, 2025',
      priority: 'medium',
    },
    {
      id: 4,
      title: 'Prototype Demo',
      project: 'Smart Irrigation System',
      date: 'Jul 10, 2025',
      priority: 'low',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}. Here's what's happening today.
          </p>
        </div>
        
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Research Projects"
          value="38"
          change={12}
          icon={<Beaker className="h-5 w-5 text-white" />}
          color="bg-blue-800"
        />
        <StatCard
          title="Patent Applications"
          value="24"
          change={8}
          icon={<FileText className="h-5 w-5 text-white" />}
          color="bg-teal-600"
        />
        <StatCard
          title="Innovation Ideas"
          value="64"
          change={27}
          icon={<Lightbulb className="h-5 w-5 text-white" />}
          color="bg-amber-500"
        />
        <StatCard
          title="Active Startups"
          value="12"
          change={-3}
          icon={<Rocket className="h-5 w-5 text-white" />}
          color="bg-purple-600"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm lg:col-span-2 border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Activity Overview
            </h2>
            <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>Last month</option>
            </select>
          </div>
          <div className="p-5">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={activityData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="research"
                    stackId="a"
                    fill="#1E40AF"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="ipr"
                    stackId="a"
                    fill="#0D9488"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="innovation"
                    stackId="a"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="startup"
                    stackId="a"
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-blue-800 mr-2"></span>
                <span className="text-sm text-gray-600">Research</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-teal-600 mr-2"></span>
                <span className="text-sm text-gray-600">IPR</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                <span className="text-sm text-gray-600">Innovation</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-purple-600 mr-2"></span>
                <span className="text-sm text-gray-600">Startup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Distribution Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">
              Resource Distribution
            </h2>
          </div>
          <div className="p-5 flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 w-full">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <span
                    className="h-3 w-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm lg:col-span-2 border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View all <ArrowUpRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="px-5 py-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-start">
                  <div
                    className={`p-2 rounded-lg mr-4 ${
                      activity.type === 'research'
                        ? 'bg-blue-100 text-blue-800'
                        : activity.type === 'ipr'
                        ? 'bg-teal-100 text-teal-800'
                        : activity.type === 'innovation'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {activity.type === 'research' ? (
                      <Beaker className="h-5 w-5" />
                    ) : activity.type === 'ipr' ? (
                      <FileText className="h-5 w-5" />
                    ) : activity.type === 'innovation' ? (
                      <Lightbulb className="h-5 w-5" />
                    ) : (
                      <Rocket className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600">{activity.project}</p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <span>{activity.time}</span>
                      <span className="mx-1">•</span>
                      <span>{activity.user}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Upcoming Deadlines
            </h2>
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View calendar <ArrowUpRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="px-5 py-3 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    <Clock
                      className={`h-5 w-5 ${
                        deadline.priority === 'high'
                          ? 'text-red-500'
                          : deadline.priority === 'medium'
                          ? 'text-amber-500'
                          : 'text-green-500'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {deadline.title}
                    </p>
                    <div className="flex items-center">
                      <p className="text-xs text-gray-600">
                        {deadline.project}
                      </p>
                      <span className="mx-1">•</span>
                      <p className="text-xs font-medium text-gray-700">
                        {deadline.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-100">
            <button className="w-full text-sm text-center text-blue-600 hover:text-blue-800 font-medium">
              + Add new deadline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
