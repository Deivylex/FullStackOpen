const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('arguments. Usage: node mongo.js <password> <name> <number>');
    process.exit(1);
}
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://transcendencetheboys:${password}@cluster0.tegfttq.mongodb.net/Phonebook?`;

mongoose.set('strictQuery',false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema, 'contacts');

if (process.argv.length < 4) {
  Person.find({}).then(result => {
    console.log('Phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
  return;
}

const person = new Person({
  name: name,
  number: number,
});


person.save().then(result => {
  console.log(`added ${name} number ${number} to phonebook`);
  mongoose.connection.close();
})

