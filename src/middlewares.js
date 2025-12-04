const jwt = require('jsonwebtoken');

function TokenChecker() {
  return (req, res, next) => {
    if (!req.headers['authorization']) return res.status(401).json({ message: 'No Authorization header provided' });

    const token = req.headers['authorization'].replace(/^Bearer /, '');
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return res.status(401).json(err);
      req.user = payload;
      next();
    });
  }
}
module.exports = { TokenChecker };