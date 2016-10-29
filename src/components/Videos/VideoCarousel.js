var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var VideoThumb = require('./VideoThumb.js');

var VideoCarousel = Ulna.Component.extend({
	root: '#video-carousel',

	data: {
		name: 'Videos',
		videos: []
	},

	template: {
		h1: function() {
			return this.data.name;
		},
		'div#video-carousel-inner': {
			'i#video-carousel-next.fa.fa-angle-left': '',
			div: function() {
				var videos = [];
				for (var i = 0; this.data.videos.length > i; i++) {

					var li = {};
					var liKey = 'li#video-thumb-' + hyphenate(this.data.videos[i].name);
					var data = this.data.videos[i];

					li[liKey] = new VideoThumb({
						data: data
					});

					videos.push(li);
				}
				var content = {};
				content['ul'] = videos;

				return content;
			},
			'i#video-carousel-prev.fa.fa-angle-right': '',
		}
	}
});

module.exports = VideoCarousel;