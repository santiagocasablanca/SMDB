import { db, sequelize } from "../util/db";
const Creator = db.creator;
const Channel = db.channel;
const VideoCreator = db.videoCreator;
module.exports = (sequelize, Sequelize, DataTypes) => {

  const Video = sequelize.define("video", {

    // id: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   primaryKey: true,
    // },
    video_id: {
      type: DataTypes.STRING(50),
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
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
    duration_parsed: {
      type: DataTypes.INTEGER(1000),
      allowNull: true,
    },
    channel_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    channel_title: {
      type: DataTypes.STRING(50),
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
    dislikes: {
      type: DataTypes.DECIMAL(100),
      allowNull: true,
    },
    comments: {
      type: DataTypes.DECIMAL(100),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    player: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    livestream: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    locations: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    cast_blob: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    original_blob: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    serie: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    game: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    published_at: {
      type: DataTypes.DATE,
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

  Video.belongsTo(Channel, {
    sourceKey: 'channel_id',
    as: 'channel',
    foreignKey: 'channel_id'
  });

  Video.belongsToMany(Creator, {
    // through: 'video_creator',
    through: { model: 'video_creator', unique: false, role: DataTypes.STRING(50) }, // Explicitly specify the table name and set 'unique' to false
    as: 'cast', // Alias to use when accessing the associated videos as cast
    foreignKey: 'video_id', // Foreign key in the join table referencing the Creator model
    otherKey: 'creator_id', // Foreign key in the join table referencing the Video model
  });

  Video.belongsToMany(Creator, {
    through: 'director',
    as: 'directedBy', // Alias to use when accessing the associated videos as cast
    foreignKey: 'video_id', // Foreign key in the join table referencing the Creator model
    otherKey: 'creator_id', // Foreign key in the join table referencing the Video model
  });

  return Video;
}
