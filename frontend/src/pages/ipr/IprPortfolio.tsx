import { useState } from 'react';
import { FileText, Filter, Plus, ArrowUpDown, MoreHorizontal, Search, ChevronDown, Globe, BookOpen, Shield, Edit, Trash2, Share2, Copy, Eye } from 'lucide-react';

const mockPatents = [
  {
    id: 'PAT-2025-001',
    title: 'Method for Enhancing Battery Longevity Using Novel Electrode Materials',
    type: 'patent',
    status: 'pending',
    filingDate: '2025-02-10',
    inventors: ['Dr. Sarah Wilson', 'Dr. Robert Thompson'],
    owners: ['University Research Foundation'],
    countries: ['US', 'EU', 'JP', 'CN'],
    expiryDate: '2045-02-10'
  },
  {
    id: 'PAT-2024-011',
    title: 'Neural Network Architecture for Real-Time Image Analysis in Medical Applications',
    type: 'patent',
    status: 'granted',
    filingDate: '2024-08-15',
    grantDate: '2025-03-20',
    inventors: ['Dr. Michael Chen', 'Dr. Emily Patel'],
    owners: ['University Research Foundation', 'Medical Technologies Inc.'],
    countries: ['US', 'EU', 'CA', 'AU'],
    expiryDate: '2044-08-15'
  },
  {
    id: 'TM-2025-003',
    title: 'QuantumSolve',
    type: 'trademark',
    status: 'registered',
    filingDate: '2025-01-05',
    regDate: '2025-04-12',
    owners: ['University Research Foundation'],
    class: [9, 42],
    countries: ['US', 'EU', 'UK'],
    renewalDate: '2035-04-12'
  },
  {
    id: 'CR-2024-015',
    title: 'Comprehensive Handbook on Sustainable Energy Solutions',
    type: 'copyright',
    status: 'registered',
    filingDate: '2024-11-20',
    regDate: '2025-01-15',
    authors: ['Dr. Thomas Lee', 'Dr. James Rodriguez'],
    owners: ['University Press'],
    countries: ['US'],
    expiryDate: '2120-11-20'
  },
  {
    id: 'PAT-2024-008',
    title: 'Smart Irrigation System with AI-based Water Usage Optimization',
    type: 'patent',
    status: 'abandoned',
    filingDate: '2024-05-03',
    inventors: ['Dr. Amara Johnson', 'Dr. David Parker'],
    owners: ['University Research Foundation'],
    countries: ['US'],
    abandonDate: '2025-01-15'
  },
  {
    id: 'LIC-2025-002',
    title: 'Exclusive License for Battery Technology Patent PAT-2025-001',
    type: 'license',
    status: 'active',
    startDate: '2025-04-01',
    endDate: '2030-03-31',
    licensee: 'EnergyTech Solutions Inc.',
    licensor: 'University Research Foundation',
    territories: ['Worldwide'],
    value: '$2.5M upfront + 5% royalty'
  }
];

// Format date string to readable format
interface Patent {
  id: string;
  title: string;
  type: 'patent';
  status: 'pending' | 'granted' | 'abandoned';
  filingDate: string;
  inventors: string[];
  owners: string[];
  countries: string[];
  expiryDate?: string;
  grantDate?: string;
  abandonDate?: string;
}

interface Trademark {
  id: string;
  title: string;
  type: 'trademark';
  status: 'registered';
  filingDate: string;
  regDate: string;
  owners: string[];
  class: number[];
  countries: string[];
  renewalDate: string;
}

interface Copyright {
  id: string;
  title: string;
  type: 'copyright';
  status: 'registered';
  filingDate: string;
  regDate: string;
  authors: string[];
  owners: string[];
  countries: string[];
  expiryDate: string;
}

interface License {
  id: string;
  title: string;
  type: 'license';
  status: 'active';
  startDate: string;
  endDate: string;
  licensee: string;
  licensor: string;
  territories: string[];
  value: string;
}

type IprItem = Patent | Trademark | Copyright | License;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

// Status badge component
const StatusBadge = ({ status }) => {
  let bgColor;
  let textColor;
  const label = status.charAt(0).toUpperCase() + status.slice(1);

  switch (status) {
    case 'pending':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'granted':
    case 'registered':
    case 'active':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'abandoned':
    case 'expired':
    case 'inactive':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'provisional':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

// Type badge component
const TypeBadge = ({ type }) => {
  let bgColor;
  let textColor;
  let icon;
  const label = type.charAt(0).toUpperCase() + type.slice(1);

  switch (type) {
    case 'patent':
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-700';
      icon = <FileText className="h-3 w-3 mr-1" />;
      break;
    case 'trademark':
      bgColor = 'bg-purple-50';
      textColor = 'text-purple-700';
      icon = <Globe className="h-3 w-3 mr-1" />;
      break;
    case 'copyright':
      bgColor = 'bg-amber-50';
      textColor = 'text-amber-700';
      icon = <BookOpen className="h-3 w-3 mr-1" />;
      break;
    case 'license':
      bgColor = 'bg-teal-50';
      textColor = 'text-teal-700';
      icon = <Shield className="h-3 w-3 mr-1" />;
      break;
    default:
      bgColor = 'bg-gray-50';
      textColor = 'text-gray-700';
      icon = <FileText className="h-3 w-3 mr-1" />;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${bgColor} ${textColor}`}>
      {icon}
      {label}
    </span>
  );
};

// Country code component
const CountryCode = ({ code }) => {
  const flagEmoji = code === 'EU' ? '🇪🇺' : 
                   code === 'US' ? '🇺🇸' :
                   code === 'JP' ? '🇯🇵' :
                   code === 'CN' ? '🇨🇳' :
                   code === 'CA' ? '🇨🇦' :
                   code === 'AU' ? '🇦🇺' :
                   code === 'UK' ? '🇬🇧' : '';

  return (
    <span className="inline-flex items-center mr-1" title={code}>
      <span className="text-sm">{flagEmoji}</span>
    </span>
  );
};

// ActionMenu component for the dropdown on each row
const ActionMenu = ({ item, onView, onEdit, onDelete, onShare }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => { onView(item); setIsOpen(false); }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <Eye className="mr-3 h-4 w-4 text-gray-500" />
              View Details
            </button>
            <button
              onClick={() => { onEdit(item); setIsOpen(false); }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <Edit className="mr-3 h-4 w-4 text-gray-500" />
              Edit
            </button>
            <button
              onClick={() => { onShare(item); setIsOpen(false); }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <Share2 className="mr-3 h-4 w-4 text-gray-500" />
              Share
            </button>
            <button
              onClick={() => { onDelete(item); setIsOpen(false); }}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <Trash2 className="mr-3 h-4 w-4 text-red-500" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal component for displaying details
const DetailModal = ({ item, onClose }) => {
  if (!item) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            {item.type === 'patent' && <FileText className="h-5 w-5 mr-2 text-blue-600" />}
            {item.type === 'trademark' && <Globe className="h-5 w-5 mr-2 text-purple-600" />}
            {item.type === 'copyright' && <BookOpen className="h-5 w-5 mr-2 text-amber-600" />}
            {item.type === 'license' && <Shield className="h-5 w-5 mr-2 text-teal-600" />}
            {item.id}: {item.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <div className="flex mb-4">
            <TypeBadge type={item.type} />
            <span className="ml-2"><StatusBadge status={item.status} /></span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Filing Details</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm">Filing Date: {formatDate(item.filingDate)}</p>
                
                {item.status === 'granted' && item.grantDate && (
                  <p className="text-sm mt-1">Grant Date: {formatDate(item.grantDate)}</p>
                )}
                
                {item.status === 'registered' && item.regDate && (
                  <p className="text-sm mt-1">Registration Date: {formatDate(item.regDate)}</p>
                )}
                
                {item.expiryDate && (
                  <p className="text-sm mt-1">Expiry Date: {formatDate(item.expiryDate)}</p>
                )}
                
                {item.renewalDate && (
                  <p className="text-sm mt-1">Renewal Date: {formatDate(item.renewalDate)}</p>
                )}
                
                {item.status === 'abandoned' && item.abandonDate && (
                  <p className="text-sm mt-1">Abandoned Date: {formatDate(item.abandonDate)}</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Territories</h3>
              <div className="bg-gray-50 p-3 rounded-md flex flex-wrap">
                {'countries' in item && item.countries?.map((code, index) => (
                  <div key={index} className="mr-3 mb-2 flex items-center bg-white px-2 py-1 rounded-md shadow-sm">
                    <CountryCode code={code} /> <span className="ml-1 text-sm">{code}</span>
                  </div>
                ))}
                {'territories' in item && (
                  <span className="text-sm text-gray-600">{item.territories.join(', ')}</span>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {item.type === 'patent' ? 'Inventors' : 
                 item.type === 'copyright' ? 'Authors' : 
                 item.type === 'license' ? 'Parties' : 'Owners'}
              </h3>
              <div className="bg-gray-50 p-3 rounded-md">
                {'inventors' in item && item.inventors?.map((inventor, idx) => (
                  <div key={idx} className="text-sm flex items-center mb-1">
                    <span className="h-2 w-2 bg-blue-500 rounded-full mr-2"></span>
                    {inventor}
                  </div>
                ))}
                
                {'authors' in item && item.authors?.map((author, idx) => (
                  <div key={idx} className="text-sm flex items-center mb-1">
                    <span className="h-2 w-2 bg-amber-500 rounded-full mr-2"></span>
                    {author}
                  </div>
                ))}
                
                {'owners' in item && item.owners?.map((owner, idx) => (
                  <div key={idx} className="text-sm flex items-center mb-1">
                    <span className="h-2 w-2 bg-gray-500 rounded-full mr-2"></span>
                    {owner}
                  </div>
                ))}
                
                {'licensee' in item && (
                  <div className="text-sm">Licensee: {item.licensee}</div>
                )}
                
                {'licensor' in item && (
                  <div className="text-sm">Licensor: {item.licensor}</div>
                )}
              </div>
            </div>
            
            {item.type === 'license' && 'value' in item && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">License Value</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm">{item.value}</p>
                  {item.startDate && item.endDate && (
                    <p className="text-sm mt-1">
                      Duration: {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {item.type === 'trademark' && 'class' in item && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Trademark Classes</h3>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex flex-wrap">
                    {item.class.map((cls, idx) => (
                      <span key={idx} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mb-2">
                        Class {cls}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}>
            Close
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// New IPR dropdown menu component
const NewIprDropdown = ({ onNewItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleNewItem = (type) => {
    onNewItem(type);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus className="h-4 w-4 mr-2" />
        New IPR
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>
      
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleNewItem('patent')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <FileText className="mr-3 h-4 w-4 text-blue-500" />
              New Patent
            </button>
            <button
              onClick={() => handleNewItem('trademark')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <Globe className="mr-3 h-4 w-4 text-purple-500" />
              New Trademark
            </button>
            <button
              onClick={() => handleNewItem('copyright')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <BookOpen className="mr-3 h-4 w-4 text-amber-500" />
              New Copyright
            </button>
            <button
              onClick={() => handleNewItem('license')}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              role="menuitem"
            >
              <Shield className="mr-3 h-4 w-4 text-teal-500" />
              New License
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component
const IprPortfolio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'filingDate', direction: 'desc' });
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTerritory, setSelectedTerritory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [detailItem, setDetailItem] = useState(null);
  const [itemsPerPage] = useState(5);
  
  // Event handlers
  const handleViewItem = (item) => {
    setDetailItem(item);
  };
  
  const handleEditItem = (item) => {
    alert(`Edit ${item.type}: ${item.title}`);
  };
  
  const handleDeleteItem = (item) => {
    if (confirm(`Are you sure you want to delete ${item.id}: ${item.title}?`)) {
      alert(`Deleted ${item.id}: ${item.title}`);
    }
  };
  
  const handleShareItem = (item) => {
    alert(`Share ${item.type}: ${item.title}`);
  };
  
  const handleNewItem = (type) => {
    alert(`Create new ${type}`);
  };
  
  // Filter items based on search term, type, status, and territory
  const filteredItems = mockPatents.filter(item => {
    // Type filter
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    
    // Status filter
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'granted/registered' && 
          (item.status !== 'granted' && item.status !== 'registered')) return false;
      else if (selectedStatus !== 'granted/registered' && item.status !== selectedStatus) return false;
    }
    
    // Territory filter
    if (selectedTerritory !== 'all') {
      if ('countries' in item && !item.countries?.includes(selectedTerritory)) return false;
      if ('territories' in item && !item.territories?.includes(selectedTerritory)) return false;
    }
    
    // Search term
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort items if sort configuration exists
  const sortedItems = sortConfig
    ? [...filteredItems].sort((a, b) => {
        if ((a[sortConfig.key] ?? '') < (b[sortConfig.key] ?? '')) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if ((a[sortConfig.key] ?? '') > (b[sortConfig.key] ?? '')) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredItems;

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  // Toggle sort for a column
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Toggle selection of an item
  const toggleSelectItem = (id) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id]
    );
  };

  // Toggle selection of all items
  const toggleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map(item => item.id));
    }
  };

  // Count items by type
  const countByType = {
    all: mockPatents.length,
    patent: mockPatents.filter(item => item.type === 'patent').length,
    trademark: mockPatents.filter(item => item.type === 'trademark').length,
    copyright: mockPatents.filter(item => item.type === 'copyright').length,
    license: mockPatents.filter(item => item.type === 'license').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IPR Portfolio</h1>
          <p className="text-gray-600 mt-1">
            Manage intellectual property assets and licensing
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <NewIprDropdown onNewItem={handleNewItem} />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setSelectedType('all')}
              className={`${
                selectedType === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              All 
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {countByType.all}
              </span>
            </button>
            <button
              onClick={() => setSelectedType('patent')}
              className={`${
                selectedType === 'patent'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Patents
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {countByType.patent}
              </span>
            </button>
            <button
              onClick={() => setSelectedType('trademark')}
              className={`${
                selectedType === 'trademark'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Trademarks
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {countByType.trademark}
              </span>
            </button>
            <button
              onClick={() => setSelectedType('copyright')}
              className={`${
                selectedType === 'copyright'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Copyrights
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {countByType.copyright}
              </span>
            </button>
            <button
              onClick={() => setSelectedType('license')}
              className={`${
                selectedType === 'license'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              Licenses
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {countByType.license}
              </span>
            </button>
          </nav>
        </div>

        {/* Search and filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                // Continuing from where the code was cut off
                placeholder="Search by title or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Filter by:</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="granted/registered">Granted/Registered</option>
                <option value="abandoned">Abandoned</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
              
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedTerritory}
                onChange={(e) => setSelectedTerritory(e.target.value)}
              >
                <option value="all">All Territories</option>
                <option value="US">United States</option>
                <option value="EU">European Union</option>
                <option value="JP">Japan</option>
                <option value="CN">China</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="Worldwide">Worldwide</option>
              </select>
            </div>
          </div>
        </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="pl-4 py-3 text-left w-8">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                <button
                  onClick={() => requestSort('id')}
                  className="flex items-center group focus:outline-none"
                >
                  ID
                  <ArrowUpDown className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100" />
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={() => requestSort('title')}
                  className="flex items-center group focus:outline-none"
                >
                  Title
                  <ArrowUpDown className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100" />
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Type
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Status
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                <button
                  onClick={() => requestSort('filingDate')}
                  className="flex items-center group focus:outline-none"
                >
                  Filing Date
                  <ArrowUpDown className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100" />
                </button>
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Territories
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="pl-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                  />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  <button 
                    className="hover:underline focus:outline-none"
                    onClick={() => handleViewItem(item)}
                  >
                    {item.id}
                  </button>
                </td>
                <td className="px-3 py-4 text-sm text-gray-900">
                  <div className="max-w-lg truncate">
                    <button 
                      className="hover:underline focus:outline-none text-left"
                      onClick={() => handleViewItem(item)}
                    >
                      {item.title}
                    </button>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  <TypeBadge type={item.type} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.filingDate)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex">
                    {'countries' in item && item.countries?.slice(0, 3).map((code, index) => (
                      <CountryCode key={index} code={code} />
                    ))}
                    {'countries' in item && item.countries?.length > 3 && (
                      <span className="text-sm text-gray-500">+{item.countries.length - 3}</span>
                    )}
                    {'territories' in item && item.territories.includes('Worldwide') && (
                      <span className="text-sm text-gray-500">🌐 Worldwide</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                  <ActionMenu 
                    item={item}
                    onView={handleViewItem}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onShare={handleShareItem}
                  />
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
              <tr>
                <td colSpan="8" className="px-3 py-8 text-center text-sm text-gray-500">
                  No records found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sortedItems.length > itemsPerPage && (
        <div className="bg-white p-4 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, sortedItems.length)}
                </span>{' '}
                of <span className="font-medium">{sortedItems.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  } relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`${
                      currentPage === page
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                  } relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      </div>
      
      {/* Detail Modal */}
      {detailItem && (
        <DetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      )}
    </div>
  );
};

export default IprPortfolio;