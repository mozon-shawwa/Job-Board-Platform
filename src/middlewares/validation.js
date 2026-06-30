const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const authValidation = {
  register: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim(),
    body('role').isIn(['EMPLOYER', 'CANDIDATE']),
    body('company').if(body('role').equals('EMPLOYER')).notEmpty().trim()
  ],
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ]
};

const jobValidation = {
  create: [
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('location').notEmpty().trim(),
    body('type').isIn(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']),
    body('category').notEmpty().trim(),
    body('salaryMin').optional().isInt({ min: 0 }),
    body('salaryMax').optional().isInt({ min: 0 })
  ],
  update: [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('location').optional().trim(),
    body('type').optional().isIn(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE']),
    body('category').optional().trim(),
    body('salaryMin').optional().isInt({ min: 0 }),
    body('salaryMax').optional().isInt({ min: 0 }),
    body('isActive').optional().isBoolean()
  ],
  id: [
    param('id').isUUID()
  ]
};

const applicationValidation = {
  apply: [
    body('jobId').isUUID(),
    body('coverLetter').optional().trim()
  ],
  statusUpdate: [
    body('status').isIn(['PENDING', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED'])
  ]
};

module.exports = { validate, authValidation, jobValidation, applicationValidation };