import express from "express";
import cors from "cors";
import pkg from "body-parser";
import { courseRouter } from "./router.js";
import { imageRouter } from "./image.router.js";

const app = express();
const { json } = pkg;

app.use(json());
app.use(cors());
app.use("/api", courseRouter);
app.use("/image", imageRouter);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

export default app;
