import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, UploadCloud, Plus, Calendar, ArrowUpDown, MoreHorizontal, X, Check } from 'lucide-react';
import { format } from 'date-fns';

interface GrantApplication {
  id: string;
  title: string;
  agency: string;
  status: 'submitted' | 'in_preparation' | 'awarded' | 'rejected';
  amount: number;
  deadline: string;
  submittedDate?: string;
  investigators: string[];
  abstract: string;
  objectives: string[];
  budget: {
    personnel: number;
    equipment: number;
    materials: number;
    travel: number;
    other: number;
  }
  duration: number;
  documents: string[];
}

const mockGrants: GrantApplication[] = [
  {
    id: 'GR-2025-001',
    title: 'Advanced Materials for Renewable Energy Applications',
    agency: 'National Science Foundation',
    status: 'submitted',
    amount: 450000,
    deadline: '2025-05-15',
    submittedDate: '2025-04-10',
    investigators: ['Dr. Sarah Wilson', 'Dr. James Rodriguez'],
    abstract: 'Research on novel materials for improved energy storage and conversion efficiency.',
    objectives: [
      'Develop new electrode materials',
      'Improve energy storage capacity',
      'Reduce production costs'
    ],
    budget: {
      personnel: 250000,
      equipment: 100000,
      materials: 50000,
      travel: 25000,
      other: 25000
    },
    duration: 24,
    documents: ['proposal.pdf', 'budget.xlsx', 'team_bios.pdf']
  },
  // other mock grants...
];

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let label = "";

  switch(status) {
    case 'in_preparation':
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      label = "In Preparation";
      break;
    case 'submitted':
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      label = "Submitted";
      break;
    case 'awarded':
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      label = "Awarded";
      break;
    case 'rejected':
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      label = "Rejected";
      break;
    default:
      label = status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
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

const GrantApplications = () => {
 // Use the react-router-dom hook
 const navigate = useNavigate();
  
 // Update the navigateToGrant function to use the navigate hook
 const navigateToGrant = (grantId: string) => {
   navigate(`/research/grants/${grantId}`);
 };

  const [grants, setGrants] = useState<GrantApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGrants, setSelectedGrants] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Toast notification replacement
  const showToast = (message: string, type: 'success' | 'error') => {
    alert(`${type.toUpperCase()}: ${message}`);
  };
  
  // New Grant form state
  const [newGrant, setNewGrant] = useState<Partial<GrantApplication>>({
    title: '',
    agency: '',
    status: 'in_preparation',
    amount: 0,
    deadline: format(new Date(), 'yyyy-MM-dd'),
    investigators: [''],
    abstract: '',
    objectives: [''],
    budget: {
      personnel: 0,
      equipment: 0,
      materials: 0,
      travel: 0,
      other: 0
    },
    duration: 12,
    documents: []
  });

  // Load grants from localStorage or initialize with mock data
  useEffect(() => {
    const savedGrants = localStorage.getItem('grantApplications');
    if (savedGrants) {
      try {
        const parsedGrants = JSON.parse(savedGrants);
        setGrants(parsedGrants);
      } catch (error) {
        console.error("Failed to parse grants from localStorage:", error);
        setGrants(mockGrants);
        // If there was an error parsing, save the mock grants
        localStorage.setItem('grantApplications', JSON.stringify(mockGrants));
      }
    } else {
      // If no grants in localStorage, initialize with mock data
      setGrants(mockGrants);
      localStorage.setItem('grantApplications', JSON.stringify(mockGrants));
    }
  }, []);

  const filteredGrants = grants.filter(grant =>
    (selectedStatus === 'all' || grant.status === selectedStatus) &&
    (grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.investigators.join(' ').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedGrants = sortConfig
    ? [...filteredGrants].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof GrantApplication];
        const bValue = b[sortConfig.key as keyof GrantApplication];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredGrants;

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectGrant = (grantId: string) => {
    setSelectedGrants(prevSelected =>
      prevSelected.includes(grantId)
        ? prevSelected.filter(id => id !== grantId)
        : [...prevSelected, grantId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedGrants.length === sortedGrants.length) {
      setSelectedGrants([]);
    } else {
      setSelectedGrants(sortedGrants.map(grant => grant.id));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedGrants = JSON.parse(content);
          
          if (Array.isArray(importedGrants) && importedGrants.every(grant => 
            grant.id && grant.title && grant.agency && grant.status
          )) {
            const updatedGrants = [...grants, ...importedGrants];
            setGrants(updatedGrants);
            localStorage.setItem('grantApplications', JSON.stringify(updatedGrants));
            showToast('Grants imported successfully', 'success');
          } else {
            showToast('Invalid grant data format', 'error');
          }
        } catch (error) {
          showToast('Failed to import grants', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const selectedData = selectedGrants.length > 0 
      ? grants.filter(g => selectedGrants.includes(g.id))
      : grants;

    const dataStr = JSON.stringify(selectedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'grant-applications.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast(`${selectedData.length} grants exported successfully`, 'success');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties for budget
    if (name.startsWith('budget.')) {
      const budgetField = name.split('.')[1];
      setNewGrant({
        ...newGrant,
        budget: {
          ...newGrant.budget,
          [budgetField]: Number(value)
        }
      });
    } else {
      setNewGrant({
        ...newGrant,
        [name]: name === 'amount' || name === 'duration' ? Number(value) : value
      });
    }
  };

  const addInvestigator = () => {
    if (newGrant.investigators) {
      setNewGrant({
        ...newGrant,
        investigators: [...newGrant.investigators, '']
      });
    }
  };

  const updateInvestigator = (index: number, value: string) => {
    if (newGrant.investigators) {
      const updatedInvestigators = [...newGrant.investigators];
      updatedInvestigators[index] = value;
      setNewGrant({
        ...newGrant,
        investigators: updatedInvestigators
      });
    }
  };

  const removeInvestigator = (index: number) => {
    if (newGrant.investigators && newGrant.investigators.length > 1) {
      const updatedInvestigators = [...newGrant.investigators];
      updatedInvestigators.splice(index, 1);
      setNewGrant({
        ...newGrant,
        investigators: updatedInvestigators
      });
    }
  };

  const addObjective = () => {
    if (newGrant.objectives) {
      setNewGrant({
        ...newGrant,
        objectives: [...newGrant.objectives, '']
      });
    }
  };

  const updateObjective = (index: number, value: string) => {
    if (newGrant.objectives) {
      const updatedObjectives = [...newGrant.objectives];
      updatedObjectives[index] = value;
      setNewGrant({
        ...newGrant,
        objectives: updatedObjectives
      });
    }
  };

  const removeObjective = (index: number) => {
    if (newGrant.objectives && newGrant.objectives.length > 1) {
      const updatedObjectives = [...newGrant.objectives];
      updatedObjectives.splice(index, 1);
      setNewGrant({
        ...newGrant,
        objectives: updatedObjectives
      });
    }
  };

  const handleCreateGrant = () => {
    try {
      // Generate a new Grant ID
      const date = new Date();
      const year = date.getFullYear();
      const newId = `GR-${year}-${String(grants.length + 1).padStart(3, '0')}`;
      
      const finalGrant: GrantApplication = {
        ...newGrant as GrantApplication,
        id: newId,
        documents: [] // Start with empty documents
      };
      
      // Add the new grant to state and localStorage
      const updatedGrants = [...grants, finalGrant];
      setGrants(updatedGrants);
      localStorage.setItem('grantApplications', JSON.stringify(updatedGrants));
      
      // Close modal and notify
      setIsModalOpen(false);
      showToast('New grant created successfully', 'success');
      
      // Navigate to the new grant
      navigateToGrant(newId);
    } catch (error) {
      console.error("Failed to create grant:", error);
      showToast('Failed to create grant. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grant Applications</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all research grant applications and funding opportunities
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Grant
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-xs w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search grants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="in_preparation">In Preparation</option>
              <option value="submitted">Submitted</option>
              <option value="awarded">Awarded</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownload}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Download selected grants"
              >
                <Download className="h-4 w-4 text-gray-500" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Upload grants"
              >
                <UploadCloud className="h-4 w-4 text-gray-500" />
              </button>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Calendar className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedGrants.length === sortedGrants.length && sortedGrants.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('id')}
                >
                  <div className="flex items-center">
                    Grant ID
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('title')}
                >
                  <div className="flex items-center">
                    Title & Agency
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('deadline')}
                >
                  <div className="flex items-center">
                    Deadline
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Investigators
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedGrants.length > 0 ? (
                sortedGrants.map((grant) => (
                  <tr key={grant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedGrants.includes(grant.id)}
                        onChange={() => toggleSelectGrant(grant.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {grant.id}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => navigateToGrant(grant.id)}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {grant.title}
                      </button>
                      <div className="text-sm text-gray-500">{grant.agency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={grant.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(grant.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(grant.deadline), 'MMM d, yyyy')}
                      </div>
                      {grant.submittedDate && (
                        <div className="text-xs text-gray-500">
                          Submitted: {format(new Date(grant.submittedDate), 'MMM d, yyyy')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grant.investigators.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-400 hover:text-gray-500">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    No grants found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedGrants.length}</span> of{' '}
                <span className="font-medium">{grants.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* New Grant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Grant Application</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Grant Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="agency" className="block text-sm font-medium text-gray-700">Funding Agency</label>
                    <input
                      type="text"
                      id="agency"
                      name="agency"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.agency}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="status"
                      name="status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.status}
                      onChange={handleInputChange}
                    >
                      <option value="in_preparation">In Preparation</option>
                      <option value="submitted">Submitted</option>
                      <option value="awarded">Awarded</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.deadline}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (months)</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      min="1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Investigators */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Investigators</h3>
                  <button
                    type="button"
                    onClick={addInvestigator}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Investigator
                  </button>
                </div>
                {newGrant.investigators?.map((investigator, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={investigator}
                      onChange={(e) => updateInvestigator(index, e.target.value)}
                      placeholder="Investigator name"
                      required
                    />
                    {newGrant.investigators.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInvestigator(index)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Abstract */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Abstract</h3>
                <textarea
                  name="abstract"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={newGrant.abstract}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the grant proposal"
                />
              </div>

              {/* Objectives */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Objectives</h3>
                  <button
                    type="button"
                    onClick={addObjective}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Objective
                  </button>
                </div>
                {newGrant.objectives?.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder="Grant objective"
                      required
                    />
                    {newGrant.objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Budget */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Budget Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="budget.personnel" className="block text-sm font-medium text-gray-700">Personnel ($)</label>
                    <input
                      type="number"
                      id="budget.personnel"
                      name="budget.personnel"
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.budget?.personnel}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="budget.equipment" className="block text-sm font-medium text-gray-700">Equipment ($)</label>
                    <input
                      type="number"
                      id="budget.equipment"
                      name="budget.equipment"
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.budget?.equipment}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="budget.materials" className="block text-sm font-medium text-gray-700">Materials ($)</label>
                    <input
                      type="number"
                      id="budget.materials"
                      name="budget.materials"
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.budget?.materials}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="budget.travel" className="block text-sm font-medium text-gray-700">Travel ($)</label>
                    <input
                      type="number"
                      id="budget.travel"
                      name="budget.travel"
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.budget?.travel}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="budget.other" className="block text-sm font-medium text-gray-700">Other ($)</label>
                    <input
                      type="number"
                      id="budget.other"
                      name="budget.other"
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newGrant.budget?.other}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md w-full">
                      <div className="text-sm font-medium text-gray-700">Total Budget</div>
                      <div className="text-xl font-semibold text-gray-900">
                        {formatCurrency(
                          (newGrant.budget?.personnel || 0) +
                          (newGrant.budget?.equipment || 0) +
                          (newGrant.budget?.materials || 0) +
                          (newGrant.budget?.travel || 0) +
                          (newGrant.budget?.other || 0)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-5 mt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateGrant}
                    className="ml-3 inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Create Grant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantApplications;