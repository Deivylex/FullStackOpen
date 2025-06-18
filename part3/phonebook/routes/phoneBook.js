const express = require('express');
const router = express.Router();
const Person = require('../models/persons');
const morgan = require('morgan');

morgan.token('body', (req) => JSON.stringify(req.body));

let numbers = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  }
];

const generateId = () => {
  const maxId = numbers.length > 0
    ? Math.max(...numbers.map(n => Number(n.id)))
    : 0;
  return String(maxId + 1);
}

router.get('/', (req, res) => {
  res.send("Welcome to the Phonebook API");
}
);

router.get('/api/persons', (req, respose) => {
    Person.find({}).then(contacts => {
      respose.json(contacts);
    })
})

router.get('/info', (req, respose) => {
    const date = new Date();
    respose.send(`Phonebook has info for ${numbers.length} people<br><br>${date.toString()}`);
})

router.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findById(id).then(person => {
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
  }).catch(error => {
  console.error(error);
  response.status(500).end();
  });
})

router.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  numbers = numbers.filter(person => person.id !== id);
  
  response.status(204).end();
})

router.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    });
  }

  const existingPerson = numbers.find(person => person.name === body.name);
  if (existingPerson) {
    return response.status(400).json({
      error: 'name must be unique'
    });
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  };

  numbers.push(newPerson);
  response.json(newPerson);
}
);

module.exports = router;