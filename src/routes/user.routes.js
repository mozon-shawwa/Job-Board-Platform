const router = require('express').Router();
const { uploadResume, getProfile } = require('../controllers/user.controller');
const { auth, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/profile', auth, getProfile);
router.post('/resume', auth, authorize('CANDIDATE'), upload.single('resume'), uploadResume);

module.exports = router;