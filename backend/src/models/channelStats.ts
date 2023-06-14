import { db, sequelize } from "../util/db";
const Channel = db.channel;

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


  return ChannelStats;
};