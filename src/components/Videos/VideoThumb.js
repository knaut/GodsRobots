var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var VideoThumb = Ulna.Component.extend({
	root: '#video-thumb-<<this.data.id>>',
	dispatcher: dispatcher,

	events: {
		'click root': function(e) {
			this.dispatcher.dispatch('VIDEO_CAROUSEL_VIEW', {
				data: this.data
			});
		}
	},

	template: {
		'.video-wrap': function() {
			var img = {};
			var imgKey = 'img[src="' + this.data.thumb + '"][alt="' + this.data.name + '"][name="' + this.data.name + '"]';

			img[imgKey] = '';

			return img;
		}
	}
});

module.exports = VideoThumb;