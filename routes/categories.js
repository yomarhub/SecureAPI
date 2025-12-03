const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.app.models.Category.findAll().then(categories => {
    res.json(categories);
  })
    .catch(e => res.status(500).json(e));
});
router.post('/', (req, res) => {
  req.app.models.Category.create(req.body).then(category => {
    res.json(category);
  })
    .catch(e => res.status(500).json(e));
});

module.exports = router;