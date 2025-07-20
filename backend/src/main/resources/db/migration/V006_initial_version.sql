-- // Migration script to create the initial database schema for the user table
CREATE TABLE CourseSelection (
  id BIGSERIAL PRIMARY KEY,
  course VARCHAR(200) NOT NULL,
  fk_user_id BIGSERIAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY(fk_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance optimization for faster lookups by the user's id
CREATE INDEX idx_users_course_id ON CourseSelection(fk_user_id);