import { useState } from 'react';
import { 
  Box, Search, Plus, ArrowUpDown, MoreHorizontal, 
  CheckCircle, XCircle, Clock, Users, Filter 
} from 'lucide-react';

interface Prototype {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'testing' | 'completed' | 'cancelled';
  lead: string;
  team: string[];
  startDate: string;
  targetDate: string;
  progress: number;
  category: string;
  technologies: string[];
  budget: number;
}

const mockPrototypes: Prototype[] = [
  {
    id: "PROTO-2025-001",
    name: "Smart Energy Monitor",
    description: "IoT device for real-time energy consumption monitoring",
    status: "in_progress",
    lead: "Dr. James Wilson",
    team: ["Sarah Chen", "Mike Johnson"],
    startDate: "2025-01-15",
    targetDate: "2025-06-30",
    progress: 45,
    category: "Hardware",
    technologies: ["IoT", "Arduino", "Cloud"],
    budget: 25000
  },
  {
    id: "PROTO-2025-002",
    name: "AI Customer Service Bot",
    description: "NLP-powered chatbot for customer service automation",
    status: "planning",
    lead: "Emma Rodriguez",
    team: ["David Kim", "Lisa Park"],
    startDate: "2025-03-01",
    targetDate: "2025-09-15",
    progress: 15,
    category: "Software",
    technologies: ["NLP", "Machine Learning", "Python"],
    budget: 35000
  },
  {
    id: "PROTO-2025-003",
    name: "Autonomous Delivery Drone",
    description: "Small-scale delivery drone for urban environments",
    status: "testing",
    lead: "Dr. Alex Chen",
    team: ["Robert Jones", "Sophia Lee"],
    startDate: "2024-11-10",
    targetDate: "2025-05-20",
    progress: 75,
    category: "Hardware",
    technologies: ["Robotics", "GPS", "Computer Vision"],
    budget: 50000
  },
  {
    id: "PROTO-2025-004",
    name: "Blockchain Supply Chain",
    description: "Transparent supply chain tracking using blockchain",
    status: "completed",
    lead: "Michael Thompson",
    team: ["Janet Williams", "Kevin Brown"],
    startDate: "2024-09-05",
    targetDate: "2025-02-15",
    progress: 100,
    category: "Software",
    technologies: ["Blockchain", "Web3", "Smart Contracts"],
    budget: 30000
  },
  {
    id: "PROTO-2025-005",
    name: "AR Maintenance Assistant",
    description: "Augmented reality app for equipment maintenance",
    status: "cancelled",
    lead: "Sarah Miller",
    team: ["John Davis", "Emily White"],
    startDate: "2024-12-01",
    targetDate: "2025-04-30",
    progress: 20,
    category: "Mobile",
    technologies: ["AR", "Mobile", "3D Modeling"],
    budget: 28000
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'planning':
        return { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock };
      case 'in_progress':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
      case 'testing':
        return { bg: 'bg-purple-100', text: 'text-purple-800', icon: Clock };
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const displayName = status.replace('_', ' ').split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="w-4 h-4 mr-1" />
      {displayName}
    </span>
  );
};

// Create a modal component for adding new prototypes
const NewPrototypeModal = ({ isOpen, onClose, addPrototype }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    lead: '',
    technologies: '',
    category: 'Software',
    budget: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPrototype: Prototype = {
      id: `PROTO-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: formData.name,
      description: formData.description,
      status: formData.status as any,
      lead: formData.lead,
      team: [],
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      category: formData.category,
      technologies: formData.technologies.split(',').map(tech => tech.trim()),
      budget: Number(formData.budget)
    };
    
    addPrototype(newPrototype);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New Prototype</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="testing">Testing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Mobile">Mobile</option>
                <option value="Web">Web</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead</label>
            <input
              type="text"
              name="lead"
              value={formData.lead}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Technologies (comma separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              placeholder="AI, Cloud, Mobile"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Budget</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create a dropdown menu component for more options
const DropdownMenu = ({ prototype, onDelete, onEdit, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-500"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => {
                onEdit(prototype);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Edit Details
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-gray-500 mb-1">Change Status</p>
              <div className="space-y-1">
                {['planning', 'in_progress', 'testing', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(prototype.id, status);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1 text-xs rounded ${
                      prototype.status === status ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {status.replace('_', ' ').split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            <button
              onClick={() => {
                onDelete(prototype.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              role="menuitem"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Prototypes = () => {
  const [prototypes, setPrototypes] = useState(mockPrototypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Handler for adding a new prototype
  const handleAddPrototype = (newPrototype) => {
    setPrototypes([...prototypes, newPrototype]);
  };

  // Handler for deleting a prototype
  const handleDeletePrototype = (id) => {
    setPrototypes(prototypes.filter(p => p.id !== id));
  };

  // Handler for editing a prototype (would typically open a modal)
  const handleEditPrototype = (prototype) => {
    // This would open an edit modal in a real application
    alert(`Edit prototype: ${prototype.name}`);
  };

  // Handler for changing prototype status
  const handleStatusChange = (id, newStatus) => {
    setPrototypes(prototypes.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    ));
  };

  // Sort functionality
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort prototypes based on current state
  const filteredAndSortedPrototypes = prototypes
    .filter(prototype => {
      const matchesSearch = 
        prototype.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prototype.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prototype.technologies.some(tech => 
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesStatus = statusFilter === 'all' || prototype.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || prototype.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Prototypes</h2>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Prototype
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Search and filters */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search prototypes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <button 
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              <button 
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => requestSort('name')}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? 'A to Z' : 'Z to A') : 'Sort'}
              </button>
            </div>
            
            {showFilters && (
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="testing">Testing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Web">Web</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Prototypes grid */}
          {filteredAndSortedPrototypes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedPrototypes.map((prototype) => (
                <div key={prototype.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{prototype.name}</h3>
                        <StatusBadge status={prototype.status} />
                      </div>
                      <DropdownMenu 
                        prototype={prototype}
                        onDelete={handleDeletePrototype}
                        onEdit={handleEditPrototype}
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{prototype.description}</p>
                    
                    <div className="mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{prototype.lead}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Progress</span>
                        <span>{prototype.progress}%</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${prototype.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {prototype.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Box className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No prototypes found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for adding new prototype */}
      <NewPrototypeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addPrototype={handleAddPrototype}
      />
    </div>
  );
};

export default Prototypes;