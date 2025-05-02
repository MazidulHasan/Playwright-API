const express = require('express');
const { body, validationResult } = require('express-validator');
const { faker } = require('@faker-js/faker');
const cors = require('cors');
const validateUserSchemaForServer = require('../schema/userSchemaForServer');

const app = express();
const port = 3000;

const FAKE_AUTH_TOKEN = 'fake-jwt-token';

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.path === '/api/login') {
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

app.post('/api/createUser', validateUserSchemaForServer.validateUserCreate, (req, res) => {
  const errors = validationResult(req); //validationResult checks the request json with schema
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userData = req.body;
  res.status(201).json({
    ...userData,
    id: faker.string.uuid(),
    createdAt: new Date().toISOString(),
    verified: false,
    status: faker.helpers.arrayElement(['active', 'pending', 'inactive'])
  });
});

app.put('/api/updateUser/:id', validateUserSchemaForServer.validateUserUpdate, (req, res) => {
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

const methodNotAllowed = (req, res) => res.status(405).send();
app.all('/api/login', methodNotAllowed);
app.all('/api/createUser', methodNotAllowed);
app.all('/api/updateUser/:id', methodNotAllowed);
app.all('/api/deleteUser/:id', methodNotAllowed);
app.all('/api/users', methodNotAllowed);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`✅ Enhanced server running at http://localhost:${port}`);
});