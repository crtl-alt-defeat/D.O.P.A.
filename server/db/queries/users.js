import client from "../client.js";
import bcrypt from "bcrypt";

//todo: import createToken from /utils/jwt.js (copy utils folder from previous assignments)

export async function createUser({ email, password, name }) {
  const hash = bcrypt.hash(password, 12);
  const SQL = `
    INSERT INTO users (email, password, name)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [user],
  } = await client.query(SQL, [email, hash, name]);

  //todo: return token instead of user (copy utils folder from previous assignments)
  return user;
}

//todo: create an authenticate function (takes an object parameter containing an email and a password and returns a token)

//todo: create getUserById function (takes an id parameter and returns a user)
