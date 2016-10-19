var Ulna = require('ulna');

var dispatcher = require('./dispatcher.js');
var services = require('./services.js');

var Header = require('./components/Header.js');
var Typed = require('./components/Typewriter.js');
var VFrame = require('./components/VFrame.js');
var SocialIcons = require('./components/SocialIcons.js');
var HotButton = require('./components/HotButton.js');
var Nav = require('./components/Nav.js');

var BrandCarousel = require('./components/BrandCarousel.js');
var InfographicCarousel = require('./components/InfographicCarousel.js');
var UpcomingCarousel = require('./components/UpcomingCarousel.js');
var TimelinePrev = require('./components/TimelinePrev.js');
var Timeline = require('./components/Timeline/Timeline.js');
var Footer = require('./components/Footer.js');

var BioCardList = require('./components/BioCardList.js');
var Discography = require('./components/Discography.js');
var PhotoGallery = require('./components/Photos/PhotoGallery.js');
var Modal = require('./components/Modal.js');
var Curtain = require('./components/Curtain.js');

var Hero = require('./components/Hero.js');

if (Ulna.env === 'browser') {
	var router = require('./router.js');
}

// gather routes from nav
var routes = services.data.index.nav;

routes.push({
	title: 'Index',
	url: '/'
});

var indexTemplate = {
	'#vframe': new VFrame(),
	'article#main-inner': {
		// 'section#bio-cards.layout': new BioCardList(),
		// 'section#discography.layout': new Discography({
		// 	data: {
		// 		albums: services.data.music.discography
		// 	}
		// }),
		// 'section#photo-gallery.tile-gallery.layout': new PhotoGallery({
		// 	data: services.data.photos
		// }),
		'footer#footer': new Footer()
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
	// 		if (payload.route.req === 'timeline') {
	// 			this.data.active = payload.route.req;
	// 			this.data.activeDate = services.utils.buildDateUID( payload.date.startDate );
	// 			this.rerender();
	// 		}	
	// 	}
	// },

	data: {
		active: 'index',
		activeDate: null
	},

	template: {
		'#main-content': function() {
			switch (this.data.active) {
				case 'index':
					return indexTemplate;
				break;
				
				case 'timeline':
					return new Timeline();
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

if (Ulna.env === 'browser') {
	// quick and dirty util
	var getRoute = function() {
		var route = window.location.pathname.split('/')[1];
		if (route === '') {
			route = 'index'
		}
		return route;
	}
}

app = new Ulna.Component({
	root: '#app-root',

	dispatcher: dispatcher,
	services: services,

	data: {
		active: 'index'
	},

	listen: {
		HISTORY_PUSH: function( payload ) {
			if (payload.route.req === 'timeline') {
				this.data.active = 'timeline';
				this.rerender();
			}
		}
	},

	template: {
		// '#curtain-wrap': new Curtain(),
		'#modal': new Modal(),
		'#main-wrap': function() {
			var mainKey = 'article#main' + '.page-' + this.data.active;

			if (this.data.active === 'index') {

				var obj = {
					// '#nav-wrap.container': new Nav(),
					'#header-wrap.container': new Header()
				};

				obj[mainKey] = new Main({
					data: {
						active: 'index',
						routes: routes
					}
				});

				return obj;

			} else {

				var obj = {
					// '#nav-wrap.container': new Nav(),
				};

				obj[mainKey] = new Main({
					data: {
						active: this.data.active
					}
				});

				return obj;
			}
		}
	}
});

module.exports = app;