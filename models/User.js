const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Role',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'User',
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        name: "sqlite_autoindex_User_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
