const express = require('express');
const randomatic = require('randomatic');

const { Links, Users } = require('./models');
const { router: authRouter, login } = require('./auth');

const rand = (len) => randomatic('Aa0?', len, { chars: '-_' });

const r = new express.Router();

r.use('/auth', authRouter);

r.post('/new', login(true), async (req, res) => {
  if (
    !(
      req.body &&
      req.body.url &&
      req.body.url.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)
    )
  )
    return res.err(400, 'BAD_URL');

  let path;
  if (req.body.path) {
    if (!req.body.path.match(/^[a-z0-9\-_]{4,}$/i))
      return res.err(400, 'CUSTOM_PATH_INVALID');
    const { data, error } = await Links.get(req.body.path);
    if (error) return res.err(500, 'DB_ERROR', error);
    if (data) return res.err(400, 'PATH_TAKEN');
    path = req.body.path;
  } else {
    while (true) {
      let name = rand(5);
      if ((await Links.get(name)).data) continue;
      path = name;
      break;
    }
  }

  const error = await Links.put({
    path,
    url: req.body.url,
    account: req.user ? req.user.id : undefined,
  });
  if (error) return res.err(500, 'SERVER_ERROR', error);

  res.json({ path, url: `${req.protocol}://${req.get('host')}/${path}` });
});

r.get('/link/:path', login(true), async (req, res) => {
  if (!req?.params?.path?.length) return res.err(400, 'MISSING_PATH');

  try {
    const link = (await Links.get(req.params.path))?.data;
    return res.json({ link: link ?? null });
  } catch (error) {
    return res.err(500, 'DB_ERROR', error);
  }
});

r.get('/user', login(), (req, res) =>
  res.json({ user: (({ id, email }) => ({ id, email }))(req.user) })
);

r.use((_, res) => res.err(404, 'NOT_FOUND'));

module.exports = r;
