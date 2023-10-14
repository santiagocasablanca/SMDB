import { db, sequelize } from "../util/db";

module.exports = (sequelize, Sequelize, DataTypes) => {
  const GameOneLeaderboard = sequelize.define("game_one_leaderboard", {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    player_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    total_rounds: {
      type: DataTypes.DECIMAL(30),
      allowNull: false,
    },
    total_points: {
      type: DataTypes.DECIMAL(30),
      allowNull: false,
    },
    rounds: {
      type: DataTypes.JSONB,
      allowNull: false
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
  },
  );

  return GameOneLeaderboard;
};