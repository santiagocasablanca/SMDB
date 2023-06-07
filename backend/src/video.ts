import { sequelize, DataTypes } from "./db";
const VideoModel = sequelize.define("video", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  videoId: {
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
  duration: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  channelId: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  channelTitle: {
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
  url:{
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  tags: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  locations: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  cast: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  publishedAt: {
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

// VideoModel.belongsTo(Foo);

export default VideoModel;
