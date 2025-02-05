const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const jwt = require("jsonwebtoken");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;

const SECRET_KEY = "mysecret";
const users = {
  userHandle: "DukeNukem",
  password: "123456",
};
const blacklist = [];

const jwtOptions = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};
passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    if (blacklist.includes(payload.jti)) return done(null, false);
    return done(null, payload);
  })
);




const validateJWT = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Authorization header is required" });
  }
  const tokenWithoutBearer = token.replace(/^Bearer\s/, "");
  jwt.verify(tokenWithoutBearer, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired JWT token" });
    }
    req.user = decoded;
    next();
  });
};




app.post("/signup", (req, res) => {
  const { userHandle, password } = req.body;
  if (!userHandle || !password)
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  if (userHandle.length < 6)
    return res
      .status(400)
      .json({ error: "Username must be at least 6 characters" });
  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  users[userHandle] = { password };
  return res.status(201).json({ message: "User created" });
});




app.post("/login", (req, res) => {
  const { userHandle, password, ...rest } = req.body;
  if (!userHandle || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  if (Object.keys(rest).length > 0) {
    return res.status(400).json({ error: "Additional fields are not allowed" });
  }
  if (typeof userHandle !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ error: "Username and password must be strings" });
  }
  const user = users[userHandle];
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (user.password !== password) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = jwt.sign({ userHandle, jti: Date.now() }, SECRET_KEY, {
    expiresIn: "1h",
  });
  return res.status(200).json({ jsonWebToken: token });
});



const highScores = [
  {
    level: "A1",
    userHandle: "PlayerOne",
    score: 30000,
    timestamp: "2020-07-15T12:00:10Z",
  },
  {
    level: "A1",
    userHandle: "PlayerTwo",
    score: 25000,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerThree",
    score: 20000,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerFour",
    score: 15000,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerFive",
    score: 10000,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerSix",
    score: 5000,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerSeven",
    score: 4500,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerEight",
    score: 4000,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerNine",
    score: 3500,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerTen",
    score: 3000,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerEleven",
    score: 2500,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerTwelve",
    score: 2000,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerThirteen",
    score: 1500,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerFourteen",
    score: 1000,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerFifteen",
    score: 900,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerSixteen",
    score: 800,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerSeventeen",
    score: 700,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerEighteen",
    score: 600,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerNineteen",
    score: 500,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerTwenty",
    score: 400,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerTwentyOne",
    score: 300,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerTwentyTwo",
    score: 200,
    timestamp: "2021-06-20T09:30:00Z",
  },
  {
    level: "A1",
    userHandle: "PlayerTwentyThree",
    score: 100,
    timestamp: "2021-06-20T09:30:00Z",
  },
];

app.post("/high-scores", validateJWT, (req, res) => {
  const { score, userHandle, level, timestamp } = req.body;
  if (!score || !userHandle || !level || !timestamp) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  if (typeof score !== "number" || score <= 0) {
    return res.status(400).json({ error: "Valid score is required" });
  }
  highScores.push({ level, userHandle, score, timestamp });
  return res.status(201).json({ message: "Score saved" });
});

app.get("/high-scores", (req, res) => {
  const { level, page = 1 } = req.query;
  if (!level) {
    return res.status(400).json({ error: "Level is required" });
  }
  if (isNaN(page) || page <= 0) {
    return res.status(400).json({ error: "Invalid page number" });
  }
  const filteredScores = highScores.filter((score) => score.level === level);
  if (filteredScores.length === 0) {
    return res.status(200).json([]);
  }
  const sortedScores = filteredScores.sort((a, b) => b.score - a.score);
  const pageSize = 20;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageScores = sortedScores.slice(startIndex, endIndex);
  return res.status(200).json(pageScores);
});



let serverInstance = null;
module.exports = {
  start: function () {
    serverInstance = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  },
  close: function () {
    serverInstance.close();
  },
};
