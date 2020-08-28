import express from 'express';
import auth from '../../middleware/auth';
import Profile from '../../models/Profile';
import User from '../../models/User';
import request from 'request';
import config from 'config';
import Post from '../../models/Post';
import {check, validationResult} from 'express-validator';

const router = express.Router();

// @route   GET api/profile/me
// @desc    Gut current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try{
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if(!profile) return res.status(404).json({msg: "There no profile for this user."});

    res.json(profile);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/
// @desc    Create or Update a User Profile
// @access  Private
router.post('/', auth, [
  check('status', 'status is required').not().isEmpty(),
  check('skills', 'skills is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  // Profile data marshelling
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body;

  // Build User Profile Object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (company)        profileFields.company = company;
  if (website)        profileFields.website = website;
  if (location)       profileFields.location = location;
  if (bio)            profileFields.bio = bio;
  if (status)         profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills)         profileFields.skills = skills.split(',').map(skill => skill.trim());

  // Build Social object
  profileFields.social = {};
  if (twitter)   profileFields.social.twitter = twitter;
  if (linkedin)  profileFields.social.linkedin = linkedin;
  if (facebook)  profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (youtube)   profileFields.social.youtube = youtube;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
      return res.json(profile);
    }

    // Create
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

// @route   GET api/profile/
// @desc    Get all User Profile
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).status('Server Error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get user profile by user id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
    if(!profile) return res.status(404).json({ msg: 'User not found' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).status('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete a profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Delete user posts
    await Post.deleteMany({_id: req.user.id});

    // Delete User Profile
    await Profile.findOneAndRemove({user: req.user.id});

    // Delete User account
    await User.findOneAndRemove({_id: req.user.id});

    res.json({msg: 'User Deleted'});

  } catch (err) {
    console.error(err.message);
    res.send('Server Error');
  }

});


// @route   PUT api/profile/experience
// @desc    ADD Experirnce
// @access  Private
router.put('/experience', auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
], async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  };
  
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.experience.unshift(newExp);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});


// @route   DELETE api/profile/experience/:exp_id
// @desc    DELETE Experirnce by id
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // get remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    
    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// profile.education section

// @route   PUT api/profile/education
// @desc    ADD education
// @access  Private
router.put('/education', auth, [
  check('school', 'school is required'),
  check('degree', 'degree is required'),
  check('fieldofstudy', 'Field of study is required'),
  check('from', 'from date is required'),
], async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  };
  
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    profile.education.unshift(newEdu);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

// @route   DELETE api/profile/education/:edu_id
// @desc    DELETE Experirnce by id
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // get remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    
    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('github_client_id')}&client_secret=${config.get('github_secret')}`,
      method: 'GET',
      headers: {'user-agent' : 'node.js'}
    };

    request(options, (error, response, body) => {
      if(error) console.error(error);
      if(response.statusCode !== 200){
        return res.status(404).json( {msg: 'No Github Profile found.'} );
      }

      res.json(JSON.parse(body));
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


export default router;