const { body, check, query, param } = require('express-validator');
const { isValid } = require('date-fns');

// Base User Schema
const userSchema = {
  // Profile validations
  profile: {
    name: body('profile.name')
      .isString().withMessage('Must be a string')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Must be between 2-50 characters'),
      
    age: body('profile.age')
      .isInt({ min: 18, max: 120 }).withMessage('Must be between 18-120'),
      
    isStudent: body('profile.isStudent')
      .isBoolean().withMessage('Must be true or false'),
      
    education: {
      degree: body('profile.education.degree')
        .if(body('profile.isStudent').equals(false))
        .notEmpty().withMessage('Degree required for non-students')
        .isIn(['Bachelor', 'Master', 'PhD', 'Diploma']).withMessage('Invalid degree type'),
        
      institution: body('profile.education.institution')
        .isString().trim()
        .isLength({ max: 100 }).withMessage('Max 100 characters')
    }
  },

  // Account validations
  account: {
    email: body('account.email')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail()
      .isLength({ max: 100 }).withMessage('Max 100 characters'),
      
    password: body('account.password')
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      }).withMessage('Password must contain uppercase, lowercase, number and symbol'),
      
    confirmPassword: body('account.confirmPassword')
      .custom((value, { req }) => value === req.body.account.password)
      .withMessage('Passwords must match')
  },

  // Metadata validations
  metadata: {
    signupSource: body('metadata.signupSource')
      .isIn(['web', 'mobile', 'api']).withMessage('Invalid source'),
      
    acceptTerms: body('metadata.acceptTerms')
      .isBoolean().withMessage('Must be boolean')
      .equals(true).withMessage('Terms must be accepted'),
      
    registrationDate: body('metadata.registrationDate')
      .optional()
      .custom((value) => isValid(new Date(value)))
      .withMessage('Invalid date format')
  },

  // Address validations
  addresses: body('addresses.*').customSanitizer((value) => {
    return Array.isArray(value) ? value : [value];
  }).isArray({ max: 3 }).withMessage('Max 3 addresses allowed')
    .custom((addresses) => {
      const defaultCount = addresses.filter(a => a.isDefault).length;
      return defaultCount <= 1;
    }).withMessage('Only one default address allowed'),
    
  'addresses.*.type': body('addresses.*.type')
    .isIn(['home', 'work', 'billing']).withMessage('Invalid address type'),
    
  'addresses.*.isDefault': body('addresses.*.isDefault')
    .isBoolean().withMessage('Must be boolean')
};

// Update-specific validations
const updateSchema = {
  updateReason: body('updateReason')
    .isString().trim()
    .notEmpty().withMessage('Update reason required')
    .isLength({ max: 200 }).withMessage('Max 200 characters'),
    
  updatedFields: body('updatedFields')
    .isArray().withMessage('Must be an array')
    .custom((fields) => {
      const allowedFields = ['profile.name', 'profile.age', 'account.email'];
      return fields.every(field => allowedFields.includes(field));
    }).withMessage('Contains invalid updatable fields'),
    
  timestamp: body('timestamp')
    .optional()
    .isISO8601().withMessage('Must be ISO8601 format')
};

// Query validations
const querySchema = {
  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Must be between 1-100'),
    
  page: query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Must be positive integer'),
    
  status: query('status')
    .optional()
    .isIn(['active', 'pending', 'inactive']).withMessage('Invalid status')
};

// Param validations
const paramSchema = {
  id: param('id')
    .isUUID().withMessage('Invalid ID format')
};

// Response Schema (for testing responses)
const responseSchema = {
  user: {
    id: check('id').isUUID(),
    name: check('profile.name').isString(),
    email: check('account.email').isEmail(),
    status: check('status').isIn(['active', 'pending', 'inactive'])
  }
};

// Composite Validators
const createUserValidator = Object.values(userSchema).flatMap(group => 
  Object.values(group).flat()
);

const updateUserValidator = [
  ...createUserValidator.filter(v => !['account.password', 'account.confirmPassword'].includes(v.path)),
  ...Object.values(updateSchema)
];

const getUserValidator = [
  paramSchema.id,
  ...Object.values(querySchema)
];

module.exports = {
  userSchema,
  updateSchema,
  querySchema,
  paramSchema,
  responseSchema,
  createUserValidator,
  updateUserValidator,
  getUserValidator
};