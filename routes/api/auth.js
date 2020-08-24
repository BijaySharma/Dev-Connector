import express from 'express';
import auth from '../../middleware/auth';
import {validationResult, check} from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
const router = express.Router();

// Import User Model
import User from '../../models/User';

// @route   GET api/auth
// @desc    Test route
// @access  public
router.get('/', auth, async (req, res) => {
  try{
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  public
router.post('/',[
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {

  const errors = validationResult(req);
  
  if(!errors.isEmpty()) 
    return res.status(400).json({errors: errors.array()});
  
  const { email, password } = req.body;
  
  try {

    let user = await User.findOne({ email });
    if(!user) return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' } ] });

    
    const isMatch = await bcrypt.compare(password, user.password);
   
    if(!isMatch){
      return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' } ] });
    }

    // Generate and send authorization token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload,
      config.get('jwt_secret'),
      { expiresIn: 60 * 60, algorithm: 'HS256' },
      (err, token) => {
        if(err){
          throw err;
        }else{
          return res.status(200).json({token});
        }
      }
    );
   
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }

});

export default router;