const jwt = require('jsonwebtoken');
const User = require('../models/User');


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Użytkownik o tym emailu już istnieje'
      });
    }

    
    const user = await User.create({
      name,
      email,
      password
    });

    

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Użytkownik zarejestrowany pomyślnie',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd rejestracji użytkownika',
      error: error.message
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Nieprawidłowy email lub hasło'
      });
    }

    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Nieprawidłowy email lub hasło'
      });
    }

    
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Zalogowano pomyślnie',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd logowania',
      error: error.message
    });
  }
};



exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania danych użytkownika',
      error: error.message
    });
  }
};