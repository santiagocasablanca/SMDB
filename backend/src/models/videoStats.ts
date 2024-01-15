import { db, sequelize } from "../util/db";
const dayjs = require('dayjs');

// const { Op } = require('sequelize');
const Video = db.video;
// const Op = Sequelize.Op;
module.exports = (sequelize, Sequelize, DataTypes) => {
  const Op = Sequelize.Op;
  const VideoStats = sequelize.define("video_stats", {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    video_id: {
      type: DataTypes.STRING(50),
      unique: false,
      allowNull: false,
    },
    views: {
      type: DataTypes.DECIMAL(100),
      allowNull: true,
    },
    likes: {
      type: DataTypes.DECIMAL(100),
      allowNull: true,
    },
    comments: {
      type: DataTypes.DECIMAL(100),
      allowNull: true,
    },
    fetched_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  });



  VideoStats.belongsTo(Video, {
    targetKey: "video_id",
    foreignKey: 'video_id'
  });

  VideoStats.beforeCreate(async (videoStats, options) => {
    console.log('beforeCreate')
    // Use the Sequelize model to find and remove duplicates
    const lastRecord = await VideoStats.findOne({
      attributes: ['id', 'video_id', 'fetched_at'],
      where: {
        video_id: videoStats.video_id
      },
      order: [['fetched_at', 'DESC']]
    });

    const isDuplicated = lastRecord && isWithinSameDay(lastRecord.fetched_at, videoStats.fetched_at);

    console.log('isDuplicated', lastRecord?.fetched_at, videoStats.fetched_at, isDuplicated);
    if (isDuplicated) {
      // If duplicates exist, do not proceed with the creation
      // throw new Error('Duplicate record within the same hour.');
      console.log('Duplicate record within the same day. Updating values.');
      // Update the existing record with new values
      await lastRecord.update({
        views: videoStats.views,
        likes: videoStats.likes,
        dislikes: videoStats.dislikes,
        comments: videoStats.comments,
        fetched_at: videoStats.fetched_at,
      });

      // Cancel the creation of a new record
      options.abort = true;
    }
  });

  function isWithinSameDay(timestamp1, timestamp2) {
    return dayjs(timestamp1).isSame(timestamp2, 'day');

  }


  return VideoStats;
}
