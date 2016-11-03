var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var SoundcloudEmbed = Ulna.Component.extend({
	root: '#embed-thumb-<<this.data.id>>',
	dispatcher: dispatcher,

	events: {
		'click root': function(e) {
			this.dispatcher.dispatch('VIDEO_CAROUSEL_VIEW', {
				data: this.data
			});
		}
	},

	template: {
		'iframe[src="<<this.data.src>>"][frameborder="0"][allowfullscreen]': ''
	}
});

module.exports = SoundcloudEmbed;