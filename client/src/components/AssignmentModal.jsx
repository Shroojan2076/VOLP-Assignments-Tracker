import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Award, 
  CheckCircle2, 
  FileText
} from 'lucide-react';

function formatModalDate(dateStr) {
  if (!dateStr) return 'Not set by instructor';
  const d = new Date(dateStr);
  return d.toLocaleDateString([], { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }) + ' at ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function AssignmentModal({ assignment, onClose }) {
  if (!assignment) return null;

  const now = new Date();
  const isOverdue = !assignment.submitted && assignment.dueDate && new Date(assignment.dueDate) < now;
  const isGraceActive = !assignment.submitted && isOverdue && assignment.graceDate && new Date(assignment.graceDate) > now;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.72)',
      backdropFilter: 'blur(8px)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }}>
      <div 
        className="craft-card"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '88vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface)',
          padding: '2rem',
          position: 'relative',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-elevated)'
        }}
      >
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
            padding: '0.35rem',
            borderRadius: 'var(--radius-xs)',
            transition: 'color 0.15s ease'
          }}
          title="Close sheet"
          id="close-assignment-modal-button"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--text-main)',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            padding: '0.15rem 0.45rem',
            borderRadius: 'var(--radius-xs)',
            border: '1px solid var(--border-subtle)'
          }}>
            {assignment.courseCode || `Course #${assignment.courseId}`}
          </span>

          <span className={`stamp ${
            assignment.submitted 
              ? 'stamp-sage' 
              : isGraceActive 
                ? 'stamp-amber' 
                : isOverdue 
                  ? 'stamp-terracotta' 
                  : 'stamp-sky'
          }`}>
            {assignment.submitted 
              ? '✓ Turned In' 
              : isGraceActive 
                ? 'Grace Window Active' 
                : isOverdue 
                  ? 'Past Official Deadline' 
                  : 'Action Needed'}
          </span>

          {assignment.evaluated && (
            <span className="stamp stamp-sage">
              Graded: {assignment.score} / {assignment.marks}
            </span>
          )}
        </div>

        <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>
          Reference #{assignment.assignmentId}
        </div>
        <h3 className="font-serif" style={{ fontSize: '1.45rem', fontWeight: 400, color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: 1.3 }}>
          {assignment.courseName ? assignment.courseName : 'Subjective Coursework Dossier'}
        </h3>

        <div style={{
          backgroundColor: 'var(--bg-inset)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          color: 'var(--text-main)'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
            Problem Statement / Prompt
          </div>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {assignment.question || 'No question description was provided by the professor.'}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.73rem', marginBottom: '0.25rem' }}>
              <Calendar size={13} />
              <span>Official Due Date</span>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {formatModalDate(assignment.dueDate)}
            </div>
          </div>

          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.73rem', marginBottom: '0.25rem' }}>
              <Clock size={13} />
              <span>Grace Period Cutoff</span>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: isGraceActive ? 'var(--accent-amber)' : 'var(--text-main)' }}>
              {formatModalDate(assignment.graceDate)}
            </div>
          </div>

          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.73rem', marginBottom: '0.25rem' }}>
              <Award size={13} />
              <span>Assigned Weightage</span>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {assignment.marks} Points
            </div>
          </div>

          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.73rem', marginBottom: '0.25rem' }}>
              <CheckCircle2 size={13} />
              <span>Faculty Evaluation</span>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: assignment.evaluated ? '#4ade80' : 'var(--text-muted)' }}>
              {assignment.evaluated ? `Awarded ${assignment.score} / ${assignment.marks} pts` : 'Awaiting instructor evaluation'}
            </div>
          </div>
        </div>

        {assignment.submitted && (
          <div style={{
            padding: '0.9rem 1.1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-sage-soft)',
            border: '1px solid rgba(52, 168, 83, 0.3)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
              <FileText size={15} />
              <span>Submitted Assignment File</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>
              {assignment.submissionFile || 'File uploaded directly to classroom.volp.in'}
            </div>
            {assignment.submissionPath && (
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                Path: {assignment.submissionPath}
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            id="modal-close-action-button"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
}
