/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ChecklistView.css';
// @ts-expect-error fuck ts
import { checklistService } from "../../services/checklists";
// @ts-expect-error fuck ts
import { procedureService } from "../../services/procedures";
// @ts-expect-error fuck ts
import { patientService } from "../../services/patientService";

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
            {procedure.checklists.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                No checklists added yet
              </div>
            ) : (
              procedure.checklists.map((checklist) => (
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
                    to={`/patients/${patientId}/view-procedure/${procedure.id}`}
                    className="view-details-link"
                  >
                    View Details →
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Filter tabs
type FilterTab = 'all' | 'scheduled' | 'ready' | 'completed' | 'cancelled';

// Main component
export const AllProceduresChecklists: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const patientId = id || '1';
  
  const [expandedProcedures, setExpandedProcedures] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [patientData, setPatientData] = useState<any>(null);

  // Fetch checklist for a procedure
  const fetchChecklistForProcedure = async (procedureId: number) => {
    try {
      const [planningResponse, signInResponse, signOutResponse] = await Promise.all([
        checklistService.getProcedurePlanningByProcedure(procedureId).catch(() => ({ data: null })),
        checklistService.getSignInByProcedure(procedureId).catch(() => ({ data: null })),
        checklistService.getSignOutByProcedure(procedureId).catch(() => ({ data: null }))
      ]);

      const checklists: Checklist[] = [];

      if (planningResponse.data) {
        const planning = planningResponse.data;
        const booleanFields = Object.entries(planning).filter(([key, value]) => 
          typeof value === 'boolean' && key !== 'id' && key !== 'patient_procedure_id'
        );
        const totalItems = booleanFields.length;
        const completedItems = booleanFields.filter(([_, value]) => value === true).length;
        
        const items = [
          planning.discussed_with_referring_physician && 'Discussed with referring physician',
          planning.imaging_studies_reviewed && 'Imaging studies reviewed',
          planning.informed_consent && 'Informed consent obtained',
          planning.prophylaxis && 'Prophylaxis administered'
        ].filter(Boolean) as string[];

        checklists.push({
          id: `planning-${planning.id}`,
          type: 'planning',
          name: 'Pre-Procedural Planning',
          date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          completedItems,
          totalItems,
          items: items.slice(0, 4)
        });
      }

      if (signInResponse.data) {
        const signIn = signInResponse.data;
        const booleanFields = Object.entries(signIn).filter(([key, value]) => 
          typeof value === 'boolean' && key !== 'id' && key !== 'patient_procedure_id'
        );
        const totalItems = booleanFields.length;
        const completedItems = booleanFields.filter(([_, value]) => value === true).length;
        
        const items = [
          signIn.correct_patient && 'Correct patient verified',
          signIn.correct_site && 'Correct site verified',
          signIn.allergies_checked && 'Allergies checked',
          signIn.consent_obtained && 'Consent obtained'
        ].filter(Boolean) as string[];

        checklists.push({
          id: `signin-${signIn.id}`,
          type: 'signin',
          name: 'Sign In',
          date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          completedItems,
          totalItems,
          items: items.slice(0, 4)
        });
      }

      if (signOutResponse.data) {
        const signOut = signOutResponse.data;
        const booleanFields = Object.entries(signOut).filter(([key, value]) => 
          typeof value === 'boolean' && key !== 'id' && key !== 'patient_procedure_id'
        );
        const totalItems = booleanFields.length;
        const completedItems = booleanFields.filter(([_, value]) => value === true).length;
        
        const items = [
          signOut.vital_signs_normal && 'Vital signs normal',
          signOut.samples_labelled && 'Samples labelled',
          signOut.follow_up_appt_made && 'Follow-up appointment made',
          signOut.procedure_results_communicated_to_referring_physician && 'Results communicated to physician'
        ].filter(Boolean) as string[];

        checklists.push({
          id: `signout-${signOut.id}`,
          type: 'signout',
          name: 'Sign Out',
          date: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          completedItems,
          totalItems,
          items: items.slice(0, 4)
        });
      }

      return checklists;
    } catch (error) {
      console.log('error fetching checklist for procedure', error);
      return [];
    }
  };

  // Fetch procedures for patient
  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;
      
      try {
        // Fetch patient data
        const patientResponse = await patientService.getPatient(patientId);
        setPatientData(patientResponse.data);

        // Fetch patient procedures
        const patientProcsResponse = await procedureService.getAllPatientProceduresForPatient(patientId);
        
        const transformedProcedures = await Promise.all(
          patientProcsResponse.data.map(async (proc: any) => {
            try {
              const procedureDetails = await procedureService.getProcedureByID(proc.procedure_id);
              const checklists = await fetchChecklistForProcedure(proc.id);
              
              return {
                id: proc.id,
                date: new Date(proc.scheduled_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }),
                name: procedureDetails.data.procedure_name,
                code: procedureDetails.data.procedure_code,
                physician: proc.physician,
                status: proc.status.toLowerCase() as 'scheduled' | 'ready' | 'completed' | 'cancelled',
                checklists: checklists
              };
            } catch (error) {
              console.error(`Error fetching procedure details for ID ${proc.procedure_id}:`, error);
              return {
                id: proc.id,
                date: new Date(proc.scheduled_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }),
                name: 'Unknown Procedure',
                code: 'N/A',
                physician: proc.physician,
                status: proc.status.toLowerCase() as 'scheduled' | 'ready' | 'completed' | 'cancelled',
                checklists: []
              };
            }
          })
        );
        
        setProcedures(transformedProcedures);
        
        if (transformedProcedures.length > 0) {
          setExpandedProcedures([transformedProcedures[0].id]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching procedures:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const toggleProcedure = (procedureId: number) => {
    setExpandedProcedures(prev =>
      prev.includes(procedureId)
        ? prev.filter(id => id !== procedureId)
        : [...prev, procedureId]
    );
  };

  const expandAll = () => {
    setExpandedProcedures(procedures.map(p => p.id));
  };

  const collapseAll = () => {
    setExpandedProcedures([]);
  };

  // Filter procedures
  const filteredProcedures = procedures.filter(procedure => {
    const matchesFilter = activeFilter === 'all' || procedure.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      procedure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedure.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      procedure.physician.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const totalProcedures = procedures.length;
  const completedProcedures = procedures.filter(p => p.status === 'completed').length;
  const scheduledProcedures = procedures.filter(p => p.status === 'scheduled').length;
  const totalChecklists = procedures.reduce((acc, p) => acc + p.checklists.length, 0);

  if (loading) {
    return (
      <div className="all-procedures-page">
        <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
          Loading...
        </div>
      </div>
    );
  }

  const patientName = patientData 
    ? `${patientData.first_name} ${patientData.last_name}`
    : 'Unknown Patient';

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
            className={`filter-tab ${activeFilter === 'ready' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ready')}
          >
            Ready
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