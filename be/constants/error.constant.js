const ErrorConstants = {
  NOT_FOUND: {
    message: 'Resource not found',
    statusCode: 404,
    errorCode: 1,
  },
  ALREADY_EXISTS: {
    message: 'Resource already exists',
    statusCode: 409,
    errorCode: 2,
  },
  BAD_REQUEST: {
    message: 'Bad request',
    statusCode: 400,
    errorCode: 3,
  },
  UNAUTHORIZED: {
    message: 'Unauthorized',
    statusCode: 401,
    errorCode: 4,
  },
  INTERVAL_SERVER_ERROR: {
    message: 'Internal server error',
    statusCode: 500,
    errorCode: 5,
  },
  SUCCESSFUL: {
    message: 'Successful',
    statusCode: 200,
    errorCode: 0,
  },
};

module.exports = { ErrorConstants };
