
var Boom = require('boom');
var User = require('../../database/models/User');

var internals = {};

internals.all = function(req, reply) {
	User.find({}, function(err, docs) {
		if (err) {
			throw err;
		}

		console.log(docs);
		/*
		var ret = docs.map(function(e) {
			return ("<div>" + e.username + "</div>");
		}).join('');
		*/
		reply(docs);
	});
};

module.exports = internals;