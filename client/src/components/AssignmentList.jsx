import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Filter,
  Check,
  FileCheck
} from 'lucide-react';
import AssignmentModal from './AssignmentModal';

export default function AssignmentList({ assignments = [], selectedCourseId }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectAssignment, setInspectAssignment] = useState(null);

  // Filter logic
  const filtered = assignments.filter(item => {
    // Match course selection if any
    if (selectedCourseId && item.courseId !== selectedCourseId) {
      return false;
    }

    // Match status tab
    const now = new Date();
    const isOverdue = !item.submitted && item.dueDate && new Date(item.dueDate) < now;
    const isGrace = !item.submitted && isOverdue && item.graceDate && new Date(item.graceDate) > now;

    if (activeFilter === 'pending' && item.submitted) return false;
    if (activeFilter === 'submitted' && !item.submitted) return false;
    if (activeFilter === 'graded' && !item.evaluated) return false;
    if (activeFilter === 'overdue' && (!isOverdue || item.submitted)) return false;

    // Search query
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
      return { label: 'Submitted', type: 'emerald', icon: CheckCircle2 };
    }

    if (!item.dueDate) {
      return { label: 'No Deadline', type: 'indigo', icon: Calendar };
    }

    const now = new Date();
    const due = new Date(item.dueDate);
    const grace = item.graceDate ? new Date(item.graceDate) : null;

    if (now > due) {
      if (grace && now < grace) {
        const hoursLeft = Math.ceil((grace - now) / (1000 * 60 * 60));
        return { label: `Grace: ${hoursLeft}h left`, type: 'amber', icon: Clock };
      }
      return { label: 'Overdue', type: 'rose', icon: AlertCircle };
    }

    const diffHours = (due - now) / (1000 * 60 * 60);
    if (diffHours <= 24) {
      return { label: `Due in ${Math.ceil(diffHours)}h`, type: 'amber', icon: Clock };
    }

    const daysLeft = Math.ceil(diffHours / 24);
    return { label: `Due in ${daysLeft} days`, type: 'cyan', icon: Calendar };
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Subjective Assignments Hub
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Track submissions, due dates, grace windows, and evaluation marks
          </p>
        </div>

        {/* Search Input */}
        <div style={{
          position: 'relative',
          minWidth: '240px',
          maxWidth: '320px',
          width: '100%'
        }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.82rem', padding: '0.55rem 0.75rem 0.55rem 2.4rem' }}
            placeholder="Search assignments or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-assignments-input"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1.25rem'
      }}>
        {[
          { id: 'all', label: 'All Tasks', count: assignments.length },
          { id: 'pending', label: 'Pending', count: assignments.filter(a => !a.submitted).length },
          { id: 'submitted', label: 'Submitted', count: assignments.filter(a => a.submitted).length },
          { id: 'graded', label: 'Graded', count: assignments.filter(a => a.evaluated).length },
          { id: 'overdue', label: 'Overdue / Grace', count: assignments.filter(a => !a.submitted && new Date(a.dueDate) < new Date()).length }
        ].map(tab => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isActive ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-subtle)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              id={`filter-tab-${tab.id}`}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.7rem',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                padding: '0.05rem 0.4rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Assignment List Grid */}
      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
          <CheckCircle2 size={36} style={{ color: 'var(--accent-emerald)', margin: '0 auto 0.75rem auto' }} />
          <h4 style={{ fontSize: '1rem', color: '#fff', fontWeight: 600, marginBottom: '0.3rem' }}>
            No Assignments Found
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            There are no assignments matching the current search criteria or filter.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map(item => {
            const status = getDueStatus(item);
            const StatusIcon = status.icon;

            return (
              <div
                key={item.assignmentId}
                className="glass-panel"
                style={{
                  padding: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
                id={`assignment-card-${item.assignmentId}`}
              >
                {/* Left: Course Code, Status, Question Excerpt */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-indigo" style={{ fontFamily: 'var(--font-mono)' }}>
                      {item.courseCode || `Course #${item.courseId}`}
                    </span>
                    <span className={`badge badge-${status.type}`}>
                      <StatusIcon size={12} />
                      <span>{status.label}</span>
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      ID: #{item.assignmentId}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.88rem',
                    color: '#fff',
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

                {/* Right: Deadlines, Marks, Action */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  {/* Deadline info */}
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Due Date (24-Hour Format)
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString() + ' ' + new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Flexible'}
                    </div>
                  </div>

                  {/* Marks / Evaluation */}
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      Weightage / Score
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: item.evaluated ? '#34d399' : '#fff' }}>
                      {item.evaluated ? `${item.score} / ${item.marks} pts` : `${item.marks} pts`}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => setInspectAssignment(item)}
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                    id={`view-assignment-btn-${item.assignmentId}`}
                  >
                    <span>View Task</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      {inspectAssignment && (
        <AssignmentModal
          assignment={inspectAssignment}
          onClose={() => setInspectAssignment(null)}
        />
      )}
    </div>
  );
}
