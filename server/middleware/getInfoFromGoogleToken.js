import { jwtDecode } from "jwt-decode";

/** Attaches the user to the request if a valid token is provided */

export default async function getInfoFromGoogleToken(req, res, next) {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    req.sub = null;
    req.name = null;
    return next();
  }

  const token = authorization.split(" ")[1];

  try {
    const { name, sub } = jwtDecode(token);
    req.sub = sub;
    req.name = name;
    return next();
  } catch (e) {
    console.error("getSubFromGoogleToken: JWT error:", e.message);
    req.sub = null;
    req.name = null;
    return next();
  }
}
