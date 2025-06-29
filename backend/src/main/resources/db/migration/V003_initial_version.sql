ALTER TABLE CalendarEvents ADD COLUMN description VARCHAR(255) DEFAULT '';
ALTER TABLE CalendarEvents ADD COLUMN endTime TIMESTAMP;
ALTER TABLE CalendarEvents ADD COLUMN fk_edited_by_user_id BIGSERIAL;
ALTER TABLE CalendarEvents ADD CONSTRAINT fk_editedby FOREIGN KEY(fk_edited_by_user_id ) REFERENCES users(id);
CREATE INDEX idx_events_edited_by ON CalendarEvents(fk_edited_by_user_id);