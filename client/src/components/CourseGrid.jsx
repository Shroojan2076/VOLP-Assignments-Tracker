import React from 'react';
import { 
  BookOpen, 
  UserCheck, 
  CheckCircle2, 
  ExternalLink,
  Filter
} from 'lucide-react';

export default function CourseGrid({ courses = [], selectedCourseId, onSelectCourse }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
            Enrolled Academic Courses
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Synchronized directly from VOLP Classroom Learner Dashboard
          </p>
        </div>

        {selectedCourseId && (
          <button
            onClick={() => onSelectCourse(null)}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            id="clear-course-filter-button"
          >
            <span>Showing filtered course • Click to show all</span>
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.25rem'
      }}>
        {courses.map(course => {
          const isSelected = selectedCourseId === course.courseId;
          const progressVal = Number(course.progress) || 0;

          return (
            <div
              key={course.courseId}
              onClick={() => onSelectCourse(isSelected ? null : course.courseId)}
              className="glass-panel"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'var(--shadow-card)',
                backgroundColor: isSelected ? 'rgba(25, 36, 64, 0.85)' : 'var(--bg-card)'
              }}
              id={`course-card-${course.courseId}`}
            >
              {/* Header tags */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <span className="badge badge-indigo" style={{ fontFamily: 'var(--font-mono)' }}>
                  {course.code}
                </span>
                <span className={`badge ${course.active ? 'badge-emerald' : 'badge-amber'}`}>
                  {course.active ? 'Active' : 'Archived'}
                </span>
              </div>

              {/* Title & Professor */}
              <h4 style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '0.4rem',
                lineHeight: 1.3,
                minHeight: '2.6em',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {course.name}
              </h4>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem'
              }}>
                <UserCheck size={14} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {course.professor || 'Instructor Assigned'}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Syllabus Progress</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{progressVal}%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressVal}%`,
                    height: '100%',
                    background: progressVal >= 80 
                      ? 'linear-gradient(90deg, #6366f1, #10b981)' 
                      : 'linear-gradient(90deg, #6366f1, #06b6d4)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              {/* Footer action */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.74rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'
              }}>
                <span>Course ID: {course.courseId}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                  {isSelected ? 'Filtering Active' : 'View Assignments'} &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
