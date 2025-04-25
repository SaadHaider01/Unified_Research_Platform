import { useState } from 'react';
import { Lightbulb, Search, Plus, ArrowUpDown, MoreHorizontal, Star, Users, X, Filter } from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string;
  submitter: string;
  department: string;
  submittedDate: string;
  status: 'new' | 'under_review' | 'approved' | 'rejected';
  category: string;
  votes: number;
  comments: number;
  tags: string[];
}

const mockIdeas: Idea[] = [
  {
    id: "IDEA-2025-001",
    title: "AI-Powered Research Assistant",
    description: "Develop an AI system to help researchers with literature review and data analysis",
    submitter: "Dr. Sarah Wilson",
    department: "Computer Science",
    submittedDate: "2025-01-15",
    status: "under_review",
    category: "Research Tools",
    votes: 45,
    comments: 12,
    tags: ["AI", "Research", "Automation"]
  },
  {
    id: "IDEA-2025-002",
    title: "Virtual Reality Campus Tour",
    description: "Create a VR application that allows prospective students to tour the campus remotely",
    submitter: "Michael Johnson",
    department: "Marketing",
    submittedDate: "2025-02-03",
    status: "approved",
    category: "Student Engagement",
    votes: 28,
    comments: 7,
    tags: ["VR", "Recruitment", "Technology"]
  },
  {
    id: "IDEA-2025-003",
    title: "Sustainable Energy Initiative",
    description: "Install solar panels on university buildings to reduce carbon footprint",
    submitter: "Emma Greene",
    department: "Facilities",
    submittedDate: "2025-01-27",
    status: "new",
    category: "Sustainability",
    votes: 67,
    comments: 23,
    tags: ["Green", "Energy", "Environment"]
  },
  {
    id: "IDEA-2025-004",
    title: "Cross-Department Collaboration Platform",
    description: "Develop a digital hub for researchers to find potential collaborators across departments",
    submitter: "Prof. James Liu",
    department: "Biology",
    submittedDate: "2025-02-12",
    status: "under_review",
    category: "Collaboration",
    votes: 31,
    comments: 9,
    tags: ["Research", "Networking", "Collaboration"]
  }
];

const departments = ["Computer Science", "Marketing", "Facilities", "Biology"];
const categories = ["Research Tools", "Student Engagement", "Sustainability", "Collaboration"];
const statuses = [
  { value: "new", label: "New" },
  { value: "under_review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" }
];

export default function IdeaBank() {
  const [ideas, setIdeas] = useState(mockIdeas);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [sortField, setSortField] = useState<'votes' | 'submittedDate'>('submittedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    department: '',
    category: '',
    status: '',
    tags: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Form state for new idea submission
  const [newIdea, setNewIdea] = useState<Omit<Idea, 'id' | 'votes' | 'comments'>>({
    title: '',
    description: '',
    submitter: '',
    department: '',
    submittedDate: new Date().toISOString().split('T')[0],
    status: 'new',
    category: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  // Handler for submitting a new idea
  const handleSubmitIdea = () => {
    const ideaId = `IDEA-2025-${String(ideas.length + 1).padStart(3, '0')}`;
    const ideaToAdd: Idea = {
      ...newIdea,
      id: ideaId,
      votes: 0,
      comments: 0
    };
    
    setIdeas([ideaToAdd, ...ideas]);
    setShowSubmitModal(false);
    resetNewIdeaForm();
  };

  const resetNewIdeaForm = () => {
    setNewIdea({
      title: '',
      description: '',
      submitter: '',
      department: '',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'new',
      category: '',
      tags: []
    });
    setTagInput('');
  };

  // Handle adding a tag to new idea
  const handleAddTag = () => {
    if (tagInput.trim() && !newIdea.tags.includes(tagInput.trim())) {
      setNewIdea({
        ...newIdea,
        tags: [...newIdea.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  // Handle removing a tag from new idea
  const handleRemoveTag = (tagToRemove: string) => {
    setNewIdea({
      ...newIdea,
      tags: newIdea.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle voting for an idea
  const handleVote = (ideaId: string) => {
    setIdeas(ideas.map(idea => 
      idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
    ));
  };

  // Apply sorting to ideas
  const getSortedIdeas = () => {
    return [...ideas].sort((a, b) => {
      if (sortField === 'votes') {
        return sortDirection === 'asc' ? a.votes - b.votes : b.votes - a.votes;
      } else {
        // Sort by date
        return sortDirection === 'asc' 
          ? new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime()
          : new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      }
    });
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: 'votes' | 'submittedDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter ideas based on search term and filters
  const getFilteredIdeas = () => {
    const sorted = getSortedIdeas();
    
    return sorted.filter(idea => {
      // Text search
      const matchesSearch = searchTerm === '' || 
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Department filter
      const matchesDepartment = filters.department === '' || 
        idea.department === filters.department;
      
      // Category filter
      const matchesCategory = filters.category === '' || 
        idea.category === filters.category;
      
      // Status filter
      const matchesStatus = filters.status === '' || 
        idea.status === filters.status;
      
      // Tags filter (match any of the selected tags)
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.some(tag => idea.tags.includes(tag));
      
      return matchesSearch && matchesDepartment && matchesCategory && matchesStatus && matchesTags;
    });
  };

  // Handler for clearing all filters
  const clearFilters = () => {
    setFilters({
      department: '',
      category: '',
      status: '',
      tags: []
    });
    setSearchTerm('');
  };

  // Toggle a tag filter
  const toggleTagFilter = (tag: string) => {
    setFilters(prev => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...prev.tags, tag] };
      }
    });
  };

  // Get all unique tags from ideas
  const getAllTags = () => {
    const tagsSet = new Set<string>();
    ideas.forEach(idea => {
      idea.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  };

  const filteredIdeas = getFilteredIdeas();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Idea Bank</h2>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowSubmitModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit Idea
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Search and filters */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button 
                className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <button 
                className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => handleSort('votes')}
              >
                <Star className="h-4 w-4 mr-1" />
                Votes
                <ArrowUpDown className="h-3 w-3 ml-1" />
              </button>
              <button 
                className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => handleSort('submittedDate')}
              >
                Date
                <ArrowUpDown className="h-3 w-3 ml-1" />
              </button>
            </div>
            
            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-md space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Filters</h3>
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Department filter */}
                  <div>
                    <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <select
                      id="department-filter"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filters.department}
                      onChange={(e) => setFilters({...filters, department: e.target.value})}
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Category filter */}
                  <div>
                    <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category-filter"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Status filter */}
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status-filter"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={filters.status}
                      onChange={(e) => setFilters({...filters, status: e.target.value})}
                    >
                      <option value="">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Tags filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getAllTags().map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTagFilter(tag)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          filters.tags.includes(tag) 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ideas list */}
          <div className="space-y-4">
            {filteredIdeas.length > 0 ? (
              filteredIdeas.map((idea) => (
                <div key={idea.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          {idea.title}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          idea.status === 'approved' ? 'bg-green-100 text-green-800' :
                          idea.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          idea.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {statuses.find(s => s.value === idea.status)?.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{idea.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {idea.submitter} • {idea.department}
                        </div>
                        <button 
                          className="flex items-center hover:text-blue-600"
                          onClick={() => handleVote(idea.id)}
                        >
                          <Star className={`h-4 w-4 mr-1 ${idea.votes > 0 ? "text-yellow-400" : ""}`} />
                          {idea.votes} votes
                        </button>
                        <div>{idea.comments} comments</div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {idea.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No ideas found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filters, or submit a new idea.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Submit Idea Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Submit New Idea
                    </h3>
                    <div className="mt-4 space-y-4">
                      {/* Title */}
                      <div>
                        <label htmlFor="idea-title" className="block text-sm font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          id="idea-title"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newIdea.title}
                          onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                          required
                        />
                      </div>
                      
                      {/* Description */}
                      <div>
                        <label htmlFor="idea-description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="idea-description"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newIdea.description}
                          onChange={(e) => setNewIdea({...newIdea, description: e.target.value})}
                          required
                        />
                      </div>
                      
                      {/* Submitter */}
                      <div>
                        <label htmlFor="idea-submitter" className="block text-sm font-medium text-gray-700">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="idea-submitter"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={newIdea.submitter}
                          onChange={(e) => setNewIdea({...newIdea, submitter: e.target.value})}
                          required
                        />
                      </div>
                      
                      {/* Department */}
                      <div>
                        <label htmlFor="idea-department" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <select
                          id="idea-department"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={newIdea.department}
                          onChange={(e) => setNewIdea({...newIdea, department: e.target.value})}
                          required
                        >
                          <option value="" disabled>Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Category */}
                      <div>
                        <label htmlFor="idea-category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          id="idea-category"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          value={newIdea.category}
                          onChange={(e) => setNewIdea({...newIdea, category: e.target.value})}
                          required
                        >
                          <option value="" disabled>Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Tags */}
                      <div>
                        <label htmlFor="idea-tags" className="block text-sm font-medium text-gray-700">
                          Tags
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            id="idea-tags"
                            className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            placeholder="Add a tag"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                          />
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100 focus:outline-none"
                            onClick={handleAddTag}
                          >
                            Add
                          </button>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-2">
                          {newIdea.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                              <button
                                type="button"
                                className="ml-1.5 h-3.5 w-3.5 rounded-full text-blue-400 hover:bg-blue-200 flex items-center justify-center"
                                onClick={() => handleRemoveTag(tag)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSubmitIdea}
                  disabled={!newIdea.title || !newIdea.description || !newIdea.submitter || !newIdea.department || !newIdea.category}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}