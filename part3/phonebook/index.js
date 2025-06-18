require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const Person = require('./models/persons');

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/', (req, res) => {
  res.send("Welcome to the Phonebook API");
}
);

app.get('/api/persons', (req, respose) => {
    Person.find({}).then(contacts => {
      respose.json(contacts);
    })
    .catch(error => {
      console.error(error);
      respose.status(500).json({
        error: 'something went wrong while fetching the persons'
      });
    });
})

app.get('/info', (req, respose) => {
    const date = new Date();
    Person.countDocuments({}).then(numbers => {
    respose.send(`Phonebook has info for ${numbers} people<br><br>${date.toString()}`);
    }
    ).catch(error => {
      console.error(error);
      respose.status(500).json({
        error: 'something went wrong while counting the persons'
      });
    });
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id).then(person => {
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
  }).catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).then(result => {
      response.status(204).end();
  }).catch(error => next(error));
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const body = request.body;
  Person.findByIdAndUpdate(id, {name: body.name, number: body.number}, {new: true})
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
}
);

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    });
  }
  Person.findOne({name: body.name}).then(existingPerson => {
      if (existingPerson){
          if (existingPerson.number === body.number) {
            response.json(existingPerson);
            return;
          }
          Person.findByIdAndUpdate(existingPerson.id, {number: body.number}, {new: true }).then(updatedPerson => {
            response.json(updatedPerson);
          }
          ).catch(error => {
            console.error(error);
            response.status(500).json({
              error: 'something went wrong while updating the person'
            });
          });
          return;
      }
      const person = new Person({
        name: body.name,
        number: body.number,
      });
      person.save().then(savedPerson => {
        response.json(savedPerson);
      }).catch(error => {
        console.error(error);
        response.status(500).json({
          error: 'something went wrong while saving the person'
        });
      }).catch(error => {
        console.error(error);
        response.status(500).json({
          error: 'something went wrong while saving the person'
        });
      });
    });
  }
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

//app.get(/^\/(?!api|info).*/, (req, res) => {
//  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
//});


// Escucha del servidor
const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}
);