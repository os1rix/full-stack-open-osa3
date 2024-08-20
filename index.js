const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());
morgan.token("body", function (req, res) {
  JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const filteredPerson = persons.find((person) => person.id === id);
  if (filteredPerson) {
    res.json(filteredPerson);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length}</p>\n<p>${new Date()}</p>`
  );
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id === id);
});

app.post("/api/persons", (req, res) => {
  if (!(req.body.name && req.body.number)) {
    return res.status(400).json({ error: "content missing" });
  } else if (persons.some((person) => person.name === req.body.name)) {
    return res.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    name: req.body.name,
    number: req.body.number,
    id: Math.floor(Math.random() * 10000),
  };

  persons = persons.concat(newPerson);

  res.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => console.log("Server is running!"));
