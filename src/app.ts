import * as dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import ExpressRouter from "./express.router";
import bodyParser from "body-parser";
import path from "path";
import sqlite3 from "sqlite3"
sqlite3.verbose()
const app = express();
// Dotenv initialize
dotenv.config();

// Express initialize & settings
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PATCH, POST, OPTIONS, PUT, DELETE");
    next();
});

const db = new sqlite3.Database('D:/webdev/game_api_express/db/game.db', (err) => console.error(err ? err : 'SQLite initialized'))

const expressRoutes = new ExpressRouter(app, db);
expressRoutes.init();

app.listen(process.env.PORT || 5000, () => console.log(`Express server app listening on port ${process.env.PORT}!`));

// export interface IRequest extends Request {
//     token?: string;
// }
