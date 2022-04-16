const success = (res, post) =>{
  res.status(200).json({
    status: 'success',
    post
  });
}

module.exports = success;