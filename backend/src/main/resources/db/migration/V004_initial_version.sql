-- // Migration script to create the initial database schema for the user table
CREATE TABLE CalendarInvites (
  id UUID PRIMARY KEY,
  status VARCHAR(200) NOT NULL,
  fk_user_id UUID NOT NULL,
  fk_invited_by_user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY(fk_user_id) REFERENCES users(id) ON DELETE CASCADE
  CONSTRAINT fk_invited_user FOREIGN KEY(fk_invited_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance optimization for faster lookups by the user's id
CREATE INDEX idx_users_events_id ON CalendarInvites(fk_user_id);
CREATE INDEX idx_users_events_id ON CalendarInvites(fk_invited_by_user_id);