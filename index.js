require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/api/persons", (req, res, next) => {
  console.log("Phonebook:");
  Person.find({})
    .then((persons) => {
      console.log(persons);
      res.json(persons);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", async (req, res, next) => {
  let { name, number } = req.body;

  name = name.trim();
  number = number.trim();

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

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((person) => {
      const length = person.length;
      const dateNow = new Date();
      res.write(`Phonebook has info for ${length} people\n`);
      res.write(`${dateNow}`);
      res.end();
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;
  if (number.trim() === "") {
    return res.status(400).json({
      error: "content missing",
    });
  }
  const person = {
    name: name,
    number: number,
  };
  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
