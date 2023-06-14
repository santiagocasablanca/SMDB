import { db, DataTypes } from "./db";
const ChannelStatsModel = db.define("channel_stats", {

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
    type: DataTypes.DECIMAL(10),
    allowNull: true,
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

export default ChannelStatsModel;
