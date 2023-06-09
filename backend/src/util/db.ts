require("dotenv").config();
import { Sequelize, DataTypes } from "sequelize";

const POSTGRES_URL = process.env.DATABASE_URL as unknown as string;
console.log(POSTGRES_URL);
const sequelize = new Sequelize(POSTGRES_URL);


const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.channel = require("../models/channel")(sequelize, Sequelize, DataTypes);
db.video = require("../models/video")(sequelize, Sequelize, DataTypes);
db.videoStats = require("../models/videoStats")(sequelize, Sequelize, DataTypes);
db.channelStats = require("../models/channelStats")(sequelize, Sequelize, DataTypes);

export { db, sequelize, Sequelize, DataTypes };
