const router = require('express').Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth');
const { validate, authValidation } = require('../middlewares/validation');

router.post('/register', authValidation.register, validate, register);
router.post('/login', authValidation.login, validate, login);
router.get('/me', auth, getMe);

module.exports = router;