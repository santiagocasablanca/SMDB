import { Request, Response } from "express";
const dayjs = require('dayjs')
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;

import { db, sequelize } from "../util/db";
import {  SearchReqQuery } from "./types";
const GameOneLeaderboard = db.gameOneLeaderboard;
const { v4: uuidv4 } = require('uuid');


export const fetchLeaderboardController = async (
  req: Request<{}, {}, {}, SearchReqQuery>,
  res: Response
) => {
  try {
    
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    //sort 
    let sort = req.query.sort ? req.query.sort.split('%') : ['total_points', 'DESC'];

    // TODO implement this query! more views and likes over videos uploaded on range
    // limit, offset: skip,
    const results = await GameOneLeaderboard.findAndCountAll({
       order: [sort]});
    


    res.status(200).json({
      status: "success",
      count: results.count,
      results: results.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const addToLeaderboardController = async (
  req: Request,
  res: Response) => {

  try {
    console.log('STARTING: ', req.body);
    const player_name = req.body.player_name;
    const total_points = req.body.total_points;
    const total_rounds = req.body.total_rounds;
    const rounds = req.body.rounds;
    
    const lb = await GameOneLeaderboard.create({
      id: uuidv4(),
      player_name: player_name,
      total_points: total_points,
      total_rounds: total_rounds,
      rounds: rounds,
      created_at: new Date(),
      updated_at: new Date()
  });
    

    res.status(200).json({
      status: "success",
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
