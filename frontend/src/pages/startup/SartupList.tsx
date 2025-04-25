import React, { useState, useEffect } from "react";
import { ChevronDown, Filter, Plus, Search } from "lucide-react";

// Type definitions for our component props
interface StartupData {
  id: string;
  name: string;
  sector: string;
  stage: string;
  funding: string;
  joinedDate: string;
  status: "Active" | "Graduated" | "Applicant";
}

// Main StartupList component that will be used in the Routes
const StartupList: React.FC = () => {
  // Sample data
  const startups: StartupData[] = [
    {
      id: "SU-2025-001",
      name: "QuantumSolve Technologies",
      sector: "AI/ML",
      stage: "Series A",
      funding: "$2.5M",
      joinedDate: "Feb 15, 2025",
      status: "Active"
    },
    {
      id: "SU-2024-015",
      name: "MediSync Health",
      sector: "HealthTech",
      stage: "Seed",
      funding: "$850K",
      joinedDate: "Nov 20, 2024",
      status: "Active"
    },
    {
      id: "SU-2024-011",
      name: "EcoSmart Solutions",
      sector: "CleanTech",
      stage: "Series A",
      funding: "$1.8M",
      joinedDate: "Aug 15, 2024",
      status: "Active"
    },
    {
      id: "SU-2024-008",
      name: "FinEdge Technologies",
      sector: "FinTech",
      stage: "Seed",
      funding: "$750K",
      joinedDate: "May 3, 2024",
      status: "Active"
    },
    {
      id: "SU-2023-022",
      name: "LearnSphere",
      sector: "EdTech",
      stage: "Series B",
      funding: "$4.2M",
      joinedDate: "Dec 10, 2023",
      status: "Graduated"
    },
    {
      id: "SU-2025-004",
      name: "NeuraTech",
      sector: "AI/ML",
      stage: "Pre-Seed",
      funding: "$300K",
      joinedDate: "Mar 22, 2025",
      status: "Applicant"
    },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all-stages");
  const [sectorFilter, setSectorFilter] = useState("all-sectors");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStartups, setSelectedStartups] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 5;

  // Count startups by status for tab badges
  const activeCount = startups.filter(s => s.status === "Active").length;
  const graduatedCount = startups.filter(s => s.status === "Graduated").length;
  const applicantCount = startups.filter(s => s.status === "Applicant").length;

  // Filter startups based on active filters and search
  const filteredStartups = startups.filter(startup => {
    // Filter by status (tab)
    if (activeTab === "active" && startup.status !== "Active") return false;
    if (activeTab === "graduated" && startup.status !== "Graduated") return false;
    if (activeTab === "applicants" && startup.status !== "Applicant") return false;
    
    // Filter by search term
    if (searchTerm && !startup.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !startup.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by stage
    if (stageFilter !== "all-stages" && 
        !startup.stage.toLowerCase().replace(/\s/g, "-").includes(stageFilter)) {
      return false;
    }
    
    // Filter by sector
    if (sectorFilter !== "all-sectors" && 
        !startup.sector.toLowerCase().replace(/\//g, "-").includes(sectorFilter)) {
      return false;
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStartups.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStartups = filteredStartups.slice(indexOfFirstItem, indexOfLastItem);

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      setSelectedStartups(filteredStartups.map(s => s.id));
    } else if (selectedStartups.length === filteredStartups.length) {
      setSelectedStartups([]);
    }
  }, [selectAll]);

  // Handle checkbox changes
  const handleCheckboxChange = (id: string) => {
    if (selectedStartups.includes(id)) {
      setSelectedStartups(selectedStartups.filter(sid => sid !== id));
    } else {
      setSelectedStartups([...selectedStartups, id]);
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, stageFilter, sectorFilter]);

  // Check if current selection matches all filtered items
  useEffect(() => {
    if (filteredStartups.length > 0 && 
        selectedStartups.length === filteredStartups.length && 
        filteredStartups.every(s => selectedStartups.includes(s.id))) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedStartups, filteredStartups]);

  return (
    <div className="px-4 md:px-6 py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Startup Ventures</h1>
          <p className="text-gray-500 text-sm md:text-base">Manage and track startups in the incubation program</p>
        </div>
        <div>
          <button className="inline-flex items-center w-full justify-center md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            <span>New Startup</span>
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-4 md:space-x-8">
              <button
                onClick={() => setActiveTab("all")}
                className={`whitespace-nowrap py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm ${
                  activeTab === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-600">
                  {startups.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`whitespace-nowrap py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm ${
                  activeTab === "active"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Active
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-600">
                  {activeCount}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("graduated")}
                className={`whitespace-nowrap py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm ${
                  activeTab === "graduated"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Graduated
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-600">
                  {graduatedCount}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("applicants")}
                className={`whitespace-nowrap py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm ${
                  activeTab === "applicants"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Applicants
                <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-gray-100 text-gray-600">
                  {applicantCount}
                </span>
              </button>
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by name or ID"
              className="block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500 mr-2">Filter:</span>
            </div>
            <SelectDropdown 
              defaultValue="all-stages" 
              value={stageFilter}
              onChange={setStageFilter}
              options={[
                { value: "all-stages", label: "All Stages" },
                { value: "pre-seed", label: "Pre-Seed" },
                { value: "seed", label: "Seed" },
                { value: "series-a", label: "Series A" },
                { value: "series-b", label: "Series B" }
              ]}
            />
            <SelectDropdown 
              defaultValue="all-sectors"
              value={sectorFilter}
              onChange={setSectorFilter}
              options={[
                { value: "all-sectors", label: "All Sectors" },
                { value: "healthtech", label: "HealthTech" },
                { value: "fintech", label: "FinTech" },
                { value: "edtech", label: "EdTech" },
                { value: "cleantech", label: "CleanTech" },
                { value: "ai-ml", label: "AI/ML" }
              ]}
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white shadow overflow-hidden border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectAll}
                    onChange={() => setSelectAll(!selectAll)}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sector
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Funding
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStartups.length > 0 ? (
                currentStartups.map((startup) => (
                  <tr key={startup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedStartups.includes(startup.id)}
                        onChange={() => handleCheckboxChange(startup.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {startup.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                      <a href={`/startup/ventures/${startup.id.toLowerCase()}`}>
                        {startup.name}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {startup.sector}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {startup.stage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {startup.funding}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {startup.joinedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={startup.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu status={startup.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-500">
                    No startups found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {currentStartups.length > 0 ? (
            currentStartups.map((startup) => (
              <div key={startup.id} className="bg-white shadow overflow-hidden rounded-lg border">
                <div className="px-4 py-4 sm:px-6 flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-blue-600 hover:underline">
                      <a href={`/startup/ventures/${startup.id.toLowerCase()}`}>
                        {startup.name}
                      </a>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{startup.id}</div>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                      checked={selectedStartups.includes(startup.id)}
                      onChange={() => handleCheckboxChange(startup.id)}
                    />
                    <DropdownMenu status={startup.status} />
                  </div>
                </div>
                <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div className="col-span-1">
                      <dt className="text-gray-500 text-xs">Sector</dt>
                      <dd className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {startup.sector}
                        </span>
                      </dd>
                    </div>
                    <div className="col-span-1">
                      <dt className="text-gray-500 text-xs">Stage</dt>
                      <dd className="mt-1 text-gray-900">{startup.stage}</dd>
                    </div>
                    <div className="col-span-1">
                      <dt className="text-gray-500 text-xs">Funding</dt>
                      <dd className="mt-1 text-gray-900">{startup.funding}</dd>
                    </div>
                    <div className="col-span-1">
                      <dt className="text-gray-500 text-xs">Joined</dt>
                      <dd className="mt-1 text-gray-900">{startup.joinedDate}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-gray-500 text-xs">Status</dt>
                      <dd className="mt-1">
                        <StatusBadge status={startup.status} />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white px-6 py-10 text-center border rounded-lg">
              <p className="text-gray-500">No startups found matching your filters</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <div className="text-sm text-gray-500 w-full sm:w-auto text-center sm:text-left">
            {filteredStartups.length > 0 
              ? `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredStartups.length)} of ${filteredStartups.length} results` 
              : 'No results'}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={`inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                  currentPage === 1 
                    ? "text-gray-500 bg-white opacity-50 cursor-not-allowed" 
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {Array.from({ length: Math.min(totalPages, 3) }).map((_, idx) => {
                let pageNumber;
                
                if (totalPages <= 3) {
                  pageNumber = idx + 1;
                } else if (currentPage <= 2) {
                  pageNumber = idx + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNumber = totalPages - 2 + idx;
                } else {
                  pageNumber = currentPage - 1 + idx;
                }
                
                return (
                  <button 
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                      currentPage === pageNumber 
                        ? "text-gray-700 bg-gray-100" 
                        : "text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={`inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                  currentPage === totalPages 
                    ? "text-gray-500 bg-white opacity-50 cursor-not-allowed" 
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component for the Status Badge
interface StatusBadgeProps {
  status: "Active" | "Graduated" | "Applicant";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let className = "bg-green-100 text-green-800";
  
  if (status === "Graduated") {
    className = "bg-blue-100 text-blue-800";
  } else if (status === "Applicant") {
    className = "bg-amber-100 text-amber-800";
  }
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {status}
    </span>
  );
};

// Component for the Action Menu
interface DropdownMenuProps {
  status: "Active" | "Graduated" | "Applicant";
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ status }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleOptionClick = (action: string) => {
    console.log(`Action selected: ${action} for ${status} startup`);
    setIsOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = () => {
      setIsOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={toggleDropdown}
        className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {status === "Active" && (
              <>
                <a href="#" onClick={() => handleOptionClick('view')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">View details</a>
                <a href="#" onClick={() => handleOptionClick('edit')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Edit startup</a>
                <a href="#" onClick={() => handleOptionClick('team')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">View team</a>
                <a href="#" onClick={() => handleOptionClick('metrics')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">View metrics</a>
              </>
            )}
            {status === "Graduated" && (
              <>
                <a href="#" onClick={() => handleOptionClick('view')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">View details</a>
                <a href="#" onClick={() => handleOptionClick('success')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">View success story</a>
                <a href="#" onClick={() => handleOptionClick('metrics')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">View metrics</a>
              </>
            )}
            {status === "Applicant" && (
              <>
                <a href="#" onClick={() => handleOptionClick('application')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">View application</a>
                <a href="#" onClick={() => handleOptionClick('pitch')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Review pitch deck</a>
                <a href="#" onClick={() => handleOptionClick('interview')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Schedule interview</a>
                <a href="#" onClick={() => handleOptionClick('approve')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Approve application</a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Select dropdown component
interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  defaultValue: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}

const SelectDropdown: React.FC<SelectDropdownProps> = ({ defaultValue, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.value === value) || 
                         options.find(option => option.value === defaultValue) ||
                         options[0];
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = () => {
      setIsOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <div className="relative w-36 md:w-44" onClick={e => e.stopPropagation()}>
      <button
        type="button"
        className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption?.label || "Select option"}</span>
        <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-1 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="max-h-60 overflow-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  value === option.value ? "bg-blue-50 text-blue-700" : "text-gray-700"
                }`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// More icon component for the dropdown
const MoreHorizontal: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
};

export default StartupList;