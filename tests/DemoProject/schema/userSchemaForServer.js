const { body } = require('express-validator');


const validateUserCreate = [
  // Profile validations
  body('profile').exists().withMessage('Profile is required'),
  body('profile.name').isString().withMessage('Must be a string').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Must be between 2-50 characters'),
  body('profile.age').isInt({ min: 18 }).withMessage('Must be at least 18 years old'),
  body('profile.isStudent').isBoolean().withMessage('Must be a boolean value'),
  body('profile.education.degree')
    .if(body('profile.isStudent').equals('true'))
    .notEmpty().withMessage('Degree is required for students'),
  
  // Account validations
  body('account').exists().withMessage('Account info is required'),
  body('account.email').isEmail().withMessage('Valid email is required'),
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
  body('profile.name').notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Must be between 2-50 characters'),
  body('profile.age').isInt({ min: 18 }).withMessage('Must be at least 18 years old'),
  body('account.email').optional().isEmail(),
  body('updateReason').exists().withMessage('Update reason is required'),
  body('updatedFields').exists().withMessage('Updated fields array is required')
];
  
module.exports = {
  validateUserCreate,
  validateUserUpdate
}