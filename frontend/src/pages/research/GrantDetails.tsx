import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Users, DollarSign, FileText, 
  CheckCircle, Clock, Edit, Trash2, Share2, Download, 
  Building, Award
} from 'lucide-react';
import { formatDistance } from 'date-fns';

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
  };
  duration: number;
  documents: string[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const GrantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [grant, setGrant] = useState<GrantApplication | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    const savedGrants = localStorage.getItem('grantApplications');
    if (savedGrants) {
      try {
        const grants = JSON.parse(savedGrants);
        if (Array.isArray(grants)) {
          const foundGrant = grants.find((g: GrantApplication) => g.id === id);
          if (foundGrant) {
            setGrant(foundGrant);
          }
        }
      } catch (error) {
        console.error("Failed to parse grantApplications from localStorage:", error);
      }
    }
  }, [id]);
  
  const handleDelete = () => {
    const savedGrants = localStorage.getItem('grantApplications');
    if (savedGrants) {
      const grants = JSON.parse(savedGrants);
      const updatedGrants = grants.filter((g: GrantApplication) => g.id !== id);
      localStorage.setItem('grantApplications', JSON.stringify(updatedGrants));
      navigate('/research/grants');
    }
  };

  const handleEdit = () => {
    navigate(`/research/grants/edit/${id}`);
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the share link to the email
    alert(`Grant details shared with ${shareEmail}`);
    setShareEmail('');
    setShareMessage('');
    setShowShareModal(false);
  };

  const handleExport = () => {
    if (!grant) return;

    // Create a text representation of the grant data
    const grantText = `
Grant Details: ${grant.title}
ID: ${grant.id}
Agency: ${grant.agency}
Status: ${grant.status}
Amount: ${formatCurrency(grant.amount)}
Deadline: ${new Date(grant.deadline).toLocaleDateString()}
${grant.submittedDate ? `Submitted: ${new Date(grant.submittedDate).toLocaleDateString()}` : ''}
Duration: ${grant.duration} months
Investigators: ${grant.investigators.join(', ')}

Abstract:
${grant.abstract}

Objectives:
${grant.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}

Budget:
Personnel: ${formatCurrency(grant.budget.personnel)}
Equipment: ${formatCurrency(grant.budget.equipment)}
Materials: ${formatCurrency(grant.budget.materials)}
Travel: ${formatCurrency(grant.budget.travel)}
Other: ${formatCurrency(grant.budget.other)}
Total: ${formatCurrency(Object.values(grant.budget).reduce((sum, value) => sum + value, 0))}

Documents:
${grant.documents.join('\n')}
    `;

    // Create a blob and download link
    const blob = new Blob([grantText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grant-${grant.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDocumentDownload = (docName: string) => {
    // In a real app, this would trigger a download of the actual document
    alert(`Downloading ${docName}...`);
  };

  if (!grant) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  const timeToDeadline = formatDistance(new Date(grant.deadline), new Date(), { addSuffix: true });
  const totalBudget = Object.values(grant.budget).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/research/grants')}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{grant.title}</h1>
            <p className="text-gray-600">Grant ID: {grant.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
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
            onClick={handleEdit}
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

      {/* Grant Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Deadline</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{timeToDeadline}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Due: {new Date(grant.deadline).toLocaleDateString()}</p>
            {grant.submittedDate && (
              <p>Submitted: {new Date(grant.submittedDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Agency</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{grant.agency}</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Building className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Duration: {grant.duration} months</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">{formatCurrency(grant.amount)}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Total Budget: {formatCurrency(totalBudget)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-gray-900 capitalize">{grant.status.replace('_', ' ')}</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg">
              <Award className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>{grant.investigators.length} Investigators</p>
          </div>
        </div>
      </div>

      {/* Grant Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Abstract */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Abstract</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{grant.abstract}</p>
          </div>

          {/* Objectives */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Research Objectives</h2>
            <ul className="space-y-3">
              {grant.objectives.map((objective, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Budget Breakdown</h2>
            <div className="space-y-4">
              {Object.entries(grant.budget).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{category}</span>
                  <span className="text-gray-900 font-medium">{formatCurrency(amount)}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(totalBudget)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Documents</h2>
            <div className="space-y-3">
              {grant.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{doc}</span>
                  </div>
                  <button 
                    onClick={() => handleDocumentDownload(doc)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Investigators */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Investigators</h2>
            <div className="space-y-4">
              {grant.investigators.map((investigator, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img 
                    src={`https://i.pravatar.cc/40?img=${index + 1}`}
                    alt={investigator}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{investigator}</p>
                    <p className="text-xs text-gray-500">Principal Investigator</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Duration</p>
                  <p className="text-sm text-gray-600">{grant.duration} months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Grant Application</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this grant application? This action cannot be undone.
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
                Delete Grant
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default GrantDetails;