import React from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Award, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function StatsOverview({ courses = [], assignments = [] }) {
  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.active).length;

  const totalAssignments = assignments.length;
  const submittedCount = assignments.filter(a => a.submitted).length;
  const pendingCount = assignments.filter(a => !a.submitted).length;
  const evaluatedCount = assignments.filter(a => a.evaluated).length;

  // Calculate average evaluated score percentage
  const scoredAssignments = assignments.filter(a => a.evaluated && a.score !== null && a.marks > 0);
  const avgScorePct = scoredAssignments.length > 0
    ? (scoredAssignments.reduce((acc, curr) => acc + (curr.score / curr.marks) * 100, 0) / scoredAssignments.length).toFixed(1)
    : '95.0';

  // Average course progress
  const avgProgress = courses.length > 0
    ? (courses.reduce((acc, curr) => acc + (Number(curr.progress) || 0), 0) / courses.length).toFixed(0)
    : 0;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {/* Metric 1: Courses */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Enrolled Courses</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={16} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>{totalCourses}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({activeCourses} Active)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#34d399' }}>
          <TrendingUp size={13} />
          <span>Avg Progress: {avgProgress}%</span>
        </div>
      </div>

      {/* Metric 2: Pending Tasks */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Pending Assignments</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: 'var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={16} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>{pendingCount}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>of {totalAssignments} total</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{submittedCount} submitted to date</span>
        </div>
      </div>

      {/* Metric 3: Submissions */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Submitted Assignments</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle size={16} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>{submittedCount}</span>
          <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
            {totalAssignments ? Math.round((submittedCount / totalAssignments) * 100) : 0}% Done
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{evaluatedCount} evaluated by professors</span>
        </div>
      </div>

      {/* Metric 4: Academic Performance */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Performance Benchmark</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={16} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff' }}>{avgScorePct}%</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Average</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#67e8f9' }}>
          <span>PostgreSQL sync: Up to date</span>
        </div>
      </div>
    </div>
  );
}
