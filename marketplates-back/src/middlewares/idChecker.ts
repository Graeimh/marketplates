
/**
   * Checks if ids sent through from the front end are valid
   *
   *
   * @param req - The request object associated with the route, mainly, the params object and its ids property
   * @param res - The response object associated with the route
   * @param next - The function to call to allow passage to the next route
   * 
   * @catches - If the route can't be reached (500) or if any of the ids do not match the specifications given (403)
*/
export function idChecker(req, res, next) {
  try {
    // Check if req.params does indeed contain ids, and if not, allow passage to the next route
    if (req.params.ids) {

      // Separating ids from each other as groups are sent as a single string tied together by &'s
      const splittedIdQuery = req.params.ids.split("&");

      for (let i = 0; i < splittedIdQuery.length; i++) {
        // Mongoose.SchemaTypes.ObjectId always have a length of 24 and are written in hexadecimal values, an id not matching these conditions isn't valid 
        if (splittedIdQuery[i].length !== 24 || /[^a-f0-9]/.test(splittedIdQuery[i])) {
          return res.status(403).send({ success: false, message: '(403 Forbidden)-The ID(s) given is invalid.' });
        }

      }
    }
    next();
  } catch (err) {
    res.status(500).json({
      message: '(500 Internal Server Error)-A server side error has occured.',
      success: false,
    });
  }
}