import client from "../client.js";
import bcrypt from "bcrypt";

export const createUser = async ({ name, email, password }) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const {
      rows: [user]
    } = await client.query(
      `INSERT INTO users(username, email, password) 
       VALUES($1, $2, $3) 
       RETURNING id, username, email;`,
      [username, email, hashedPassword]
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
