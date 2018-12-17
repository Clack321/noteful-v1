'use strict';

// Load array of notes
const express = require('express');
const data = require('./db/notes');
const app = express();

app.use(express.static("public"));


app.get('/api/notes', (req, res) => {
  const searchTerm = req.query.searchTerm;
  let returnItems = [];
  for (let i=0; i < data.length; i++) {
    if (data[i].title.includes(searchTerm)) {
      returnItems.push(data[i])
    }
  }
  res.json(returnItems);
});

app.get('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  let Item = data.find( item => item.id === Number(id));
  res.json(Item);
})

app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`)
}).on('error', err => {
  console.error(err);
})




// INSERT EXPRESS APP CODE HERE...
