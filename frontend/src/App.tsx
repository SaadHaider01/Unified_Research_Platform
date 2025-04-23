import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ResearchProjects from './pages/research/ResearchProjects';
import IprPortfolio from './pages/ipr/IprPortfolio';
import InnovationHub from './pages/innovation/InnovationHub';
import StartupIncubator from './pages/startup/StartupIncubator';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useEffect } from 'react';

function App() {
  // Set document title
  useEffect(() => {
    document.title = 'ResearchIP - Research & IPR Management Platform';
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/research/*" element={<ResearchProjects />} />
            <Route path="/ipr/*" element={<IprPortfolio />} />
            <Route path="/innovation/*" element={<InnovationHub />} />
            <Route path="/startup/*" element={<StartupIncubator />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;