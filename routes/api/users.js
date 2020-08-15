import express from 'express';
import { check, validationResult } from 'express-validator';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';

import User from '../../models/User';

const router = express.Router();

// @route   POST api/users
// @desc    Register User
// @access  public
router.post('/',[
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a passwrod with 6 characters or more').isLength({min: 6})
], async (req, res) => {

  const errors = validationResult(req);
  
  if(!errors.isEmpty()) 
    return res.status(400).json({errors: errors.array()});
  
  const { name, email, password } = req.body;
  
  try {

    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ errors: [ { msg: 'User already exists' } ] });

    const avatar = gravatar.url(email, {
      s: 200,
      r: 'pg',
      d: 'mm'
    });

    user = new User({ name, email, avatar, password });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

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