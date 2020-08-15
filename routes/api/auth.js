import express from 'express';
import auth from '../../middleware/auth';
const router = express.Router();

// @route   GET api/auth
// @desc    Test route
// @access  public
router.get('/', auth, (req, res) => res.send('Auth route.'));

export default router;