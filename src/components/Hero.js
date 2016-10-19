var Ulna = require('ulna');

var Hero = Ulna.Component.extend({
	root: '#hero-wrap',

	data: {
		name: 'Sample Hero',
		img: '/media/images/about/hero_sample.jpg'
	},

	template: {
		'#hero': function() {
			var img = {};
			var imgKey = 'img[src="' + this.data.img + '"][alt="' + this.data.name + '"]' + '[alt="' + this.data.name + '"]';

			img[imgKey] = '';

			return img;
		}
	}
});

module.exports = Hero;