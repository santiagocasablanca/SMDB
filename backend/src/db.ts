require("dotenv").config();
import { Sequelize, DataTypes } from "sequelize";
import ChannelModel from "./channel";
import ChannelStatsModel from "./channelStats";
import VideoStatsModel from "./videoStats";

const POSTGRES_URL = process.env.DATABASE_URL as unknown as string;
const sequelize = new Sequelize(POSTGRES_URL);


async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync().then(()=> {
      console.log('out here');
      // ChannelModel.findALL();
    });

    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export { connectDB, sequelize, Sequelize, DataTypes };
