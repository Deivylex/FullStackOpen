import Filter from './component/filter';
import PersonForm from './component/form';
import Persons from './component/person';
import { useEffect, useState } from 'react';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
  personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons);
    });
}, []);

  const personsToShow = filter
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons;
  
  const handleDelete = (id, name) => {
      if (window.confirm(`Delete ${name}?`)) {
    personService.deletePerson(id)
    .then(() => { 
      setPersons(persons.filter(p => p.id !== id));
      setSuccessMessage(`deleted contact ${name}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }).catch(error => {
        setErrorMessage(`Error deleting ${name}`);
        setTimeout(() => setErrorMessage(null), 5000);
      });
  }
  }
  
  const addPerson = (e) => {
    e.preventDefault();
    const exists = persons.some(p => p.name === newName);
    if (exists) 
    {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) 
      {
        const personToUpdate = persons.find(p => p.name === newName);
        const updatedPerson = { ...personToUpdate, number: newNumber };
        personService.update(personToUpdate.id, updatedPerson).then(returnedPerson => {
          setPersons(persons.map(p => (p.id !== returnedPerson.id ? p : returnedPerson)));
          setNewName('');
          setNewNumber('');
          setSuccessMessage(`Updated contact ${returnedPerson.name}`);
          setTimeout(() => setSuccessMessage(null), 3000);
        })
      }
      return;
    }
    if (newName === "")
    {
      setErrorMessage('no valid name to add to the contact list');
      setNewNumber('');
      setTimeout(() => setErrorMessage(null), 3000);
      return ;
    }
    const personObject = {
      name: newName,
      number: newNumber,
    };
    personService.create(personObject).then(returnedPerson => {
    setPersons(persons.concat(returnedPerson));
    setNewName('');
    setNewNumber('');
    setSuccessMessage(`added succes contact ${returnedPerson.name}`);
    setTimeout(() => setSuccessMessage(null), 3000);
    }).catch(error =>{
    setErrorMessage(`Error: ${error.response?.data?.error || 'Could not add person'}`);
    setTimeout(() => setErrorMessage(null), 5000);
  });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={(e) => setFilter(e.target.value)} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
        onNameChange={(e) => setNewName(e.target.value)}
        onNumberChange={(e) => setNewNumber(e.target.value)}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={handleDelete}/>
      {errorMessage &&
      <div style={{color : 'red'}}> {errorMessage} </div>}
      {successMessage &&
      <div style={{color : 'green'}}> {successMessage} </div>}
    </div>
  );
};

export default App;
