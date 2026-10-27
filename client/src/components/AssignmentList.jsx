import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight
} from 'lucide-react';
import AssignmentModal from './AssignmentModal';

function formatHumanDeadline(dueDateStr) {
  if (!dueDateStr) return 'No due date set';
  const now = new Date();
  const due = new Date(dueDateStr);
  
  const timeStr = due.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  
  // Calculate day difference
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.round((startOfDueDate - startOfToday) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return `Today at ${timeStr}`;
  if (diffDays === 1) return `Tomorrow at ${timeStr}`;
  if (diffDays === -1) return `Yesterday at ${timeStr}`;
  if (diffDays > 1 && diffDays < 7) {
    const weekday = due.toLocaleDateString([], { weekday: 'long' });
    return `${weekday} at ${timeStr}`;
  }
  return due.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) + ` (${timeStr})`;
}

export default function AssignmentList({ assignments = [], selectedCourseId, onSelectAssignment }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalModalAssignment, setInternalModalAssignment] = useState(null);

  const handleOpenAssignment = (item) => {
    if (onSelectAssignment) {
      onSelectAssignment(item);
    } else {
      setInternalModalAssignment(item);
    }
  };

  // Filter logic
  const filtered = assignments.filter(item => {
    if (selectedCourseId && item.courseId !== selectedCourseId) {
      return false;
    }

    const now = new Date();
    const isOverdue = !item.submitted && item.dueDate && new Date(item.dueDate) < now;

    if (activeFilter === 'pending' && item.submitted) return false;
    if (activeFilter === 'submitted' && !item.submitted) return false;
    if (activeFilter === 'graded' && !item.evaluated) return false;
    if (activeFilter === 'overdue' && (!isOverdue || item.submitted)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchQuestion = item.question?.toLowerCase().includes(q);
      const matchCourse = item.courseCode?.toLowerCase().includes(q) || item.courseName?.toLowerCase().includes(q);
      const matchId = String(item.assignmentId).includes(q);
      return matchQuestion || matchCourse || matchId;
    }

    return true;
  });

  const getDueStatus = (item) => {
    if (item.submitted) {
      return { 
        label: 'Turned In', 
        stampClass: 'stamp-sage', 
        icon: CheckCircle2 
      };
    }

    if (!item.dueDate) {
      return { 
        label: 'Open Task', 
        stampClass: 'stamp-muted', 
        icon: Calendar 
      };
    }

    const now = new Date();
    const due = new Date(item.dueDate);
    const grace = item.graceDate ? new Date(item.graceDate) : null;

    if (now > due) {
      if (grace && now < grace) {
        const hoursLeft = Math.ceil((grace - now) / (1000 * 60 * 60));
        return { 
          label: `Grace Window (${hoursLeft}h left)`, 
          stampClass: 'stamp-amber', 
          icon: Clock 
        };
      }
      return { 
        label: 'Past Due Date', 
        stampClass: 'stamp-terracotta', 
        icon: AlertCircle 
      };
    }

    const diffHours = (due - now) / (1000 * 60 * 60);
    if (diffHours <= 24) {
      return { 
        label: `Due in ${Math.max(1, Math.ceil(diffHours))}h`, 
        stampClass: 'stamp-amber', 
        icon: Clock 
      };
    }

    const daysLeft = Math.ceil(diffHours / 24);
    if (daysLeft === 1) {
      return { 
        label: 'Due Tomorrow', 
        stampClass: 'stamp-amber', 
        icon: Clock 
      };
    }

    return { 
      label: `Due in ${daysLeft} days`, 
      stampClass: 'stamp-sky', 
      icon: Calendar 
    };
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            Coursework Tracker
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Review pending assignments, submission deadlines, and professor evaluations
          </p>
        </div>

        {/* Search Input */}
        <div style={{
          position: 'relative',
          minWidth: '240px',
          maxWidth: '300px',
          width: '100%'
        }}>
          <Search size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.3rem', fontSize: '0.82rem', padding: '0.5rem 0.75rem 0.5rem 2.3rem' }}
            placeholder="Search questions, topics, or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-assignments-input"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        overflowX: 'auto',
        paddingBottom: '0.4rem',
        marginBottom: '1.25rem'
      }}>
        {[
          { id: 'all', label: 'All Assignments', count: assignments.length },
          { id: 'pending', label: 'Needs Action', count: assignments.filter(a => !a.submitted).length },
          { id: 'submitted', label: 'Turned In', count: assignments.filter(a => a.submitted).length },
          { id: 'graded', label: 'Graded', count: assignments.filter(a => a.evaluated).length },
          { id: 'overdue', label: 'Past Deadline', count: assignments.filter(a => !a.submitted && new Date(a.dueDate) < new Date()).length }
        ].map(tab => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isActive ? 'var(--text-main)' : 'rgba(255, 255, 255, 0.03)',
                color: isActive ? 'var(--bg-inset)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: isActive ? 'var(--text-main)' : 'var(--border-subtle)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit'
              }}
              id={`filter-tab-${tab.id}`}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.68rem',
                backgroundColor: isActive ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                padding: '0.05rem 0.35rem',
                borderRadius: 'var(--radius-xs)'
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Assignment List */}
      {filtered.length === 0 ? (
        <div className="craft-card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <CheckCircle2 size={32} style={{ color: 'var(--accent-amber)', margin: '0 auto 0.75rem auto', opacity: 0.8 }} />
          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.25rem' }}>
            No coursework matches this filter
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Try adjusting your search terms or selecting another status tab above.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(item => {
            const status = getDueStatus(item);
            const StatusIcon = status.icon;

            return (
              <div
                key={item.assignmentId}
                onClick={() => handleOpenAssignment(item)}
                className="craft-card"
                style={{
                  padding: '1.2rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                id={`assignment-card-${item.assignmentId}`}
              >
                {/* Left: Course tag, status badge, Question excerpt */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      {item.courseCode || `Course #${item.courseId}`}
                    </span>

                    <span className={`stamp ${status.stampClass}`}>
                      <StatusIcon size={12} />
                      <span>{status.label}</span>
                    </span>

                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      #{item.assignmentId}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                    fontWeight: 500,
                    lineHeight: 1.45,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.question}
                  </p>
                </div>

                {/* Right: Human Deadline, Evaluation / Weightage, Action button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  {/* Deadline info */}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.15rem' }}>
                      Target Deadline
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      {formatHumanDeadline(item.dueDate)}
                    </div>
                  </div>

                  {/* Marks / Evaluation */}
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '0.15rem' }}>
                      Evaluation
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: item.evaluated ? '#4ade80' : 'var(--text-main)' }}>
                      {item.evaluated ? `${item.score} / ${item.marks} pts` : `${item.marks || 0} pts`}
                    </div>
                  </div>

                  {/* Open Dossier button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAssignment(item);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    id={`view-assignment-btn-${item.assignmentId}`}
                  >
                    <span>Details</span>
                    <ArrowUpRight size={13} style={{ opacity: 0.7 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Internal Modal fallback if not passed from parent */}
      {internalModalAssignment && (
        <AssignmentModal
          assignment={internalModalAssignment}
          onClose={() => setInternalModalAssignment(null)}
        />
      )}
    </div>
  );
}
