const express = require("express");

const app = express();

const { auth, projects, tasks } = require("./src/routes");
const { connection } = require("./src/db");

connection.connect(() => {
  console.log("Db connected");
});

app.use(express.json());

const PORT = 3000 || process.env.PORT;

app.use("/", auth);
app.use("/", projects);
app.use("/", tasks);

app.listen(PORT, () => {
  console.log("Server is listening to port " + PORT);
});
