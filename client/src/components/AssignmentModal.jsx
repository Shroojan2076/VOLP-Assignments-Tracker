import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  FolderOpen
} from 'lucide-react';

export default function AssignmentModal({ assignment, onClose }) {
  if (!assignment) return null;

  const isOverdue = !assignment.submitted && new Date(assignment.dueDate) < new Date();
  const isGraceActive = !assignment.submitted && isOverdue && assignment.graceDate && new Date(assignment.graceDate) > new Date();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'rgba(13, 18, 31, 0.95)',
          padding: '2rem',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
          id="close-assignment-modal-button"
        >
          <X size={20} />
        </button>

        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className="badge badge-indigo" style={{ fontFamily: 'var(--font-mono)' }}>
            {assignment.courseCode || `Course #${assignment.courseId}`}
          </span>
          <span className={`badge ${
            assignment.submitted 
              ? 'badge-emerald' 
              : isGraceActive 
                ? 'badge-amber' 
                : isOverdue 
                  ? 'badge-rose' 
                  : 'badge-cyan'
          }`}>
            {assignment.submitted 
              ? 'Submitted' 
              : isGraceActive 
                ? 'Grace Period Active' 
                : isOverdue 
                  ? 'Overdue' 
                  : 'Action Required'}
          </span>
          {assignment.evaluated && (
            <span className="badge badge-emerald">
              Graded: {assignment.score} / {assignment.marks}
            </span>
          )}
        </div>

        {/* Assignment ID & Title */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
          Assignment Reference ID: <span style={{ fontFamily: 'var(--font-mono)', color: '#a5b4fc' }}>#{assignment.assignmentId}</span>
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', lineHeight: 1.3 }}>
          {assignment.courseName ? `${assignment.courseName} - Subjective Assessment` : 'Subjective Assignment Details'}
        </h3>

        {/* Question Text Box */}
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-primary)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Problem Statement / Question
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {assignment.question || 'No description provided by professor.'}
          </div>
        </div>

        {/* Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* Due Date */}
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <Calendar size={13} />
              <span>Official Deadline</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
              {assignment.dueDate ? new Date(assignment.dueDate).toLocaleString() : 'Not Set'}
            </div>
          </div>

          {/* Grace Date */}
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <Clock size={13} />
              <span>Grace Date Limit</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isGraceActive ? '#fbbf24' : '#fff' }}>
              {assignment.graceDate ? new Date(assignment.graceDate).toLocaleString() : 'No Grace Window'}
            </div>
          </div>

          {/* Marks */}
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <Award size={13} />
              <span>Maximum Marks</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
              {assignment.marks} Points
            </div>
          </div>

          {/* Score */}
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={13} />
              <span>Evaluation Status</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: assignment.evaluated ? '#34d399' : 'var(--text-muted)' }}>
              {assignment.evaluated ? `Awarded ${assignment.score} pts` : 'Awaiting Grading'}
            </div>
          </div>
        </div>

        {/* Submission Details if submitted */}
        {assignment.submitted && (
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <FileCheck size={16} />
              <span>Submitted Artifact</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#fff', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>
              {assignment.submissionFile || 'File submitted directly to VOLP Portal'}
            </div>
            {assignment.submissionPath && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                Path: {assignment.submissionPath}
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            id="modal-close-action-button"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
