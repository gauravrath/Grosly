import sequelize from "./db.js";
import User from "./models/users.js";

(async () => {
  await sequelize.sync({ alter: true });
  console.log("Database synced");
})();

export { sequelize, User };
