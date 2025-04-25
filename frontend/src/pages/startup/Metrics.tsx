import { useState } from 'react';
import { 
  BarChart as BarChartIcon, PieChart as PieChartIcon, 
  TrendingUp, Users, DollarSign, Calendar 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const mockMetricCards: MetricCard[] = [
  {
    title: 'Active Startups',
    value: '24',
    change: 12,
    icon: <Users className="h-6 w-6 text-blue-600" />,
    trend: 'up'
  },
  {
    title: 'Total Investment',
    value: '$2.4M',
    change: 8,
    icon: <DollarSign className="h-6 w-6 text-green-600" />,
    trend: 'up'
  },
  {
    title: 'Mentor Sessions',
    value: '156',
    change: 15,
    icon: <Calendar className="h-6 w-6 text-purple-600" />,
    trend: 'up'
  },
  {
    title: 'Success Rate',
    value: '78%',
    change: -2,
    icon: <TrendingUp className="h-6 w-6 text-amber-600" />,
    trend: 'down'
  }
];

const mockFundingData = [
  { month: 'Jan', seed: 150000, seriesA: 500000, grants: 75000 },
  { month: 'Feb', seed: 180000, seriesA: 600000, grants: 90000 },
  { month: 'Mar', seed: 220000, seriesA: 750000, grants: 120000 },
  { month: 'Apr', seed: 280000, seriesA: 900000, grants: 150000 },
  { month: 'May', seed: 350000, seriesA: 1200000, grants: 180000 },
  { month: 'Jun', seed: 420000, seriesA: 1500000, grants: 200000 }
];

const mockIndustryData = [
  { name: 'FinTech', value: 35 },
  { name: 'HealthTech', value: 25 },
  { name: 'CleanTech', value: 20 },
  { name: 'EdTech', value: 15 },
  { name: 'Others', value: 5 }
];

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#6B7280'];

const MetricCard = ({ title, value, change, icon, trend }: MetricCard) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-full">
        {icon}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </span>
      <span className="ml-2 text-sm text-gray-500">from last month</span>
    </div>
  </div>
);

const Metrics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Metrics & Analytics</h2>
        <p className="mt-1 text-sm text-gray-500">
          Track key performance indicators and startup metrics
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mockMetricCards.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Funding Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Funding Overview</h3>
            <BarChartIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockFundingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="seed" name="Seed" fill="#3B82F6" />
                <Bar dataKey="seriesA" name="Series A" fill="#10B981" />
                <Bar dataKey="grants" name="Grants" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Industry Distribution</h3>
            <PieChartIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockIndustryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockIndustryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Success Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Success Metrics</h3>
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Graduation Rate</dt>
              <dd className="text-sm font-medium text-gray-900">78%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Follow-on Funding</dt>
              <dd className="text-sm font-medium text-gray-900">65%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Market Penetration</dt>
              <dd className="text-sm font-medium text-gray-900">42%</dd>
            </div>
          </dl>
        </div>

        {/* Mentor Engagement */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mentor Engagement</h3>
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Active Mentors</dt>
              <dd className="text-sm font-medium text-gray-900">45</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Sessions This Month</dt>
              <dd className="text-sm font-medium text-gray-900">156</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Avg. Session Rating</dt>
              <dd className="text-sm font-medium text-gray-900">4.8/5.0</dd>
            </div>
          </dl>
        </div>

        {/* Resource Utilization */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resource Utilization</h3>
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Workspace Occupancy</dt>
              <dd className="text-sm font-medium text-gray-900">85%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Equipment Usage</dt>
              <dd className="text-sm font-medium text-gray-900">72%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Resource Requests</dt>
              <dd className="text-sm font-medium text-gray-900">24 Active</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Metrics;