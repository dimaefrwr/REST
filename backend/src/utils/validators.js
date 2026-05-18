const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Imię musi mieć od 2 do 50 znaków'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Podaj prawidłowy adres email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Hasło musi mieć minimum 6 znaków'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Podaj prawidłowy adres email'),
  body('password')
    .notEmpty()
    .withMessage('Hasło jest wymagane'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];


exports.validateAuction = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Tytuł musi mieć od 3 do 100 znaków'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Opis musi mieć od 10 do 2000 znaków'),
  body('category')
    .isIn(['electronics', 'fashion', 'home', 'sports', 'books', 'art', 'other'])
    .withMessage('Nieprawidłowa kategoria'),
  body('startingPrice')
    .isFloat({ min: 0 })
    .withMessage('Cena wywoławcza musi być liczbą dodatnią'),
  body('startDate')
    .isISO8601()
    .toDate()
    .withMessage('Podaj prawidłową datę rozpoczęcia'),
  body('endDate')
    .isISO8601()
    .toDate()
    .withMessage('Podaj prawidłową datę zakończenia'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];


exports.validateBid = [
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Kwota oferty musi być liczbą dodatnią'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];


exports.validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Imię musi mieć od 2 do 50 znaków'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Podaj prawidłowy adres email'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];