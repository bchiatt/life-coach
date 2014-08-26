/* global describe, before, it, beforeEach */
'use strict';

process.env.DB   = 'life-coach-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('goals', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@example.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('get /', function(){
    it('should fetch the home page', function(done){
      request(app)
      .get('/')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Home');
        done();
      });
    });
  });

  describe('get /register', function(){
    it('should fetch the registration page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        expect(res.text).to.include('Submit');
        done();
      });
    });
  });

  describe('get /login', function(){
    it('should fetch the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        expect(res.text).to.include('Submit');
        done();
      });
    });
  });

  describe('post /login', function(){
    it('should not log in a user when incorrect password', function(done){
      request(app)
      .post('/login')
      .send('email=bob@example.com')
      .send('password=abcd')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /register', function(){
    it('should register a new user', function(done){
      request(app)
      .post('/register')
      .send('email=steve@example.com')
      .send('password=5678')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /register', function(){
    it('should not register a new user', function(done){
      request(app)
      .post('/register')
      .send('email=bob@example.com')
      .send('password=1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('delete /logout', function(){
    it('should logout a user', function(done){
      request(app)
      .delete('/logout')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /goals/new', function(){
    it('should fetch the new goals page', function(done){
      request(app)
      .get('/goals/new')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Name');
        expect(res.text).to.include('Due');
        expect(res.text).to.include('Tags');
        done();
      });
    });
  });

  describe('get /goals/new', function(){
    it('should not fetch the new goals page without authentication', function(done){
      request(app)
      .get('/goals/new')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /goals', function(){
    it('should create a new goal and redirect to the goals index page', function(done){
      request(app)
      .post('/goals')
      .set('cookie', cookie)
      .send('name=become+awesome&due=2020-03-14&tags=this%2C+that%2C+and+other')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('get /goals', function(){
    it('should fetch the goals index page', function(done){
      request(app)
      .get('/goals')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('doctor');
        expect(res.text).to.include('marathon');
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should fetch a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('marathon');
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should not fetch a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000003')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /goals/3/tasks', function(){
    it('should create a task for a specific goal', function(done){
      request(app)
      .post('/goals/a00000000000000000000001/tasks')
      .set('cookie', cookie)
      .send('name=Buy+Monopoly&description=Get+the+board+game.&difficulty=Easy&rank=1')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
});
