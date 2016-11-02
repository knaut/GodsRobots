var Ulna = require('ulna');
var Moment = require('moment');

var Card = require('./Card.js');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');
var hyphenate = require('../utils.js').hyphenate;

var RouteChange = require('../actions/RouteChange.js');

var FeaturedCarousel = Ulna.Component.extend({
	dispatcher: dispatcher,

	slickConfig: {
		dots: true,
		slidesToShow: 4,
		infinite: false,
		// centerMode: true,
		// variableWidth: true
		responsive: [
			{
				breakpoint: 1091,
				settings: {
					slidesToShow: 4
				}
			},
			{
				breakpoint: 975,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1
				}
			}
		]
	},

	bindSlick() {
		this.$root.find('.carousel').slick( this.slickConfig );
	},

	unbindSlick() {
		this.$root.children('.carousel').slick('unslick');
	},

	bindToDOM() {
		this.bindRoot();
		this.bindSlick();
		this.bindEvents();
		

		return this.eventsBound;
	},

	unbindFromDOM() {
		this.unbindSlick();
		this.unbindEvents();
		this.unbindRoot();
		

		return this.eventsBound;
	},

	data: {
		// title: null,
		items: [],
		active: 0
	},

	events: {
		// 'click button.slick-arrow': function() {
		// 	this.unbindEvents();
		// 	console.log(this.eventsBound)
		// }
	},

	template: {
		'.featured-wrap': function() {
			var templ = {
				'h1.carousel-title': this.data.title ? this.data.title : '',
				'div.carousel': function() {
					var items = [];
					for (var v = 0; this.data.items.length > v; v++) {
						var card = {};
						var cardKey = 'div#card-' + this.data.items[v].id;
						card[cardKey] = new Card({
							data: this.data.items[v]
						});							
						items.push(card);
					}
					return items;
				}
			}

			return templ;
			
		}
	}

});


module.exports = FeaturedCarousel;
