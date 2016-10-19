var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var RouteChange = require('../actions/RouteChange.js');
var PhotoCarousel = require('./Photos/PhotoCarousel.js');
var VideoCarousel = require('./Videos/VideoCarousel.js');

var DateArticle = Ulna.Component.extend({
	root: '#timeline-content',
	dispatcher: dispatcher,

	listen: {
		HISTORY_PUSH: function( payload ) {
			this.data = payload.date;

			this.rerender();
		},
		HISTORY_REPLACE: function( payload ) {
			this.data = payload.date;

			this.rerender();
		}
	},

	template: {
		'.col-lg-12': function() {
			var content = {
				h1: this.data.name,
				date: this.data.startDate.format('MMM D, YYYY'),
				p: this.data.desc
			};

			var videos = [];
			for (var i = 0; this.data.media.length > i; i++) {
				if (this.data.media[i].kind === 'video') {
					videos.push(this.data.media[i]);
				}
			}

			if (videos.length) {
				content['#video-carousel.carousel-gallery'] = new VideoCarousel({
					data: {
						name: 'Videos',
						videos: videos
					}
				});
			}

			var imgs = [];
			for (var i = 0; this.data.media.length > i; i++) {
				if (this.data.media[i].kind === 'flier' || this.data.media[i].kind === 'photo') {
					imgs.push(this.data.media[i]);
				}
			}

			if (imgs.length) {
				content['#photo-carousel.carousel-gallery'] = new PhotoCarousel({
					data: {
						name: 'Photos',
						photos: imgs
					}
				});
			}

			return content;
		}
	}
});

module.exports = DateArticle;