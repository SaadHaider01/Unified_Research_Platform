import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Beaker, Search, Filter, Plus, ArrowUpDown, MoreHorizontal, Download, UploadCloud, Calendar, X, Check } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  status: string;
  lead: string;
  department: string;
  startDate: string;
  endDate: string;
  budget: string;
  team: number;
  progress: number;
  objectives: string[];
  methodology: string;
  funding: string;
  deliverables: string[];
}

// Mock research projects data
const mockProjects = [
  {
    id: 'RP-2025-001',
    title: 'Advanced Materials for Energy Storage',
    status: 'active',
    lead: 'Dr. Sarah Wilson',
    department: 'Engineering',
    startDate: '2025-01-15',
    endDate: '2026-12-31',
    budget: '$350,000',
    team: 8,
    progress: 65,
    objectives: [
      'Develop novel electrode materials',
      'Improve battery cycle life by 50%',
      'Reduce production costs by 30%'
    ],
    methodology: 'Experimental research with iterative prototyping',
    funding: 'National Science Foundation',
    deliverables: [
      'Quarterly progress reports',
      'Patent applications',
      'Research publications',
      'Prototype demonstration'
    ]
  },
  {
    id: 'RP-2025-002',
    title: 'Genetic Markers for Early Disease Detection',
    status: 'active',
    lead: 'Dr. Michael Chen',
    department: 'Life Sciences',
    startDate: '2025-02-01',
    endDate: '2027-01-31',
    budget: '$420,000',
    team: 6,
    progress: 42,
    objectives: [
      'Identify novel genetic markers',
      'Develop rapid screening method',
      'Validate clinical applications'
    ],
    methodology: 'Clinical trials and data analysis',
    funding: 'Medical Research Council',
    deliverables: [
      'Research papers',
      'Clinical trial reports',
      'Diagnostic tool prototype'
    ]
  },
  {
    id: 'RP-2025-003',
    title: 'Quantum Computing Optimization Algorithms',
    status: 'planning',
    lead: 'Dr. James Rodriguez',
    department: 'Computer Science',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    budget: '$275,000',
    team: 4,
    progress: 10,
    objectives: [
      'Develop quantum algorithms',
      'Improve computational efficiency',
      'Create simulation framework'
    ],
    methodology: 'Theoretical research and simulation',
    funding: 'Tech Innovation Grant',
    deliverables: [
      'Algorithm documentation',
      'Software implementation',
      'Performance analysis'
    ]
  },
  {
    id: 'RP-2024-015',
    title: 'AI Applications in Medical Imaging',
    status: 'active',
    lead: 'Dr. Emily Patel',
    department: 'Medicine',
    startDate: '2024-09-15',
    endDate: '2026-03-31',
    budget: '$380,000',
    team: 7,
    progress: 78,
    objectives: [
      'Develop AI imaging models',
      'Improve diagnosis accuracy',
      'Reduce processing time'
    ],
    methodology: 'Deep learning and clinical validation',
    funding: 'Healthcare Innovation Fund',
    deliverables: [
      'AI model documentation',
      'Clinical validation reports',
      'Software platform'
    ]
  },
  {
    id: 'RP-2024-012',
    title: 'Sustainable Urban Water Management',
    status: 'completed',
    lead: 'Dr. Thomas Lee',
    department: 'Environmental Science',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    budget: '$195,000',
    team: 5,
    progress: 100,
    objectives: [
      'Optimize water distribution',
      'Reduce water waste',
      'Implement smart monitoring'
    ],
    methodology: 'Field studies and system implementation',
    funding: 'Environmental Protection Agency',
    deliverables: [
      'System design documentation',
      'Implementation guide',
      'Impact assessment report'
    ]
  },
  {
    id: 'RP-2024-018',
    title: 'Blockchain for Secure Medical Records',
    status: 'on-hold',
    lead: 'Dr. Amara Johnson',
    department: 'Health Informatics',
    startDate: '2024-11-01',
    endDate: '2026-04-30',
    budget: '$320,000',
    team: 6,
    progress: 35,
    objectives: [
      'Design blockchain architecture',
      'Implement security protocols',
      'Ensure HIPAA compliance'
    ],
    methodology: 'System development and security testing',
    funding: 'Digital Health Initiative',
    deliverables: [
      'Architecture documentation',
      'Security audit reports',
      'Implementation prototype'
    ]
  }
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const StatusBadge = ({ status }: { status: string }) => {
  let bgColor;
  let textColor;
  let label;

  switch (status) {
    case 'active':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Active';
      break;
    case 'planning':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      label = 'Planning';
      break;
    case 'completed':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = 'Completed';
      break;
    case 'on-hold':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      label = 'On Hold';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = status;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

const ResearchProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New project form state
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    department: '',
    lead: '',
    startDate: '',
    endDate: '',
    budget: '',
    team: 1,
    objectives: [''],
    methodology: '',
    funding: '',
    deliverables: [''],
    status: 'planning',
    progress: 0
  });

  // Load projects from localStorage on mount
  useState(() => {
    const savedProjects = localStorage.getItem('researchProjects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  });

  // Save projects to localStorage whenever they change
  useState(() => {
    localStorage.setItem('researchProjects', JSON.stringify(projects));
  }, [projects]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newProject.title?.trim()) {
      errors.title = 'Project title is required';
    }
    if (!newProject.department?.trim()) {
      errors.department = 'Department is required';
    }
    if (!newProject.lead?.trim()) {
      errors.lead = 'Lead researcher is required';
    }
    if (!newProject.startDate) {
      errors.startDate = 'Start date is required';
    }
    if (!newProject.endDate) {
      errors.endDate = 'End date is required';
    }
    if (newProject.startDate && newProject.endDate && new Date(newProject.startDate) > new Date(newProject.endDate)) {
      errors.endDate = 'End date must be after start date';
    }
    if (!newProject.budget?.trim()) {
      errors.budget = 'Budget is required';
    }
    if (!newProject.methodology?.trim()) {
      errors.methodology = 'Methodology is required';
    }
    if (!newProject.funding?.trim()) {
      errors.funding = 'Funding source is required';
    }
    if (!newProject.objectives?.length || !newProject.objectives[0].trim()) {
      errors.objectives = 'At least one objective is required';
    }
    if (!newProject.deliverables?.length || !newProject.deliverables[0].trim()) {
      errors.deliverables = 'At least one deliverable is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayInputChange = (index: number, value: string, field: 'objectives' | 'deliverables') => {
    setNewProject(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => i === index ? value : item) || []
    }));
  };

  const addArrayItem = (field: 'objectives' | 'deliverables') => {
    setNewProject(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeArrayItem = (index: number, field: 'objectives' | 'deliverables') => {
    setNewProject(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newProjectData: Project = {
      ...newProject as Project,
      id: `RP-${new Date().getFullYear()}-${String(projects.length + 1).padStart(3, '0')}`,
      progress: 0,
      status: 'planning'
    };

    setProjects(prev => [...prev, newProjectData]);
    setIsModalOpen(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);

    // Reset form
    setNewProject({
      title: '',
      department: '',
      lead: '',
      startDate: '',
      endDate: '',
      budget: '',
      team: 1,
      objectives: [''],
      methodology: '',
      funding: '',
      deliverables: [''],
      status: 'planning',
      progress: 0
    });
  };

  // Filter projects based on all criteria
  const filteredProjects = projects.filter(project =>
    (selectedDepartment === 'all' || project.department === selectedDepartment) &&
    (selectedStatus === 'all' || project.status === selectedStatus) &&
    (project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.lead.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort projects if sort configuration exists
  const sortedProjects = sortConfig
    ? [...filteredProjects].sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredProjects;

  // Toggle sort for a column
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Toggle selection of a project
  const toggleSelectProject = (projectId: string) => {
    setSelectedProjects(prevSelected =>
      prevSelected.includes(projectId)
        ? prevSelected.filter(id => id !== projectId)
        : [...prevSelected, projectId]
    );
  };

  // Toggle selection of all projects
  const toggleSelectAll = () => {
    if (selectedProjects.length === sortedProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(sortedProjects.map(project => project.id));
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const importedProjects = JSON.parse(content);
          
          // Validate imported data
          if (Array.isArray(importedProjects) && importedProjects.every(project => 
            project.id && project.title && project.status && project.department
          )) {
            setProjects([...projects, ...importedProjects]);
            localStorage.setItem('researchProjects', JSON.stringify([...projects, ...importedProjects]));
            toast.success('Projects imported successfully');
          } else {
            toast.error('Invalid project data format');
          }
        } catch (error) {
          toast.error('Failed to import projects');
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle file download
  const handleDownload = () => {
    const selectedData = selectedProjects.length > 0 
      ? projects.filter(p => selectedProjects.includes(p.id))
      : projects;

    const dataStr = JSON.stringify(selectedData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'research-projects.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`${selectedData.length} projects exported successfully`);
  };

  // Handle department filter
  const handleDepartmentFilter = (department: string) => {
    setSelectedDepartment(department);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all research initiatives and funding
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Create New Research Project</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Project Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={newProject.title}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${formErrors.title ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department*
                  </label>
                  <select
                    name="department"
                    id="department"
                    value={newProject.department}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${formErrors.department ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Life Sciences">Life Sciences</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Medicine">Medicine</option>
                    <option value="Environmental Science">Environmental Science</option>
                  </select>
                  {formErrors.department && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.department}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lead" className="block text-sm font-medium text-gray-700">
                    Lead Researcher*
                  </label>
                  <input
                    type="text"
                    name="lead"
                    id="lead"
                    value={newProject.lead}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${formErrors.lead ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {formErrors.lead && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.lead}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="team" className="block text-sm font-medium text-gray-700">
                    Team Size
                  </label>
                  <input
                    type="number"
                    name="team"
                    id="team"
                    min="1"
                    value={newProject.team}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date*
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={newProject.startDate}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${formErrors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {formErrors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date*
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={newProject.endDate}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${formErrors.endDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {formErrors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Budget*
                  </label>
                  <input
                    type="text"
                    name="budget"
                    id="budget"
                    value={newProject.budget}
                    onChange={handleInputChange}
                    placeholder="e.g., $350,000"
                    className={`mt-1 block w-full border ${formErrors.budget ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {formErrors.budget && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.budget}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="funding" className="block text-sm font-medium text-gray-700">
                    Funding Source*
                  </label>
                  <input
                    type="text"
                    name="funding"
                    id="funding"
                    value={newProject.funding}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${formErrors.funding ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                  {formErrors.funding && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.funding}</p>
                  )}
                </div>
              </div>

              {/* Methodology */}
              <div>
                <label htmlFor="methodology" className="block text-sm font-medium text-gray-700">
                  Research Methodology*
                </label>
                <textarea
                  name="methodology"
                  id="methodology"
                  rows={3}
                  value={newProject.methodology}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${formErrors.methodology ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {formErrors.methodology && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.methodology}</p>
                )}
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Research Objectives*
                </label>
                {newProject.objectives?.map((objective, index) => (
                  <div key={index} className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleArrayInputChange(index, e.target.value, 'objectives')}
                      className={`block w-full border ${formErrors.objectives ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Enter research objective"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'objectives')}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('objectives')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Objective
                </button>
                {formErrors.objectives && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.objectives}</p>
                )}
              </div>

              {/* Deliverables */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Deliverables*
                </label>
                {newProject.deliverables?.map((deliverable, index) => (
                  <div key={index} className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => handleArrayInputChange(index, e.target.value, 'deliverables')}
                      className={`block w-full border ${formErrors.deliverables ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                      placeholder="Enter deliverable"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'deliverables')}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('deliverables')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Deliverable
                </button>
                {formErrors.deliverables && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.deliverables}</p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center shadow-lg z-50">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          Project created successfully!
        </div>
      )}

      {/* Search and actions bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative max-w-xs w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={selectedDepartment}
              onChange={(e) => handleDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Life Sciences">Life Sciences</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Medicine">Medicine</option>
              <option value="Environmental Science">Environmental Science</option>
            </select>
            
            <select 
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              value={selectedStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleDownload}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                title="Download selected projects"
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
                title="Upload projects"
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

      {/* Projects table */}
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
                      checked={selectedProjects.length === sortedProjects.length && sortedProjects.length > 0}
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
                    Project ID
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('title')}
                >
                  <div className="flex items-center">
                    Project Title
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
                  onClick={() => requestSort('lead')}
                >
                  <div className="flex items-center">
                    Lead Researcher
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('startDate')}
                >
                  <div className="flex items-center">
                    Timeline
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('budget')}
                >
                  <div className="flex items-center">
                    Budget
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('progress')}
                >
                  <div className="flex items-center">
                    Progress
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleSelectProject(project.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {project.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                        <Beaker className="h-4 w-4 text-blue-800" />
                      </div>
                      <div className="ml-3">
                        <Link 
                          to={`/research/projects/${project.id}`} 
                          className="text-sm font-medium text-gray-900 hover:text-blue-600"
                        >
                          {project.title}
                        </Link>
                        <div className="text-xs text-gray-500">{project.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{project.lead}</div>
                    <div className="text-xs text-gray-500">{project.team} team members</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(project.startDate)}</div>
                    <div className="text-xs text-gray-500">to {formatDate(project.endDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold text-blue-700">{project.progress}%</div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                        <div 
                          style={{ width: `${project.progress}%` }} 
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            project.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {sortedProjects.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Beaker className="h-8 w-8 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedProjects.length}</span> of{' '}
                <span className="font-medium">{mockProjects.length}</span> results
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
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
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

export default ResearchProjects;