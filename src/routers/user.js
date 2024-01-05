const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/signup', async (req, res) => {
  const user = new User(req.body);

  try {
    if (!user.confirmed) {
      await user.generateAuthToken();
      user.confirmed = true;
      await user.save();
      res.status(201);
      console.log(user.username + ' created successfully...');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    res.status(200).send();
    // res.send('Dashboard');
    console.log(`${req.body.email} successfully logged in...`);
  } catch (error) {
    res.status(400).send();
  }
});

router.get('/confirmation/:token', async (req, res) => {
  try {
    const payload = jwt.verify(req.params.token);
    const _id = payload._id;
    await User.findByIdAndUpdate(_id, { confirmed: true });
  } catch (error) {
    console.log(error);
    res.send('error');
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user.username);
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'password', 'name', 'age'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    console.log('Deleting user: ', req.user._id);

    // Delete associated task
    await Task.deleteMany({ owner: req.user._id });

    // Delete the user
    await req.user.deleteOne();

    sendCancelationEmail(req.user.email, req.user.username);

    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
