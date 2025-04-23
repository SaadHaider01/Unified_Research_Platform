import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Lock, User, Monitor, Globe, Moon, Sun, Smartphone, Save, Trash2 } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState('english');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: 'Research & Development',
    bio: 'Experienced researcher with focus on renewable energy technologies.'
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save profile data to backend
    console.log('Saving profile:', profileForm);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              <User className="h-5 w-5 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              <Lock className="h-5 w-5 mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`${
                activeTab === 'appearance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              <Monitor className="h-5 w-5 mr-2" />
              Appearance
            </button>
          </nav>
        </div>

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="p-6">
            <form onSubmit={handleSaveProfile}>
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-24 w-24 rounded-full object-cover border border-gray-200" 
                      src={user?.avatar || 'https://i.pravatar.cc/150?img=0'}
                      alt="User avatar"
                    />
                  </div>
                  <div className="ml-6">
                    <button 
                      type="button" 
                      className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Change photo
                    </button>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={profileForm.department}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option>Research & Development</option>
                    <option>Intellectual Property</option>
                    <option>Innovation Management</option>
                    <option>Startup Incubation</option>
                    <option>Administration</option>
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description for your profile.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="email_notifications"
                      name="email_notifications"
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="email_notifications" className="font-medium text-gray-700">
                      Email Notifications
                    </label>
                    <p className="text-gray-500">
                      Receive email notifications for project updates, deadlines, and important alerts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="push_notifications"
                      name="push_notifications"
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={() => setPushNotifications(!pushNotifications)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="push_notifications" className="font-medium text-gray-700">
                      Push Notifications
                    </label>
                    <p className="text-gray-500">
                      Receive browser notifications for real-time updates and alerts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Notification Preferences</h4>
                
                <div className="bg-gray-50 rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Research Project Updates</p>
                      <p className="text-xs text-gray-500">Updates on research projects, tasks, and milestones</p>
                    </div>
                    <div>
                      <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                        <option>Immediately</option>
                        <option>Daily digest</option>
                        <option>Weekly digest</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">IPR Applications</p>
                      <p className="text-xs text-gray-500">Updates on patents, trademarks, and other IPR applications</p>
                    </div>
                    <div>
                      <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                        <option>Immediately</option>
                        <option>Daily digest</option>
                        <option>Weekly digest</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Funding Opportunities</p>
                      <p className="text-xs text-gray-500">New grants, funding opportunities, and deadlines</p>
                    </div>
                    <div>
                      <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                        <option>Immediately</option>
                        <option>Daily digest</option>
                        <option>Weekly digest</option>
                        <option>Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset to defaults
                </button>
                <button 
                  type="button" 
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="current_password"
                      id="current_password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new_password"
                      id="new_password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      id="confirm_password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <button 
                      type="button" 
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <div className="mt-4">
                  <button 
                    type="button" 
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Enable Two-Factor Authentication
                  </button>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-200">
                <h4 className="text-sm font-medium text-red-600">Danger Zone</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <div className="mt-4">
                  <button 
                    type="button" 
                    className="inline-flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Appearance Settings</h3>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Theme</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${!darkMode ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:bg-gray-50'}`}
                    onClick={() => setDarkMode(false)}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-white border border-gray-200 rounded-md h-8 w-8 flex items-center justify-center">
                        <Sun className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className={`h-4 w-4 rounded-full ${!darkMode ? 'bg-blue-500' : 'border border-gray-300'}`}></div>
                    </div>
                    <h5 className="text-sm font-medium text-gray-900">Light Mode</h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Standard light interface
                    </p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${darkMode ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:bg-gray-50'}`}
                    onClick={() => setDarkMode(true)}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-gray-800 border border-gray-700 rounded-md h-8 w-8 flex items-center justify-center">
                        <Moon className="h-5 w-5 text-gray-100" />
                      </div>
                      <div className={`h-4 w-4 rounded-full ${darkMode ? 'bg-blue-500' : 'border border-gray-300'}`}></div>
                    </div>
                    <h5 className="text-sm font-medium text-gray-900">Dark Mode</h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Reduced brightness for dark environments
                    </p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="bg-white border border-gray-200 rounded-md h-8 w-8 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className={`h-4 w-4 rounded-full border border-gray-300`}></div>
                    </div>
                    <h5 className="text-sm font-medium text-gray-900">System Default</h5>
                    <p className="text-xs text-gray-500 mt-1">
                      Follow system appearance settings
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Language</h4>
                
                <div>
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-2" />
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="chinese">Chinese</option>
                      <option value="japanese">Japanese</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Density</h4>
                
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center">
                    <input
                      id="density_comfortable"
                      name="density"
                      type="radio"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="density_comfortable" className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">Comfortable</span>
                      <span className="block text-xs text-gray-500">Standard spacing between elements</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="density_compact"
                      name="density"
                      type="radio"
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="density_compact" className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">Compact</span>
                      <span className="block text-xs text-gray-500">Reduced spacing for more content</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button 
                  type="button" 
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Reset to defaults
                </button>
                <button 
                  type="button" 
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;