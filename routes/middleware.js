export function checkBody(req, res, next) {
  const body = req.body;
  if (
    !body.fieldCode &&
    !body.location &&
    !body.threatLevel &&
    !body.description &&
    body.confirmed === undefined
  ) {
    res.status(401).send('Body unauthorized');
  } else {
    next();
  }
}
