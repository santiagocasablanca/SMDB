module.exports = (sequelize, Sequelize, DataTypes) => {
  const Channel = sequelize.define("channel", {

      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      channel_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      customUrl: {
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
      logo_url:{
        type: DataTypes.STRING(1000),
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

    return Channel;
};