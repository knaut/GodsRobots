var Ulna = require('ulna');

var dispatcher = require('../dispatcher.js');

var BrandCarousel = Ulna.Component.extend({
	root: '#brand-carousel',

	dispatcher: dispatcher,

	data: {
		tagline: null,
		brands: []
	},

	listen: {
		'ON_LOAD': function(payload) {
			console.log('Brand Carousel load')
		}
	},

	template: {
		div: function() {
			if (this.data.tagline) {
				return {
					h1: this.data.tagline
				};
			}
		},
		ul: function() {
			var brands = [];
			for (var b = 0; this.data.brands.length > b; b++) {
				var brandKey = 'img[src="' + this.data.brands[b].src + '"]' +
					'[title="' + this.data.brands[b].name + '"]' +
					'[alt="' + this.data.brands[b].name + '"].brand-img';
				
				var brandObj = {};
				brandObj[brandKey] = '';

				var anchorLink = 'a[href="' + this.data.brands[b].url + '"]';
				var anchor = {};

				anchor[anchorLink] = brandObj;

				brands.push({
					li: anchor
				});
			}
			return brands;
		}
	}
});

module.exports = BrandCarousel;