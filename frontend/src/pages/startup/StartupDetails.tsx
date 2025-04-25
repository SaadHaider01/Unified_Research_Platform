import { useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Upload,
  Users,
} from "lucide-react";

// Define TypeScript interfaces for our data structures
interface Founder {
  name: string;
  role: string;
  avatar: string;
  email: string;
  phone: string;
}

interface Mentor {
  name: string;
  expertise: string;
  avatar: string;
}

interface Milestone {
  title: string;
  date: string;
  description: string;
  completed: boolean;
}

interface Metrics {
  revenue: string;
  customers: number;
  growth: string;
  runway: string;
  burnRate: string;
}

interface Event {
  title: string;
  date: string;
  time: string;
}

interface Document {
  title: string;
  lastUpdated: string;
  type: string;
}

interface Startup {
  id: string;
  name: string;
  logo: string;
  description: string;
  stage: string;
  sector: string;
  funding: string;
  foundedDate: string;
  joinedDate: string;
  website: string;
  location: string;
  teamSize: number;
  founders: Founder[];
  metrics: Metrics;
  milestones: Milestone[];
  mentors: Mentor[];
  events: Event[];
  documents: Document[];
}

interface StartupDetailsPageProps {
  params?: {
    id?: string;
  };
}

export default function StartupDetailsPage({ params }: StartupDetailsPageProps): JSX.Element {
  const [activeTab, setActiveTab] = useState("overview");
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [allEventsVisible, setAllEventsVisible] = useState(false);
  const [allTeamVisible, setAllTeamVisible] = useState(false);
  
  // Handle case where params or params.id is undefined
  const startupId = params?.id || "default-id";
  
  // This would normally fetch data based on the ID
  const startup: Startup = {
    id: startupId,
    name: "QuantumSolve Technologies",
    logo: "/api/placeholder/120/120",
    description:
      "QuantumSolve Technologies is developing quantum computing algorithms for complex optimization problems in logistics, finance, and healthcare. Our proprietary quantum software solutions provide exponential speedups for computationally intensive tasks.",
    stage: "Series A",
    sector: "AI/ML",
    funding: "$2.5M",
    foundedDate: "2023",
    joinedDate: "Feb 15, 2025",
    website: "https://example.com/quantumsolve",
    location: "Boston, MA",
    teamSize: 12,
    founders: [
      {
        name: "Dr. Emily Chen",
        role: "CEO & Co-founder",
        avatar: "/api/placeholder/40/40",
        email: "emily@quantumsolve.example",
        phone: "+1 (555) 123-4567",
      },
      {
        name: "Dr. Michael Rodriguez",
        role: "CTO & Co-founder",
        avatar: "/api/placeholder/40/40",
        email: "michael@quantumsolve.example",
        phone: "+1 (555) 987-6543",
      },
    ],
    metrics: {
      revenue: "$450K",
      customers: 8,
      growth: "+32%",
      runway: "18 months",
      burnRate: "$85K/month",
    },
    milestones: [
      {
        title: "Seed Funding",
        date: "June 2023",
        description: "Raised $750K in seed funding",
        completed: true,
      },
      {
        title: "MVP Launch",
        date: "December 2023",
        description: "Launched minimum viable product",
        completed: true,
      },
      {
        title: "First Enterprise Client",
        date: "March 2024",
        description: "Signed first enterprise client",
        completed: true,
      },
      {
        title: "Series A Funding",
        date: "January 2025",
        description: "Raised $2.5M in Series A funding",
        completed: true,
      },
      {
        title: "International Expansion",
        date: "Q3 2025",
        description: "Expand to European market",
        completed: false,
      },
      {
        title: "Series B Funding",
        date: "Q1 2026",
        description: "Target $10M Series B round",
        completed: false,
      },
    ],
    mentors: [
      {
        name: "Dr. Sarah Johnson",
        expertise: "Quantum Computing",
        avatar: "/api/placeholder/40/40",
      },
      {
        name: "Alex Thompson",
        expertise: "Venture Capital",
        avatar: "/api/placeholder/40/40",
      },
    ],
    events: [
      {
        title: "Mentor Session",
        date: "April 28, 2025",
        time: "10:00 AM",
      },
      {
        title: "Pitch Practice",
        date: "May 5, 2025",
        time: "2:00 PM",
      },
      {
        title: "Investor Demo Day",
        date: "May 15, 2025",
        time: "9:00 AM",
      },
      {
        title: "Tech Conference",
        date: "May 20, 2025",
        time: "9:00 AM",
      },
      {
        title: "Product Review",
        date: "May 25, 2025",
        time: "11:00 AM",
      },
    ],
    documents: [
      {
        title: "Pitch Deck",
        lastUpdated: "2 months ago",
        type: "presentation",
      },
      {
        title: "Business Plan",
        lastUpdated: "3 months ago",
        type: "document",
      },
      {
        title: "Financial Projections",
        lastUpdated: "1 month ago",
        type: "spreadsheet",
      },
    ],
  };

  // Modal component for scheduling a meeting
  const MeetingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Schedule Meeting</h3>
          <button onClick={() => setShowMeetingModal(false)} className="text-gray-500">
            &times;
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setShowMeetingModal(false); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Meeting Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter meeting title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time</label>
              <input
                type="time"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Attendees</label>
              <select className="w-full p-2 border rounded">
                <option>Select attendees</option>
                {startup.founders.map((founder, index) => (
                  <option key={index}>{founder.name}</option>
                ))}
                {startup.mentors.map((mentor, index) => (
                  <option key={index}>{mentor.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowMeetingModal(false)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Schedule
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  // Modal component for assigning a new mentor
  const MentorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Assign New Mentor</h3>
          <button onClick={() => setShowMentorModal(false)} className="text-gray-500">
            &times;
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setShowMentorModal(false); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mentor Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter mentor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expertise</label>
              <select className="w-full p-2 border rounded">
                <option>Select expertise</option>
                <option>Venture Capital</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Product Development</option>
                <option>Quantum Computing</option>
                <option>AI/ML</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowMentorModal(false)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Assign
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  // Modal component for uploading a document
  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Upload New Document</h3>
          <button onClick={() => setShowUploadModal(false)} className="text-gray-500">
            &times;
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setShowUploadModal(false); }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Document Title</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter document title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Document Type</label>
              <select className="w-full p-2 border rounded">
                <option>Select document type</option>
                <option>Presentation</option>
                <option>Spreadsheet</option>
                <option>Document</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">File</label>
              <div className="border-2 border-dashed rounded p-4 text-center">
                <Upload className="h-6 w-6 mx-auto text-gray-500" />
                <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                <input type="file" className="opacity-0 absolute inset-0 w-full cursor-pointer" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  // Handler for viewing a document
  const handleViewDocument = (document) => {
    alert(`Viewing document: ${document.title}`);
    // In a real application, this would open the document
  };

  // Handler for reviewing progress
  const handleReviewProgress = () => {
    setActiveTab("metrics");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container py-6">
      {showMeetingModal && <MeetingModal />}
      {showMentorModal && <MentorModal />}
      {showUploadModal && <UploadModal />}
      
      <div className="flex items-center gap-2 mb-6">
        <button className="flex items-center px-3 py-1 text-sm rounded hover:bg-gray-100">
          <a href="/startup-incubator" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Startups
          </a>
        </button>
        <div className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="ml-2">{startup.name}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg border shadow">
            <div className="p-6 flex flex-row items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-md border">
                <img
                  src={startup.logo || "/api/placeholder/120/120"}
                  alt={startup.name}
                  width={120}
                  height={120}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      <a href="#startup-description" className="hover:underline">
                        {startup.name}
                      </a>
                    </h2>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 border">{startup.sector}</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{startup.stage}</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-200">Funding: {startup.funding}</span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={startup.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
                <p id="startup-description" className="mt-4 text-sm text-gray-600">{startup.description}</p>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Founded</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{startup.foundedDate}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Joined Incubator</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{startup.joinedDate}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Team Size</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span>{startup.teamSize} members</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Location</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{startup.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="border-b">
              <div className="grid w-full grid-cols-4">
                {["overview", "team", "metrics", "documents"].map((tab) => (
                  <button
                    key={tab}
                    className={`py-2 text-center text-sm transition-colors ${
                      activeTab === tab 
                        ? "border-b-2 border-blue-500 font-medium" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {activeTab === "overview" && (
              <div className="mt-4">
                <div className="bg-white rounded-lg border shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-bold">Milestones</h3>
                    <p className="text-sm text-gray-500">
                      Track the startup's progress through key milestones and achievements
                    </p>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="space-y-8">
                      {startup.milestones.map((milestone, index) => (
                        <div key={index} className="relative pl-8">
                          <div
                            className={`absolute left-0 top-1 h-4 w-4 rounded-full border ${
                              milestone.completed 
                                ? "bg-blue-500 border-blue-500" 
                                : "bg-white border-gray-500"
                            }`}
                          />
                          {index < startup.milestones.length - 1 && (
                            <div
                              className={`absolute left-2 top-5 h-[calc(100%-16px)] w-[1px] ${
                                milestone.completed ? "bg-blue-500" : "bg-gray-500"
                              }`}
                            />
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{milestone.title}</h4>
                              <span 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  milestone.completed 
                                    ? "bg-blue-100 text-blue-800" 
                                    : "bg-gray-100 border"
                                }`}
                              >
                                {milestone.date}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{milestone.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border shadow mt-6">
                  <div className="p-6">
                    <h3 className="text-lg font-bold">Mentors & Advisors</h3>
                    <p className="text-sm text-gray-500">Experts providing guidance and support</p>
                  </div>
                  <div className="px-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {startup.mentors.map((mentor, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={mentor.avatar || "/api/placeholder/40/40"}
                            alt={mentor.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <h4 className="font-medium">{mentor.name}</h4>
                            <p className="text-sm text-gray-500">{mentor.expertise}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 border-t mt-6">
                    <button 
                      onClick={() => setShowMentorModal(true)}
                      className="px-4 py-1 text-sm border rounded hover:bg-gray-50"
                    >
                      Assign New Mentor
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="mt-4">
                <div className="bg-white rounded-lg border shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-bold">Founding Team</h3>
                    <p className="text-sm text-gray-500">Key team members and their roles</p>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {startup.founders.map((founder, index) => (
                        <div key={index} className="bg-white rounded-lg border shadow">
                          <div className="p-4 flex flex-row items-center gap-4">
                            <img
                              src={founder.avatar || "/api/placeholder/40/40"}
                              alt={founder.name}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <h4 className="text-base font-bold">{founder.name}</h4>
                              <p className="text-sm text-gray-500">{founder.role}</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>{founder.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <span>{founder.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {allTeamVisible && (
                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div className="bg-white rounded-lg border shadow">
                          <div className="p-4 flex flex-row items-center gap-4">
                            <img
                              src="/api/placeholder/40/40"
                              alt="Team member"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <h4 className="text-base font-bold">Sarah Wilson</h4>
                              <p className="text-sm text-gray-500">Lead Developer</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>sarah@quantumsolve.example</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg border shadow">
                          <div className="p-4 flex flex-row items-center gap-4">
                            <img
                              src="/api/placeholder/40/40"
                              alt="Team member"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <h4 className="text-base font-bold">Alex Kim</h4>
                              <p className="text-sm text-gray-500">Head of Sales</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>alex@quantumsolve.example</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 border-t">
                    <button 
                      onClick={() => setAllTeamVisible(!allTeamVisible)}
                      className="px-4 py-1 text-sm border rounded hover:bg-gray-50"
                    >
                      {allTeamVisible ? "Hide Team Members" : "View All Team Members"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "metrics" && (
              <div className="mt-4">
                <div className="bg-white rounded-lg border shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-bold">Performance Metrics</h3>
                    <p className="text-sm text-gray-500">Key business metrics and financial indicators</p>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="bg-white rounded-lg border shadow">
                        <div className="p-4">
                          <h4 className="text-sm font-medium">Revenue</h4>
                        </div>
                        <div className="p-4">
                          <div className="text-2xl font-bold">{startup.metrics.revenue}</div>
                          <p className="text-xs text-gray-500">YTD</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Growth</span>
                              <span className="text-green-600">{startup.metrics.growth}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-blue-500 h-1 rounded-full" 
                                style={{ width: "32%" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border shadow">
                        <div className="p-4">
                          <h4 className="text-sm font-medium">Customers</h4>
                        </div>
                        <div className="p-4">
                          <div className="text-2xl font-bold">{startup.metrics.customers}</div>
                          <p className="text-xs text-gray-500">Enterprise clients</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border shadow">
                        <div className="p-4">
                          <h4 className="text-sm font-medium">Runway</h4>
                        </div>
                        <div className="p-4">
                          <div className="text-2xl font-bold">{startup.metrics.runway}</div>
                          <p className="text-xs text-gray-500">Burn rate: {startup.metrics.burnRate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t">
                    <button 
                      onClick={() => alert("Detailed analytics would open in a new dashboard")}
                      className="px-4 py-1 text-sm border rounded hover:bg-gray-50"
                    >
                      View Detailed Analytics
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="mt-4">
                <div className="bg-white rounded-lg border shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-bold">Documents & Resources</h3>
                    <p className="text-sm text-gray-500">Important files and documentation</p>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="space-y-4">
                    {startup.documents.map((document, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-2">
                            <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">{document.title}</h4>
                              <p className="text-xs text-gray-500">Updated {document.lastUpdated}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewDocument(document)}
                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 border-t">
                    <button 
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-1 text-sm border rounded hover:bg-gray-50"
                    >
                      Upload New Document
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border shadow">
            <div className="p-6">
              <h3 className="text-lg font-bold">Quick Actions</h3>
            </div>
            <div className="p-6 pt-0">
              <div className="grid gap-2">
                <button
                  onClick={() => setShowMeetingModal(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm border rounded hover:bg-gray-50"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Meeting</span>
                </button>
                <button
                  onClick={handleReviewProgress}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm border rounded hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span>Review Progress</span>
                </button>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm border rounded hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Document</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Upcoming Events</h3>
                <button
                  onClick={() => setAllEventsVisible(!allEventsVisible)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  {allEventsVisible ? "View Less" : "View All"}
                </button>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {startup.events.slice(0, allEventsVisible ? undefined : 3).map((event, index) => (
                  <div key={index} className="bg-white rounded-lg border shadow">
                    <div className="p-4">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t">
              <button 
                onClick={() => setShowMeetingModal(true)}
                className="flex items-center px-4 py-1 text-sm border rounded hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span>Add Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}