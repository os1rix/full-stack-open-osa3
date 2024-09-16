const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

const url = `mongodb+srv://silvoniemioskari:${password}@fullstackopen.2zqcf.mongodb.net/persons?retryWrites=true&w=majority&appName=fullStackOpen`;

mongoose.connect(url).then(() => {
  console.log("Connected to MongoDB");
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (newName && newNumber) {
  const newPerson = new Person({
    name: newName,
    number: newNumber,
  });
  newPerson.save().then((response) => {
    console.log(`added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    result.forEach((person) => console.log(person));
    mongoose.connection.close();
  });
}
