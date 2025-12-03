const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.app.models.Product.findAll().then(products => { res.json(products); }).catch(e => res.status(500).json(e));
});
router.post('/', (req, res) => {
  req.app.models.Product.create(req.body).then(product => { res.json(product); }).catch(e => res.status(500).json(e));
});

module.exports = router;