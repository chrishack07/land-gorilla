const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const { authenticate, userValidationSchema } = require('../middleware/user.js'); // Importamos los middlewares
const config = require('config');

const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');


// Ruta para registrar un usuario
router.post('/register', [
  body('name').isLength({ min: 3 }).withMessage('Name should be at least 3 characters long'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long')
], async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { error } = userValidationSchema.validate(req.body);
 
  if (error) {
    return res.status(400).json({ error: error.details });
  }


  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if(user){
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword
    });


    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("ERROR", error);
    res.status(500).json({ error: 'Error registering user' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const payload = { userId: user._id };
    const token = jwt.encode(payload, config.get('jwtSecret'));

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Ruta protegida (requiere autenticación)
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Ruta para obtener todos los usuarios (solo para administración)
router.get('/users', authenticate, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Ruta para actualizar un usuario
router.put('/users/:id', authenticate, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      name,
      email,
      password: hashedPassword
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Ruta para eliminar un usuario
router.delete('/users/:id', authenticate, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;