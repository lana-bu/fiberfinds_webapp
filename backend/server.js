import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectToMongo } from './config/db.js';
import { setCsrfToken, validateCsrfToken } from './middleware/csrf.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json()); // built-in body parser
app.use(cookieParser());
app.use(setCsrfToken); // set CSRF cookie on every response
app.use('/api/auth', authRoutes); // no CSRF validation (login/signup)
// create about page route

const port = process.env.PORT || 3000;
const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB;

connectToMongo(url, dbName)
  .then(() => {
    app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to Mongo:', err.message);
    process.exit(1);
  });