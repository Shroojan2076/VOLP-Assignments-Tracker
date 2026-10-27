import pool from './database.js';

export async function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    console.log('Verifying or creating "users" table...');
    await pool.query(createTableQuery);
    console.log('"users" table created or verified successfully.');
  } catch (error) {
    console.error('Failed to create users table:', error.message);
    throw error;
  }
}

export async function createCoursesTables() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      course_id INT NOT NULL,
      course_offering_learner_id INT,
      code VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      professor VARCHAR(255),
      last_seen TIMESTAMP WITH TIME ZONE,
      progress NUMERIC(5, 2) DEFAULT 0.0,
      active BOOLEAN DEFAULT TRUE,
      allow_assessment BOOLEAN DEFAULT TRUE,
      archived BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      
      -- Unique constraint for tracking specific courses per user
      CONSTRAINT unique_user_course UNIQUE (user_id, course_id),

      -- FK linking back to the new users table
      CONSTRAINT fk_course_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  try {
    console.log('Verifying or creating "courses" table...');
    await pool.query(createTableQuery);
    console.log('"courses" table created or verified successfully.');
  } catch (error) {
    console.error('Failed to create courses table:', error.message);
    throw error;
  }
}

export async function createAssignmentsTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS assignments (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      assignment_id INT NOT NULL,
      course_id INT NOT NULL,
      marks NUMERIC(5, 2),
      submitted BOOLEAN DEFAULT FALSE,
      question TEXT,
      due_date TIMESTAMP WITH TIME ZONE,
      grace_date TIMESTAMP WITH TIME ZONE,
      graded BOOLEAN DEFAULT FALSE,
      evaluated BOOLEAN DEFAULT FALSE,
      score NUMERIC(5, 2) DEFAULT NULL,
      submission_file VARCHAR(255) DEFAULT NULL,
      submission_path TEXT DEFAULT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

      -- Ensures a user cannot duplicate assignment records
      CONSTRAINT unique_user_assignment UNIQUE (user_id, assignment_id),

      -- Multi-column FK enforcing that the assignment course must belong to the same user
      CONSTRAINT fk_assignment_course FOREIGN KEY (user_id, course_id) 
        REFERENCES courses(user_id, course_id) ON DELETE CASCADE,

      -- Redundant but explicit backing safety FK directly targeting the user
      CONSTRAINT fk_assignment_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  try {
    console.log('Verifying or creating "assignments" table...');
    await pool.query(createTableQuery);
    console.log('"assignments" table created or verified successfully.');
  } catch (error) {
    console.error('Failed to create assignments table:', error.message);
    throw error;
  }
}

async function runDatabaseSetup() {
  try {
    await createUsersTable();
    
    await createCoursesTables();
    
    await createAssignmentsTable();
    
    console.log('Complete relational schema initialization successful.');
  } catch (err) {
    console.error('Database setup encountered an error:', err.message);
  } finally {
    await pool.end();
    console.log('🔌 Database pool closed cleanly.');
  }
}

runDatabaseSetup();
