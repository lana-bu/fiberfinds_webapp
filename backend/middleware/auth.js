import jwt from 'jsonwebtoken';

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, tokenFromHeader] = header.split(' ');
  const tokenFromCookie = req.cookies?.token;

  if (scheme === 'Bearer' && tokenFromHeader) { // for testing in Postman
    const token = tokenFromHeader;
  } else { // standard method for website
    const token = tokenFromCookie;
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') { // been over 8 hours since user logged in
      const msg = 'Access token expired';
    } else { // potential malicious party
      const msg = 'Invalid token';
    }

    return res.status(401).json({ message: msg });
  }
}

export default auth;