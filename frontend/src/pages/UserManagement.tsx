import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, UserPlus, Search, Edit, Trash2, CheckCircle, AlertCircle, X, Filter, ChevronDown, Loader } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'researcher' | 'ipr_officer' | 'innovation_manager' | 'startup_founder' | 'admin';
  avatar?: string;
  department?: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive?: string;
}

const MOCK_USERS: UserData[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'researcher@example.com',
    role: 'researcher',
    avatar: 'https://i.pravatar.cc/150?img=1',
    department: 'Research & Development',
    status: 'active',
    lastActive: '2025-04-22T15:34:12Z'
  },
  {
    id: '2',
    name: 'Robert Chen',
    email: 'ipr@example.com',
    role: 'ipr_officer',
    avatar: 'https://i.pravatar.cc/150?img=2',
    department: 'Intellectual Property',
    status: 'active',
    lastActive: '2025-04-23T09:12:45Z'
  },
  {
    id: '3',
    name: 'Sara Johnson',
    email: 'innovation@example.com',
    role: 'innovation_manager',
    avatar: 'https://i.pravatar.cc/150?img=3',
    department: 'Innovation Management',
    status: 'active',
    lastActive: '2025-04-21T16:55:30Z'
  },
  {
    id: '4',
    name: 'David Parker',
    email: 'startup@example.com',
    role: 'startup_founder',
    avatar: 'https://i.pravatar.cc/150?img=4',
    department: 'Startup Incubation',
    status: 'inactive',
    lastActive: '2025-03-15T11:22:18Z'
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=5',
    department: 'Administration',
    status: 'active',
    lastActive: '2025-04-23T11:10:05Z'
  },
  {
    id: '6',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    role: 'researcher',
    avatar: 'https://i.pravatar.cc/150?img=6',
    department: 'Research & Development',
    status: 'pending',
    lastActive: null
  },
  {
    id: '7',
    name: 'Michael Wong',
    email: 'michael@example.com',
    role: 'ipr_officer',
    avatar: 'https://i.pravatar.cc/150?img=7',
    department: 'Intellectual Property',
    status: 'active',
    lastActive: '2025-04-20T08:45:12Z'
  },
  {
    id: '8',
    name: 'Aisha Khan',
    email: 'aisha@example.com',
    role: 'innovation_manager',
    avatar: 'https://i.pravatar.cc/150?img=8',
    department: 'Innovation Management',
    status: 'inactive',
    lastActive: '2025-02-28T14:30:00Z'
  }
];

const roleLabels = {
  researcher: 'Researcher',
  ipr_officer: 'IPR Officer',
  innovation_manager: 'Innovation Manager',
  startup_founder: 'Startup Founder',
  admin: 'Administrator'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // New user form
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'researcher' as 'researcher' | 'ipr_officer' | 'innovation_manager' | 'startup_founder' | 'admin',
    department: 'Research & Development',
    status: 'active' as 'active' | 'inactive' | 'pending'
  });

  useEffect(() => {
    // Simulate API call to fetch users
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setUsers(MOCK_USERS);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 3000);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };

  const handleEditUser = (user: UserData) => {
    setCurrentUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || 'Research & Development',
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (user: UserData) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  const addUser = async () => {
    try {
      // Validate form
      if (!userForm.name || !userForm.email) {
        showNotification('error', 'Name and email are required');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const newUser: UserData = {
        id: (users.length + 1).toString(),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        department: userForm.department,
        status: userForm.status,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        lastActive: userForm.status === 'active' ? new Date().toISOString() : undefined
      };

      setUsers([...users, newUser]);
      setShowAddModal(false);
      resetForm();
      showNotification('success', 'User added successfully');
    } catch (error) {
      showNotification('error', 'Failed to add user');
    }
  };

  const updateUser = async () => {
    if (!currentUser) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedUsers = users.map(u => 
        u.id === currentUser.id 
          ? { 
              ...u, 
              name: userForm.name, 
              email: userForm.email, 
              role: userForm.role,
              department: userForm.department,
              status: userForm.status 
            } 
          : u
      );

      setUsers(updatedUsers);
      setShowEditModal(false);
      resetForm();
      showNotification('success', 'User updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update user');
    }
  };

  const deleteUser = async () => {
    if (!currentUser) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const updatedUsers = users.filter(u => u.id !== currentUser.id);
      setUsers(updatedUsers);
      setShowDeleteModal(false);
      showNotification('success', 'User deleted successfully');
    } catch (error) {
      showNotification('error', 'Failed to delete user');
    }
  };

  const resetForm = () => {
    setUserForm({
      name: '',
      email: '',
      role: 'researcher',
      department: 'Research & Development',
      status: 'active'
    });
    setCurrentUser(null);
  };

  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Access Denied</h2>
          <p className="text-red-600">
            You need administrator privileges to access the User Management page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notification toast */}
      {notification.type && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-md flex items-center ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2" />
          )}
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ type: null, message: '' })}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {/* Role filter */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowRoleFilter(!showRoleFilter)}
                >
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  {roleFilter === 'all' ? 'All Roles' : roleLabels[roleFilter as keyof typeof roleLabels]}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                </button>
                
                {showRoleFilter && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        className={`${roleFilter === 'all' ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100`}
                        onClick={() => {
                          setRoleFilter('all');
                          setShowRoleFilter(false);
                        }}
                      >
                        All Roles
                      </button>
                      {Object.entries(roleLabels).map(([role, label]) => (
                        <button
                          key={role}
                          className={`${roleFilter === role ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100`}
                          onClick={() => {
                            setRoleFilter(role);
                            setShowRoleFilter(false);
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Status filter */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                >
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                </button>
                
                {showStatusFilter && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        className={`${statusFilter === 'all' ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100`}
                        onClick={() => {
                          setStatusFilter('all');
                          setShowStatusFilter(false);
                        }}
                      >
                        All Status
                      </button>
                      {['active', 'inactive', 'pending'].map((status) => (
                        <button
                          key={status}
                          className={`${statusFilter === status ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100`}
                          onClick={() => {
                            setStatusFilter(status);
                            setShowStatusFilter(false);
                          }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* User Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full" 
                              src={user.avatar || '/default-avatar.png'} 
                              alt={user.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{roleLabels[user.role]}</div>
                        <div className="text-sm text-gray-500">{user.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[user.status]}`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900"
                          disabled={user.id === '5'} // Prevent deleting the admin user
                        >
                          <Trash2 className={`h-4 w-4 ${user.id === '5' ? 'opacity-50 cursor-not-allowed' : ''}`} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No users found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredUsers.length}</span> out of <span className="font-medium">{users.length}</span> users
          </div>
        </div>
      </div>
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userForm.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={userForm.role}
                  onChange={handleFormChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {Object.entries(roleLabels).map(([role, label]) => (
                    <option key={role} value={role}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={userForm.department}
                  onChange={handleFormChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option>Research & Development</option>
                  <option>Intellectual Property</option>
                  <option>Innovation Management</option>
                  <option>Startup Incubation</option>
                  <option>Administration</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={userForm.status}
                  onChange={handleFormChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                onClick={addUser}
              >
                Add User
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User: {currentUser.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={userForm.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="edit-email"
                  name="email"
                  value={userForm.email}
                  onChange={handleFormChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="edit-role"
                  name="role"
                  value={userForm.role}
                  onChange={handleFormChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {Object.entries(roleLabels).map(([role, label]) => (
                    <option key={role} value={role}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="edit-department" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  id="edit-department"
                  name="department"
                  value={userForm.department}
                  onChange={handleFormChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option>Research & Development</option>
                  <option>Intellectual Property</option>
                  <option>Innovation Management</option>
                  <option>Startup Incubation</option>
                  <option>Administration</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={userForm.status}
                  onChange={handleFormChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                onClick={updateUser}
              >
                Update User
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete User Modal */}
      {showDeleteModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Delete User</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete <strong>{currentUser.name}</strong>? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={deleteUser}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentUser(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;