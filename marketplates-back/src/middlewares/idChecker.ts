export function idChecker(req, res, next) {

  if (req.params.ids) {
    const splittedIdQuery = req.params.ids.split("&");

    for (let i = 0; i < splittedIdQuery.length; i++) {
      if (splittedIdQuery[i].length !== 24 || /[^a-f0-9]/.test(splittedIdQuery[i])) {
        return res.status(403).send({ success: false, message: '(403 Forbidden)-The ID(s) given is invalid.' });
      }

    }
  }
  next();
}