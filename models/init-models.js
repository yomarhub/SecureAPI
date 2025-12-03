var DataTypes = require("sequelize").DataTypes;
var _Category = require("./Category");
var _Product = require("./Product");
var _Role = require("./Role");
var _Token = require("./Token");
var _User = require("./User");

function initModels(sequelize) {
  var Category = _Category(sequelize, DataTypes);
  var Product = _Product(sequelize, DataTypes);
  var Role = _Role(sequelize, DataTypes);
  var Token = _Token(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Product.belongsTo(Category, { as: "category", foreignKey: "categoryId"});
  Category.hasMany(Product, { as: "Products", foreignKey: "categoryId"});
  User.belongsTo(Role, { as: "role", foreignKey: "roleId"});
  Role.hasMany(User, { as: "Users", foreignKey: "roleId"});
  Token.belongsTo(User, { as: "user", foreignKey: "userId"});
  User.hasMany(Token, { as: "Tokens", foreignKey: "userId"});

  return {
    Category,
    Product,
    Role,
    Token,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
