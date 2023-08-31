require("dotenv").config();
const express = require("express");
const userController = require("./controllers/user");
const articleController = require("./controllers/article");
const tenderController = require("./controllers/tender");
const soumissionController = require("./controllers/soumission");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());
app.use("/users", userController);
app.use("/articles", articleController);
app.use("/tenders", tenderController);
app.use("/soumissions", soumissionController);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
        console.log('Connected to mongodb');
      console.log(`Server is listening on port ${PORT}`);
    });
  }) 
  .catch((err) => {
    console.log(err);
  });
