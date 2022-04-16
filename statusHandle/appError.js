const appError = (httpStatus, errMessage, next) =>{
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  const status = `${httpStatus}`.startsWith('4') ? 'fail' : 'error';
  error.status = status;
  next(error);
}

module.exports = appError;