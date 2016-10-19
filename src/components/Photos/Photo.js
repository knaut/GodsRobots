var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var Photo = Ulna.Component.extend({
	root: '#photo-thumb-<<this.data.id>>',
	dispatcher: dispatcher,

	data: {
		id: 'test-photo',
		name: 'Test Photo',
		date: null,
		credit: null,
		src: '/test-photo.jpg'
	},

	events: {
		'click root': function(e) {
			this.dispatcher.dispatch('PHOTO_CAROUSEL_VIEW', {
				data: this.data
			});
		}
	},

	template: {
		'.photo-wrap': function() {
			var img = {};
			var imgKey = 'img[src="' + this.data.src + '"][alt="' + this.data.name + '"][name="' + this.data.name + '"]';

			img[imgKey] = '';

			return img;
		}
	}
});

module.exports = Photo;