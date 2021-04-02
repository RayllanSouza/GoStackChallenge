const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs, likes} = request.body;
  const repos = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: likes
  }
  repositories.push(repos);
  return response.json(repos)
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const index = repositories.findIndex(repository => repository.id === id);

  if(index < 0){
    return response.status(404).json({
      Error: "Repository not found",
    })
  }
  const likes = repositories[index].likes;
  const newRepository = {
    id,
    title: title,
    url: url,
    techs: techs,
    likes: likes
  }

  repositories[index] = newRepository;
  return response.status(201).json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  if(index < 0){
    return response.status(404).json({
      Error: "Repository not found",
    })
  }
  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const index = repositories.findIndex(repository => repository.id === id);
  if(index<0){
    return response.status(400).json({
      Error: "Repository not found",
    })
  }
  var numberLikes = repositories[index].likes
  repositories[index].likes = repositories[index].likes + 1;
  return response.status(200).json(repositories[index])
});

module.exports = app;
