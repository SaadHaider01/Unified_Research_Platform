import { useState } from 'react';
import { 
  Building, Search, Plus, ArrowUpDown, MoreHorizontal, 
  Globe, Mail, Phone, Users, X 
} from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  type: 'academic' | 'industry' | 'government' | 'non_profit';
  logo: string;
  description: string;
  website: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  projects: string[];
  status: 'active' | 'pending' | 'inactive';
  startDate: string;
  location: string;
}

const mockPartners: Partner[] = [
  {
    id: "PARTNER-2025-001",
    name: "TechCorp Industries",
    type: "industry",
    logo: "/api/placeholder/150/150",
    description: "Leading technology solutions provider",
    website: "https://example.com",
    contact: {
      name: "John Smith",
      email: "john@example.com",
      phone: "+1 234 567 8900"
    },
    projects: [
      "AI Research Initiative",
      "Smart City Project"
    ],
    status: "active",
    startDate: "2025-01-15",
    location: "San Francisco, CA"
  },
  {
    id: "PARTNER-2025-002",
    name: "Stanford University",
    type: "academic",
    logo: "/api/placeholder/150/150",
    description: "Premier research institution focusing on breakthrough innovations",
    website: "https://stanford-example.edu",
    contact: {
      name: "Dr. Emma Rodriguez",
      email: "emma@stanford-example.edu",
      phone: "+1 415 555 7890"
    },
    projects: [
      "Quantum Computing Research",
      "Sustainable Energy Initiative"
    ],
    status: "active",
    startDate: "2024-11-03",
    location: "Palo Alto, CA"
  },
  {
    id: "PARTNER-2025-003",
    name: "Green Earth Foundation",
    type: "non_profit",
    logo: "/api/placeholder/150/150",
    description: "Environmental conservation organization working to protect endangered ecosystems",
    website: "https://greenearth-example.org",
    contact: {
      name: "Michael Chen",
      email: "michael@greenearth-example.org",
      phone: "+1 415 333 4444"
    },
    projects: [
      "Rainforest Protection Program",
      "Ocean Conservation Initiative"
    ],
    status: "active",
    startDate: "2025-02-20",
    location: "Seattle, WA"
  }
];

const TypeBadge = ({ type }: { type: string }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'academic':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'industry':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'government':
        return { bg: 'bg-purple-100', text: 'text-purple-800' };
      case 'non_profit':
        return { bg: 'bg-orange-100', text: 'text-orange-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const config = getTypeConfig(type);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
    </span>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'inactive':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Modal component for adding a new partner
const AddPartnerModal = ({ isOpen, onClose, onAddPartner }) => {
  const [newPartner, setNewPartner] = useState({
    name: '',
    type: 'industry',
    description: '',
    website: '',
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    location: '',
    projects: [''],
    status: 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNewPartner({
        ...newPartner,
        [parent]: {
          ...newPartner[parent],
          [child]: value
        }
      });
    } else {
      setNewPartner({
        ...newPartner,
        [name]: value
      });
    }
  };

  const handleProjectChange = (index, value) => {
    const updatedProjects = [...newPartner.projects];
    updatedProjects[index] = value;
    setNewPartner({
      ...newPartner,
      projects: updatedProjects
    });
  };

  const addProjectField = () => {
    setNewPartner({
      ...newPartner,
      projects: [...newPartner.projects, '']
    });
  };

  const removeProjectField = (index) => {
    const updatedProjects = newPartner.projects.filter((_, i) => i !== index);
    setNewPartner({
      ...newPartner,
      projects: updatedProjects
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty project strings
    const filteredProjects = newPartner.projects.filter(project => project.trim() !== '');
    
    const formattedPartner = {
      ...newPartner,
      id: `PARTNER-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      logo: "/api/placeholder/150/150",
      projects: filteredProjects,
      startDate: new Date().toISOString().split('T')[0]
    };
    
    onAddPartner(formattedPartner);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Partner</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Partner Name</label>
              <input
                type="text"
                name="name"
                value={newPartner.name}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={newPartner.type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option value="academic">Academic</option>
                <option value="industry">Industry</option>
                <option value="government">Government</option>
                <option value="non_profit">Non-Profit</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={newPartner.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                name="website"
                value={newPartner.website}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={newPartner.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={newPartner.status}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <input
                type="text"
                name="contact.name"
                value={newPartner.contact.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                name="contact.email"
                value={newPartner.contact.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
              <input
                type="tel"
                name="contact.phone"
                value={newPartner.contact.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              />
            </div>
          </div>
          
          {/* Projects */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Projects</h3>
              <button 
                type="button" 
                onClick={addProjectField}
                className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Project
              </button>
            </div>
            
            {newPartner.projects.map((project, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  value={project}
                  onChange={(e) => handleProjectChange(index, e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Project name"
                />
                {newPartner.projects.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeProjectField(index)}
                    className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Partner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Partners = () => {
  const [partners, setPartners] = useState(mockPartners);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to add a new partner
  const handleAddPartner = (newPartner) => {
    setPartners([...partners, newPartner]);
  };

  // Filter partners based on search term and filters
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.projects.some(project => project.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || partner.type === filterType;
    const matchesStatus = filterStatus === 'all' || partner.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Partners</h2>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Partner
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Search and filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="academic">Academic</option>
                  <option value="industry">Industry</option>
                  <option value="government">Government</option>
                  <option value="non_profit">Non-Profit</option>
                </select>
              </div>
              
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Partners grid */}
          {filteredPartners.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPartners.map((partner) => (
                <div key={partner.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="h-12 w-12 rounded-full"
                        />
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{partner.name}</h3>
                          <div className="flex space-x-2 mt-1">
                            <TypeBadge type={partner.type} />
                            <StatusBadge status={partner.status} />
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="mt-4 text-sm text-gray-500">{partner.description}</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Globe className="h-4 w-4 mr-2" />
                        <a href={partner.website} className="text-blue-600 hover:text-blue-800">
                          Website
                        </a>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{partner.contact.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{partner.contact.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Building className="h-4 w-4 mr-2" />
                        <span>{partner.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{partner.contact.name}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Projects</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {partner.projects.map((project, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {project}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No partners match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Partner Modal */}
      <AddPartnerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPartner={handleAddPartner}
      />
    </div>
  );
};

export default Partners;