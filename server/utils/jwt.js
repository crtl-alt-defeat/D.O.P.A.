import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const GITHUB_SECRET = process.env.GITHUB_SECRET;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const LINKEDIN_SECRET = process.env.LINKEDIN_SECRET;

/** Creates a token with the given payload */
export function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

/** Extracts the payload from a token */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

/** Extracts the payload from a token from GitHub */
export function verifyGithubToken(githubToken) {
  return jwt.verify(githubToken, GITHUB_SECRET);
}

export function verifyGoogleToken(googleToken) {
  return jwt.verify(googleToken, GOOGLE_CLIENT_SECRET);
}

export function verifyLinkedInToken(linkedinToken) {
  return jwt.verify(linkedinToken, LINKEDIN_SECRET);
}
