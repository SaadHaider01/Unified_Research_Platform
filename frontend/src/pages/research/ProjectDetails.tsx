import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Users, DollarSign, Target, FileText, 
  CheckCircle, Clock, Edit, Trash2, Share2, Download 
} from 'lucide-react';
import { formatDistance } from 'date-fns';

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

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    // Load project from localStorage
    const savedProjects = localStorage.getItem('researchProjects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const foundProject = projects.find((p: Project) => p.id === id);
      if (foundProject) {
        setProject(foundProject);
      }
    }
  }, [id]);

  const handleDelete = () => {
    const savedProjects = localStorage.getItem('researchProjects');
    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      const updatedProjects = projects.filter((p: Project) => p.id !== id);
      localStorage.setItem('researchProjects', JSON.stringify(updatedProjects));
      navigate('/research');
    }
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the share link to the email
    alert(`Project details shared with ${shareEmail}`);
    setShareEmail('');
    setShareMessage('');
    setShowShareModal(false);
  };

  const handleExport = () => {
    if (!project) return;
    
    // Create a formatted project object for export
    const exportData = {
      ...project,
      exportDate: new Date().toISOString(),
      exportVersion: '1.0'
    };
    
    // Convert the project data to a JSON string
    const jsonString = JSON.stringify(exportData, null, 2);
    
    // Create a blob with the data
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}-${project.id}.json`;
    
    // Append the anchor to the body, click it, and remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Release the blob URL
    URL.revokeObjectURL(url);
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  const timeRemaining = formatDistance(new Date(project.endDate), new Date(), { addSuffix: true });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/research')}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
            <p className="text-gray-600">Project ID: {project.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => setShowShareModal(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
          <button 
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button 
            onClick={() => setIsEditMode(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Timeline</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{timeRemaining}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
            <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Team</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{project.team} Members</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Lead: {project.lead}</p>
            <p>Department: {project.department}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{project.budget}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Funding Source: {project.funding}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Progress</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{project.progress}%</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Target className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Methodology */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Research Methodology</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{project.methodology}</p>
          </div>

          {/* Objectives */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Research Objectives</h2>
            <ul className="space-y-3">
              {project.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Deliverables</h2>
            <ul className="space-y-3">
              {project.deliverables.map((deliverable, index) => (
                <li key={index} className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline and Updates */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Updates</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Progress Update</p>
                  <p className="text-sm text-gray-600">Research phase 1 completed</p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Document Added</p>
                  <p className="text-sm text-gray-600">Initial findings report uploaded</p>
                  <p className="text-xs text-gray-500 mt-1">5 days ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Team Members</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://i.pravatar.cc/40?img=1" 
                  alt="Team member" 
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{project.lead}</p>
                  <p className="text-xs text-gray-500">Lead Researcher</p>
                </div>
              </div>
              {/* Add more team members here */}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Share Grant Details</h3>
            <form onSubmit={handleShare}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="colleague@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="I thought you might be interested in this grant application..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Project</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;