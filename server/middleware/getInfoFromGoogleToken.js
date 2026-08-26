import { jwtDecode } from "jwt-decode";

/** Attaches the user to the request if a valid token is provided */

export default async function getInfoFromGoogleToken(req, res, next) {
  //get token from body
  const token = req.body.googleToken;

  //handle if no token provided
  if (!token) {
    req.sub = null;
    req.name = null;
    return next();
  }

  //try to get info from token
  try {
    const { name, sub } = jwtDecode(token);
    req.sub = sub;
    req.name = name;
    return next();
  } catch (e) {
    //error out if faulty token
    console.error("getSubFromGoogleToken: JWT error:", e.message);
    req.sub = null;
    req.name = null;
    return next();
  }
}
