import {
//  param,
  body
} from 'express-validator';

const validator = {};

validator.userSignup = [
  body('firstName').not().isEmpty().isLength({ min: 2 }),
  body('surName').not().isEmpty().isLength({ min: 2 }),
  body('middleName').not().isEmpty().isLength({ min: 2 }),
  body('email').normalizeEmail().isEmail(),
  body('phone').not().isEmpty().isLength({ min: 8 })
    .isNumeric(),
  body('password').not().isEmpty().isLength({ min: 8 }),
  body('gender').isIn('male', 'female', 'not specified'),
  body('role', 'invalid user role').isIn('patient', 'admin', 'consultant'),
  body('conditions').not().isEmpty()
];

validator.login = [
  body('email', 'please enter a valid email').normalizeEmail().isEmail(),
  body('password').trim().escape()
];

export default validator;