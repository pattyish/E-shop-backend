function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      status: 401,
      message: "Use Authentication Fail!",
      success: false,
      error: err,
    });
  }
  if (err.name === "ValidationError") {
    return res.status(401).json({
      status: 401,
      success: false,
      error: err,
    });
  }

  return res.status(500).json({
    status: 401,
    success: false,
    error: err,
  });
}

module.exports = errorHandler;
