var Ulna = require('ulna');
var Moment = require('moment');

var Card = require('./Card.js');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');
var hyphenate = require('../utils.js').hyphenate;

var RouteChange = require('../actions/RouteChange.js');

var CardCarousel = Ulna.Component.extend({
	root: '#card-carousel',
	dispatcher: dispatcher,

	data: {
		// title: null,
		items: [],
		active: 0
	},

	events: {

	},

	template: {
		'.card-carousel-wrap': function() {
			var templ = {
				'h1.carousel-title': this.data.title ? this.data.title : '',
				'div.carousel-nav': {
					'a.carousel-prev': {
						span: 'Previous',
						'i.fa.fa-chevron-right': ''
					},
					'a.carousel-next': {
						span: 'Next',
						'i.fa.fa-chevron-left': ''
					}
				},
				'div.carousel-inner': {
					'ul.slides-wrap': function() {
						var items = [];

						for (var v = 0; this.data.items.length > v; v++) {
							var card = {};
							var cardKey = 'li#card-' + this.data.items[v].id;
							card[cardKey] = new Card({
								data: this.data.items[v]
							});
							items.push(card);
						}

						return items;
					},
					
				}
			}

			return templ;
			
		}
	}

});


module.exports = CardCarousel;
