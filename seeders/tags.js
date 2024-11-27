require("dotenv").config();
const mongoose = require("mongoose");
const Model = require("../resources/v1/tags/tag.model");

mongoose
  .connect(process.env.DATABASE_URL, {})
  .then(() => {
    console.log("connection open !!");
  })
  .catch((err) => {
    console.error(err);
  });

const tagsData = [
  {
    name: "Tag 1",
  },
  {
    name: "Tag 2",
  },
  {
    name: "Tag 3",
  },
  {
    name: "Tag 4",
  },
  {
    name: "Tag 5",
  },
  {
    name: "Tag 6",
  },
  {
    name: "Tag 7",
  },
  {
    name: "Tag 8",
  },
  {
    name: "Tag 9",
  },
  {
    name: "Tag 10",
  }
];

const seedDB = async () => {
  await Model.deleteMany({});
  await Model.insertMany(tagsData);
};

seedDB().then(() => {
  mongoose.connection.close();
});
