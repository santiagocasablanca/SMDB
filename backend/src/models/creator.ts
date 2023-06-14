import { db, sequelize } from "../util/db";
const Video = db.video;
const Channel = db.channel;
const VideoCreator = db.videoCreator;

module.exports = (sequelize, Sequelize, DataTypes) => {
  const Creator = sequelize.define("creator", {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false,
    },
    custom_url: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    profile_picture: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    banner_picture: {
      type: DataTypes.STRING(1000),
      allowNull: true,
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

  return Creator;
};