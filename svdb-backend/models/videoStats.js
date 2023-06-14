import { db, sequelize, DataTypes } from "./db";
import {VideoModel} from "./video";

console.log('videoStats');
const VideoStatsModel = db.define("video_stats", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  videoId: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  views: {
    type: DataTypes.DECIMAL(10),
    allowNull: true,
  },
  likes: {
    type: DataTypes.DECIMAL(10),
    allowNull: true,
  },
  comments: {
    type: DataTypes.DECIMAL(10),
    allowNull: true,
  },
  fetchedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});


VideoStatsModel.associate = (models) => {
  VideoStatsModel.hasOne(models.video, {
    foreignKey: 'videoId'
  });
};


export default VideoStatsModel;
