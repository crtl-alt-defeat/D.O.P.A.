import client from "./client.js";

export const createUser = async ({ username, email, password }) => {
  try {
    const {
      rows: [user]
    } = await client.query(
      `INSERT INTO users(username, email, password) 
       VALUES($1, $2, $3) 
       RETURNING id, username, email;`,
      [username, email, password]
    );
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const {
      rows: [user]
    } = await client.query(
      `SELECT id, username, email FROM users WHERE id = $1;`,
      [id]
    );
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const {
      rows: [user]
    } = await client.query(`SELECT * FROM users WHERE email = $1;`, [email]);
    return user;
  } catch (error) {
    throw error;
  }
};
