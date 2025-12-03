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
    role: {
      type: DataTypes.TEXT,
      allowNull: false
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
