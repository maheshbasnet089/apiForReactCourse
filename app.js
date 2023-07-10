const express = require("express");
const app = express();
const Blog = require("./model/blogModel");
const mongoConnection = require("./database/db");
require("dotenv").config();
const { multer, storage } = require("./utils/multerConfig");
const exp = require("constants");
const upload = multer({ storage: storage });

mongoConnection(process.env.MONGO_URI);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("uploads"));

app.post("/blogs", upload.single("image"), async (req, res) => {
  if (!req.file || !req.body.title || !req.body.description) {
    return res.json({
      status: 400,
      message: "Please fill all the fields  title, description and image",
    });
  }
  const image = req.file.filename;
  try {
    const blog = await Blog.create({
      title: req.body.title,
      description: req.body.description,
      image: process.env.Backend_URL + image,
    });
    res.json({
      status: 200,
      message: "Blog created successfully",
    });
  } catch (e) {
    res.json({
      status: 400,
      message: e.message,
    });
  }
});

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({
      status: 200,
      blogs: blogs,
    });
  } catch (e) {
    res.json({
      status: 400,
      message: e.message,
    });
  }
});
app.all("*", (req, res) => {
  res.json({
    status: 404,
    message: "Page not found",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
