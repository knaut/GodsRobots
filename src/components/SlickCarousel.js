var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;
var dispatcher = require('../dispatcher.js');

var Photo = require('./Photos/Photo.js');
var VideoThumb = require('./Videos/VideoThumb.js');
var SoundcloudEmbed = require('./SoundcloudEmbed.js');

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
			infinite: false,
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

				switch(this.data.items[i].kind) {
					case 'flier' || 'photo' || 'still':
						var li = {};
						var liKey = 'div#photo-thumb-' + hyphenate(this.data.items[i].name);					
						var data = this.data.items[i];

						li[liKey] = new Photo({
							data: data
						});

						items.push(li);
					break;
					case 'video':
						var li = {};
						var liKey = 'div#video-thumb-' + hyphenate(this.data.items[i].name);					
						var data = this.data.items[i];

						li[liKey] = new VideoThumb({
							data: data
						});

						items.push(li);
					break;
					case 'embed':
						var li = {};
						var liKey = 'div#embed-thumb-' + hyphenate(this.data.items[i].name);					
						var data = this.data.items[i];

						li[liKey] = new SoundcloudEmbed({
							data: data
						});

						items.push(li);
					break;
				}
				
			}

			return items;
		}
	}
});

module.exports = SlickCarousel;