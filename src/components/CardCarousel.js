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
		items: []
	},

	events: {

	},

	template: {
		'.container': function() {
			var templ = {
				'div.slide-status': function() {
					var leds = {
						ul: []
					};
					for (var l = 0; this.data.items.length > l; l++) {						
						// if (l === this.data.index) {
						// 	var led = {
						// 		index: l,
						// 		active: 'active'
						// 	}
						// } else {
						// 	var led = {
						// 		index: l,
						// 		active: ''
						// 	}
						// }
						// var liKey = 'li.carousel-slide-status-' + led.index + '.' + led.active;
						// var li = {};
						// li[liKey] = '';
						// leds.ul.push(li);
					}
					return leds;
				},
				'div.carousel-inner': {
					'span.carousel-inner-prev': {
						span: 'previous slide'
					},
					'.slides-wrap': function() {
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
					'span.carousel-inner-next': {
						span: 'next slide'
					}
				}
			}

			return templ;
			
		}
	}

});


module.exports = CardCarousel;
