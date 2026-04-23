import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { xss } from 'express-xss-sanitizer';
import cookieParser from 'cookie-parser';
import { connectToMongo } from './config/db.js';
import { setCsrfToken, validateCsrfToken } from './middleware/csrf.js';
import authRoutes from './routes/authRoutes.js';
import postsRoutes from './routes/postsRoutes.js';

const app = express();

// establish connection to front end
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
// parse request body
app.use(express.json());
// sanitize all user inputs to prevent XSS
app.use(xss());
app.use(cookieParser());
// set CSRF cookie on every response
app.use(setCsrfToken);
// serve uploaded files
app.use('/uploads', express.static('uploads'));
// no CSRF validation (login/signup/refresh check/logout)
app.use('/api/auth', authRoutes);
// CSRF validated
app.use('/api/posts', validateCsrfToken, postsRoutes);

const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;

connectToMongo(uri, dbName)
  .then(() => {
    app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to Mongo:', err.message);
    process.exit(1);
  });