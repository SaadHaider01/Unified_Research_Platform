import { useState } from 'react';
import { 
  Box, Search, Plus, ArrowUpDown, MoreHorizontal, 
  FileText, Download, Calendar, Users, X, Edit, Trash2
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'guide' | 'template' | 'tool' | 'workspace' | 'equipment';
  category: string;
  description: string;
  format: string;
  availability: 'available' | 'limited' | 'unavailable';
  location?: string;
  downloadUrl?: string;
  tags: string[];
  addedDate: string;
  lastUpdated: string;
}

const mockResources: Resource[] = [
  {
    id: "RES-2025-001",
    title: "Startup Financial Model Template",
    type: "template",
    category: "Finance",
    description: "Comprehensive financial model template for early-stage startups",
    format: "Excel",
    availability: "available",
    downloadUrl: "#",
    tags: ["Finance", "Planning", "Metrics"],
    addedDate: "2025-01-15",
    lastUpdated: "2025-02-01"
  },
  {
    id: "RES-2025-002",
    title: "Market Research Guide",
    type: "guide",
    category: "Marketing",
    description: "Step-by-step guide to conducting effective market research for startups",
    format: "PDF",
    availability: "available",
    downloadUrl: "#",
    tags: ["Marketing", "Research", "Strategy"],
    addedDate: "2025-01-18",
    lastUpdated: "2025-01-30"
  },
  {
    id: "RES-2025-003",
    title: "Product Management Software",
    type: "tool",
    category: "Product",
    description: "Enterprise-grade product management software with startup-friendly features",
    format: "Software",
    availability: "limited",
    tags: ["Product Management", "Software", "Planning"],
    addedDate: "2025-01-20",
    lastUpdated: "2025-03-10"
  },
  {
    id: "RES-2025-004",
    title: "Co-working Space",
    type: "workspace",
    category: "Facilities",
    description: "Collaborative workspace with high-speed internet and meeting rooms",
    format: "Physical",
    location: "Floor 3, North Wing",
    availability: "limited",
    tags: ["Workspace", "Meetings", "Collaboration"],
    addedDate: "2025-01-10",
    lastUpdated: "2025-04-01"
  },
  {
    id: "RES-2025-005",
    title: "3D Printer",
    type: "equipment",
    category: "Hardware",
    description: "Industrial 3D printer for prototype development",
    format: "Hardware",
    location: "Maker Lab, Room 204",
    availability: "unavailable",
    tags: ["Prototyping", "Hardware", "Manufacturing"],
    addedDate: "2025-02-05",
    lastUpdated: "2025-03-15"
  },
];

const TypeBadge = ({ type }: { type: string }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'guide':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'template':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'tool':
        return { bg: 'bg-purple-100', text: 'text-purple-800' };
      case 'workspace':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'equipment':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const config = getTypeConfig(type);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const AvailabilityBadge = ({ availability }: { availability: string }) => {
  const getConfig = (availability: string) => {
    switch (availability) {
      case 'available':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      case 'limited':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'unavailable':
        return { bg: 'bg-red-100', text: 'text-red-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const config = getConfig(availability);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {availability.charAt(0).toUpperCase() + availability.slice(1)}
    </span>
  );
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<Partial<Resource>>({
    title: '',
    type: 'guide',
    category: '',
    description: '',
    format: '',
    availability: 'available',
    tags: [],
    location: '',
  });
  const [newTag, setNewTag] = useState('');

  // Filter resources based on search term and selected type
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Handle resource download
  const handleDownload = (resource: Resource) => {
    // In a real application, this would trigger a file download
    alert(`Downloading: ${resource.title} (${resource.format})`);
    console.log(`Download initiated for: ${resource.title}`);
  };

  // Handle view details
  const handleViewDetails = (resource: Resource) => {
    setSelectedResource(resource);
    setShowDetailsModal(true);
  };

  // Handle opening action menu
  const toggleActionMenu = (id: string) => {
    if (showActionMenu === id) {
      setShowActionMenu(null);
    } else {
      setShowActionMenu(id);
    }
  };

  // Handle edit resource
  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      type: resource.type,
      category: resource.category,
      description: resource.description,
      format: resource.format,
      availability: resource.availability,
      location: resource.location || '',
      downloadUrl: resource.downloadUrl || '',
      tags: [...resource.tags],
    });
    setShowAddModal(true);
    setShowActionMenu(null);
  };

  // Handle delete resource
  const handleDeleteResource = (id: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      setResources(resources.filter(resource => resource.id !== id));
      setShowActionMenu(null);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag]
      });
      setNewTag('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (selectedResource) {
      // Update existing resource
      setResources(resources.map(resource => 
        resource.id === selectedResource.id 
          ? { 
              ...resource, 
              ...formData, 
              lastUpdated: currentDate 
            } 
          : resource
      ));
    } else {
      // Add new resource
      const newResource: Resource = {
        id: `RES-2025-${String(resources.length + 1).padStart(3, '0')}`,
        title: formData.title || '',
        type: (formData.type as Resource['type']) || 'guide',
        category: formData.category || '',
        description: formData.description || '',
        format: formData.format || '',
        availability: (formData.availability as Resource['availability']) || 'available',
        location: formData.location,
        downloadUrl: formData.downloadUrl,
        tags: formData.tags || [],
        addedDate: currentDate,
        lastUpdated: currentDate
      };
      
      setResources([...resources, newResource]);
    }
    
    // Reset form and close modal
    setFormData({
      title: '',
      type: 'guide',
      category: '',
      description: '',
      format: '',
      availability: 'available',
      tags: [],
      location: '',
    });
    setSelectedResource(null);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Resources</h2>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            setSelectedResource(null);
            setFormData({
              title: '',
              type: 'guide',
              category: '',
              description: '',
              format: '',
              availability: 'available',
              tags: [],
              location: '',
            });
            setShowAddModal(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Search and filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
            
            <select
              className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="guide">Guides</option>
              <option value="template">Templates</option>
              <option value="tool">Tools</option>
              <option value="workspace">Workspace</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>

          {/* Resources grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <TypeBadge type={resource.type} />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">{resource.title}</h3>
                      </div>
                      <div className="relative">
                        <button 
                          className="text-gray-400 hover:text-gray-500"
                          onClick={() => toggleActionMenu(resource.id)}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        
                        {/* Action menu dropdown */}
                        {showActionMenu === resource.id && (
                          <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                            <button
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleEditResource(resource)}
                            >
                              <Edit className="h-4 w-4 inline mr-2" />
                              Edit
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              onClick={() => handleDeleteResource(resource.id)}
                            >
                              <Trash2 className="h-4 w-4 inline mr-2" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">{resource.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {resource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{resource.format}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Updated {new Date(resource.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      {resource.downloadUrl && (
                        <button 
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleDownload(resource)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      )}
                      {resource.location && (
                        <button 
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => handleViewDetails(resource)}
                        >
                          View Details
                        </button>
                      )}
                      {!resource.downloadUrl && !resource.location && (
                        <button 
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => handleViewDetails(resource)}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No resources found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {selectedResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500">
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title*</label>
                    <input
                      type="text"
                      name="title"
                      className="w-full p-2 border rounded"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type*</label>
                    <select
                      name="type"
                      className="w-full p-2 border rounded"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="guide">Guide</option>
                      <option value="template">Template</option>
                      <option value="tool">Tool</option>
                      <option value="workspace">Workspace</option>
                      <option value="equipment">Equipment</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category*</label>
                    <input
                      type="text"
                      name="category"
                      className="w-full p-2 border rounded"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Format*</label>
                    <input
                      type="text"
                      name="format"
                      className="w-full p-2 border rounded"
                      value={formData.format}
                      onChange={handleInputChange}
                      required
                      placeholder="PDF, Excel, Software, Physical, etc."
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description*</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full p-2 border rounded"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Availability*</label>
                    <select
                      name="availability"
                      className="w-full p-2 border rounded"
                      value={formData.availability}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="available">Available</option>
                      <option value="limited">Limited</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="w-full p-2 border rounded"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Required for physical resources"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Download URL</label>
                  <input
                    type="text"
                    name="downloadUrl"
                    className="w-full p-2 border rounded"
                    value={formData.downloadUrl}
                    onChange={handleInputChange}
                    placeholder="For downloadable resources"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={handleAddTag}
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {selectedResource ? 'Update Resource' : 'Add Resource'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource Details Modal */}
      {showDetailsModal && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{selectedResource.title}</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-500">
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <TypeBadge type={selectedResource.type} />
                <AvailabilityBadge availability={selectedResource.availability} />
              </div>
              
              <p className="text-gray-700">{selectedResource.description}</p>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Category</h4>
                  <p>{selectedResource.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Format</h4>
                  <p>{selectedResource.format}</p>
                </div>
              </div>
              
              {selectedResource.location && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p>{selectedResource.location}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Added</h4>
                <p>{new Date(selectedResource.addedDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                <p>{new Date(selectedResource.lastUpdated).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Tags</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedResource.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                {selectedResource.downloadUrl && (
                  <button 
                    onClick={() => handleDownload(selectedResource)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditResource(selectedResource);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;