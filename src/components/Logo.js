var Ulna = require('Ulna');

var dispatcher = require('../dispatcher.js');

var Logo = Ulna.Component.extend({
	root: '#logo',

	dispatcher: dispatcher,

	listen: {
		// 'ON_LOAD': function(payload) {
		// 	console.log('Logo load')
		// }
	},

	template: {
		'img[src="media/images/logos/gr_logo.png"]': ''
	}
});

module.exports = Logo;