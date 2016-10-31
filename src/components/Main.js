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
var CardCarousel = require('./CardCarousel.js');

var Logo = require('./Logo.js');
var HotButton = require('./HotButton.js');
var SocialIcons = require('./SocialIcons.js');

// gather routes from nav
var routes = services.data.index.nav;

routes.push({
	title: 'Index',
	url: '/'
});

var indexTemplate = {
	// '#vframe': new VFrame(),
	'article#main-inner.container': {
		// 'section#bio-cards.layout': new BioCardList(),
		// 'section#discography.layout': new Discography({
		// 	data: {
		// 		albums: services.data.music.discography
		// 	}
		// }),
		// 'section#photo-gallery.tile-gallery.layout': new PhotoGallery({
		// 	data: services.data.photos
		// }),
		'header#logo.col-lg-12': new Logo({
			data: {
				src: '/media/images/logos/gr_logo.png'
			}
		}),
		'#card-carousel.col-lg-12': new CardCarousel({
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
	}
};

var aboutTemplate = {
	'#hero-wrap': new Hero(),
	'article#main-inner': {
		'section#bio-cards.layout': new BioCardList(),
		'footer#footer': new Footer()
	}
}

var musicTemplate = {
	'#hero-wrap': new Hero({
		data: {
			name: 'Music',
			img: '/media/images/music/music_hero_example.jpg'
		}
	}),
	'article#main-inner': {
		'section#discography.layout': new Discography({
			data: {
				albums: services.data.music.discography
			}
		}),
		'footer#footer': new Footer()
	}
}

var videoTemplate = {
	'#hero-wrap': new Hero({
		data: {
			name: 'Videos',
			img: '/media/images/videos/hero.jpg'
		}
	}),
	'article#main-inner': {
		'section#discography.layout': new Discography({
			data: {
				albums: services.data.music.discography
			}
		}),
		'footer#footer': new Footer()
	}
}

var photoTemplate = {
	'#hero-wrap': new Hero({
		data: {
			name: 'Videos',
			img: '/media/images/photos/hero.jpg'
		}
	}),
	'article#main-inner': {
		'section#photo-gallery.tile-gallery.layout': new PhotoGallery({
			data: services.data.photos
		}),
		'footer#footer': new Footer()
	}
}

var pressTemplate = {
	'#hero-wrap': new Hero({
		data: {
			name: 'Videos',
			img: '/media/images/press/hero.jpg'
		}
	}),
	'article#main-inner': {
		'section#photo-gallery.tile-gallery.layout': new PhotoGallery({
			data: services.data.photos
		}),
		'footer#footer': new Footer()
	}
}

var contactTemplate = {
	'#hero-wrap': new Hero({
		data: {
			name: 'Videos',
			img: '/media/images/contact/hero.jpg'
		}
	})
}

var Main = Ulna.Component.extend({
	root: '#main',
	dispatcher: dispatcher,

	// listen: {
	// 	HISTORY_PUSH: function(payload) {
			

	// 	}
	// },

	data: {
		index: {}
	},

	template: {
		'#main-content': function() {
			var route = Object.keys(this.data)[0];

			switch (route) {
				case 'index':
					return indexTemplate;
				break;
				
				case 'timeline':
					return new Timeline({
						data: this.data.timeline
					});
				break;

				// case 'about':
				// 	return aboutTemplate;
				// break;
				// case 'music':
				// 	return musicTemplate;
				// break;
				// case 'videos':
				// 	return videoTemplate;
				// break;
				// case 'photos':
				// 	return photoTemplate;
				// break;
				// case 'press':
				// 	return pressTemplate;
				// break;
				// case 'contact':
				// 	return contactTemplate;
				// break;
			}
		}
	}
});

module.exports = Main;