var Ulna = require('ulna');
var dispatcher = require('./dispatcher.js');
var utils = require('./utils.js');

var Moment = require('moment');

// let services be a global object that contains all static props and basic utils

var services = new Ulna.Services({
	dispatcher: dispatcher,

	data: {
		header: {
			title: 'GODS ROBOTS',
			delimiter: ' - ',
		},
		index: require('./data/index.js'),
		about: require('./data/about/index.js'),
		music: require('./data/music/index.js'),
		photos: require('./data/photos/index.js'),
		events: require('./data/events/index.js')
	},

	utils: utils
});

module.exports = services;