import express from 'express';
import auth from '../../middleware/auth';
import Profile from '../../models/Profile';
import User from '../../models/User';
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

export default router;