import { useState } from 'react';
import { Search, Download, Calendar, ArrowDown } from 'lucide-react';

interface Grant {
  id: string;
  title: string;
  agency: string;
  amount: number;
  status: string;
  deadline: string;
  submissionDate?: string;
  investigators: string[];
}

const GrantApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showNewGrantForm, setShowNewGrantForm] = useState(false);
  const [newGrant, setNewGrant] = useState<Partial<Grant>>({
    id: "",
    title: "",
    agency: "",
    amount: 0,
    status: "In Preparation",
    deadline: "",
    investigators: [""]
  });
  
  // Sample data
  const [grants, setGrants] = useState<Grant[]>([
    {
      id: "GR-2025-001",
      title: "Advanced Materials for Renewable Energy Applications",
      agency: "National Science Foundation",
      amount: 450000,
      status: "Submitted",
      deadline: "May 15, 2025",
      submissionDate: "Apr 10, 2025",
      investigators: ["Dr. Sarah Wilson", "Dr. James Rodriguez"]
    },
    {
      id: "GR-2025-002",
      title: "Genetic Biomarkers for Early Disease Detection",
      agency: "National Institutes of Health",
      amount: 780000,
      status: "In Preparation",
      deadline: "Jun 30, 2025",
      investigators: ["Dr. Michael Chen", "Dr. Emily Patel"]
    },
    {
      id: "GR-2024-010",
      title: "Urban Water Management Technologies",
      agency: "Environmental Protection Agency",
      amount: 320000,
      status: "Awarded",
      submissionDate: "Oct 15, 2024",
      deadline: "Dec 1, 2024",
      investigators: ["Dr. Thomas Lee"]
    },
    {
      id: "GR-2024-008",
      title: "Blockchain Applications in Healthcare",
      agency: "Department of Health",
      amount: 275000,
      status: "Rejected",
      submissionDate: "Sep 5, 2024",
      deadline: "Oct 15, 2024",
      investigators: ["Dr. Amara Johnson"]
    }
  ]);

  const statuses = ["All Statuses", "Awarded", "Submitted", "In Preparation", "Rejected"];
  
  // Filter grants based on search term and status
  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          grant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          grant.agency.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All Statuses" || grant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Awarded":
        return "bg-green-100 text-green-800";
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "In Preparation":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Export functionality
  const exportToCSV = () => {
    // Create CSV content
    let csvContent = "Grant ID,Title,Agency,Amount,Status,Deadline,Submission Date,Investigators\n";
    
    filteredGrants.forEach(grant => {
      const row = [
        grant.id,
        `"${grant.title}"`,
        `"${grant.agency}"`,
        grant.amount,
        grant.status,
        grant.deadline,
        grant.submissionDate || "",
        `"${grant.investigators.join("; ")}"`
      ].join(",");
      
      csvContent += row + "\n";
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'grant_applications.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // New grant form handling
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setNewGrant({ ...newGrant, [name]: Number(value) });
    } else if (name === 'investigators') {
      setNewGrant({ ...newGrant, [name]: value.split(',').map(item => item.trim()) });
    } else {
      setNewGrant({ ...newGrant, [name]: value });
    }
  };

  const submitNewGrant = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a new ID
    const currentYear = new Date().getFullYear();
    const newId = `GR-${currentYear}-${String(grants.length + 1).padStart(3, '0')}`;
    
    const grantToAdd: Grant = {
      ...newGrant as Grant,
      id: newId
    };
    
    // Add to grants array
    setGrants([...grants, grantToAdd]);
    
    // Reset form
    setNewGrant({
      id: "",
      title: "",
      agency: "",
      amount: 0,
      status: "In Preparation",
      deadline: "",
      investigators: [""]
    });
    
    // Close form
    setShowNewGrantForm(false);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Grant Applications</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track all research grant applications and funding opportunities</p>
      </div>

      {showNewGrantForm ? (
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">New Grant Application</h2>
            <button 
              onClick={() => setShowNewGrantForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={submitNewGrant}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grant Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newGrant.title}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Agency
                </label>
                <input
                  type="text"
                  name="agency"
                  value={newGrant.agency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={newGrant.amount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={newGrant.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="In Preparation">In Preparation</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Awarded">Awarded</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="text"
                  name="deadline"
                  value={newGrant.deadline}
                  onChange={handleInputChange}
                  placeholder="MMM DD, YYYY"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investigators (comma separated)
                </label>
                <input
                  type="text"
                  name="investigators"
                  value={newGrant.investigators?.join(", ")}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewGrantForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Grant
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search grants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <button 
                onClick={exportToCSV}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              
              <button 
                onClick={() => setShowNewGrantForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + New Grant
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grant ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title & Agency
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investigators
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGrants.map((grant) => (
                  <tr key={grant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {grant.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{grant.title}</div>
                      <div className="text-sm text-gray-500">{grant.agency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(grant.status)}`}>
                        {grant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${grant.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {grant.deadline}
                      </div>
                      {grant.submissionDate && (
                        <div className="text-xs text-gray-500">
                          Submitted: {grant.submissionDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {grant.investigators.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrantApplications;