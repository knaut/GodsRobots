var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var Photo = require('./Photo.js');

var PhotoGallery = Ulna.Component.extend({
	root: '#photo-gallery',

	template: {
		'div.container': function() {
			var content = {};
			content['h1.col-lg-12'] = 'Photos';
			
			var photos = [];
			for (var i = 0; this.data.photos.length > i; i++) {

				var key = 'li#photo-thumb-' + hyphenate(this.data.photos[i].name);
				var item = {};

				var data = this.data.photos[i];

				item[key] = new Photo({
					data: data
				});

				photos.push(item);
			}

			content['ul.col-lg-12'] = photos;

			return content;
		}
	}
});

module.exports = PhotoGallery;