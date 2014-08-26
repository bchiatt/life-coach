/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Task      = require('../../app/models/task'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    db        = 'life-coach-test';

describe('Task', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a task', function(){
      var body   = {name:'Buy Monopoly', difficulty:'Easy', description:'Go shopping', rank:'1'},
          task   = new Task(body);
      expect(task).to.be.instanceof(Task);
      expect(task.name).to.equal('Buy Monopoly');
      expect(task.difficulty).to.equal('Easy');
      expect(task.description).to.equal('Go shopping');
      expect(task.rank).to.equal(1);
      expect(task.isComplete).to.be.false;
    });
  });
});

