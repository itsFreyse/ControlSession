const app = require("./app");
const sequelize = require("./config/db");
const User = require("./models/user");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida.");
    await sequelize.sync(); 

    // Sincronizar modelos
    await sequelize.sync();
    console.log("Modelos sincronizados.");

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
})();