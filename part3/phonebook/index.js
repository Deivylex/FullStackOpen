const express = require('express');
const fs = require('fs');

const app = express();
const port = 3003;

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


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}
);