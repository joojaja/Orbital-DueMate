-- // Migration script to create the initial database schema for the user table
CREATE TABLE CalendarEvents (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  dateTime TIMESTAMP NOT NULL,
  allDay BOOLEAN DEFAULT TRUE,
  fk_user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY(fk_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance optimization for faster lookups by the user's id
CREATE INDEX idx_users_events_id ON CalendarEvents(fk_user_id);