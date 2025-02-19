const jwt = require('jwt-simple');
const Joi = require('joi');
const config = require('config');

// Middleware de autenticación con JWT
const authenticate = (req, res, next) => {
 
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.decode(token, config.get('jwtSecret'));
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
  
  // Middleware de validación de los datos de entrada
const userValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

module.exports = {
  authenticate,
  userValidationSchema
};