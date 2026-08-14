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
