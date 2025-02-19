const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');  // URI de tu base de datos

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Terminar la aplicación si la conexión falla
  }
};
module.exports = connectDB;

