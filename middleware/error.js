const ErrorResponse = require('../utils/errorResponse');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
 
  error.message = err.message;

  // Log error
  // logger.error(error);


  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }


  // Elevated privileges required error
  if (err.message === 'Elevated privileges required!. Thank you') {
    error = new ErrorResponse(err.message, 403);
  }



  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};


module.exports = errorHandler;