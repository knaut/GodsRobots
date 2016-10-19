var Ulna = require('Ulna');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');
var hyphenate = require('../utils.js').hyphenate;

var Card = require('./Card.js');

var UpcomingCarousel = Ulna.Component.extend({
	root: '#upcoming-carousel',

	dispatcher: dispatcher,

	data: {
		upcoming: services.data.index.upcoming,
		active: 0
	},

	events: {
		'click #upcoming-carousel-inner-prev': function(e) {
			this.dispatcher.dispatch('INFOGRAPHIC_CHANGE', new InfographicChange({
				data: {
					key: 'prev',
					active: this.data.active
				}
			}));
		},
		'click #upcoming-carousel-inner-next': function(e) {
			this.dispatcher.dispatch('INFOGRAPHIC_CHANGE', new InfographicChange({
				data: {
					key: 'next',
					active: this.data.active
				}
			}));
		},
		'click .slide-status li': function(e) {
			// bad, tying data to the dom a bit here
			this.dispatcher.dispatch('INFOGRAPHIC_CHANGE', new InfographicChange({
				data: parseInt(e.target.attributes.id.nodeValue.slice(-1))
			}));
		}
	},

	listen: {
		'INFOGRAPHIC_CHANGE': function(payload) {
			var prevState = this.data.active;
			this.data.active = payload.next;
			this.mutations.changeSlide.call(this, prevState);
		}
	},

	mutations: {
		changeSlide: function(prevState) {
			// console.log('changeslide', this.data.active, prevState);

			// get dom refs
			var $slides = this.$root.find('.slide');
			var $leds = this.$root.find('.slide-status li');

			// update slides
			$($slides[prevState]).removeClass('active');
			$($slides[this.data.active]).addClass('active');

			// update led status
			$($leds[prevState]).removeClass('active');
			$($leds[this.data.active]).addClass('active');

			var index = this.data.active;
			var prevIndex = prevState;

			var left = index * -100 + '%';
			var $container = this.$root.find('.slides');
			$container.css({
				'margin-left': left
			});
		}
	},

	template: {
		h1: 'Upcoming',
		'div.slide-status': function() {
			var leds = {
				ul: []
			};
			for (var l = 0; this.data.upcoming.length > l; l++) {						
				if (l === this.data.active) {
					var led = {
						index: l,
						active: 'active'
					}
				} else {
					var led = {
						index: l,
						active: ''
					}
				}
				var liKey = 'li#upcoming-slide-status-' + led.index + '.' + led.active;
				var li = {};
				li[liKey] = '';
				leds.ul.push(li);
			}
			return leds;
		},
		'div#upcoming-carousel-inner': {
			'span#upcoming-carousel-inner-prev': {
				span: 'previous slide'
			},
			'.slides-wrap': {
				'ul.slides': function() {
					var cards = [];
					// each slide object
					for (var i = 0; this.data.upcoming.length > i; i++) {
						var hyphTitle = hyphenate(this.data.upcoming[i].title);
						cards.push(new Card({
							root: '#' + hyphTitle + '-card',
							data: {
								title: this.data.upcoming[i].title,
								summary: this.data.upcoming[i].summary,
								upcoming: this.data.upcoming[i].upcoming,
								image: this.data.upcoming[i].image,
								kind: this.data.upcoming[i].image
							}
						}));
					}
					return cards;
				}
			},
			'span#upcoming-carousel-inner-next': {
				span: 'next slide'
			}
		}
	}
});

module.exports = UpcomingCarousel;