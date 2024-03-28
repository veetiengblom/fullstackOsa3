const express = require("express");
var morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Marry Poppendick",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.post("/api/persons", (req, res) => {
  console.log(req.body);
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({
      error: "content missing",
    });
  }
  const checker = persons.find((person) => person.name === name);
  if (checker) {
    return res.status(409).json({
      error: "Name already in use",
    });
  }
  const id = String(Math.floor(Math.random() * 100000));
  const obj = {
    id: id,
    name: name,
    number: number,
  };

  persons.push(obj);
  res.json(obj);
});

app.get("/info", (req, res) => {
  const length = persons.length;
  console.log(length);
  const dateNow = new Date();
  console.log(dateNow);
  res.write(`Phonebook has info for ${length} people\n`);
  res.write(`${dateNow}`);
  res.end();
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
