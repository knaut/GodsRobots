var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var SoundcloudEmbed = Ulna.Component.extend({
	root: '#embed-<<this.data.id>>',

	data: {
		id: null,
		src: null
	},

	template: {
		'iframe[src="<<this.data.src>>"][frameborder="0"][allowfullscreen]': ''
	}
});

module.exports = SoundcloudEmbed;