var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var Photo = require('./Photo.js');

var PhotoCarousel = Ulna.Component.extend({
	root: '#photo-carousel',

	data: {
		name: 'Photos',
		photos: []
	},

	events: {
		'click .fa-chevron-left': function() {

		},

		'click .fa-chevron-right': function() {
			
		}
	},

	template: {
		h1: function() {
			return this.data.name;
		},
		'div#photo-carousel-inner': {
			'i#photo-carousel-next.fa.fa-angle-left': '',
			div: function() {
				var photos = [];
				for (var i = 0; this.data.photos.length > i; i++) {

					var li = {};
					var liKey = 'li#photo-thumb-' + hyphenate(this.data.photos[i].name);
					

					var data = this.data.photos[i];

					li[liKey] = new Photo({
						data: data
					});

					photos.push(li);
				}
				var content = {};
				content['ul'] = photos;

				return content;
			},
			'i#photo-carousel-prev.fa.fa-angle-right': '',
		}
	}
});

module.exports = PhotoCarousel;