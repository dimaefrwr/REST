// Middleware do obsługi błędów 404
exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Zasób nie znaleziony - ${req.originalUrl}`
  });
};


exports.errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Nieprawidłowy format ID';
  }

  
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Wartość już istnieje w bazie danych';
  }

  
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token nieprawidłowy';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token wygasł';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};