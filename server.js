//import necessary packages
const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

//initialize Express app
const app = express();
app.use(express.json());

//connect to sql database
const sequelize = new Sequelize(process.env.DATABASE_URL || "sqlite::memory:", {
  dialect: "sqlite",
  logging: false,
});

//define the posts model
const Post = sequelize.define("Post", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

//create API endpoint to get all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//create API endpoint to insert a new post
app.post("/posts", async (req, res) => {
  try {
    const { title, description, tag, image } = req.body;
    const newPost = await Post.create({ title, description, tag, image });
    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//start the server
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
