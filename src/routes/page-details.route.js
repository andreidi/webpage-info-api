const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const { FIELDS_ENUM } = require('../utils/fields.enum');

const router = express.Router();

module.exports = router;

router.get('/api/page-details', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({ error: 'URL is required' }, 400);
  }

  const fields = req.query.field || [];

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const details = { url };

    if (fields.includes(FIELDS_ENUM.TITLE) || !fields.length) {
      const title = $('head > title').text() || $('title').text();

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
        }
      });

      details[FIELDS_ENUM.META] = meta;
    }

    res.json({
      status: 'success',
      data: details
    });
  } catch (error) {
    console.error(error.toJSON());

    res.status(500).json({
      status: 'error',
      message: 'Unable to retrieve page details'
    });
  }
});
