require("dotenv").config();
import { Sequelize, DataTypes } from "sequelize";

const POSTGRES_URL = process.env.DATABASE_URL as unknown as string;
console.log(POSTGRES_URL);
const sequelize = new Sequelize(POSTGRES_URL, {
    define: {
        freezeTableName: true,
        timestamps: false
    },
    logging: console.log, // Log queries to the console
    // logQueryParameters: true,
});

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// const User_Profile = sequelize.define('User_Profile', {
//     selfGranted: DataTypes.BOOLEAN
//   }, { timestamps: false });
//   User.belongsToMany(Profile, { through: User_Profile });
//   Profile.belongsToMany(User, { through: User_Profile });

db.videoCreator = sequelize.define('video_creator', {
    role: DataTypes.STRING(50)
}, {
    tableName: 'video_creator'
});

db.creator = require("../models/creator")(sequelize, Sequelize, DataTypes);
db.channel = require("../models/channel")(sequelize, Sequelize, DataTypes);
db.video = require("../models/video")(sequelize, Sequelize, DataTypes);
db.videoStats = require("../models/videoStats")(sequelize, Sequelize, DataTypes);
db.channelStats = require("../models/channelStats")(sequelize, Sequelize, DataTypes);

db.creator.belongsToMany(db.channel, {
    through: 'channel_creator',
    as: 'channels', // Alias to use when accessing the associated creators
    foreignKey: 'creator_id', // Foreign key in the join table referencing the Creator model
    otherKey: 'channel_id', // Foreign key in the join table referencing the Video model
  });

  db.channel.belongsToMany(db.creator, {
    through: 'channel_creator',
    as: 'channel_creators', // Alias to use when accessing the associated creators
    foreignKey: 'channel_id', // Foreign key in the join table referencing the Creator model
    otherKey: 'creator_id', // Foreign key in the join table referencing the Video model
  });


   // Creator has many Videos as Director
  db.creator.belongsToMany(db.video, {
    through: "director", // Name of the join table
    as: 'videosDirected', // Alias to use when accessing the associated videos as director
    foreignKey: 'creator_id', // Foreign key in the join table referencing the Creator model
    otherKey: 'video_id', // Foreign key in the join table referencing the Video model
  });

// db.creator.belongsToMany(db.channel, {
//     through: 'creator_channel', // Name of the join table
//     as: 'creators', // Alias to use when accessing the associated creators
//     foreignKey: 'creator_id', // Foreign key in the join table referencing the Creator model
//     otherKey: 'channel_id', // Foreign key in the join table referencing the Video model
// });

// // Creator has many Videos as Cast (with extra property 'Role')
// db.creator.belongsToMany(db.video, {
//     through: db.cast, // Name of the join table
//     foreignKey: 'creator_id', // Foreign key in the join table referencing the Creator model
//     otherKey: 'video_id', // Foreign key in the join table referencing the Video model
// });

// // Creator has many Videos as Director
// db.creator.belongsToMany(db.video, {
//     through: 'director', // Name of the join table
//     as: 'director', // Alias to use when accessing the associated videos as director
//     foreignKey: 'creator_id', // Foreign key in the join table referencing the Creator model
//     otherKey: 'video_id', // Foreign key in the join table referencing the Video model
// });

export { db, sequelize, Sequelize, DataTypes };
