const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Category', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Category',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_Category_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "sqlite_autoindex_Category_2",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
