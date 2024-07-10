const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const { rateLimit } = require('express-rate-limit')

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 100 * 100,
  max: 25
});

app.use(limiter);
app.use(require('./routes/page-details.route'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
