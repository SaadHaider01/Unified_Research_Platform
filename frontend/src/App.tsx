import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import ResearchProjects from './pages/research/ResearchProjects';
import GrantApplications from './pages/research/GrantsApplication';
import Publications from './pages/research/Publications';
import IprPortfolio from './pages/ipr/IprPortfolio';
import InnovationHub from './pages/innovation/InnovationHub';
import StartupIncubator from './pages/startup/StartupIncubator';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useEffect } from 'react';
import Signup from './pages/auth/SignUp';
import ProjectDetails from './pages/research/ProjectDetails';
import GrantDetails from './pages/research/GrantDetails';
import StartupDetailsPage from './pages/startup/StartupDetails';
import StartupList from './pages/startup/SartupList';

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
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/research" element={<ResearchProjects />} />
            <Route path="/research/projects" element={<ResearchProjects />} />
            <Route path="/research/projects/:id" element={<ProjectDetails />} />
            <Route path="/research/grants" element={<GrantApplications />} />
            <Route path="/research/grants/:id" element={<GrantDetails />} />
            <Route path="/research/publications" element={<Publications />} />
            <Route path="/ipr/*" element={<IprPortfolio />} />
            <Route path="/innovation/*" element={<InnovationHub />} />
            <Route path="/startup/*" element={<StartupIncubator />} />
            <Route path="/startup-incubator" element={<StartupList />} />
            <Route path='/startup/ventures/:id' element={<StartupDetailsPage />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;