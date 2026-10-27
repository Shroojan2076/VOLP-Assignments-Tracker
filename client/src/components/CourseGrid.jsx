import React from 'react';
import { 
  User, 
  X
} from 'lucide-react';

export default function CourseGrid({ courses = [], assignments = [], selectedCourseId, onSelectCourse }) {
  if (courses.length === 0) return null;

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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            Enrolled Subjects
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Select any subject to filter its specific assignments below
          </p>
        </div>

        {selectedCourseId && (
          <button
            onClick={() => onSelectCourse(null)}
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            id="clear-course-filter-button"
          >
            <span>Clear subject filter</span>
            <X size={12} />
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1rem'
      }}>
        {courses.map(course => {
          const isSelected = selectedCourseId === course.courseId;

          // Compute course assignment counts
          const courseAssignments = assignments.filter(a => a.courseId === course.courseId);
          const pendingCourseCount = courseAssignments.filter(a => !a.submitted).length;
          const submittedCourseCount = courseAssignments.filter(a => a.submitted).length;

          return (
            <div
              key={course.courseId}
              onClick={() => onSelectCourse(isSelected ? null : course.courseId)}
              className="craft-card"
              style={{
                padding: '1.2rem',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-amber)' : 'var(--border-subtle)',
                backgroundColor: isSelected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                boxShadow: isSelected ? '0 0 0 1px var(--accent-amber), var(--shadow-card)' : 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
              id={`course-card-${course.courseId}`}
            >
              <div>
                {/* Header row: Course code badge & status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isSelected ? 'var(--accent-amber)' : 'var(--text-main)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {course.code}
                  </span>

                  {course.active ? (
                    <span className="stamp stamp-sage" style={{ fontSize: '0.65rem' }}>Active</span>
                  ) : (
                    <span className="stamp stamp-muted" style={{ fontSize: '0.65rem' }}>Archived</span>
                  )}
                </div>

                {/* Course Name */}
                <h4 style={{
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  lineHeight: 1.35,
                  marginBottom: '0.45rem',
                  minHeight: '2.5em',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {course.name}
                </h4>

                {/* Faculty Name */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.76rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem'
                }}>
                  <User size={13} style={{ opacity: 0.6 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {course.professor || 'Instructor Assigned'}
                  </span>
                </div>
              </div>

              {/* Footer status summary */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.73rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)'
              }}>
                <div>
                  {courseAssignments.length > 0 ? (
                    <span>
                      <strong style={{ color: pendingCourseCount > 0 ? 'var(--accent-amber)' : 'var(--text-main)' }}>
                        {pendingCourseCount} due
                      </strong>
                      {' • '}
                      {submittedCourseCount} turned in
                    </span>
                  ) : (
                    <span>No active tasks</span>
                  )}
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  color: isSelected ? 'var(--accent-amber)' : 'var(--text-dim)',
                  fontWeight: 600
                }}>
                  {isSelected ? 'Filtered' : 'Filter →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
