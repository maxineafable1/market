CREATE DATABASE market_db;

-- \c market_db

CREATE TABLE users (
  user_id uuid DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
);

CREATE TABLE tokens (
  token_id SERIAL,
  refresh TEXT,
  user_id uuid,
  PRIMARY KEY (token_id),
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
      ON DELETE CASCADE
);

CREATE TABLE posts (
  post_id SERIAL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(8, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_id uuid,
  PRIMARY KEY (post_id),
  FOREIGN KEY (user_id)
    REFERENCES users(user_id)
      ON DELETE CASCADE
);

-- functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
    NEW.updated_at = now();
    RETURN NEW;
  ELSE
    RETURN OLD;
  END IF;
END;
$$ language 'plpgsql';

-- set new update timestamp when a user column has been modified
CREATE TRIGGER update_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();