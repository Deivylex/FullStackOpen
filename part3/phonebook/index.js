const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3003;
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let numbers =
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

const generateId = () => {
  const maxId = numbers.length > 0
    ? Math.max(...numbers.map(n => Number(n.id)))
    : 0;
  return String(maxId + 1);
}


app.get('/', (req, res) => {
  res.send("Welcome to the Phonebook API");
}
);

app.get('/api/persons', (req, respose) => {
    respose.send(numbers);
})

app.get('/info', (req, respose) => {
    const date = new Date();
    respose.send(`Phonebook has info for ${numbers.length} people<br><br>${date.toString()}`);
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = numbers.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  numbers = numbers.filter(person => person.id !== id);
  
  response.status(204).end();
})

app.post('/api/persons', (request, response) => {
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}
);