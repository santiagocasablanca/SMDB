// const dbConfig = require("../util/db.config.js");

// const Sequelize = require("sequelize");
// const POSTGRES_URL = process.env.DATABASE_URL as unknown as string;
// const sequelize = new Sequelize(POSTGRES_URL
// //     , {
// //   host: dbConfig.HOST,
// //   dialect: dbConfig.dialect,
// //   operatorsAliases: false,

// //   pool: {
// //     max: dbConfig.pool.max,
// //     min: dbConfig.pool.min,
// //     acquire: dbConfig.pool.acquire,
// //     idle: dbConfig.pool.idle
// //   }
// // }
// );

// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);

// module.exports = db;




// const db = require("./app/models");
// db.sequelize.sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });