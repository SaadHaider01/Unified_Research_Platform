import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'researcher' | 'ipr_officer' | 'innovation_manager' | 'startup_founder' | 'admin';
  avatar?: string;
  department?: string;
  bio?: string;
}

interface AuthContextType {
   user: User | null;
   isAuthenticated: boolean;
   login: (email: string, password: string) => Promise<void>;
   logout: () => void;
   loading: boolean;
   updateUser: (updatedUser: User) => void;
   signup: (newUser: Omit<User, 'id'> & { password: string }) => Promise<void>; // 👈 Added
  }
  
// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'researcher@example.com',
    role: 'researcher',
    avatar: 'https://i.pravatar.cc/150?img=1',
    department: 'Research & Development',
    bio: 'Experienced researcher with focus on renewable energy technologies.'
  },
  {
    id: '2',
    name: 'Robert Chen',
    email: 'ipr@example.com',
    role: 'ipr_officer',
    avatar: 'https://i.pravatar.cc/150?img=2',
    department: 'Intellectual Property',
    bio: 'Specializing in patent law and intellectual property protection.'
  },
  {
    id: '3',
    name: 'Sara Johnson',
    email: 'innovation@example.com',
    role: 'innovation_manager',
    avatar: 'https://i.pravatar.cc/150?img=3',
    department: 'Innovation Management',
    bio: 'Leading innovation initiatives across multiple research domains.'
  },
  {
    id: '4',
    name: 'David Parker',
    email: 'startup@example.com',
    role: 'startup_founder',
    avatar: 'https://i.pravatar.cc/150?img=4',
    department: 'Startup Incubation',
    bio: 'Serial entrepreneur with experience in technology startups.'
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=5',
    department: 'Administration',
    bio: 'System administrator responsible for platform management.'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user by email (demo purposes only)
    const foundUser = MOCK_USERS.find(u => u.email === email);
    
    if (foundUser && password === 'password') { // Simple password for demo
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      setLoading(false);
    } else {
      setLoading(false);
      throw new Error('Invalid credentials');
    }
  };

  //signup function
  const signup = async (newUser: Omit<User, 'id'> & { password: string }) => {
     setLoading(true);
     await new Promise(resolve => setTimeout(resolve, 800)); // simulate delay
    
     const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]') as User[];
    
     if (existingUsers.find(u => u.email === newUser.email)) {
     setLoading(false);
     throw new Error('User already exists');
     }
    
    const createdUser: User = {
    ...newUser,
    id: Date.now().toString(), // simple unique id for demo
    };
    
    const updatedUsers = [...existingUsers, createdUser];
    localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
    localStorage.setItem('user', JSON.stringify(createdUser));
    setUser(createdUser);
    setLoading(false);
    };
    

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user function
  const updateUser = (updatedUser: User) => {
    // Update in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update in state
    setUser(updatedUser);
    
    // In a real application, you would also make an API call to update the user in the backend
    // For this demo, we're just updating the client-side state and localStorage
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    signup,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;