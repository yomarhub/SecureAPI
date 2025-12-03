const express = require('express');
const router = express.Router();
const map = { products: "Product", categories: "Category", roles: "Role", users: "User", tokens: "Token" };


router.get('/:table', (req, res) => {
  const page = req.query.page ? (parseInt(req.query.page) ?? 0) : 0;
  const limit = parseInt(req.query.count);
  const sort = req.query.sort?.split(",").map(s => [s.replace(/^-/, ""), /^-/.test(s) ? "DESC" : "ASC"])

  const table = req.app.models[map[req.params.table]]
  const options = (page != undefined && page >= 0 && limit >= 0) ? { limit: limit, offset: page * limit } : { limit: 50, offset: 0 };
  if (sort && sort[0].length) options.order = sort

  table.findAndCountAll(options)
    .then(({ count: total, rows }) => res.json({ total, currentPage: page ?? 0, totalPages: Math.ceil(total / limit), entries: rows }))
    .catch(e => res.status(500).json(e));
});

router.post('/:table', (req, res) => {
  const table = req.app.models[map[req.params.table]]
  table.create(req.body)
    .then(entry => res.json(entry))
    .catch(e => res.status(500).json(e));
});

module.exports = router;