const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
require("./db/mongoose");
const userRouter = require("./router/user");
const taskRouter = require("./router/tasks");
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(port, () => {
    console.log("Server started on ", port);
});