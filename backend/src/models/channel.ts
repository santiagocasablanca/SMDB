import { db, sequelize } from "../util/db";
const Creator = db.creator;

module.exports = (sequelize, Sequelize, DataTypes) => {

  const Channel = sequelize.define("channel", {

    // id: {
    //   type: DataTypes.UUID,
    //   defaultValue: DataTypes.UUIDV4,
    //   primaryKey: true,
    // },
    channel_id: {
      type: DataTypes.STRING(50),
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    custom_url: {
      type: DataTypes.STRING(30),
      allowNull: true,
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
    logo_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    banner_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    playlist_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    channel_created_at: {
      type: DataTypes.DATE,
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

  Channel.belongsToMany(Creator, {
    through: 'channel_creator',
    as: 'creators', // Alias to use when accessing the associated creators
    foreignKey: 'channel_id', // Foreign key in the join table referencing the Creator model
    otherKey: 'creator_id', // Foreign key in the join table referencing the Video model
  });

  // Channel.belongsToMany(Creator, {
  //   through: 'creator_channel', // Name of the join table
  //   as: 'creators', // Alias to use when accessing the associated creators
  //   foreignKey: 'creator_id', // Foreign key in the join table referencing the Creator model
  //   otherKey: 'channel_id', // Foreign key in the join table referencing the Video model
  // });

  // Channel.hasMany(models.video, { sourceKey: 'channel_id', foreignKey: 'barTitle' });

  // // Creator has many Videos as Cast (with extra property 'Role')
  // Channel.belongsToMany(models.video, {
  //   through: 'cast', // Name of the join table
  //   as: 'cast', // Alias to use when accessing the associated videos as cast
  //   foreignKey: 'creator_id', // Foreign key in the join table referencing the Creator model
  //   otherKey: 'video_id', // Foreign key in the join table referencing the Video model
  // });



  return Channel;
};