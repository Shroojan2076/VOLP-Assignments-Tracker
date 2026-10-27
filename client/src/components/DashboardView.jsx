import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCourses, getAssignments } from '../services/api';
import StatsOverview from './StatsOverview';
import CourseGrid from './CourseGrid';
import AssignmentList from './AssignmentList';
import AssignmentModal from './AssignmentModal';
import { 
  ExternalLink, 
  CalendarCheck
} from 'lucide-react';

function getGreeting(name) {
  const hour = new Date().getHours();
  const firstName = name ? name.split(' ')[0] : 'there';
  if (hour < 12) return `Good morning, ${firstName}.`;
  if (hour < 17) return `Good afternoon, ${firstName}.`;
  return `Good evening, ${firstName}.`;
}

export default function DashboardView() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModalAssignment, setActiveModalAssignment] = useState(null);

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
  }, [user]);

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Human Masthead Greeting */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div>
          <h2 className="font-serif" style={{
            fontSize: '2.2rem',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
            lineHeight: 1.2,
            marginBottom: '0.35rem'
          }}>
            {getGreeting(user?.firstName)}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Student Desk for </span>
            <span style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
              {user?.email}
            </span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="https://classroom.volp.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.5rem 0.95rem', textDecoration: 'none' }}
          >
            <span>Open VOLP Classroom</span>
            <ExternalLink size={13} style={{ opacity: 0.7 }} />
          </a>
        </div>
      </div>

      {/* Stats Summary Bulletin */}
      <StatsOverview courses={courses} assignments={assignments} />

      {/* Empty State when no courses have synced yet */}
      {courses.length === 0 && !loading && (
        <div className="craft-card" style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          marginBottom: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)'
        }}>
          <CalendarCheck size={36} style={{ color: 'var(--accent-amber)', margin: '0 auto 0.85rem auto', opacity: 0.8 }} />
          <h3 className="font-serif" style={{ fontSize: '1.4rem', color: 'var(--text-main)', fontWeight: 400, marginBottom: '0.4rem' }}>
            Your coursework desk is ready.
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
            Your student account is connected. As soon as the daily portal sync runs, your enrolled subjects and subjective assignments will automatically populate here.
          </p>
        </div>
      )}

      {/* Courses Explorer */}
      <CourseGrid
        courses={courses}
        assignments={assignments}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
      />

      {/* Assignments Hub */}
      <AssignmentList
        assignments={assignments}
        selectedCourseId={selectedCourseId}
        onSelectAssignment={setActiveModalAssignment}
      />

      {/* Assignment Modal if opened */}
      {activeModalAssignment && (
        <AssignmentModal
          assignment={activeModalAssignment}
          onClose={() => setActiveModalAssignment(null)}
        />
      )}
    </div>
  );
}
