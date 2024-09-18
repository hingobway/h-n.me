const serverless = require('serverless-http');
const express = require('express');

// INIT //

if (process.env.IS_OFFLINE) {
  require('dotenv').config();
}

const { Links } = require('./src/models');

// BEGIN ROUTER //

const app = express();

app.use(require('cors')());

app.use(require('./src/err'));

app.use(express.json());

app.use('/api', require('./src/api'));

app.get('/:path', async (req, res, next) => {
  if (!(req.params && req.params.path)) return res.err(400, 'PATH_REQUIRED');

  const { data: entry, error } = await Links.get(req.params.path);
  if (error) return res.err(500, 'SERVER_ERROR_UNKNOWN', error);

  if (!entry) return next();
  if (!entry.url) return res.err(500, 'SERVER_ERROR_NO_URL');

  res.redirect(entry.url);
});

app.get('/', (_, res) => res.redirect('https://www.h-n.me/'));

app.use((req, res) => res.redirect(`https://www.h-n.me${req.originalUrl}`));

module.exports.handler = serverless(app);
