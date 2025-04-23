import { useState } from 'react';
import { Search, Download, ExternalLink, Users } from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  date: string;
  status: string;
  doi?: string;
  citations?: number;
  type: string;
}

const Publications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: "PUB-2025-001",
      title: "Novel Composite Materials for Energy Storage Applications",
      authors: ["Sarah Wilson", "James Rodriguez", "Emily Patel"],
      journal: "Advanced Materials Research",
      date: "Mar 2025",
      status: "Published",
      doi: "10.1234/amr.2025.12345",
      citations: 12,
      type: "Journal Article"
    },
    {
      id: "PUB-2025-002",
      title: "Genetic Markers as Predictors for Early-Stage Disease Detection",
      authors: ["Michael Chen", "Emily Patel"],
      journal: "Journal of Medical Genetics",
      date: "Feb 2025",
      status: "Published",
      doi: "10.1234/jmg.2025.54321",
      citations: 8,
      type: "Journal Article"
    },
    {
      id: "PUB-2025-003",
      title: "Quantum Computing Algorithms for Optimization Problems",
      authors: ["James Rodriguez", "Thomas Lee"],
      journal: "International Conference on Quantum Computing",
      date: "Jan 2025",
      status: "Accepted",
      type: "Conference Paper"
    },
    {
      id: "PUB-2024-015",
      title: "AI Applications in Medical Imaging: A Review",
      authors: ["Emily Patel", "Amara Johnson"],
      journal: "Medical AI Review",
      date: "Dec 2024",
      status: "Published",
      doi: "10.1234/mar.2024.98765",
      citations: 24,
      type: "Review Article"
    },
    {
      id: "PUB-2024-012",
      title: "Sustainable Urban Water Management Systems",
      authors: ["Thomas Lee", "Sarah Wilson"],
      journal: "Environmental Science & Technology",
      date: "Oct 2024",
      status: "Published",
      doi: "10.1234/est.2024.78901",
      citations: 15,
      type: "Journal Article"
    },
    {
      id: "PUB-2024-010",
      title: "Blockchain Technology for Secure Medical Records Management",
      authors: ["Amara Johnson", "Michael Chen"],
      journal: "Journal of Medical Informatics",
      date: "Aug 2024",
      status: "In Review",
      type: "Journal Article"
    }
  ]);
  const [showNewPublicationModal, setShowNewPublicationModal] = useState(false);
  
  const types = ["All Types", "Journal Article", "Conference Paper", "Review Article", "Book Chapter"];
  const statuses = ["All Statuses", "Published", "In Review", "Accepted", "Rejected"];
  
  // Filter publications based on search term, type and status
  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          pub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.journal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === "All Types" || pub.type === typeFilter;
    const matchesStatus = statusFilter === "All Statuses" || pub.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "In Review":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ["ID", "Title", "Authors", "Journal", "Date", "Status", "DOI", "Citations", "Type"];
    const csvContent = [
      headers.join(","),
      ...filteredPublications.map(pub => [
        pub.id,
        `"${pub.title.replace(/"/g, '""')}"`,
        `"${pub.authors.join("; ").replace(/"/g, '""')}"`,
        `"${pub.journal.replace(/"/g, '""')}"`,
        pub.date,
        pub.status,
        pub.doi || "",
        pub.citations || "0",
        pub.type
      ].join(","))
    ].join("\n");
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'publications_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddPublication = (newPub: Publication) => {
    setPublications([newPub, ...publications]);
    setShowNewPublicationModal(false);
  };

  // New publication form state
  const [newPublication, setNewPublication] = useState<Partial<Publication>>({
    title: "",
    authors: [],
    journal: "",
    date: new Date().toISOString().substring(0, 7),
    status: "In Review",
    type: "Journal Article"
  });
  const [newAuthor, setNewAuthor] = useState("");

  const addAuthor = () => {
    if (newAuthor.trim()) {
      setNewPublication({
        ...newPublication,
        authors: [...(newPublication.authors || []), newAuthor.trim()]
      });
      setNewAuthor("");
    }
  };

  const removeAuthor = (index: number) => {
    const updatedAuthors = [...(newPublication.authors || [])];
    updatedAuthors.splice(index, 1);
    setNewPublication({
      ...newPublication,
      authors: updatedAuthors
    });
  };

  const handleSubmitNewPublication = () => {
    // Generate a new ID based on current year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newId = `PUB-${year}-${randomPart}`;
    
    const completePublication: Publication = {
      id: newId,
      title: newPublication.title || "Untitled Publication",
      authors: newPublication.authors || [],
      journal: newPublication.journal || "Unknown Journal",
      date: newPublication.date || new Date().toISOString().substring(0, 7),
      status: newPublication.status || "In Review",
      type: newPublication.type || "Journal Article",
      citations: 0
    };
    
    if (newPublication.doi) {
      completePublication.doi = newPublication.doi;
    }
    
    handleAddPublication(completePublication);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Publications</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track all research publications and scholarly works</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search publications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

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
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setShowNewPublicationModal(true)}
            >
              + New Publication
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title & Journal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Authors
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Citations
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPublications.map((pub) => (
                <tr key={pub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {pub.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{pub.title}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      {pub.journal} 
                      {pub.doi && (
                        <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-800">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      {pub.authors.join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pub.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(pub.status)}`}>
                      {pub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pub.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pub.citations || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Publication Modal */}
      {showNewPublicationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Publication</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    value={newPublication.title || ''}
                    onChange={(e) => setNewPublication({...newPublication, title: e.target.value})}
                    placeholder="Publication title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="Author name"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addAuthor();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                      onClick={addAuthor}
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newPublication.authors?.map((author, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full flex items-center">
                        {author}
                        <button
                          type="button"
                          className="ml-2 text-blue-600 hover:text-blue-800"
                          onClick={() => removeAuthor(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Journal/Conference</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    value={newPublication.journal || ''}
                    onChange={(e) => setNewPublication({...newPublication, journal: e.target.value})}
                    placeholder="Journal or conference name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                      value={newPublication.type || 'Journal Article'}
                      onChange={(e) => setNewPublication({...newPublication, type: e.target.value})}
                    >
                      {types.slice(1).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                      value={newPublication.status || 'In Review'}
                      onChange={(e) => setNewPublication({...newPublication, status: e.target.value})}
                    >
                      {statuses.slice(1).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date (YYYY-MM)</label>
                    <input
                      type="month"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                      value={newPublication.date || new Date().toISOString().substring(0, 7)}
                      onChange={(e) => setNewPublication({...newPublication, date: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DOI (optional)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                      value={newPublication.doi || ''}
                      onChange={(e) => setNewPublication({...newPublication, doi: e.target.value})}
                      placeholder="10.xxxx/xxxxx"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setShowNewPublicationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  onClick={handleSubmitNewPublication}
                  disabled={!newPublication.title || !(newPublication.authors?.length) || !newPublication.journal}
                >
                  Save Publication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publications;