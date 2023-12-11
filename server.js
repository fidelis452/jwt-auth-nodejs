const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

app.use(cors());
app.use(express.json());

const posts = [
  {
    username: "fidel",
    title: "fidel's data",
  },
  {
    username: "dave",
    title: "dave's data",
  },
];

app.get("/posts", authToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

app.post("/login", (req, res) => {
  //   authenticate user
  const username = req.body.username;
  const user = { name: username };
  const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accesstoken: accesstoken });
});

// middleware
function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.listen(process.env.PORT, console.log(`listening to port ${process.env.PORT}`));


