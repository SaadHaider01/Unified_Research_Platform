import { useState } from 'react';
import { 
  Users, Search, Plus, ArrowUpDown, MoreHorizontal, 
  Mail, Phone, Star, Award, Calendar, X 
} from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  availability: 'available' | 'limited' | 'unavailable';
  rating: number;
  startups: string[];
  sessions: number;
  joinDate: string;
}

const mockMentors: Mentor[] = [
  {
    id: "MENTOR-2025-001",
    name: "Dr. Sarah Parker",
    title: "Chief Innovation Officer",
    company: "TechVentures Inc.",
    expertise: ["AI/ML", "Product Strategy", "Startup Growth"],
    bio: "20+ years experience in technology innovation and startup mentoring",
    avatar: "https://i.pravatar.cc/150?img=1",
    email: "sarah.parker@example.com",
    phone: "+1 234 567 8900",
    availability: "available",
    rating: 4.8,
    startups: ["HealthAI", "EcoTech Solutions"],
    sessions: 24,
    joinDate: "2025-01-15"
  },
];

const AvailabilityBadge = ({ availability }: { availability: string }) => {
  const getConfig = (status: string) => {
    switch (status) {
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

const Mentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>(mockMentors);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [newMentor, setNewMentor] = useState<Omit<Mentor, 'id' | 'joinDate'>>({
    name: '',
    title: '',
    company: '',
    expertise: [],
    bio: '',
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: '',
    phone: '',
    availability: 'available',
    rating: 0,
    startups: [],
    sessions: 0
  });
  const [currentExpertise, setCurrentExpertise] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionTopic, setSessionTopic] = useState('');

  const handleAddMentor = () => {
    const newId = `MENTOR-2025-${(mentors.length + 1).toString().padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    
    const mentorToAdd: Mentor = {
      ...newMentor,
      id: newId,
      joinDate: today
    };
    
    setMentors([...mentors, mentorToAdd]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewMentor({
      name: '',
      title: '',
      company: '',
      expertise: [],
      bio: '',
      avatar: 'https://i.pravatar.cc/150?img=5',
      email: '',
      phone: '',
      availability: 'available',
      rating: 0,
      startups: [],
      sessions: 0
    });
    setCurrentExpertise('');
  };

  const addExpertise = () => {
    if (currentExpertise.trim() && !newMentor.expertise.includes(currentExpertise.trim())) {
      setNewMentor({
        ...newMentor,
        expertise: [...newMentor.expertise, currentExpertise.trim()]
      });
      setCurrentExpertise('');
    }
  };

  const removeExpertise = (index: number) => {
    setNewMentor({
      ...newMentor,
      expertise: newMentor.expertise.filter((_, i) => i !== index)
    });
  };

  const openProfileModal = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsProfileModalOpen(true);
  };

  const openScheduleModal = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSession = () => {
    // In a real application, this would send the data to a backend
    // Here we'll just update the UI to show the session was scheduled
    if (selectedMentor) {
      const updatedMentors = mentors.map(mentor => {
        if (mentor.id === selectedMentor.id) {
          return {
            ...mentor,
            sessions: mentor.sessions + 1
          };
        }
        return mentor;
      });
      
      setMentors(updatedMentors);
      setIsScheduleModalOpen(false);
      
      // Reset scheduling form
      setSessionDate('');
      setSessionTime('');
      setSessionTopic('');
      
      // Show confirmation (in a real app, this would be a toast notification)
      alert(`Session scheduled with ${selectedMentor.name} on ${sessionDate} at ${sessionTime}`);
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.expertise.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Mentors</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Mentor
        </button>
      </div>

      {/* Add Mentor Modal */}
      {isAddModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Mentor</h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newMentor.name}
                      onChange={(e) => setNewMentor({...newMentor, name: e.target.value})}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newMentor.title}
                      onChange={(e) => setNewMentor({...newMentor, title: e.target.value})}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newMentor.company}
                      onChange={(e) => setNewMentor({...newMentor, company: e.target.value})}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                      Availability
                    </label>
                    <select
                      id="availability"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newMentor.availability}
                      onChange={(e) => setNewMentor({...newMentor, availability: e.target.value as 'available' | 'limited' | 'unavailable'})}
                    >
                      <option value="available">Available</option>
                      <option value="limited">Limited</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                      Expertise
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        id="expertise"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Add expertise"
                        value={currentExpertise}
                        onChange={(e) => setCurrentExpertise(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addExpertise()}
                      />
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onClick={addExpertise}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newMentor.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                          <button
                            type="button"
                            className="ml-1.5 inline-flex text-blue-500 hover:text-blue-700 focus:outline-none"
                            onClick={() => removeExpertise(index)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newMentor.bio}
                      onChange={(e) => setNewMentor({...newMentor, bio: e.target.value})}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newMentor.email}
                      onChange={(e) => setNewMentor({...newMentor, email: e.target.value})}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newMentor.phone}
                      onChange={(e) => setNewMentor({...newMentor, phone: e.target.value})}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <input
                      type="number"
                      id="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newMentor.rating}
                      onChange={(e) => setNewMentor({...newMentor, rating: parseFloat(e.target.value)})}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="sessions" className="block text-sm font-medium text-gray-700">
                      Sessions Completed
                    </label>
                    <input
                      type="number"
                      id="sessions"
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={newMentor.sessions}
                      onChange={(e) => setNewMentor({...newMentor, sessions: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  onClick={handleAddMentor}
                >
                  Add Mentor
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {isProfileModalOpen && selectedMentor && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div className="flex items-center mb-4">
                    <img
                      src={selectedMentor.avatar}
                      alt={selectedMentor.name}
                      className="h-16 w-16 rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedMentor.name}</h3>
                      <p className="text-sm text-gray-500">{selectedMentor.title} at {selectedMentor.company}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {selectedMentor.email}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {selectedMentor.phone}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Rating</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          {selectedMentor.rating}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Sessions</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {selectedMentor.sessions}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Bio</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedMentor.bio}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Expertise</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <div className="flex flex-wrap gap-2">
                            {selectedMentor.expertise.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Startups Mentored</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {selectedMentor.startups.join(", ")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    openScheduleModal(selectedMentor);
                  }}
                >
                  Schedule Session
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsProfileModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Session Modal */}
      {isScheduleModalOpen && selectedMentor && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Schedule Session with {selectedMentor.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a date and time for your mentoring session
                </p>
              </div>
              
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="session-date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    id="session-date"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="session-time" className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    id="session-time"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="session-topic" className="block text-sm font-medium text-gray-700">
                    Topic
                  </label>
                  <textarea
                    id="session-topic"
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="What would you like to discuss in this session?"
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                  />
                </div>
                
                <div className="bg-gray-50 px-4 py-3 rounded-md text-sm">
                  <p className="font-medium text-gray-900">Mentor Availability: <AvailabilityBadge availability={selectedMentor.availability} /></p>
                  <p className="mt-1 text-gray-500">This mentor has completed {selectedMentor.sessions} mentoring sessions</p>
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                  onClick={handleScheduleSession}
                  disabled={!sessionDate || !sessionTime || !sessionTopic}
                >
                  Confirm Session
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 min-w-0">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search mentors by name, company, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Mentors List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <li key={mentor.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        className="h-12 w-12 rounded-full"
                        src={mentor.avatar}
                        alt={mentor.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-600">{mentor.name}</div>
                        <div className="text-sm text-gray-500">{mentor.title} at {mentor.company}</div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <AvailabilityBadge availability={mentor.availability} />
                    </div>
                  </div>
                  
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <Award className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {mentor.expertise.slice(0, 3).join(", ")}
                        {mentor.expertise.length > 3 && "..."}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="flex space-x-2">
                      <button
                        onClick={() => openProfileModal(mentor)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => openScheduleModal(mentor)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Schedule
                      </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">
              No mentors found matching your search criteria.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Mentors;