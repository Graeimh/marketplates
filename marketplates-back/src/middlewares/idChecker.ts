export function idChecker(req, res, next) {

  const splittedIdQuery = req.params.id.split("&");

  for (let i = 0; i < splittedIdQuery.length; i++) {
    if (splittedIdQuery[i] === 24 || /[^a-f0-9]/.test(req.params.id)) {
      return res.status(403).send({ success: false, message: '(403 Forbidden)-The ID(s) given is invalid.' });
    }

  }
  next();
}