DROP TABLE IF EXISTS post CASCADE;

CREATE TABLE IF NOT EXISTS post (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(240) NOT NULL,
    post_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    body TEXT NOT NULL DEFAULT '',
    activity VARCHAR(240) NULL DEFAULT NULL,
    party VARCHAR(240) NULL DEFAULT NULL,
    start_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_time VARCHAR(100) NOT NULL DEFAULT '7:00 pm'
);
