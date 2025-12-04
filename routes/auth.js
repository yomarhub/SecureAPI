const express = require('express');
const { CheckHash } = require('../src/auth');
const cookieParser = require('cookie-parser');
const { UpdateOrCreateToken, FindTokenSession, SendTokens } = require('../src/token');
const router = express.Router();

router.use(cookieParser());
router.post('/login', (req, res) => {
  const { User, Token } = req.app.models;
  const { username, password } = req.body;

  if (username && password) User.findOne({ include: 'role', where: { username } }).then(async user => {
    if (!user || !await CheckHash(password, user.hashedPassword)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = await UpdateOrCreateToken({ Token }, user);
    SendTokens(res, accessToken, refreshToken);
  })
    .catch(e => res.status(500).json(e));
  else res.status(400).json({ message: 'Username and password are required' });
});

router.post('/refresh', async (req, res) => {
  const rtHash = req.cookies?.rt;
  if (!rtHash) return res.status(401).json({ message: 'No refresh token provided' });

  const rt = await FindTokenSession(req.app.models)(rtHash);
  if (!rt || rt.expiresAt < new Date()) return res.status(401).json({ message: (!rt ? 'Invalid' : 'Expired') + ' refresh token' });

  console.log(rt);
  const { accessToken, refreshToken } = await UpdateOrCreateToken(req.app.models, { id: rt.userId });
  SendTokens(res, accessToken, refreshToken);
});

router.post('/logout', (req, res) => {
  req.app.models.Token.destroy({ where: { hash: req.cookies.rt } }).then(() => {
    res.clearCookie('rt', { path: '/', httpOnly: true, secure: true, sameSite: 'lax' });
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;