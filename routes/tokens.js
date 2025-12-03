const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.app.models.Token.findAll().then(tokens => { res.json(tokens); }).catch(e => res.status(500).json(e));
});
router.post('/', (req, res) => {
  req.app.models.Token.create(req.body).then(token => { res.json(token); }).catch(e => res.status(500).json(e));
});

module.exports = router;