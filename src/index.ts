import * as dotenv from "dotenv";
import * as fs from "fs";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { pagination } from "typeorm-pagination";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { Routes } from "./routes";

dotenv.config();

const PORT = process.env.PORT || 8080;
const app: Application = express();

const corsOption = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "250mb" }));
app.use(express.urlencoded({ limit: "250mb", extended: true }));
app.use(pagination);
app.use(cookieParser());
app.use(cors(corsOption));

app.get("/", (_, res) => {
  res.json({
    message: "Hello I am from root",
    status: 202,
  });
});

Routes(app); //contain all api routes

//Swagger setup part
const swaggerDocument = JSON.parse(
  fs.readFileSync(`${__dirname}/swagger.json`, "utf-8")
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("*", (_, res) => {
  res.json({
    message: "No API Route found!!",
    status: 202,
  });
});

createConnection()
  .then(async () => {
    console.log(`server is connected to the database!!!`);
    app.listen(PORT, () => {
      console.log(`server is connected to ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
