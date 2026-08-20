export default async function getTimeZoneFromQuery(req, res, next) {
  const timeZone = req.query.timeZone || "UTC";
  req.timeZone = timeZone;
  next();
}
