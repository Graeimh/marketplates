import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

export function authToken(req, res, next) {
  if (!req.headers.authorization)
    return res.status(403).send({ error: 1, message: 'Missing token' });

  const [, token] = req.headers.authorization.split(' ')

  try {
    const { TOKEN_KEY } = process.env;
    jwt.verify(token, TOKEN_KEY)
    next();
  }
  catch (err) {
    return res.status(403).send({ error: 1, message: 'Invalid token' });
  }
}