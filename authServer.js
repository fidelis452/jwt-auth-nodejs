const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

app.use(cors());

app.use(express.json());

let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });

    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})


app.post("/login", (req, res) => {
  //   authenticate user
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);

  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
  });
}

app.listen(
  process.env.AuthPORT,
  console.log(`listening to port ${process.env.AuthPORT}`)
);
