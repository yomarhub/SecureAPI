const path = require('path');
const { Sequelize } = require('sequelize');
const { Hash } = require('./auth');
const dbpath = path.relative(process.cwd(), path.join(__dirname, '../data/database.sqlite'));
const sequilize = new Sequelize('sqlite://' + dbpath);
const { Category, Product, Role, Token, User } = require('../models/init-models')(sequilize);

async function main() {
  await Promise.all([Category, Product, Role, Token, User].map(m => m.destroy({ truncate: true })));
  await sequilize.query('DELETE FROM sqlite_sequence');
  const rand = ({ max = 2000, floor = true } = {}) => floor ? Math.floor(Math.random() * (max - 1)) + 1 : Math.random() * (max - 1) + 1;
  let cr = [];
  for (let n = 1; n <= 2000; n++) {
    cr.push({ name: 'cat' + n });
  }
  await Category.bulkCreate(cr);

  cr = [];
  for (let n = 1; n <= 2000; n++) {
    cr.push({ name: 'product' + n, price: rand({ floor: false }), stock: rand(), categoryId: rand() });
  }
  await Product.bulkCreate(cr);

  cr = [];
  for (let n = 1; n <= 20; n++) {
    cr.push({ role: 'role' + n });
  }
  await Role.bulkCreate(cr);

  cr = [];
  for (let n = 1; n <= 20; n++) {
    cr.push({ username: 'user' + n, hashedPassword: await Hash('pass' + n), roleId: rand({ max: 20 }) });
  }
  await User.bulkCreate(cr);
}

if (module == require.main) main();