'use strict';

var Task   = require('../models/goal');

exports.create = function(req, res){
  Task.create(req.body, res.locals.user._id, function(){
    res.redirect('/goals/' + req.params.goalId);
  });
};
