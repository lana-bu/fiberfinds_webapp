import jwt from 'jsonwebtoken';

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, tokenFromHeader] = header.split(' ');
  const tokenFromCookie = req.cookies?.token;

  let token;
  if (scheme === 'Bearer' && tokenFromHeader) { // for testing in Postman
    token = tokenFromHeader;
  } else { // standard method for website
    token = tokenFromCookie;
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    let msg;
    if (err.name === 'TokenExpiredError') { // been over 8 hours since user logged in
      msg = 'Access token expired';
    } else { // potential malicious party
      msg = 'Invalid token';
    }

    return res.status(401).json({ message: msg });
  }
}

export default auth;