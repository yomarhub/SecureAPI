const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const map = { products: "Product", categories: "Category", roles: "Role", users: "User", tokens: "Token" };


router.get('/:table', (req, res) => {
  const page = req.query.page ? (parseInt(req.query.page) ?? 0) : 0;
  const limit = parseInt(req.query.count);
  const sort = req.query.sort?.split(",").map(s => [s.replace(/^-/, ""), /^-/.test(s) ? "DESC" : "ASC"])

  // JSON:API filter support - filter[field][operator]=value
  const filters = {};
  Object.keys(req.query).forEach(key => {
    // Match filter[field][operator]=value
    const operatorMatch = key.match(/^filter\[(\w+)\]\[(\w+)\]$/);
    // Match filter[field]=value (exact match)
    const simpleMatch = key.match(/^filter\[(\w+)\]$/);

    if (operatorMatch) {
      const field = operatorMatch[1];
      const operator = operatorMatch[2];
      const value = req.query[key];

      // Map operator names to Sequelize operators
      const opMap = {
        'eq': Op.eq,
        'ne': Op.ne,
        'gt': Op.gt,
        'gte': Op.gte,
        'lt': Op.lt,
        'lte': Op.lte,
        'like': Op.like,
        'notLike': Op.notLike,
        'in': Op.in,
        'notIn': Op.notIn,
        'between': Op.between
      };

      if (opMap[operator]) {
        if (!filters[field]) filters[field] = {};
        // Handle array values for 'in', 'notIn', 'between'
        const processedValue = ['in', 'notIn', 'between'].includes(operator)
          ? value.split(',')
          : value;
        filters[field][opMap[operator]] = processedValue;
      }
    } else if (simpleMatch) {
      filters[simpleMatch[1]] = req.query[key];
    }
  });

  const table = req.app.models[map[req.params.table]]
  const options = (page != undefined && page >= 0 && limit >= 0) ? { limit: limit, offset: page * limit } : { limit: 50, offset: 0 };
  if (sort && sort[0].length) options.order = sort
  if (Object.keys(filters).length > 0) options.where = filters;

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