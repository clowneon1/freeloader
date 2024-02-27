module.exports = {
  createError: (statusCode, message) => {
    const err = new Error(message);
    err.status = statusCode;
    return err;
  },

  routeNotFound: (req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  },

  errorResponse: (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  },
};
