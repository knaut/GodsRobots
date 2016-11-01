var Ulna = require('ulna');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var VFrame = require('./VFrame.js');
var HotButton = require('./HotButton.js');
var BrandCarousel = require('./BrandCarousel.js');
// var InfographicCarousel = require('./InfographicCarousel.js');
var UpcomingCarousel = require('./UpcomingCarousel.js');
var TimelinePrev = require('./TimelinePrev.js');
var Timeline = require('./Timeline/Timeline.js');
var Footer = require('./Footer.js');
var Hero = require('./Hero.js');
var BioCardList = require('./BioCardList.js');
var Discography = require('./Discography.js');
var PhotoGallery = require('./Photos/PhotoGallery.js');
var PhotoCarousel = require('./Photos/PhotoCarousel.js');
var FeaturedCarousel = require('./FeaturedCarousel.js');
var SlickCarousel = require('./SlickCarousel.js');

var Logo = require('./Logo.js');
var HotButton = require('./HotButton.js');
var SocialIcons = require('./SocialIcons.js');


var Main = Ulna.Component.extend({
	root: '#main',
	dispatcher: dispatcher,

	state: {
		active: 'state-inactive'
	},

	listen: {
		ON_LOAD( payload ) {
			console.log('Main: ON_LOAD');

			this.state.active = 'state-active';
			this.mutations.fadeIn.call(this);
		}
	},

	mutations: {
		fadeIn() {
			this.$root.find('#main-content').addClass('state-active').removeClass('state-inactive');
		},
		fadeOut() {
			this.$root.find('#main-content').removeClass('state-active').addClass('state-active');
		}
	},

	data: {
		index: {}
	},

	template: {
		'#main-content.<<this.state.active>>': function() {
			var route = Object.keys(this.data)[0];
			var obj = {
				'header#logo.col-lg-12': new Logo()
			};

			switch (route) {
				case 'index':
					
					obj['article#main-inner.container'] = {
						'#featured.col-lg-12.card-carousel': new FeaturedCarousel({
							root: '#featured',
							data: {
								title: 'Featured',
								items: services.utils.getFeaturedItems( services.data.events )
							}
						}),
						'ul.col-lg-12': {
							'li#call-to-action': new HotButton({
								data: {
									name: 'call-to-action',
									text: 'Enter the Timeline'
								}
							}),
						},
						'#social-icons.col-lg-12': new SocialIcons(),
					};

				break;
				
				case 'timeline':
					obj['#timeline'] = new Timeline({
						root: '#timeline',
						data: this.data.timeline
					});
				break;
			}

			return obj;
		}
	}
});

module.exports = Main;