const { Sequelize } = require('sequelize');
const sequilize = new Sequelize('sqlite://../data/database.sqlite');
const { Category, Product, Role, Token, User } = require('../models/init-models')(sequilize);

async function main() {
  await Promise.all([Category, Product, Role, Token, User].map(m => m.destroy({ truncate: true })))
  await sequilize.query("DELETE FROM sqlite_sequence")
  const rand = (max = 500) => Math.floor(Math.random() * max)
  let cr = [];
  for (let n = 1; n <= 2000; n++) {
    cr.push(Category.create({ name: "cat" + n }));
  }
  await Promise.allSettled(cr)

  cr = [];
  for (let n = 1; n <= 2000; n++) {
    cr.push(Product.create({ name: "product" + n, price: rand(), stock: 0, categoryId: rand() }));
  }
  await Promise.allSettled(cr)

  cr = [];
  for (let n = 1; n <= 2000; n++) {
    cr.push(Role.create({ role: "role" + n }));
  }
  await Promise.allSettled(cr)

  cr = [];
  for (let n = 1; n <= 2000; n++) {
    cr.push(User.create({ username: "user" + n, roleId: rand() }));
  }
  await Promise.allSettled(cr)
}

if (module == require.main) main()