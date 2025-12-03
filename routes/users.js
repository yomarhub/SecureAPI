const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.app.models.User.findAll().then(users => { res.json(users); }).catch(e => res.status(500).json(e));
});
router.post('/', (req, res) => {
  req.app.models.User.create(req.body).then(user => { res.json(user); }).catch(e => res.status(500).json(e));
});

module.exports = router;