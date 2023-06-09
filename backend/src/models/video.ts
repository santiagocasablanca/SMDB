module.exports = (sequelize, Sequelize, DataTypes) => {

const Video = sequelize.define("video", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  video_id: {
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
  url:{
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
  cast: {
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


Video.associate = (models) => {
  Video.hasOne(models.channel, {
    foreignKey: 'channel_id'
  });
};

return Video;
}
