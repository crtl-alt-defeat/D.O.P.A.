import client from "../client.js";
import bcrypt from "bcrypt";
import { createToken } from "../../utils/jwt.js";

export const createUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const SQL = `
    INSERT INTO users(name, email, password) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;

  const {
    rows: [user],
  } = await client.query(SQL, [name, email, hashedPassword]);

  const token = createToken({ id: user.id });
  return token;
};

// export const createUserUsingGithub = async ({ name, credential }) => {
//   const SQL = `
//     INSERT INTO users(name, github_credential)
//     VALUES($1, $2)
//     RETURNING *
//   `;

//   const {
//     rows: [user],
//   } = await client.query(SQL, [name, credential]);

//   const token = createToken({ id: user.id });
//   return token;
// };

export const createUserUsingGoogle = async ({ name, sub }) => {
  let createdUser = false;
  try {
    const SQL = `
      INSERT INTO users(name, google_sub) 
      VALUES($1, $2) 
      RETURNING *
    `;

    const {
      rows: [user],
    } = await client.query(SQL, [name, sub]);
    createdUser = true;

    const token = createToken({ id: user.id });
    return token;
  } catch (e) {
    if (!createdUser) {
      const error = new Error("user already exists");
      error.status = 409;
      throw error;
    } else {
      throw e;
    }
  }
};

// export const createUserUsingLinkedIn = async ({ name, credential }) => {
//   const SQL = `
//     INSERT INTO users(name, linkedin_credential)
//     VALUES($1, $2)
//     RETURNING *
//   `;

//   const {
//     rows: [user],
//   } = await client.query(SQL, [name, credential]);

//   const token = createToken({ id: user.id });
//   return token;
// };

export const updateUser = async ({ id, name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const SQL = `
    UPDATE users
    SET name = $1, email = $2, password = $3
    WHERE id = $4
  `;

  const {
    rows: [user],
  } = await client.query(SQL, [name, email, hashedPassword, id]);
  return user;
};

export const authenticate = async ({ email, password }) => {
  const SQL = `
    SELECT *
    FROM users
    WHERE email = $1
  `;

  const {
    rows: [user],
  } = await client.query(SQL, [email]);

  if (!user) {
    const error = new Error("invalid credentials");
    error.status = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    const error = new Error("invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = createToken({ id: user.id });
  return token;
};

// export const authenticateUsingGithub = async (credential) => {
//   return;
// };

export const authenticateUsingGoogle = async (sub) => {
  const SQL = `
    SELECT *
    FROM users
    WHERE google_sub = $1
  `;

  const {
    rows: [user],
  } = await client.query(SQL, [sub]);

  if (!user) {
    const error = new Error("invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = createToken({ id: user.id });
  return token;
};

// export const authenticateUsingLinkedIn = async (credential) => {
//   return;
// };

// export const linkUserToGithub = async (userId, credentials) => {
//   const SQL = `
//     UPDATE users
//     SET github_credential = $1
//     WHERE id = $2
//     RETURNING *
//   `

//   const { rows: [user] } = await client.query(SQL, [credentials, userId]);
//   return user;
// };

export const linkUserToGoogle = async (userId, sub) => {
  const SQL = `
    UPDATE users
    SET google_sub = $1
    WHERE id = $2
    RETURNING *
  `;

  const {
    rows: [user],
  } = await client.query(SQL, [sub, userId]);
  return user;
};

// export const linkUserToLinkedIn = async (userId, credentials) => {
//   const SQL = `
//     UPDATE users
//     SET linkedin_credential = $1
//     WHERE id = $2
//     RETURNING *
//   `;

//   const {
//     rows: [user],
//   } = await client.query(SQL, [credentials, userId]);
//   return user;
// };

// export const unlinkUserFromGithub = async (userId) => {
//   const SQL = `
//     UPDATE users
//     SET github_credentials = NULL
//     WHERE id = $1
//     RETURNING *
//   `;

//   const {
//     rows: [user],
//   } = await client.query(SQL, [userId]);
//   return user;
// };

export const unlinkUserFromGoogle = async (userId) => {
  const SQL = `
    UPDATE users
    SET google_sub = NULL
    WHERE id = $1
    RETURNING *
  `;

  const {
    rows: [user],
  } = await client.query(SQL, [userId]);
  return user;
};

// export const unlinkUserFromLinkedIn = async (userId) => {
//   const SQL = `
//     UPDATE users
//     SET linkedin_credentials = NULL
//     WHERE id = $1
//     RETURNING *
//   `;

//   const {
//     rows: [user],
//   } = await client.query(SQL, [userId]);
//   return user;
// };

export const getUsers = async () => {
  const SQL = `
    SELECT *
    FROM users
  `;
  const { rows: users } = await client.query(SQL);
  return users;
};

export const getUserById = async (id) => {
  const SQL = `
    SELECT *
    FROM users
    WHERE id = $1
  `;

  const {
    rows: [user],
  } = await client.query(SQL, [id]);
  return user;
};

export const getUserByEmail = async (email) => {
  const SQL = `
    SELECT *
    FROM users
    WHERE email = $1
  `;

  const {
    rows: [user],
  } = await client.query(SQL, [email]);
  return user;
};

// export const getUserUsingGithub = async (credential) => {
//   const SQL = `
//     SELECT *
//     FROM users
//     WHERE github_credential = $1
//   `;

//   const {
//     rows: [user],
//   } = await client.query(SQL, [credential]);
//   return user;
// };

export const getUserUsingGoogle = async (sub) => {
  const SQL = `
    SELECT *
    FROM users
    WHERE google_sub = $1
  `;

  const {
    rows: [user],
  } = await client.query(SQL, [sub]);
  return user;
};

// export const getUserUsingLinkedIn = async (credential) => {
//   const SQL = `
//     SELECT *
//     FROM users
//     WHERE linkedin_credential = $1
//   `;

//   const {
//     rows: [user],
//   } = await client.query(SQL, [credential]);
//   return user;
// };
