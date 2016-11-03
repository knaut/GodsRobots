var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var Moment = require('moment');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var RouteChange = require('../actions/RouteChange.js');
var PhotoCarousel = require('./Photos/PhotoCarousel.js');
var PhotoGallery = require('./Photos/PhotoGallery.js');
var VideoCarousel = require('./Videos/VideoCarousel.js');
var SlickCarousel = require('./SlickCarousel.js');



var DateArticle = Ulna.Component.extend({
	root: '#timeline-content',
	dispatcher: dispatcher,

	listen: {
		
	},

	template: {
		'.col-lg-12': function() {
			var content = {
				h1: this.data.name,
				date: new Moment( this.data.startDate ).format('MMM D, YYYY'),
				p: this.data.desc
			};

			var videos = [];
			for (var i = 0; this.data.media.length > i; i++) {
				if (this.data.media[i].kind === 'video') {
					videos.push(this.data.media[i]);
				}
			}

			if (videos.length) {
				content['#videos.slick-gallery'] = new SlickCarousel({
					root: '#videos',
					data: {
						name: 'Videos',
						items: videos
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
				content['#photos.slick-gallery'] = new SlickCarousel({
					root: '#photos',
					data: {
						name: 'Photos',
						items: imgs
					}
				});
			}

			var embeds = [];
			for (var i = 0; this.data.media.length > i; i++) {
				if (this.data.media[i].kind === 'embed') {
					embeds.push(this.data.media[i]);
				}
			}

			if (embeds.length) {
				content['#embeds.slick-gallery'] = new SlickCarousel({
					root: '#embeds',
					data: {
						name: 'Soundcloud',
						items: embeds
					}
				});
			}

			console.log(content)

			return content;
		}
	}
});

module.exports = DateArticle;