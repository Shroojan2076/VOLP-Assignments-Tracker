import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award 
} from 'lucide-react';

export default function StatsOverview({ courses = [], assignments = [] }) {
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.active).length;

  const totalAssignments = assignments.length;
  const submittedCount = assignments.filter(a => a.submitted).length;
  const pendingCount = assignments.filter(a => !a.submitted).length;
  const evaluatedCount = assignments.filter(a => a.evaluated).length;

  const scoredAssignments = assignments.filter(a => a.evaluated && a.score !== null && a.marks > 0);
  const avgScorePct = scoredAssignments.length > 0
    ? (scoredAssignments.reduce((acc, curr) => acc + (curr.score / curr.marks) * 100, 0) / scoredAssignments.length).toFixed(1)
    : null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      <div className="craft-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Assignments Due
          </span>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: pendingCount > 0 ? 'var(--accent-amber-glow)' : 'rgba(255, 255, 255, 0.04)',
            color: pendingCount > 0 ? 'var(--accent-amber)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={15} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: pendingCount > 0 ? 'var(--accent-amber)' : 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {pendingCount}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            of {totalAssignments} total
          </span>
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          {pendingCount === 0 ? '✨ All caught up for now' : 'Awaiting submission'}
        </div>
      </div>

      <div className="craft-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Turned In
          </span>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'var(--accent-sage-soft)',
            color: '#4ade80',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={15} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {submittedCount}
          </span>
          {totalAssignments > 0 && (
            <span className="stamp stamp-sage" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
              {Math.round((submittedCount / totalAssignments) * 100)}% done
            </span>
          )}
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          {evaluatedCount} evaluated by faculty
        </div>
      </div>

      <div className="craft-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Average Evaluation
          </span>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'var(--accent-sky-soft)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={15} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {avgScorePct ? `${avgScorePct}%` : '—'}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {avgScorePct ? 'Score average' : 'Awaiting grades'}
          </span>
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Across {scoredAssignments.length} graded assignments
        </div>
      </div>

      <div className="craft-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Enrolled Subjects
          </span>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={15} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {totalCourses}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            ({activeCourses} active)
          </span>
        </div>
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Active semester curriculum
        </div>
      </div>
    </div>
  );
}
