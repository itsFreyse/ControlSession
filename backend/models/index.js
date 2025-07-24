const sequelize = require("sequelize");
const User = require("./user");
const RefreshToken = require("./refreshToken");

// Relaciones
User.hasMany(RefreshToken, {
  foreignKey: "userId",
  as: "refreshTokens",
});

RefreshToken.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = {
  User,
  RefreshToken,
  sequelize,
};
