var Ulna = require('Ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var InfographicChange = require('../actions/InfographicChange.js');

var InfographicCarousel = Ulna.Component.extend({
	root: '#infographic-carousel',

	dispatcher: dispatcher,

	events: {
		'click #infographic-carousel-inner-prev': function(e) {
			this.dispatcher.dispatch('INFOGRAPHIC_CHANGE', new InfographicChange({
				data: {
					key: 'prev',
					active: this.data.active
				}
			}));
		},
		'click #infographic-carousel-inner-next': function(e) {
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
		'div#infographic-carousel-inner': {
			'span#infographic-carousel-inner-prev': {
				span: 'previous slide'
			},
			'.container.slides-wrap': {
				'.col-md-12': {
					'ul.slides': function() {
						var slides = [];

						// each slide object
						for (var i = 0; this.data.infographics.length > i; i++) {

							// add title
							var title = this.data.infographics[i].title;

							// add imgs
							if (this.data.infographics[i].content.imgs.length) {

								var imgs = [];
								
								for (var c = 0; this.data.infographics[i].content.imgs.length > c; c++) {

									var img = this.data.infographics[i].content.imgs[c];

									var imgKey = 'img[src="' + img.src + '"]' +
									'[title="' + img.title + '"]' +
									'[alt="' + img.alt + '"]';
								
									var image = {};

									image[imgKey] = '';
								}

								var bullets = [];

								for (var v = 0; this.data.infographics[i].content.bullets.length > v; v++) {

									var bullet = this.data.infographics[i].content.bullets[v];

									bullets.push({
										h1: bullet.headline
									});

									bullets.push({
										p: bullet.sub
									});
								}

								var slide = [];

								slide.push({
									'.col-md-12.title': {
										h1: title
									}
								});
								
								slide.push({
									'.col-md-12': {
										'.row': {
											'.col-md-4.image': image,
											'.col-md-8.bullets': bullets
										}
									}
								});

								var slideKey = 'li.slide';

								// add active class if our current slide in the loop
								// matches our active index
								if (i === this.data.active) {
									slideKey = slideKey + '.active'
								}

								var slideObj = {}
								slideObj[slideKey] = slide;

								slides.push(slideObj);
							}
						}
						return slides;
					}
				}
			},
			'div.slide-status': function() {
				var leds = {
					ul: []
				};
				for (var l = 0; this.data.infographics.length > l; l++) {
					
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

					var liKey = 'li#infographic-slide-status-' + led.index + '.' + led.active;
					var li = {};
					li[liKey] = '';
					leds.ul.push(li);
				}

				return leds;
			},
			'span#infographic-carousel-inner-next': {
				span: 'next slide'
			}
		}
	}
});

module.exports = InfographicCarousel;