const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// GET Notes with search
notes.filter('to', (err, list) => {
  if (err) {
    console.error(err);
  }
  console.log(list);
});

// GET Notes by ID
notes.find(1005, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

// PUT (Update) Notes by ID
const updateObj = {
  title: 'New Title',
  content: 'Blah blah blah'
};

notes.update(1005, updateObj, (err, item) => {
  if (err) {
    console.error(err);
  }
  if (item) {
    console.log(item);
  } else {
    console.log('not found');
  }
});

//Create Notes by ID
const createObj = {
    //id = (notes.length + 1000),
    title: 'New Title',
    content: 'Blah blah blah'
  };


notes.create(createObj, (err, item) => {
    if (err) {
      console.error(err);
    }
    if (item) {
        console.log(item);
    } else {
        console.log('not found');
    }
});

notes.delete(1010, (err, item) => {
    if (err) {
        console.log(err);
    }
    if (item) {
        console.log("failed to delte" + item);
    } else {
        console.log('Delted item');
    }
})