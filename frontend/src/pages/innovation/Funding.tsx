import { useState } from 'react';
import { 
  DollarSign, Search, Plus, ArrowUpDown, MoreHorizontal, 
  Calendar, Clock, CheckCircle, XCircle, Filter, Building, ExternalLink 
} from 'lucide-react';

interface FundingOpportunity {
  id: string;
  title: string;
  description: string;
  type: 'grant' | 'investment' | 'competition' | 'other';
  amount: number;
  deadline: string;
  status: 'open' | 'closing_soon' | 'closed';
  organization: string;
  eligibility: string[];
  requirements: string[];
  website: string;
  applied?: boolean;
}

const mockFunding: FundingOpportunity[] = [
  {
    id: "FUND-2025-001",
    title: "Innovation Challenge 2025",
    description: "Funding for breakthrough technologies in renewable energy",
    type: "competition",
    amount: 100000,
    deadline: "2025-06-30",
    status: "open",
    organization: "Clean Energy Foundation",
    eligibility: [
      "Early-stage startups",
      "Research institutions",
      "Individual inventors"
    ],
    requirements: [
      "Detailed project proposal",
      "Proof of concept",
      "Budget breakdown"
    ],
    website: "https://example.com/funding"
  },
  {
    id: "FUND-2025-002",
    title: "Seed Funding Program",
    description: "Early-stage investments for tech startups with social impact",
    type: "investment",
    amount: 250000,
    deadline: "2025-05-15",
    status: "closing_soon",
    organization: "Future Ventures",
    eligibility: [
      "Pre-seed to seed-stage startups",
      "Technology focus",
      "Social impact component"
    ],
    requirements: [
      "Business plan",
      "Demo or MVP",
      "Market analysis"
    ],
    website: "https://example.com/funding"
  },
  {
    id: "FUND-2025-003",
    title: "Research Grant for AI Ethics",
    description: "Supporting academic research on ethical AI development",
    type: "grant",
    amount: 75000,
    deadline: "2025-04-10",
    status: "closed",
    organization: "Institute for Responsible Technology",
    eligibility: [
      "Academic institutions",
      "Research groups",
      "Independent researchers with institutional backing"
    ],
    requirements: [
      "Research proposal",
      "CV of researchers",
      "Publication plan"
    ],
    website: "https://example.com/funding"
  },
  {
    id: "FUND-2025-004",
    title: "Healthcare Innovation Fund",
    description: "Grants for innovative healthcare solutions improving patient outcomes",
    type: "grant",
    amount: 150000,
    deadline: "2025-07-31",
    status: "open",
    organization: "MedTech Foundation",
    eligibility: [
      "Healthcare startups",
      "Medical professionals",
      "Research institutions"
    ],
    requirements: [
      "Clinical relevance description",
      "Implementation plan",
      "Preliminary data"
    ],
    website: "https://example.com/funding"
  },
  {
    id: "FUND-2025-005",
    title: "Sustainability Challenge",
    description: "Competition for sustainable solutions in waste management",
    type: "competition",
    amount: 50000,
    deadline: "2025-05-30",
    status: "open",
    organization: "Green Future Alliance",
    eligibility: [
      "Startups",
      "Non-profits",
      "Community organizations"
    ],
    requirements: [
      "Project proposal",
      "Environmental impact assessment",
      "Implementation timeline"
    ],
    website: "https://example.com/funding"
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case 'closing_soon':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
      case 'closed':
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

const TypeBadge = ({ type }: { type: string }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'grant':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'investment':
        return { bg: 'bg-purple-100', text: 'text-purple-800' };
      case 'competition':
        return { bg: 'bg-indigo-100', text: 'text-indigo-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const config = getTypeConfig(type);
  const displayName = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {displayName}
    </span>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Calculate days between dates
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Format the date
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Add days remaining for upcoming deadlines
  if (diffDays > 0) {
    return `${formattedDate} (${diffDays} days left)`;
  } else if (diffDays === 0) {
    return `${formattedDate} (Today)`;
  } else {
    return `${formattedDate} (Passed)`;
  }
};

// Create a modal component for adding new funding opportunities
const NewOpportunityModal = ({ isOpen, onClose, addOpportunity }) => {
  const [formData, setFormData] = useState<Partial<FundingOpportunity>>({
    title: '',
    description: '',
    type: 'grant',
    amount: 0,
    deadline: new Date().toISOString().split('T')[0],
    status: 'open',
    organization: '',
    eligibility: [''],
    requirements: [''],
    website: 'https://'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: [...prev[field], ''] 
    }));
  };

  const removeArrayItem = (index, field) => {
    if (formData[field].length > 1) {
      const newArray = [...formData[field]];
      newArray.splice(index, 1);
      setFormData(prev => ({ ...prev, [field]: newArray }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newOpportunity: FundingOpportunity = {
      id: `FUND-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      type: formData.type as any,
      amount: Number(formData.amount),
      deadline: formData.deadline,
      status: formData.status as any,
      organization: formData.organization,
      eligibility: formData.eligibility.filter(item => item.trim() !== ''),
      requirements: formData.requirements.filter(item => item.trim() !== ''),
      website: formData.website
    };
    
    addOpportunity(newOpportunity);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Add New Funding Opportunity</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="grant">Grant</option>
                <option value="investment">Investment</option>
                <option value="competition">Competition</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="open">Open</option>
                <option value="closing_soon">Closing Soon</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
            {formData.eligibility.map((item, index) => (
              <div key={`eligibility-${index}`} className="flex mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(e, index, 'eligibility')}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Eligibility requirement"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'eligibility')}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('eligibility')}
              className="mt-1 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add eligibility criterion
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
            {formData.requirements.map((item, index) => (
              <div key={`requirement-${index}`} className="flex mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(e, index, 'requirements')}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Requirement"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'requirements')}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="mt-1 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add requirement
            </button>
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
              Add Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create an application modal component
const ApplicationModal = ({ isOpen, onClose, opportunity, onApply }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    proposal: '',
    agreedToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(opportunity.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Apply for Funding</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XCircle className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium">{opportunity.title}</h4>
          <p className="text-sm text-gray-500">{opportunity.organization}</p>
          <p className="text-sm font-medium mt-2">{formatCurrency(opportunity.amount)}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Brief Proposal</label>
            <textarea
              name="proposal"
              rows={4}
              required
              value={formData.proposal}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Briefly describe your project idea and how it meets the requirements..."
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="agreedToTerms"
                type="checkbox"
                required
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the terms and conditions
              </label>
              <p className="text-gray-500">I confirm that all information provided is accurate and complete.</p>
            </div>
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
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Create a success notification component
const Notification = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 p-4 shadow-md rounded-md max-w-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-800">{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Funding = () => {
  const [opportunities, setOpportunities] = useState(mockFunding);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    minAmount: '',
    maxAmount: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: 'deadline', direction: 'asc' });

  // Handler for adding a new opportunity
  const handleAddOpportunity = (newOpportunity) => {
    setOpportunities([...opportunities, newOpportunity]);
    setNotification("New funding opportunity added successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  // Handler for applying to an opportunity
  const handleApply = (id, applicationData) => {
    setOpportunities(opportunities.map(opp => 
      opp.id === id ? { ...opp, applied: true } : opp
    ));
    setNotification("Application submitted successfully!");
    setTimeout(() => setNotification(null), 3000);
  };

  // Handler for opening the application modal
  const openApplicationModal = (opportunity) => {
    if (opportunity.status === 'closed') {
      setNotification("This opportunity is closed for applications.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    
    setSelectedOpportunity(opportunity);
    setApplicationModalOpen(true);
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Sort functionality
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort opportunities based on current state
  const filteredAndSortedOpportunities = opportunities
    .filter(opportunity => {
      // Search term filter
      const matchesSearch = 
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.organization.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = filters.status === 'all' || opportunity.status === filters.status;
      
      // Type filter
      const matchesType = filters.type === 'all' || opportunity.type === filters.type;
      
      // Amount filter
      const minAmount = filters.minAmount === '' ? 0 : Number(filters.minAmount);
      const maxAmount = filters.maxAmount === '' ? Infinity : Number(filters.maxAmount);
      const matchesAmount = opportunity.amount >= minAmount && opportunity.amount <= maxAmount;
      
      return matchesSearch && matchesStatus && matchesType && matchesAmount;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      }
      
      if (sortConfig.key === 'deadline') {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return sortConfig.direction === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
      }
      
      // Default sort by title
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
        <h2 className="text-xl font-semibold text-gray-900">Funding Opportunities</h2>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
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
                  placeholder="Search funding opportunities..."
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
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="closing_soon">Closing Soon</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="grant">Grant</option>
                    <option value="investment">Investment</option>
                    <option value="competition">Competition</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount ($)</label>
                  <input
                    type="number"
                    name="minAmount"
                    value={filters.minAmount}
                    onChange={handleFilterChange}
                    placeholder="Min amount"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount ($)</label>
                  <input
                    type="number"
                    name="maxAmount"
                    value={filters.maxAmount}
                    onChange={handleFilterChange}
                    placeholder="Max amount"
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Opportunity cards */}
          <div className="space-y-4">
            {filteredAndSortedOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No funding opportunities match your search criteria.</p>
              </div>
            ) : (
              filteredAndSortedOpportunities.map(opportunity => (
                <div key={opportunity.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div className="mb-4 sm:mb-0">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">{opportunity.title}</h3>
                          <TypeBadge type={opportunity.type} />
                        </div>
                        <p className="text-sm text-gray-500 flex items-center mb-2">
                          <Building className="h-4 w-4 mr-1" /> {opportunity.organization}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">{opportunity.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <div className="flex items-center text-sm text-gray-700">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span className="font-medium">{formatCurrency(opportunity.amount)}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(opportunity.deadline)}</span>
                          </div>
                          <StatusBadge status={opportunity.status} />
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end">
                        <div className="flex space-x-2 mb-4">
                          <a
                            href={opportunity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Website
                          </a>
                          
                          <button
                            onClick={() => openApplicationModal(opportunity)}
                            disabled={opportunity.applied || opportunity.status === 'closed'}
                            className={`inline-flex items-center px-3 py-2 border ${
                              opportunity.applied 
                                ? 'bg-green-50 text-green-700 border-green-300' 
                                : opportunity.status === 'closed'
                                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                            } shadow-sm text-sm leading-4 font-medium rounded-md`}
                          >
                            {opportunity.applied ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Applied
                              </>
                            ) : (
                              'Apply Now'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Eligibility</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {opportunity.eligibility.map((item, index) => (
                              <li key={`eligibility-${index}`} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {opportunity.requirements.map((item, index) => (
                              <li key={`requirement-${index}`} className="flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <NewOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addOpportunity={handleAddOpportunity}
      />
      
      {selectedOpportunity && (
        <ApplicationModal
          isOpen={applicationModalOpen}
          onClose={() => setApplicationModalOpen(false)}
          opportunity={selectedOpportunity}
          onApply={handleApply}
        />
      )}
      
      {/* Notification */}
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Funding;