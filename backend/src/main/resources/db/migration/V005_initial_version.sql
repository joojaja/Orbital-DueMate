-- // Migration script to create the initial database schema for the user table
CREATE TABLE Modules (
  id BIGSERIAL PRIMARY KEY,
  moduleCode VARCHAR(200) NOT NULL,
  moduleCredit INTEGER NOT NULL,
  category VARCHAR(200) NOT NULL,
  secondCategory VARCHAR(200),
  subcategory VARCHAR(200),
  subsubcategory VARCHAR(200),
  level INTEGER NOT NULL,
  fk_user_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY(fk_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance optimization for faster lookups by the user's id
CREATE INDEX idx_users_modules_id ON Modules(fk_user_id);