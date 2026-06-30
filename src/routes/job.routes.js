const router = require('express').Router();
const { 
  createJob, 
  getJobs, 
  getJobById, 
  updateJob, 
  deleteJob,
  getEmployerJobs 
} = require('../controllers/job.controller');
const { auth, authorize } = require('../middlewares/auth');
const { validate, jobValidation } = require('../middlewares/validation');

router.get('/', getJobs);
router.get('/employer', auth, authorize('EMPLOYER'), getEmployerJobs);
router.get('/:id', jobValidation.id, validate, getJobById);

router.post('/', auth, authorize('EMPLOYER'), jobValidation.create, validate, createJob);
router.put('/:id', auth, authorize('EMPLOYER'), jobValidation.id, jobValidation.update, validate, updateJob);
router.delete('/:id', auth, authorize('EMPLOYER'), jobValidation.id, validate, deleteJob);

module.exports = router;