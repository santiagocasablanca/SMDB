import { db, sequelize } from "../util/db";
const Channel = db.channel;
const dayjs = require('dayjs');

module.exports = (sequelize, Sequelize, DataTypes) => {
  const ChannelStats = sequelize.define("channel_stats", {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    channel_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    subs: {
      type: DataTypes.DECIMAL(100),
      allowNull: true,
    },
    videos: {
      type: DataTypes.DECIMAL(100),
      allowNull: true,
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

  ChannelStats.belongsTo(Channel, {
    targetKey: "channel_id",
    foreignKey: 'channel_id'
  });

  ChannelStats.beforeCreate(async (channelStats, options) => {
    console.log('beforeCreate')
    // Use the Sequelize model to find and remove duplicates
    const lastRecord = await ChannelStats.findOne({
      attributes: ['id', 'channel_id', 'fetched_at'],
      where: {
        channel_id: channelStats.channel_id
      },
      order: [['fetched_at', 'DESC']]
    });

    const isDuplicated = lastRecord && isWithinSameDay(lastRecord.fetched_at, channelStats.fetched_at);

    console.log('isDuplicated', lastRecord?.fetched_at, channelStats.fetched_at, isDuplicated);
    if (isDuplicated) {
      // If duplicates exist, do not proceed with the creation
      // throw new Error('Duplicate record within the same hour.');
      console.log('Duplicate record within the same day. Updating values.');
      // Update the existing record with new values
      await lastRecord.update({
        subs: channelStats.subs,
        videos: channelStats.videos,
        views: channelStats.views,
        likes: channelStats.likes,
        comments: channelStats.comments,
        fetched_at: channelStats.fetched_at,
      });

      // Cancel the creation of a new record
      options.abort = true;
    }
  });

  function isWithinSameDay(timestamp1, timestamp2) {
    return dayjs(timestamp1).isSame(timestamp2, 'day');

  }

  return ChannelStats;
};