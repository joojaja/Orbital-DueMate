-- // Migration script to create the initial database schema for the calendar invites table
CREATE TABLE CalendarInvites (
  id BIGSERIAL PRIMARY KEY,
  status VARCHAR(200) NOT NULL,
  fk_user_id BIGSERIAL NOT NULL,
  fk_invited_by_user_id BIGSERIAL NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY(fk_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_invited_user FOREIGN KEY(fk_invited_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance optimization for faster lookups by the user's id
CREATE INDEX idx_users_invites_id ON CalendarInvites(fk_user_id);
CREATE INDEX idx_users_invited_invites_id ON CalendarInvites(fk_invited_by_user_id);