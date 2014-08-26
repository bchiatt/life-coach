'use strict';

var Mongo = require('mongodb'),
    Task  = require('./task'),
    _     = require('lodash');

function Goal(o, userId){
  this.userId = userId;
  this.name   = o.name;
  this.due    = new Date(o.due);
  this.tags   = o.tags.split(',');
  this.tasks  = [];
}

Object.defineProperty(Goal, 'collection', {
  get: function(){return global.mongodb.collection('goals');}
});

Goal.create = function(o, userId, cb){
  var goal = new Goal(o, userId);
  Goal.collection.save(goal, cb);
};

Goal.findAllByUserId = function(userId, cb){
  Goal.collection.find({userId:userId}).toArray(cb);
};


Goal.findByGoalIdAndUserId = function(goalId, userId, cb){
  var _id = Mongo.ObjectID(goalId);
  Goal.collection.findOne({_id:_id, userId:userId}, function(err, object){
    if(object){
      cb(err, _.create(Goal.prototype, object));
    }else{
      cb();
    }
  });
};

Goal.prototype.addTask = function(body){
  var task = new Task(body);
  this.tasks.push(task);
};

Goal.prototype.save = function(cb){
  Goal.collection.save(this, cb);
};

module.exports = Goal;
