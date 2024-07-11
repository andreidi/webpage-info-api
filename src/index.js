const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const { rateLimit } = require('express-rate-limit');
const { CONSTANTS } = require('./utils/constants');
const { DEFAULT_PORT, STATUS, MESSAGES, HTTP_CODES } = CONSTANTS;

const app = express();
const port = process.env.PORT || DEFAULT_PORT;

app.use(express.json());
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 100 * 100,
  max: 25,
  handler: (req, res) =>
    res.status(HTTP_CODES.TOO_MANY_REQUESTS).json({
      status: STATUS.ERROR,
      message: MESSAGES.TOO_MANY_REQUESTS
    }),
});

app.use(limiter);
app.use(require('./routes/page-details.route'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
