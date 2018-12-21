const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);


describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});
describe('Express static', function () {

    it('GET request "/" should return the index page', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  
  });
  
describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
    .get('/DOES/NOT/EXIST')
    .then(res => {
        expect(res).to.have.status(404);
    });
  });

});

describe('Get API notes', function() {

  it('should return 10 notes as an array', function () {
    return chai.request(app)
    .get('/api/notes/')
    .then(res => {
      console.log(typeof res);
      expect(res).to.have.status(200)
      expect(res).to.be.json;
      expect(res.body).to.be.a("array");
      expect(res.body.length).to.be.at.most(10);
      const expectedKeys = ["id", "title", "content"]
      res.body.forEach(function(item) {
        expect(item).to.be.a("object");
        expect(item).to.include.keys(expectedKeys);
      });
      return chai.request(app)
      .get('/api/notes?searchTerm=life')
      .then(res => {
        expect(res).to.have.status(200)
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body[0]).to.be.a("object");
        return chai.request(app)
        .get('/api/notes?searchTerm=DOESNOTEXISTDOESNOTEXISTDOESNOTEXIS')
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("array");
          expect(res.body[0]).to.be.a("undefined");
        });
      })
    });
  });
});

describe('Get a single API note', function() {

  it('should return note object', function () {
    return chai.request(app)
    .get('/api/notes/')
    .then(res => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.a("array");
      const expectedKeys = ["id", "title", "content"]
      res.body.forEach(function(item) {
        expect(item).to.be.a("object");
        expect(item).to.include.keys(expectedKeys);
      });
    });
  });
  it('should respond with a 404 for an invalid id', function() {
    return chai.request(app)
    .get('/api/notes/DOESNOTEXISTDOESNOTEXISTDOESNOTEXIST')
    .then(res=> {
      expect(res).to.have.status(404);
    })
  })
});

describe('POST api notes', function() {
  it('should create and return an item object with location', function () {
    const newItem = { title: "New Title!", content: "So much AWESOME content" };
    return chai.request(app)
    .post('/api/notes')
    .send(newItem)
    .then(res => {
      expect(res).to.have.status(201);
      expect(res).to.be.json;
      expect(res.body).to.be.a("object");
      expect(res.body).to.include.keys("id", "title", "content");
      expect(res.body.id).to.not.equal(null);
      expect(res.body).to.deep.equal(
        Object.assign(newItem, { id: res.body.id })
      );
    });
  });
});

describe('PUT api notes id', function() {
  it('should create and return an item object', function () {
    const updateData = {
      title: "newTitle",
      content: "newContent"
    };
    return chai.request(app)
    .get('/api/notes')
    .then(res => {
      updateData.id = res.body[0].id;
      return chai.request(app)
      .put(`/api/notes/${updateData.id}`)
      .send(updateData);
    })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.deep.equal(updateData);
      })
  });
});

describe('should DELETE item from api notes id', function() {

  it('should delete item by id', function () {
    return chai.request(app)
    .get("/api/notes")
    .then(res => {
      return chai.request(app)
      .delete(`/api/notes/${res.body[0].id}`);
    })
        .then(res => {
          expect(res).to.have.status(204);
        })
    });
  });