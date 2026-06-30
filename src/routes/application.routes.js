const router = require('express').Router();
const { 
  applyToJob, 
  getMyApplications, 
  getJobApplications, 
  updateApplicationStatus,
  getApplicationStats 
} = require('../controllers/application.controller');
const { auth, authorize } = require('../middlewares/auth');
const { validate, applicationValidation } = require('../middlewares/validation');

router.get('/my', auth, getMyApplications);
router.get('/stats', auth, authorize('EMPLOYER'), getApplicationStats);
router.get('/job/:jobId', auth, authorize('EMPLOYER'), getJobApplications);

router.post('/apply', auth, authorize('CANDIDATE'), applicationValidation.apply, validate, applyToJob);
router.put('/:id/status', auth, authorize('EMPLOYER'), applicationValidation.statusUpdate, validate, updateApplicationStatus);

module.exports = router;