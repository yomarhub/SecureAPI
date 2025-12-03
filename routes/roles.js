const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.app.models.Role.findAll().then(roles => { res.json(roles); }).catch(e => res.status(500).json(e));
});
router.post('/', (req, res) => {
  req.app.models.Role.create(req.body).then(role => { res.json(role); }).catch(e => res.status(500).json(e));
});

module.exports = router;