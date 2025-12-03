const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Role', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    role: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'Role',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_Role_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "sqlite_autoindex_Role_2",
        unique: true,
        fields: [
          { name: "role" },
        ]
      },
    ]
  });
};
