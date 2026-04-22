import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerUserRules } from '../middleware/validation/userValidation.js'
import { validate } from '../middleware/validation/validate.js'
import auth from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();

// Register User
router.post('/signup', registerUserRules, validate, async (req, res) => {
  try {    
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(400).json({ message: 'The username provided is not available' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'The email provided is already linked to an existing account' });
    }

    const newUser = await User.create({ username, email, password, verified: false });
    res.status(201).json({ success: true, message: 'Account registered successfully'});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // check for username
    let user = await User.findOne({ username: usernameOrEmail });
    if (!user) { // user with given username does not exist
      // check for email
      user = await User.findOne({ email: usernameOrEmail });
      
      if (!user) { // user with given emaildoes not exist
        return res.status(400).json({ message: 'The login credentials provided do not match an existing account' });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { // incorect password
      return res.status(400).json({ message: 'The login credentials provided do not match an existing account' });
    }

    // generate JWT token to stay logged in
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' }); // can make expire time shorter once refresh token implemented
    
    // store JWT token in cookie
    res.cookie('token', token, {
      httpOnly: true,  // prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
      sameSite: 'strict',  // prevents CSRF
      maxAge: 8 * 60 * 60 * 1000,  // 8 hours in milliseconds, matching the JWT expiry
    });

    res.json({ message: 'Login successful', user: {id: user._id, username: user.username, role: user.role} });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// check if user still logged in after refresh
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    res.json({ user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// logout user
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

export default router;