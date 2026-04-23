import crypto from 'crypto';

const SECRET = process.env.CSRF_SECRET;
const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours, same as JWT token

function generateCsrfToken() {
  const random = crypto.randomBytes(32).toString('hex');
  const timestamp = Date.now().toString(); // in place of session ID (since stateless)
  const message = random + "!" + timestamp;
  const hmac = crypto.createHmac('sha256', SECRET).update(message).digest('hex');
  const csrfToken = random + "." + timestamp + "." + hmac;
  return csrfToken;
}

function verifyCsrfToken(token) {
  if (!token || typeof token !== 'string') { // token not set or not a string
    return false;
  }

  const tokenParts = token.split('.'); // break apart pieces of token
  if (tokenParts.length !== 3) { // shuld be random, timestamp, and hmac section
    return false;
  }

  const [random, timestamp, hmac] = tokenParts;

  const age = Date.now() - parseInt(timestamp, 10);
  if (isNaN(age) || age > TOKEN_EXPIRY_MS || age < 0) { // age is too old or invalid
    return false;
  }

  const message = random + "!" + timestamp;

  const expectedHmac = crypto.createHmac('sha256', SECRET).update(message).digest('hex');

  // return true if expected and actual HMAC match, false otherwise
  return crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expectedHmac, 'hex'));
}

// sets a CSRF token cookie on every response if one isn't present or is expired
export function setCsrfToken(req, res, next) {
  const existing = req.cookies?.[CSRF_COOKIE_NAME];

  if (!existing || !verifyCsrfToken(existing)) {
    const token = generateCsrfToken();

    res.cookie(CSRF_COOKIE_NAME, token, {
      httpOnly: false, // frontend JS must read this to send it as a header
      secure: process.env.NODE_ENV === 'production', // not necessary to be secure for development
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRY_MS,
      path: '/',
    });
  }
  next();
}

// validates CSRF token on state-changing requests (POST, PUT, DELETE, PATCH)
export function validateCsrfToken(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) { // no user input taken
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (!cookieToken || !headerToken) {
    return res.status(403).json({ message: 'CSRF token missing' });
  }

  if (cookieToken !== headerToken) {
    return res.status(403).json({ message: 'CSRF token mismatch' });
  }

  if (!verifyCsrfToken(cookieToken)) {
    return res.status(403).json({ message: 'CSRF token invalid or expired' });
  }

  next();
}
