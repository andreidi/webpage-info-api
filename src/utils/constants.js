exports.CONSTANTS = {
  DEFAULT_PORT: 3000,
  STATUS: {
    SUCCESS: 'success',
    ERROR: 'error'
  },
  MESSAGES: {
    URL_REQUIRED: 'URL parameter is required',
    GENERIC_ERROR: 'Unable to retrieve page details',
    TOO_MANY_REQUESTS: 'Too many requests. Please try again later.'
  },
  HTTP_CODES: {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  }
};
