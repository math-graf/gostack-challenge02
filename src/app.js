const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params

  if (!isUuid(id)) return response.status(400).json({ error: 'ID de repositório inválido.' })

  next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const data = {...request.body, id: uuid(), likes: 0}

  repositories.push(data)
  return response.json(data)
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  repositories[repositoryIndex] = {...request.body, id: id, likes: repositories[repositoryIndex].likes}

  return response.json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  repositories.splice(repositoryIndex, 1)

  return response.status(204).json()
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  repositories[repositoryIndex].likes++

  return response.json(repositories[repositoryIndex])
});

module.exports = app;