import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCourses, getAssignments } from '../services/api';
import StatsOverview from './StatsOverview';
import CourseGrid from './CourseGrid';
import AssignmentList from './AssignmentList';
import { 
  RefreshCw, 
  ExternalLink, 
  Sparkles,
  Calendar,
  Layers,
  Database
} from 'lucide-react';

export default function DashboardView() {
  const { user, isDemoMode, syncState, syncNow } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [coursesRes, assignmentsRes] = await Promise.all([
      getCourses(user?.email),
      getAssignments(user?.email)
    ]);
    setCourses(coursesRes.data || []);
    setAssignments(assignmentsRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user, syncState.lastSynced]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Welcome, {user?.firstName || 'Student'}!
            </h2>
            {isDemoMode && (
              <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                <Sparkles size={11} /> Sandbox Preview
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            College ID: <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{user?.email}</span> • Synchronized with Neon PostgreSQL
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={loadData}
            disabled={loading}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem' }}
            title="Reload local data"
            id="reload-dashboard-data-button"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>Reload Views</span>
          </button>

          <a
            href="https://classroom.volp.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.9rem', textDecoration: 'none' }}
          >
            <span>Open VOLP Portal</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Metric Cards */}
      <StatsOverview courses={courses} assignments={assignments} />

      {/* Empty State Action when 0 courses are in database */}
      {courses.length === 0 && !loading && (
        <div className="glass-panel" style={{
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
          border: '1px dashed var(--border-glow)',
          backgroundColor: 'rgba(15, 23, 42, 0.45)'
        }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700, marginBottom: '0.4rem' }}>
            No Synchronized Courses Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
            Your account is authenticated, but your database portfolio has not populated courses or assignments yet.
          </p>
          <button
            onClick={syncNow}
            disabled={syncState.isSyncing}
            className="btn-primary"
            style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}
            id="empty-state-sync-button"
          >
            <RefreshCw size={14} className={syncState.isSyncing ? 'animate-spin' : ''} />
            <span>{syncState.isSyncing ? 'Syncing Portfolio...' : 'Sync Now with VOLP'}</span>
          </button>
        </div>
      )}

      {/* Courses Explorer */}
      <CourseGrid
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
      />

      {/* Assignments Hub */}
      <AssignmentList
        assignments={assignments}
        selectedCourseId={selectedCourseId}
      />
    </div>
  );
}
