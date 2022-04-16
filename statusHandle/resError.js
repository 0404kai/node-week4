const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('出現重大錯誤', err);
    res.status(500).json({
      status: 'error',
      message: '系統錯誤，請恰系統管理員'
    });
  }
};

module.exports = {resErrorDev, resErrorProd}