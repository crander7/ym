DROP TABLE IF EXISTS checkins CASCADE;
DROP TABLE IF EXISTS post CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS children CASCADE;
DROP TYPE IF EXISTS alert_type;
DROP TYPE IF EXISTS act_type;

CREATE TYPE alert_type AS ENUM ('none', 'email', 'text', 'call');
CREATE TYPE act_type AS ENUM ('user', 'editor', 'admin', 'parent');

CREATE TABLE IF NOT EXISTS post (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(240) NOT NULL,
    post_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NULL DEFAULT NULL,
    body TEXT NOT NULL DEFAULT '',
    activity VARCHAR(240) NULL DEFAULT NULL,
    location VARCHAR(500) NULL DEFAULT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    start_time VARCHAR(100) NOT NULL DEFAULT '7:00 pm',
    groups VARCHAR(40) ARRAY NULL DEFAULT NULL,
    tags VARCHAR(40) ARRAY NULL DEFAULT NULL,
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY NOT NULL,
    display_name VARCHAR(100) NULL DEFAULT NULL,
    first_name VARCHAR(100) NULL DEFAULT NULL,
    last_name VARCHAR(100) NULL DEFAULT NULL,
    phone VARCHAR(20) NULL DEFAULT NULL,
    email VARCHAR(100) NULL DEFAULT NULL,
    password VARCHAR(100) NULL DEFAULT NULL,
    fb_id VARCHAR(100) NULL DEFAULT NULL,
    g_id VARCHAR(100) NULL DEFAULT NULL,
    g_photo VARCHAR(1000) NULL DEFAULT NULL,
    fb_photo VARCHAR(1000) NULL DEFAULT NULL,
    alerts alert_type NULL DEFAULT NULL,
    birthday TIMESTAMP NULL DEFAULT NULL,
    alert_days INT NULL DEFAULT NULL,
    alert_hour INT NULL DEFAULT NULL,
    account act_type NOT NULL DEFAULT 'user',
    edit_req BOOLEAN NOT NULL DEFAULT FALSE,
    class VARCHAR(40) NULL DEFAULT NULL,
    UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS children (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(100) NULL DEFAULT NULL,
    dob TIMESTAMP NULL DEFAULT NULL,
    class VARCHAR(40) NULL DEFAULT NULL,
    user_id INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS checkins (
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
  post_id INTEGER REFERENCES post (id) ON DELETE CASCADE,
  child_id INTEGER REFERENCES children (id) ON DELETE CASCADE,
  CONSTRAINT onecheckinperuser UNIQUE (user_id, post_id),
  CONSTRAINT onecheckinperkid UNIQUE (post_id, child_id)
);