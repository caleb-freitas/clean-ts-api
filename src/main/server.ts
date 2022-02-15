import express from "express";

const app = express();
app.listen(5050, () => {
  console.log("server runnig at http://localhost:5050");
});
