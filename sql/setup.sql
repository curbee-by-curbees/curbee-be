DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS finds CASCADE;
DROP TABLE IF EXISTS spots CASCADE;
DROP TABLE IF EXISTS photos;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone_number VARCHAR(15) NOT NULL
);

CREATE TABLE finds (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- user_id BIGINT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  is_claimed BOOLEAN NOT NULL,
  latitude DECIMAL(8,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW() 
);

CREATE TABLE spots (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- user_id BIGINT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  radius INT NOT NULL,
  latitude DECIMAL(8,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  items TEXT[] 
);

CREATE TABLE photos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- user_id BIGINT NOT NULL REFERENCES users(id),
  -- find_id BIGINT NOT NULL REFERENCES finds(id),
  photo TEXT NOT NULL
);
