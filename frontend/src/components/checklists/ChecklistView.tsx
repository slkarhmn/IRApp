import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ChecklistView.css';

// Type definitions
type ChecklistType = 'planning' | 'signin' | 'signout';

interface Checklist {
  id: string;
  type: ChecklistType;
  name: string;
  date: string;
  completedItems: number;
  totalItems: number;
  items: string[];
}

interface Procedure {
  id: number;
  name: string;
  code: string;
  date: string;
  physician: string;
  status: 'scheduled' | 'ready' | 'completed' | 'cancelled';
  checklists: Checklist[];
}

// Mock data
const MOCK_PROCEDURES: Procedure[] = [
  {
    id: 1,
    name: 'Appendectomy',
    code: 'APX-001',
    date: 'Feb 21, 2025',
    physician: 'Dr. Smith',
    status: 'completed',
    checklists: [
      {
        id: 'planning-1',
        type: 'planning',
        name: 'Pre-Procedural Planning',
        date: 'Feb 18, 2025',
        completedItems: 12,
        totalItems: 12,
        items: [
          'Discussed with referring physician',
          'Imaging studies reviewed',
          'Relevant medical history documented',
          'Informed consent obtained'
        ]
      },
      {
        id: 'signin-1',
        type: 'signin',
        name: 'Sign In',
        date: 'Feb 21, 2025',
        completedItems: 14,
        totalItems: 14,
        items: [
          'All team members introduced',
          'Correct patient verified',
          'Correct site confirmed',
          'Allergies checked'
        ]
      },
      {
        id: 'signout-1',
        type: 'signout',
        name: 'Sign Out',
        date: 'Feb 21, 2025',
        completedItems: 12,
        totalItems: 12,
        items: [
          'Post-op note written',
          'Vital signs normal',
          'Medications recorded',
          'Follow-up scheduled'
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Cholecystectomy',
    code: 'CHO-002',
    date: 'Jan 27, 2025',
    physician: 'Dr. Johnson',
    status: 'completed',
    checklists: [
      {
        id: 'planning-2',
        type: 'planning',
        name: 'Pre-Procedural Planning',
        date: 'Jan 24, 2025',
        completedItems: 11,
        totalItems: 12,
        items: [
          'Discussed with referring physician',
          'Imaging studies reviewed',
          'Consent obtained'
        ]
      },
      {
        id: 'signin-2',
        type: 'signin',
        name: 'Sign In',
        date: 'Jan 27, 2025',
        completedItems: 14,
        totalItems: 14,
        items: [
          'All team members introduced',
          'Correct patient verified',
          'IV access established'
        ]
      },
      {
        id: 'signout-2',
        type: 'signout',
        name: 'Sign Out',
        date: 'Jan 27, 2025',
        completedItems: 10,
        totalItems: 12,
        items: [
          'Procedure completed successfully',
          'Samples sent to lab',
          'Instructions provided'
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Hernia Repair',
    code: 'HRN-003',
    date: 'Mar 15, 2025',
    physician: 'Dr. Williams',
    status: 'scheduled',
    checklists: [
      {
        id: 'planning-3',
        type: 'planning',
        name: 'Pre-Procedural Planning',
        date: 'Mar 10, 2025',
        completedItems: 8,
        totalItems: 12,
        items: [
          'Imaging studies reviewed',
          'Lab tests ordered',
          'Fasting instructions given'
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Colonoscopy',
    code: 'COL-004',
    date: 'Dec 10, 2024',
    physician: 'Dr. Smith',
    status: 'completed',
    checklists: [
      {
        id: 'planning-4',
        type: 'planning',
        name: 'Pre-Procedural Planning',
        date: 'Dec 5, 2024',
        completedItems: 10,
        totalItems: 10,
        items: [
          'Bowel prep instructions provided',
          'Medical history reviewed'
        ]
      },
      {
        id: 'signin-4',
        type: 'signin',
        name: 'Sign In',
        date: 'Dec 10, 2024',
        completedItems: 12,
        totalItems: 12,
        items: [
          'Patient identity confirmed',
          'Sedation administered'
        ]
      },
      {
        id: 'signout-4',
        type: 'signout',
        name: 'Sign Out',
        date: 'Dec 10, 2024',
        completedItems: 11,
        totalItems: 11,
        items: [
          'No abnormalities found',
          'Recovery instructions given'
        ]
      }
    ]
  }
];

// Arrow icon component
const BackArrowIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={`chevron-icon ${expanded ? 'expanded' : ''}`}
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// Checklist type label component
const ChecklistTypeLabel: React.FC<{ type: ChecklistType }> = ({ type }) => {
  const labels: Record<ChecklistType, string> = {
    planning: 'Planning',
    signin: 'Sign In',
    signout: 'Sign Out'
  };

  return (
    <span className={`checklist-type-label ${type}`}>
      {labels[type]}
    </span>
  );
};

// Progress bar component
const ProgressBar: React.FC<{ completed: number; total: number }> = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="progress-text">{completed}/{total}</span>
    </div>
  );
};

// Status badge component
const StatusBadge: React.FC<{ status: Procedure['status'] }> = ({ status }) => {
  return (
    <span className={`status-badge status-${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Procedure card component
const ProcedureCard: React.FC<{ 
  procedure: Procedure; 
  isExpanded: boolean; 
  onToggle: () => void;
  patientId: string;
}> = ({ procedure, isExpanded, onToggle, patientId }) => {
  return (
    <div className={`procedure-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="procedure-card-header" onClick={onToggle}>
        <div className="procedure-card-left">
          <ChevronIcon expanded={isExpanded} />
          <div className="procedure-card-info">
            <div className="procedure-card-date">{procedure.date}</div>
            <div className="procedure-card-name">
              {procedure.name}
              <span className="procedure-code">({procedure.code})</span>
            </div>
            <div className="procedure-card-physician">
              Physician: {procedure.physician}
            </div>
          </div>
        </div>
        <div className="procedure-card-right">
          <StatusBadge status={procedure.status} />
          <span className="checklist-count">
            {procedure.checklists.length} checklist{procedure.checklists.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="procedure-card-content">
          <div className="checklists-list">
            {procedure.checklists.map((checklist) => (
              <div key={checklist.id} className="checklist-card">
                <div className="checklist-card-header">
                  <div className="checklist-card-left">
                    <span className={`checklist-dot ${checklist.type}`} />
                    <div className="checklist-card-info">
                      <div className="checklist-card-name">{checklist.name}</div>
                      <div className="checklist-card-date">{checklist.date}</div>
                    </div>
                  </div>
                  <div className="checklist-card-right">
                    <ChecklistTypeLabel type={checklist.type} />
                    <ProgressBar 
                      completed={checklist.completedItems} 
                      total={checklist.totalItems} 
                    />
                  </div>
                </div>
                <div className="checklist-card-items">
                  <ul>
                    {checklist.items.slice(0, 4).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                    {checklist.items.length > 4 && (
                      <li className="more-items">
                        +{checklist.items.length - 4} more items
                      </li>
                    )}
                  </ul>
                </div>
                <Link 
                  to={`/patients/${patientId}/view-procedure/${procedure.id}/${checklist.type}`}
                  className="view-details-link"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Filter tabs
type FilterTab = 'all' | 'scheduled' | 'completed' | 'cancelled';

// Main component
export const AllProceduresChecklists: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const patientId = id || '1';
  
  const [expandedProcedures, setExpandedProcedures] = useState<number[]>([1]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Patient info (mock)
  const patientName = "John Doe";

  const toggleProcedure = (procedureId: number) => {
    setExpandedProcedures(prev =>
      prev.includes(procedureId)
        ? prev.filter(id => id !== procedureId)
        : [...prev, procedureId]
    );
  };

  const expandAll = () => {
    setExpandedProcedures(MOCK_PROCEDURES.map(p => p.id));
  };

  const collapseAll = () => {
    setExpandedProcedures([]);
  };

  // Filter procedures
  const filteredProcedures = MOCK_PROCEDURES.filter(procedure => {
    const matchesFilter = activeFilter === 'all' || procedure.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      procedure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedure.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedure.physician.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const totalProcedures = MOCK_PROCEDURES.length;
  const completedProcedures = MOCK_PROCEDURES.filter(p => p.status === 'completed').length;
  const scheduledProcedures = MOCK_PROCEDURES.filter(p => p.status === 'scheduled').length;
  const totalChecklists = MOCK_PROCEDURES.reduce((acc, p) => acc + p.checklists.length, 0);

  return (
    <div className="all-procedures-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-top">
          <Link to={`/patients/${patientId}`} className="back-link">
            <BackArrowIcon />
            <span>Back to Patient</span>
          </Link>
        </div>
        <div className="header-main">
          <div className="header-title-section">
            <h1 className="page-title">Procedures & Checklists</h1>
            <p className="patient-name-subtitle">Patient: {patientName}</p>
          </div>
          <Link to={`/patients/${patientId}`} className="add-procedure-btn">
            + Add Procedure
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-value">{totalProcedures}</div>
          <div className="stat-label">Total Procedures</div>
        </div>
        <div className="stat-card">
          <div className="stat-value completed">{completedProcedures}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value scheduled">{scheduledProcedures}</div>
          <div className="stat-label">Scheduled</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalChecklists}</div>
          <div className="stat-label">Total Checklists</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${activeFilter === 'scheduled' ? 'active' : ''}`}
            onClick={() => setActiveFilter('scheduled')}
          >
            Scheduled
          </button>
          <button
            className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-tab ${activeFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
        <div className="search-and-actions">
          <div className="search-box">
            <svg 
              className="search-icon" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search procedures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="expand-actions">
            <button className="expand-btn" onClick={expandAll}>
              Expand All
            </button>
            <button className="expand-btn" onClick={collapseAll}>
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Procedures List */}
      <div className="procedures-list">
        {filteredProcedures.length === 0 ? (
          <div className="empty-state">
            <p>No procedures found matching your criteria.</p>
          </div>
        ) : (
          filteredProcedures.map((procedure) => (
            <ProcedureCard
              key={procedure.id}
              procedure={procedure}
              isExpanded={expandedProcedures.includes(procedure.id)}
              onToggle={() => toggleProcedure(procedure.id)}
              patientId={patientId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AllProceduresChecklists;