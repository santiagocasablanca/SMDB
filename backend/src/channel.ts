import { sequelize, DataTypes } from "./db";
const ChannelModel = sequelize.define("channel", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  channel_d: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: false,
  },
  description: {
    type: DataTypes.TEXT,
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
  logo_url:{
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  channel_created_at: {
    type: DataTypes.DATE,
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

export default ChannelModel;
