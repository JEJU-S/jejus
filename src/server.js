
import express from "express"; 
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import planRouter from "./routers/planRouter";


//express application(server) 만들기
const app = express(); 
// middle ware 패키지 사용
const logger = morgan("dev");

//퍼그 사용
app.set("view engine", "ejs");
app.engine('html', require('ejs').renderFile);
app.set("views", process.cwd() + "/src/views");
app.use(logger)
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/plans", planRouter);

export default app;

