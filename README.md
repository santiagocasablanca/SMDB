# SVDB
Sidemen Video Database

Visit here: https://svdb.ddns.net/#/home/

STILL UNDER CONSTRUCTION

This is a proof of concept for a youtube IMDb inspired web application, using Sidemen and other youtubers that often collaborate within the scene as Creators.

It uses a traditional sql model for storing the Channel and Video data fetched from Youtube using the Youtube Api, having 'introduced' the concept/table of Creator in order to represent multiple Channels owned by one Creator and simultaneously Channels owned by multiple Creators.

The tables Channel_Stats and Video_Stats are used for keeping (the evolution of the channel/video) stats over time.

It also introduces the concepts of 'directed_by' used for representing the main creator(s) responsible for a given video and the 'cast' (creator_id, role) used for storing the creators that appear on each video.


Inspirations:
https://mattw.io/youtube-metadata/
https://codevoweb.com/wp-content/uploads/2023/01/Build-a-CRUD-API-with-Node.js-and-Sequelize.webp

#Technologies used: Nodejs, expressjs, docker, sequelize, postgresql, react

