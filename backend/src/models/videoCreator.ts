import { db, sequelize } from "../util/db";
const dayjs = require('dayjs');

// const { Op } = require('sequelize');
const Video = db.video;
// const Op = Sequelize.Op;
module.exports = (sequelize, Sequelize, DataTypes) => {
  const Op = Sequelize.Op;
  const VideoCreator = sequelize.define("video_creator", {

    video_id: {
      type: DataTypes.STRING(50),
      unique: false,
      allowNull: false,
    },
    creator_id: {
      type: DataTypes.STRING(50),
      unique: false,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: true,
    }
  });

  VideoCreator.belongsTo(Video, {
    targetKey: "video_id",
    foreignKey: 'video_id'
  });

  Video.hasMany(VideoCreator, {
    foreignKey: 'video_id', // Foreign key in the join table referencing the Creator model
    otherKey: 'video_id', // Foreign key in the join table referencing the Video model
  });

  return VideoCreator;
}
