import { useState } from 'react';
import { FileText, Filter, Plus, ArrowUpDown, MoreHorizontal, Search, ChevronDown, Globe, BookOpen, Shield } from 'lucide-react';
//import { Link } from 'react-router-dom';

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const StatusBadge = ({ status }: { status: string }) => {
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

const TypeBadge = ({ type }: { type: string }) => {
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

const CountryCode = ({ code }: { code: string }) => {
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

const IprPortfolio = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedType, setSelectedType] = useState('all');

  // Filter items based on search term and type
  const filteredItems = mockPatents.filter(item =>
    (selectedType === 'all' || item.type === selectedType) &&
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort items if sort configuration exists
  const sortedItems = sortConfig
    ? [...filteredItems].sort((a, b) => {
        if ((a[sortConfig.key as keyof typeof a] ?? '') < (b[sortConfig.key as keyof typeof b] ?? '')) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if ((a[sortConfig.key as keyof typeof a] ?? '') > (b[sortConfig.key as keyof typeof b] ?? '')) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredItems;

  // Toggle sort for a column
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Toggle selection of an item
  const toggleSelectItem = (id: string) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(itemId => itemId !== id)
        : [...prevSelected, id]
    );
  };

  // Toggle selection of all items
  const toggleSelectAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
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
          <div className="relative">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Plus className="h-4 w-4 mr-2" />
              New IPR
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
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
                placeholder="Search by title or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Granted/Registered</option>
                <option>Abandoned</option>
              </select>
              
              <select className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                <option>All Territories</option>
                <option>US</option>
                <option>EU</option>
                <option>International</option>
              </select>
            </div>
          </div>
        </div>

        {/* IPR Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedItems.length === sortedItems.length && sortedItems.length > 0}
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
                    ID
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('title')}
                >
                  <div className="flex items-center">
                    Title
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('type')}
                >
                  <div className="flex items-center">
                    Type
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
                  onClick={() => requestSort('filingDate')}
                >
                  <div className="flex items-center">
                    Filing Date
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Territories
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Owners
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {item.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    {'inventors' in item && (
                      <div className="text-xs text-gray-500 mt-1">
                        Inventors: {item.inventors?.join(', ')}
                      </div>
                    )}
                    {'authors' in item && (
                      <div className="text-xs text-gray-500 mt-1">
                        Authors: {(item.authors ?? []).join(', ')}
                      </div>
                    )}
                    {'licensee' in item && (
                      <div className="text-xs text-gray-500 mt-1">
                        Licensee: {item.licensee}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TypeBadge type={item.type} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.filingDate ? formatDate(item.filingDate) : 'N/A'}
                    {item.status === 'granted' && 'grantDate' in item && (
                      <div className="text-xs mt-1">
                        Granted: {formatDate(item.grantDate ?? '')}
                      </div>
                    )}
                    {item.status === 'registered' && 'regDate' in item && (
                      <div className="text-xs mt-1">
                        Registered: {formatDate(item.regDate ?? '')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {'countries' in item && (
                      <div className="flex flex-wrap">
                        {item.countries?.map((code, index) => (
                          <CountryCode key={index} code={code} />
                        ))}
                      </div>
                    )}
                    {'territories' in item && (
                      <span className="text-sm text-gray-600">{item.territories.join(', ')}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {'owners' in item && (
                      <div>
                        {item.owners.map((owner, idx) => (
                          <div key={idx}>{owner}</div>
                        ))}
                      </div>
                    )}
                    {'licensor' in item && (
                      <div>
                        {item.licensor}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {sortedItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No IP assets found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filter to find what you're looking for.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedItems.length}</span> of{' '}
                <span className="font-medium">{mockPatents.length}</span> results
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
    </div>
  );
};

export default IprPortfolio;