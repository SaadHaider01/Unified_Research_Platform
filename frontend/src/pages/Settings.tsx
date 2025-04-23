import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Lock, User, Monitor, Globe, Moon, Sun, Smartphone, Save, Trash2, CheckCircle, X, AlertCircle, Loader } from 'lucide-react';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Theme settings
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Then check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('themePreference') as 'light' | 'dark' | 'system') || 'system';
    }
    return 'system';
  });
  
  // Notifications settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationPreferences, setNotificationPreferences] = useState({
    researchUpdates: 'immediately',
    iprApplications: 'daily',
    fundingOpportunities: 'weekly'
  });
  
  // Language & Density settings
  const [language, setLanguage] = useState('english');
  const [density, setDensity] = useState('comfortable');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || 'Research & Development',
    bio: user?.bio || 'Experienced researcher with focus on renewable energy technologies.'
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || 'https://i.pravatar.cc/150?img=0');

  // Security form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Apply theme effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set the theme based on preference
      if (themePreference === 'system') {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(isSystemDark);
        document.documentElement.classList.toggle('dark', isSystemDark);
      } else {
        setDarkMode(themePreference === 'dark');
        document.documentElement.classList.toggle('dark', themePreference === 'dark');
      }
      
      // Save preference to localStorage
      localStorage.setItem('themePreference', themePreference);
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }
  }, [darkMode, themePreference]);

  // Listen for system theme changes if using system preference
  useEffect(() => {
    if (typeof window !== 'undefined' && themePreference === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setDarkMode(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themePreference]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: '' });
    }, 3000);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // File size validation (1MB max)
      if (file.size > 1024 * 1024) {
        showNotification('error', 'File size exceeds 1MB limit');
        return;
      }

      // File type validation
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        showNotification('error', 'File must be JPG, PNG, or GIF');
        return;
      }

      setAvatar(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, we would upload the avatar and save profile data to backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call

      // Update user context
      updateUser({
        ...user,
        ...profileForm,
        avatar: avatarPreview
      });
      
      showNotification('success', 'Profile updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return !errors.currentPassword && !errors.newPassword && !errors.confirmPassword;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  const handleUpdatePassword = async () => {
    if (!validatePassword()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, we would call the API to update the password
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      showNotification('success', 'Password updated successfully');
    } catch (error) {
      showNotification('error', 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    setLoading(true);
    
    try {
      // In a real app, we would call the API to enable/disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      setTwoFactorEnabled(!twoFactorEnabled);
      showNotification('success', twoFactorEnabled 
        ? 'Two-factor authentication disabled' 
        : 'Two-factor authentication enabled');
    } catch (error) {
      showNotification('error', 'Failed to update two-factor authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    
    try {
      // In a real app, we would call the API to update notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      showNotification('success', 'Notification preferences saved');
    } catch (error) {
      showNotification('error', 'Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleResetNotifications = () => {
    setEmailNotifications(true);
    setPushNotifications(true);
    setNotificationPreferences({
      researchUpdates: 'immediately',
      iprApplications: 'daily',
      fundingOpportunities: 'weekly'
    });
  };

  const handleSaveAppearance = async () => {
    setLoading(true);
    
    try {
      // In a real app, we would call the API to update appearance settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      showNotification('success', 'Appearance settings saved');
    } catch (error) {
      showNotification('error', 'Failed to update appearance settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAppearance = () => {
    setThemePreference('system');
    setLanguage('english');
    setDensity('comfortable');
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      showNotification('error', 'Please type DELETE to confirm account deletion');
      return;
    }
    
    setIsDeleting(true);
    
    try {
      // In a real app, we would call the API to delete the account
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      
      setShowDeleteModal(false);
      logout();
      // Redirect to login page would happen here in a real app
    } catch (error) {
      showNotification('error', 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <div className={`space-y-6 ${darkMode ? 'dark' : ''}`}>
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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-black">Settings</h1>
        <p className="text-gray-600 dark:text-gray-800 mt-1">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex flex-wrap">
            <button
              onClick={() => setActiveTab('profile')}
              className={`${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              <User className="h-5 w-5 mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              <Lock className="h-5 w-5 mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`${
                activeTab === 'appearance'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div className="flex-shrink-0">
                    <img 
                      className="h-24 w-24 rounded-full object-cover border border-gray-200 dark:border-gray-700" 
                      src={avatarPreview}
                      alt="User avatar"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-6">
                    <div>
                      <label 
                        htmlFor="avatar-upload" 
                        className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                      >
                        Change photo
                      </label>
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/jpeg,image/png,image/gif" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={profileForm.department}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Brief description for your profile.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button 
                    type="button" 
                    className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setProfileForm({
                      name: user?.name || '',
                      email: user?.email || '',
                      department: user?.department || 'Research & Development',
                      bio: user?.bio || 'Experienced researcher with focus on renewable energy technologies.'
                    })}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                    disabled={loading}
                  >
                    {loading && <Loader className="animate-spin h-4 w-4 mr-2" />}
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
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Notification Settings</h3>

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
                    <label htmlFor="email_notifications" className="font-medium text-gray-700 dark:text-gray-300">
                      Email Notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
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
                    <label htmlFor="push_notifications" className="font-medium text-gray-700 dark:text-gray-300">
                      Push Notifications
                    </label>
                    <p className="text-gray-500 dark:text-gray-400">
                      Receive browser notifications for real-time updates and alerts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notification Preferences</h4>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Research Project Updates</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Updates on research projects, tasks, and milestones</p>
                    </div>
                    <div>
                      <select 
                        className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={notificationPreferences.researchUpdates}
                        onChange={(e) => setNotificationPreferences({
                          ...notificationPreferences,
                          researchUpdates: e.target.value
                        })}
                      >
                        <option value="immediately">Immediately</option>
                        <option value="daily">Daily digest</option>
                        <option value="weekly">Weekly digest</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">IPR Applications</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Updates on patents, trademarks, and other IPR applications</p>
                    </div>
                    <div>
                      <select 
                        className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={notificationPreferences.iprApplications}
                        onChange={(e) => setNotificationPreferences({
                          ...notificationPreferences,
                          iprApplications: e.target.value
                        })}
                      >
                        <option value="immediately">Immediately</option>
                        <option value="daily">Daily digest</option>
                        <option value="weekly">Weekly digest</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Funding Opportunities</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">New grants, funding opportunities, and deadlines</p>
                    </div>
                    <div>
                      <select 
                        className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={notificationPreferences.fundingOpportunities}
                        onChange={(e) => setNotificationPreferences({
                          ...notificationPreferences,
                          fundingOpportunities: e.target.value
                        })}
                      >
                        <option value="immediately">Immediately</option>
                        <option value="daily">Daily digest</option>
                        <option value="weekly">Weekly digest</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button 
                  type="button" 
                  className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleResetNotifications}
                >
                  Reset to defaults
                </button>
                <button 
                  type="button" 
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                  onClick={handleSaveNotifications}
                  disabled={loading}
                >
                  {loading && <Loader className="animate-spin h-4 w-4 mr-2" />}
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
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Security Settings</h3>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Change Password</h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {passwordErrors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {passwordErrors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>
                  
                  <div>
                    <button 
                      type="button" 
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                      onClick={handleUpdatePassword}
                      disabled={loading}
                    >
                      {loading && <Loader className="animate-spin h-4 w-4 mr-2" />}
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {twoFactorEnabled 
                        ? 'Two-factor authentication is currently enabled.' 
                        : 'Two-factor authentication is currently disabled.'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {twoFactorEnabled 
                        ? 'This adds an extra layer of security to your account.' 
                        : 'Enable for additional account security.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTwoFactor}
                    className={`py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      twoFactorEnabled
                        ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                        : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader className="animate-spin h-4 w-4" />
                    ) : twoFactorEnabled ? (
                      'Disable'
                    ) : (
                      'Enable'
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Delete Account</h4>
                
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Permanently delete your account and all of your data.
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    This action cannot be undone.
                  </p>
                  
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="mt-4 py-2 px-4 border border-red-300 dark:border-red-800 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
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
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Appearance Settings</h3>

              {/* Theme Selection */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Theme Preference</h4>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div 
                    className={`relative rounded-lg border ${
                      themePreference === 'light' 
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-800 p-4 flex flex-col cursor-pointer`}
                    onClick={() => setThemePreference('light')}
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                      <Sun className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">Light</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Always use light mode</div>
                    
                    {themePreference === 'light' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className={`relative rounded-lg border ${
                      themePreference === 'dark' 
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-800 p-4 flex flex-col cursor-pointer`}
                    onClick={() => setThemePreference('dark')}
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                      <Moon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">Dark</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Always use dark mode</div>
                    
                    {themePreference === 'dark' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className={`relative rounded-lg border ${
                      themePreference === 'system' 
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-800 p-4 flex flex-col cursor-pointer`}
                    onClick={() => setThemePreference('system')}
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-3">
                      <Monitor className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">System</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Match system appearance</div>
                    
                    {themePreference === 'system' && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Language</h4>
                
                <div>
                  <select
                    id="language"
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="mt-1 block w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="english">English (US)</option>
                    <option value="spanish">Español (Spanish)</option>
                    <option value="french">Français (French)</option>
                    <option value="german">Deutsch (German)</option>
                    <option value="chinese">简体中文 (Chinese Simplified)</option>
                    <option value="japanese">日本語 (Japanese)</option>
                  </select>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    This changes the application language.
                  </p>
                </div>
              </div>

              {/* Density Selection */}
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Interface Density</h4>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <input
                      id="density-comfortable"
                      name="density"
                      type="radio"
                      checked={density === 'comfortable'}
                      onChange={() => setDensity('comfortable')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="density-comfortable" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Comfortable
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="density-compact"
                      name="density"
                      type="radio"
                      checked={density === 'compact'}
                      onChange={() => setDensity('compact')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="density-compact" className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Compact
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Controls spacing and density of UI elements.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button 
                  type="button" 
                  className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleResetAppearance}
                >
                  Reset to defaults
                </button>
                <button 
                  type="button" 
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
                  onClick={handleSaveAppearance}
                  disabled={loading}
                >
                  {loading && <Loader className="animate-spin h-4 w-4 mr-2" />}
                  Save preferences
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 shadow-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Account</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              This action permanently deletes your account, all your data, and cannot be undone. Please type <strong>DELETE</strong> to confirm.
            </p>
            
            <div className="mb-6">
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Type DELETE to confirm"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;