const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { datetoken } = require('datetoken');

const GenerateAccessToken = ({ id, role }) => jwt.sign({ userId: id, role }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRATION });
const GenerateRefreshToken = ({ id }) => ({
  userId: id,
  hash: crypto.randomBytes(32).toString('hex'),
  expiresAt: datetoken("now+" + process.env.JWT_REFRESH_EXPIRATION)
});
const GenerateTokens = (user) => ({ accessToken: GenerateAccessToken(user), refreshToken: GenerateRefreshToken(user) })

const SendTokens = (res, accessToken, { hash, expiresAt }) => res.cookie('rt', hash, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  expires: expiresAt
}).json({ accessToken });

function FindTokenSession({ Token }) {
  return async function (key) {
    return await Token.findOne({ where: { hash: key } });
  }
}

async function UpdateOrCreateToken({ Token }, user) {
  const { accessToken, refreshToken } = GenerateTokens(user);
  const [logedUser, created] = await Token.findOrCreate({
    where: { userId: user.id },
    defaults: refreshToken
  });
  if (!created) await logedUser.update(refreshToken);

  return { accessToken, refreshToken };
}

module.exports = { GenerateAccessToken, GenerateRefreshToken, GenerateTokens, SendTokens, FindTokenSession, UpdateOrCreateToken };