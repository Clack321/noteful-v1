const express = require('express');
const notesRouter = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');  
const notes = simDB.initialize(data);

notesRouter.get('/notes', (req, res, next) => {
    const { searchTerm } = req.query;
    notes.filter(searchTerm)
    .then(list => {
      return res.json(list); // responds with filtered array      
    })
    .catch(err => {
      next(err)
    });
  });

notesRouter.get('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  notes.find(id)
  .then(item => {
    if (item) {
      res.json(item);
    } else {
      next();
    }
  })
  .catch(err => {
    next(err)
  });
});
 
  
  notesRouter.put('/notes/:id', (req, res, next) => {
    const id = req.params.id;
  
    /***** Never trust users - validate input *****/
    const updateObj = {};
    const updateFields = ['title', 'content'];
  
    updateFields.forEach(field => {
      if (field in req.body) {
        updateObj[field] = req.body[field];
      }
    });
  
    notes.update(id, updateObj).then((item) => {
      if (item) {
        return res.json(item);
      } else {
        next()
      }})
      .catch(err => {
        next(err);
      })
    }
  );

  notesRouter.post('/notes', (req, res, next) => {
    const { title, content } = req.body;
    console.log(req.body);
    const newItem = { title, content };
    /***** Never trust users - validate input *****/
    if (!newItem.title) {
      const err = new Error('Missing `title` in request body');
      err.status = 400;
      return next(err);
    }
  
    notes.create(newItem).then((item) => {
      if (item) {
        res.location(`/api/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    }).catch( err => {
      next(err)
    });
  });

  notesRouter.delete('/notes/:id', (req, res, next) => {
    id = req.params.id
    notes.delete(id).then( (item) => {
        if (item) {
            res.status(204).end();
        } else {
            next();
        }
    }).catch( err => {
      next(err);
    })
  });
  
module.exports = notesRouter;