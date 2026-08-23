DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS types CASCADE;
DROP TABLE IF EXISTS users_types CASCADE;
DROP TABLE IF EXISTS users_goals CASCADE;
DROP TABLE IF EXISTS selected_goals CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NULL,
    password TEXT NULL,
    google_sub VARCHAR(255) UNIQUE NULL,
    CONSTRAINT at_least_1_credential
        CHECK (
            (email IS NOT NULL AND password IS NOT NULL) 
            OR google_sub IS NOT NULL
        )
);

CREATE TABLE types (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type_id INT NOT NULL,
    CONSTRAINT fk_types FOREIGN KEY (type_id) REFERENCES types(id),
    CONSTRAINT mutually_unique_name_and_type UNIQUE (name, type_id)
);

CREATE TABLE users_types (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type_id INT NOT NULL,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_types FOREIGN KEY (type_id) REFERENCES types(id),
    CONSTRAINT mutually_unique_user_and_type UNIQUE (user_id, type_id)
);

CREATE TABLE users_goals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    goal_id INT NOT NULL,
    date_made DATE NOT NULL,
    date_complete DATE,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_goals FOREIGN KEY (goal_id) REFERENCES goals(id),
    CONSTRAINT mutually_unique_user_and_goal_and_date UNIQUE (user_id, goal_id, date_made)
);
CREATE TABLE selected_goals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    goal_id INT NOT NULL,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_goals FOREIGN KEY (goal_id) REFERENCES goals(id),
    CONSTRAINT mutually_unique_user_and_goal UNIQUE (user_id, goal_id)
);
