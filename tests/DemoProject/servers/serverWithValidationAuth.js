const express = require('express');
const { body, validationResult } = require('express-validator');
const { faker } = require('@faker-js/faker');
const cors = require('cors');

const app = express();
const port = 3000;

// Constants
const FAKE_AUTH_TOKEN = 'fake-jwt-token';

app.use(cors());
app.use(express.json());

// Fake Authentication Middleware
app.use((req, res, next) => {
  // Skip authentication for these routes
  if (req.path === '/api/login' || req.path === '/api/createUser') {
    return next();
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
  }
  
  const token = authHeader.split(' ')[1];
  if (token !== FAKE_AUTH_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
  
  next();
});

// Enhanced User Schema Validations
const validateUserCreate = [
  // Profile validations
  body('profile').exists().withMessage('Profile is required'),
  body('profile.name').isString().trim().notEmpty().withMessage('Name is required'),
  body('profile.age').isInt({ min: 18 }).withMessage('Must be at least 18 years old'),
  body('profile.isStudent').isBoolean().withMessage('Must be a boolean value'),
  body('profile.education.degree')
    .if(body('profile.isStudent').equals(false))
    .notEmpty().withMessage('Degree is required for non-students'),
  
  // Account validations
  body('account').exists().withMessage('Account info is required'),
  body('account.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('account.password').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  }).withMessage('Password must be at least 8 chars with uppercase, lowercase, number and symbol'),
  body('account.confirmPassword')
    .custom((value, { req }) => value === req.body.account.password)
    .withMessage('Passwords do not match'),
  
  // Metadata validations
  body('metadata.signupSource').isIn(['web', 'mobile', 'api']).withMessage('Invalid signup source')
];

const validateUserUpdate = [
  body('profile.name').optional().isString().trim().notEmpty(),
  body('profile.age').optional().isInt({ min: 18 }),
  body('account.email').optional().isEmail().normalizeEmail(),
  body('updateReason').exists().withMessage('Update reason is required'),
  body('updatedFields').exists().withMessage('Updated fields array is required')
];

// POST /api/login
app.post('/api/login', 
  body('username').exists().withMessage('Username is required'),
  body('password').exists().withMessage('Password is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    res.status(200).json({ 
      token: FAKE_AUTH_TOKEN,
      user: {
        id: faker.string.uuid(),
        username,
        name: faker.person.fullName()
      }
    });
  }
);

// POST /api/createUser
app.post('/api/createUser', validateUserCreate, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userData = req.body;
  res.status(201).json({
    ...userData,
    id: faker.string.uuid(),
    createdAt: new Date().toISOString(),
    verified: false,
    status: 'pending'
  });
});

// PUT /api/updateUser/:id
app.put('/api/updateUser/:id', validateUserUpdate, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const updateData = req.body;
  res.status(200).json({
    ...updateData,
    id: req.params.id,
    updatedAt: new Date().toISOString(),
    updatedBy: faker.person.fullName()
  });
});

// DELETE /api/deleteUser/:id
app.delete('/api/deleteUser/:id', (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  res.status(200).json({
    id: req.params.id,
    deletedAt: new Date().toISOString(),
    deletedBy: faker.person.fullName()
  });
});

// GET /api/users
app.get('/api/users', (req, res) => {
  const users = Array.from({ length: 10 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(['active', 'pending', 'inactive']),
    createdAt: faker.date.past().toISOString()
  }));

  res.status(200).json({
    count: users.length,
    users
  });
});

// Method Not Allowed handlers
const methodNotAllowed = (req, res) => res.status(405).send();
app.all('/api/login', methodNotAllowed);
app.all('/api/createUser', methodNotAllowed);
app.all('/api/updateUser/:id', methodNotAllowed);
app.all('/api/deleteUser/:id', methodNotAllowed);
app.all('/api/users', methodNotAllowed);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`✅ Enhanced server running at http://localhost:${port}`);
});