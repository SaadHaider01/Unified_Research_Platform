import { NavLink, useLocation } from 'react-router-dom';
import { 
  Beaker, FileText, Lightbulb, Rocket, Users, Settings, 
  LayoutDashboard, ChevronDown, ChevronRight, X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  isExpanded?: boolean;
  toggleExpand?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  title, 
  children, 
  isExpanded, 
  toggleExpand 
}) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  
  // If this is a parent item with children
  if (children) {
    return (
      <div className="mb-1">
        <button
          onClick={toggleExpand}
          className={`w-full flex items-center text-sm px-3 py-2 rounded-md font-medium transition-colors duration-150 ease-in-out ${
            isActive
              ? 'text-blue-900 bg-blue-50'
              : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
          }`}
        >
          <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
            {icon}
          </span>
          <span className="flex-1">{title}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="ml-10 space-y-1 mt-1">
            {children}
          </div>
        )}
      </div>
    );
  }
  
  // Regular link without children
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center text-sm px-3 py-2 rounded-md font-medium transition-colors duration-150 ease-in-out ${
          isActive
            ? 'text-blue-900 bg-blue-50'
            : 'text-gray-700 hover:text-blue-900 hover:bg-blue-50'
        }`
      }
    >
      <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
        {icon}
      </span>
      <span>{title}</span>
    </NavLink>
  );
};

const SubNavItem: React.FC<{ to: string; title: string }> = ({ to, title }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block text-sm py-2 px-3 rounded-md transition-colors duration-150 ease-in-out ${
          isActive
            ? 'text-blue-900 bg-blue-50 font-medium'
            : 'text-gray-600 hover:text-blue-900 hover:bg-blue-50'
        }`
      }
    >
      {title}
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, isMobile }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    research: false,
    ipr: false,
    innovation: false,
    startup: false
  });
  
  // Auto-expand section based on current route
  useEffect(() => {
    const path = location.pathname;
    
    if (path.startsWith('/research')) {
      setExpandedSections(prev => ({ ...prev, research: true }));
    } else if (path.startsWith('/ipr')) {
      setExpandedSections(prev => ({ ...prev, ipr: true }));
    } else if (path.startsWith('/innovation')) {
      setExpandedSections(prev => ({ ...prev, innovation: true }));
    } else if (path.startsWith('/startup')) {
      setExpandedSections(prev => ({ ...prev, startup: true }));
    }
  }, [location.pathname]);
  
  // const toggleSection = (section: string) => {
  //   setExpandedSections(prev => ({
  //     ...prev,
  //     [section]: !prev[section]
  //   }));
  // };
  const toggleSection = (section: string) => {
    setExpandedSections({
      research: section === 'research',
      ipr: section === 'ipr',
      innovation: section === 'innovation',
      startup: section === 'startup'
    });
  };

  return (
    <>
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${!isMobile ? 'relative z-0' : 'shadow-xl'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-800 text-white rounded-md">
              <Beaker className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">ResearchIP</span>
          </div>
          
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-4 space-y-1.5">
          <NavItem 
            to="/" 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            title="Dashboard" 
          />
          
          <NavItem 
            to="/research" 
            icon={<Beaker className="w-5 h-5" />} 
            title="Research Projects"
            isExpanded={expandedSections.research}
            toggleExpand={() => toggleSection('research')}
          >
            <SubNavItem to="/research/projects" title="All Projects" />
            <SubNavItem to="/research/grants" title="Grant Applications" />
            <SubNavItem to="/research/publications" title="Publications" />

          </NavItem>
          
          <NavItem 
            to="/ipr" 
            icon={<FileText className="w-5 h-5" />} 
            title="IPR Portfolio"
            isExpanded={expandedSections.ipr}
            toggleExpand={() => toggleSection('ipr')}
          >
            <SubNavItem to="/ipr/patents" title="Patents" />
            <SubNavItem to="/ipr/trademarks" title="Trademarks" />
            <SubNavItem to="/ipr/copyrights" title="Copyrights" />
            <SubNavItem to="/ipr/licensing" title="Licensing" />
          </NavItem>
          
          <NavItem 
            to="/innovation" 
            icon={<Lightbulb className="w-5 h-5" />} 
            title="Innovation Hub"
            isExpanded={expandedSections.innovation}
            toggleExpand={() => toggleSection('innovation')}
          >
            <SubNavItem to="/innovation/ideas" title="Idea Bank" />
            <SubNavItem to="/innovation/prototypes" title="Prototypes" />
            <SubNavItem to="/innovation/funding" title="Funding" />
            <SubNavItem to="/innovation/partners" title="Partners" />
          </NavItem>
          
          <NavItem 
            to="/startup" 
            icon={<Rocket className="w-5 h-5" />} 
            title="Startup Incubator"
            isExpanded={expandedSections.startup}
            toggleExpand={() => toggleSection('startup')}
          >
            <SubNavItem to="/startup/ventures" title="Ventures" />
            <SubNavItem to="/startup/mentors" title="Mentors" />
            <SubNavItem to="/startup/resources" title="Resources" />
            <SubNavItem to="/startup/metrics" title="Metrics" />
          </NavItem>
          
          {user?.role === 'admin' && (
            <NavItem 
              to="/users" 
              icon={<Users className="w-5 h-5" />} 
              title="User Management" 
            />
          )}
        </nav>
        
        {/* Bottom navigation */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200">
          <nav className="px-4 py-4">
            <NavItem 
              to="/settings" 
              icon={<Settings className="w-5 h-5" />} 
              title="Settings" 
            />
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;