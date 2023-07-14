# This is just a proof of concept. 

No great concerns were taken during the implementation in regard of coding best practises. Although, some of the classic layered architecture were implemented.
This REST API runs on an Express.js server (using Node.js and Sequelize) and has endpoints for performing (mostly) read operations on a PostgreSQL.
The class youtubeService.ts has methods for fetching information regarding Channel and Video information and storing the data into the correspondent tables (models: channel, video, channel_stats and video_stats). The stats table maintain the historic values for the stats (subs, views, likes, comments) for each time the information is fetched from the Youtube API. In order to keep within the API ratee limits, some delays are invoked during the fetching algorithms. 
There's also the backbone of a job service (still on server.ts) responsible for automatic regular fetching (using cron jobs).

Useful commands: 
- docker-compose up
- yarn start
- npx sequelize-cli db:migrate



# (Using this article as backbone) 

Read the entire article here: [https://codevoweb.com/build-a-crud-api-with-nodejs-and-sequelize/](https://codevoweb.com/build-a-crud-api-with-nodejs-and-sequelize/)

