const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  
  const user = users.find((user) => user.username === username);

  if(!user) {
    return response.status(400).json({
      error: "User account does not exists!"
    });
  }
  request.user = user;

 return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body

  const userExits = users.some(
    (user) => user.username === username
  )

  if(userExits) {
    return response.status(400).json({
      error: "User already exists!"
    })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  } 
  
  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  const uses = users.find(
    (us) => us.username === user.username
  )

  return response.json(uses.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  const {title, deadline} = request.body;
  
  const userTodos = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(userTodos);
  
  return response.status(201).json(userTodos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  const {id} = request.params;

  const {title, deadline} = request.body;

  const todo = user.todos.find(
    (td) => td.id === id 
  );
  
  if (!todo) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);
 
  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
   const {user} = request;

  const {id} = request.params;

  const {title, deadline} = request.body;

  const todo = user.todos.find(
    (td) => td.id === id 
  )

  if (!todo) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  todo.done = true;
 
  return response.status(201).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;

  const {id} = request.params;

  const todo = user.todos.find(
    (td) => td.id === id 
  )

  const todoIndex = user.todos.indexOf(todo);

  if (!todo) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).send();


});

module.exports = app;