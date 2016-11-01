var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;
var dispatcher = require('../dispatcher.js');

var Photo = require('./Photos/Photo.js');

var SlickCarousel = Ulna.Component.extend({
	root: '#slick-carousel-<<this.data.id>>',
	dispatcher: dispatcher,

	// data: {
	// 	id: null,
	// 	items: []
	// },

	listen: {

	},

	bindSlick() {
		this.$root.children('div').slick({
			dots: true,
			slidesToShow: 1,
			// centerMode: true,
			// variableWidth: true
		});
	},

	unbindSlick() {
		this.$root.children('div').slick('unslick');
	},

	bindToDOM() {
		this.bindRoot();
		this.bindEvents();
		this.bindSlick();

		return this.eventsBound;
	},

	unbindFromDOM() {
		this.unbindSlick();
		this.unbindEvents();
		this.unbindRoot();
		

		return this.eventsBound;
	},

	template: {
		h1() {
			return this.data.name;
		},
		div() {
			var items = [];
			for (var i = 0; this.data.items.length > i; i++) {

				var li = {};
				var liKey = 'div#photo-thumb-' + hyphenate(this.data.items[i].name);					
				var data = this.data.items[i];

				li[liKey] = new Photo({
					data: data
				});

				items.push(li);
			}

			return items;
		}
	}
});

module.exports = SlickCarousel;