/* global describe, before, it, beforeEach */
'use strict';

process.env.DB   = 'life-coach-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('tasks', function(){
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

  describe('post /goals/3/tasks', function(){
    it('should create a task for a specific goal', function(done){
      request(app)
      .post('/goals/a00000000000000000000003/tasks')
      .set('cookie', cookie)
      .send('name=Buy+Monopoly&description=Get+the+board+game.&difficulty=Easy&rank=1')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
});
