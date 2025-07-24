const sequalize = require("./config/db");

(async () => {
  try {
    // Test the database connection
    await sequalize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();