const { promisify } = require('util');

const express = require('express');
const qs = require('qs');
const jwt_ = require('jsonwebtoken');
const jwt = {
  sign: promisify(jwt_.sign),
  verify: promisify(jwt_.verify),
};

const { generate6Digit } = require('./generate');
const { sendVerifyEmail } = require('./email');
const { Users } = require('./models');

const { API_AUTH_SECRET, API_VERIFY_SECRET } = process.env;
const LOGIN_EXPIRE = 0.5 * 3600;

// LOGIN MIDDLEWARE
module.exports.login = (cont) => async (req, res, next) => {
  const reject = () => {
    if (cont) next();
    else res.err(401, 'UNAUTHORIZED');
  };
  if (!req.get('authorization')) return reject();
  const m = req.get('authorization').match(/^\s*Bearer (.+)\s*$/);
  if (!m) return reject();

  const token = m[1];

  let p = token.match(/^[^.]+\.([^.]+)\.[^.]+$/);
  if (!p) return reject();
  try {
    p = JSON.parse(Buffer.from(p[1], 'base64'));
  } catch (err) {
    return reject();
  }
  if (!(p.data && p.data.email)) return reject();

  const { user, error } = await Users.findByEmail(p.data.email);
  if (error) return res.err(500, 'SERVER_ERROR');
  if (!user) return reject();

  try {
    await jwt.verify(token, user.secret + API_AUTH_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return reject();
  }
};

// AUTH API ROUTER
const r = new express.Router();

r.get('/login', async (req, res) => {
  if (!req.query.email) return res.err(400, 'MISSING_EMAIL');

  let user;
  const { user: user_, error } = await Users.findByEmail(req.query.email);
  if (error) return res.err(500, 'DB_ERROR', error);
  if (user_) user = user_;
  else {
    const { user: user_, error } = await Users.put({ email: req.query.email });
    if (error) return res.err(500, 'DB_ERROR', error);
    user = user_;
  }

  // GENERATE AND STORE 6-DIGIT OPTION
  const code = await generate6Digit();
  let signed;
  try {
    signed = await jwt.sign(
      {
        data: { code },
      },
      user.secret + API_VERIFY_SECRET,
      { expiresIn: LOGIN_EXPIRE }
    );
  } catch (err) {
    return res.err(500, 'TOKEN_ERROR', err);
  }

  const { error: e2 } = await Users.update(user.id, {
    add: { code: signed },
  });
  if (e2) return res.err(500, 'DB_ERROR', e2);

  // generate link option
  let urlToken;
  try {
    urlToken = await jwt.sign(
      {
        data: { email: user.email },
      },
      user.secret + API_VERIFY_SECRET,
      { expiresIn: LOGIN_EXPIRE }
    );
  } catch (err) {
    return res.err(500, 'TOKEN_ERROR', err);
  }

  const e3 = await sendVerifyEmail({
    email: user.email,
    url: `https://www.h-n.me/?${qs.stringify({ verify: urlToken })}`,
    code,
  });
  if (e3) return res.err(500, 'EMAIL_ERROR', e3);
  res.json({ sent: true });
});

r.get('/verify/token', async (req, res) => {
  if (!req.query.token) return res.err(400, 'MISSING_TOKEN');

  let p = req.query.token.match(/^[^.]+\.([^.]+)\.[^.]+$/);
  if (!p) return res.err(401, 'TOKEN_INVALID');
  try {
    p = JSON.parse(Buffer.from(p[1], 'base64'));
  } catch (err) {
    return res.err(401, 'TOKEN_INVALID');
  }
  if (!(p.data && p.data.email)) return res.err(401, 'TOKEN_INVALID');

  const { user, error } = await Users.findByEmail(p.data.email);
  if (error) return res.err(500, 'SERVER_ERROR');
  if (!user) return res.err(401, 'TOKEN_INVALID');

  try {
    await jwt.verify(req.query.token, user.secret + API_VERIFY_SECRET);
  } catch (err) {
    return res.err(401, 'TOKEN_INVALID');
  }

  try {
    const authToken = await jwt.sign(
      { data: { email: user.email } },
      user.secret + API_AUTH_SECRET
    );
    res.json({
      user: (({ id, email }) => ({ id, email }))(user),
      token: authToken,
    });
  } catch (err) {
    return res.err(500, 'SERVER_ERROR');
  }
});
r.get('/verify/code', async (req, res) => {
  if (!(req.query.code && req.query.email))
    return res.err(400, 'MISSING_PARAMS');

  const { user, error } = await Users.findByEmail(req.query.email);
  if (error) return res.err(500, 'SERVER_ERROR');
  if (!(user && user.code)) return res.err(401, 'CODE_INVALID');

  let correctCode;
  try {
    correctCode = (await jwt.verify(user.code, user.secret + API_VERIFY_SECRET))
      .data.code;
  } catch (err) {
    return res.err(401, 'CODE_INVALID');
  }

  if (req.query.code !== correctCode) return res.err(401, 'CODE_INVALID');

  // TODO abstract this (same as for other verify path)
  try {
    const authToken = await jwt.sign(
      { data: { email: user.email } },
      user.secret + API_AUTH_SECRET
    );
    res.json({
      user: (({ id, email }) => ({ id, email }))(user),
      token: authToken,
    });
  } catch (err) {
    return res.err(500, 'SERVER_ERROR');
  }
});

module.exports.router = r;
