import fs from 'fs';
import https from 'https';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import helmet from 'helmet';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import cookieSession from 'cookie-session';

dotenv.config();

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  COOKIE_KEY1: process.env.COOKIE_KEY1,
  COOKIE_KEY2: process.env.COOKIE_KEY2,
};

const AUTH_OPTIONS = {
  callbackURL: '/auth/google/callback',
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

const verify = (_accessTolken, _refreshTolken, profile, done) => {
  console.log('Google profile', profile);
  done(null, profile);
};

passport.use(new Strategy(AUTH_OPTIONS, verify));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;

const app = express();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

app.use(helmet());
app.use(
  cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY1, config.COOKIE_KEY2],
  })
);
app.use(passport.initialize());
app.use(passport.session());

const checkIfLoggedIn = (req, res, next) => {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    res.status(401).json({
      error: 'Please log in',
    });
  }
  next();
};

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['email'],
  }),
  (req, res) => {}
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
  }),
  (_req, res) => {
    res.send('Google called us back!');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logOut();
  req.session = null;
  res.redirect('/');
});

app.get('/secret', checkIfLoggedIn, (_req, res) => {
  return res.send('Your personal secret value is 37!');
});

app.get('/failure', (_req, res) => {
  res.send('Failed to log in');
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https
  .createServer(
    {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert'),
    },
    app
  )
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
