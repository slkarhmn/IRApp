import { useState } from 'react';
import './AddChecklistDropdown.css';
import { AiOutlinePlus } from "react-icons/ai";

interface AddChecklistDropdownProps {
  procedureId: number | string;
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

// SVG Icon Components - Professional medical-themed icons
const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const AddChecklistDropdown: React.FC<AddChecklistDropdownProps> = ({ onSelectOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    onSelectOption(option);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, option: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(option);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="dropdown-container">
      <div
        className="add-checklist-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Add checklist"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className="plus-icon"><AiOutlinePlus size={22} /></span>
      </div>

      {isOpen && (
        <>
          <div 
            className="dropdown-overlay" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="dropdown-menu" 
            role="menu"
            aria-label="Checklist options"
          >
            <div className="dropdown-header">
              <p className="dropdown-header-title">Add Checklist</p>
            </div>
            
            <div className="dropdown-items">
              <button
                className="dropdown-item"
                onClick={() => handleOptionClick('planning')}
                onKeyDown={(e) => handleKeyDown(e, 'planning')}
                role="menuitem"
              >
                <span className="item-icon item-icon--planning">
                  <ClipboardIcon />
                </span>
                <span className="item-content">
                  <span className="item-title">Pre-Procedural Planning</span>
                  <span className="item-description">Review and preparation checklist</span>
                </span>
                <span className="item-arrow">
                  <ChevronRightIcon />
                </span>
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item"
                onClick={() => handleOptionClick('signin')}
                onKeyDown={(e) => handleKeyDown(e, 'signin')}
                role="menuitem"
              >
                <span className="item-icon item-icon--signin">
                  <CheckCircleIcon />
                </span>
                <span className="item-content">
                  <span className="item-title">Sign In</span>
                  <span className="item-description">Patient verification and safety checks</span>
                </span>
                <span className="item-arrow">
                  <ChevronRightIcon />
                </span>
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item"
                onClick={() => handleOptionClick('signout')}
                onKeyDown={(e) => handleKeyDown(e, 'signout')}
                role="menuitem"
              >
                <span className="item-icon item-icon--signout">
                  <LogOutIcon />
                </span>
                <span className="item-content">
                  <span className="item-title">Sign Out</span>
                  <span className="item-description">Post-procedure documentation</span>
                </span>
                <span className="item-arrow">
                  <ChevronRightIcon />
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};