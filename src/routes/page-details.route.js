const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const { FIELDS_ENUM } = require('../utils/fields.enum');
const { CONSTANTS } = require('../utils/constants');
const { STATUS, MESSAGES, HTTP_CODES } = CONSTANTS;

const router = express.Router();

module.exports = router;

router.get('/api/page-details', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(HTTP_CODES.BAD_REQUEST).json({
      status: STATUS.ERROR,
      error: MESSAGES.URL_REQUIRED
    });
  }

  const fields = req.query.field || [];

  try {
    const { data } = await axios.get(url, {
      validateStatus: status => status < HTTP_CODES.INTERNAL_SERVER_ERROR
    });
    const $ = cheerio.load(data);

    const details = { url };

    if (fields.includes(FIELDS_ENUM.TITLE) || !fields.length) {
      const title = $('head > title').text() || $('title:first').text();

      details[FIELDS_ENUM.TITLE] = title;
    }

    if (fields.includes(FIELDS_ENUM.FAVICON) || !fields.length) {
      let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');

      // Resolve relative favicon URLs
      if (favicon && !favicon.startsWith('http')) {
        const urlObject = new URL(url);

        favicon = `${urlObject.origin}${favicon.startsWith('/') ? '' : '/'}${favicon}`;
      }

      details[FIELDS_ENUM.FAVICON] = favicon;
    }

    if (fields.includes(FIELDS_ENUM.META) || !fields.length) {
      const meta = {};

      $('meta').each((i, elem) => {
        const name = $(elem).attr('name') || $(elem).attr('property');
        const content = $(elem).attr('content');

        if (name && content) {
          meta[name] = content;

          if (name.includes(FIELDS_ENUM.TITLE) && !details[FIELDS_ENUM.TITLE]) {
            details[FIELDS_ENUM.TITLE] = content;
          }
        }
      });

      details[FIELDS_ENUM.META] = meta;
    }

    res.json({
      status: STATUS.SUCCESS,
      data: details
    });
  } catch (error) {
    console.error(error.toJSON());

    res.status(500).json({
      status: STATUS.ERROR,
      message: MESSAGES.GENERIC_ERROR
    });
  }
});
