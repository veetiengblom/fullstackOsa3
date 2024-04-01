require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/api/persons", (req, res) => {
  console.log("Phonebook:");
  Person.find({}).then((persons) => {
    console.log(persons);
    res.json(persons);
  });
});

app.post("/api/persons", async (req, res) => {
  console.log(req.body);
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  const checker = await Person.findOne({ name: name });
  if (checker) {
    return res.status(409).json({
      error: "Name already in use",
    });
  }
  const person = new Person({
    name: name,
    number: number,
  });
  console.log(person);

  person.save().then((savedPerson) => {
    console.log("person added");
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  Person.find({}).then((person) => {
    const length = person.length;
    const dateNow = new Date();
    res.write(`Phonebook has info for ${length} people\n`);
    res.write(`${dateNow}`);
    res.end();
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.deleteOne({ _id: id }).then((deletedPerson) => {
    console.log("deleted", deletedPerson);
    res.status(204).end();
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
