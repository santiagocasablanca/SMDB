import { db, sequelize } from "../util/db";
const Video = db.video;

module.exports = (sequelize, Sequelize, DataTypes) => {

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


  return VideoStats;
}
