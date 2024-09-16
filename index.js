require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person.js");

app.use(express.static("dist"));

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(cors());
app.use(express.json());
morgan.token("body", function (req, res) {
  JSON.stringify(req.body);
});
app.use(requestLogger);

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/persons", (req, res) => {
  Person.find({}).then((person) => {
    res.json(person);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length}</p>\n<p>${new Date()}</p>`
  );
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (!(req.body.name && req.body.number)) {
    return res.status(400).json({ error: "content missing" });
  }
  // } else if (persons.some((person) => person.name === req.body.name)) {
  //   return res.status(400).json({ error: "name must be unique" });
  // }

  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server is running!"));
