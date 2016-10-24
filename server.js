// REQUIRES, SERVER
var Hapi = require("hapi");
// var Moment = require('moment');

// head
var Cheerio = require('cheerio');
// var $ = require('./src/appHead.js');
var appHead = require('./src/appHead.js');

// server stuff
var server = new Hapi.Server(process.env.PORT || 3000, '0.0.0.0');

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});

// load the app
var App = require('./src/app.js');

// load the data
var services = require('./src/services.js');


// clientside initializer
// stringified into app head
var initializer = function() {
	// start the app
	app = new Ulna.App({
		data: appState
	});
	app.bind();
}


// server routes
server.route({
	path: '/',
	method: 'GET',
	handler: function(request, reply) {
		// we have the state of our whole app
		var appState = {
			index: {}
		};

		// stringify that state to be set client-side later
		var stringifiedState = JSON.stringify(appState);

		// load the appHead, which takes the stringified state and an initializer
		var $ = Cheerio.load( appHead( stringifiedState, initializer ) );

		// create our server-side app with the appState
		var app = new App({
			data: appState
		});
		
		// modify our server-side DOM with the html generated from our component chain
		$(app.root).html( app.stringified );

		// reply with the updated html
		reply( $.html() );
	}
});

server.route({
	path: '/timeline/{date*}',
	method: 'GET',
	handler: function(request, reply) {
		// get url from request, generate an app state object we can initialize an App from
		/* something like:
			{
				routeKey: {
					routeContent
				}
			}

			{
				timeline: {
					years: years,
					activeYear: activeYear,
					dates: datesByMonths,
					activeDate: firstDate,
				}
			}

			this is the densest state object based on the current component structure
		*/
		
		var url = request.params.date;

		var date = services.utils.getDateByPartialISO( services.data.events, services.utils.buildShortISOfromURL( url ) );
		
		var timelineState = {
			years: services.utils.getYears( services.data.events ),
			activeYear: date.startDate.year(),
			dates: services.utils.formatDatesByMonth( services.utils.getDatesForYear( services.data.events, date.startDate.year() ) ) ,
			activeDate: date
		};

		// we have the state of our whole app
		var appState = {
			timeline: timelineState
		};

		// stringify that state to be set client-side later
		var stringifiedState = JSON.stringify(appState);

		var $ = Cheerio.load( appHead( stringifiedState, initializer ) );

		var app = new App({
			data: appState
		});
		
		// modify our server-side DOM with the html generated from our component chain
		$(app.root).html( app.stringified );

		// reply with the updated html
		reply( $.html() );
	}
});

// server.route({
// 	path: '/music',
// 	method: 'GET',
// 	handler: function(request, reply) {
// 		// set the app's active root on its data
// 		app.data.active = 'music';

// 		// reinitialize the app and its components
// 		app.initialize();

// 		// modify our server-side DOM with the html generated from our component chain
// 		$(app.root).html( app.stringified );

// 		// reply with the updated html
// 		reply( $.html() );
// 	}
// });

// server.route({
// 	path: '/videos',
// 	method: 'GET',
// 	handler: function(request, reply) {
// 		// set the app's active root on its data
// 		app.data.active = 'videos';

// 		// reinitialize the app and its components
// 		app.initialize();

// 		// modify our server-side DOM with the html generated from our component chain
// 		$(app.root).html( app.stringified );

// 		// reply with the updated html
// 		reply( $.html() );
// 	}
// });

// server.route({
// 	path: '/photos',
// 	method: 'GET',
// 	handler: function(request, reply) {
// 		// set the app's active root on its data
// 		app.data.active = 'photos';

// 		// reinitialize the app and its components
// 		app.initialize();

// 		// modify our server-side DOM with the html generated from our component chain
// 		$(app.root).html( app.stringified );

// 		// reply with the updated html
// 		reply( $.html() );
// 	}
// });

// server.route({
// 	path: '/events',
// 	method: 'GET',
// 	handler: function(request, reply) {
// 		// set the app's active root on its data
// 		app.data.active = 'events';

// 		// reinitialize the app and its components
// 		app.initialize();

// 		// modify our server-side DOM with the html generated from our component chain
// 		$(app.root).html( app.stringified );

// 		// reply with the updated html
// 		reply( $.html() );
// 	}
// });

// server.route({
// 	path: '/press',
// 	method: 'GET',
// 	handler: function(request, reply) {
// 		// set the app's active root on its data
// 		app.data.active = 'press';

// 		// reinitialize the app and its components
// 		app.initialize();

// 		// modify our server-side DOM with the html generated from our component chain
// 		$(app.root).html( app.stringified );

// 		// reply with the updated html
// 		reply( $.html() );
// 	}
// });

// server.route({
// 	path: '/contact',
// 	method: 'GET',
// 	handler: function(request, reply) {
// 		// set the app's active root on its data
// 		app.data.active = 'contact';

// 		// reinitialize the app and its components
// 		app.initialize();

// 		// modify our server-side DOM with the html generated from our component chain
// 		$(app.root).html( app.stringified );

// 		// reply with the updated html
// 		reply( $.html() );
// 	}
// });


// ASSET ROUTES
server.route({
	path: '/css/{path*}',
	method: 'GET',
	handler: {
		directory: {
			path: './public/css',
			listing: false,
			index: false
		}
	}
});

server.route({
	path: '/fonts/{path*}',
	method: 'GET',
	handler: {
		directory: {
			path: './public/fonts',
			listing: false,
			index: false
		}
	}
});

server.route({
	path: '/js/{path*}',
	method: 'GET',
	handler: {
		directory: {
			path: './public/js',
			listing: false,
			index: false
		}
	}
});

server.route({
	path: '/media/{path*}',
	method: 'GET',
	handler: {
		directory: {
			path: './public/media',
			listing: false,
			index: false
		}
	}
});

server.route({
	path: '/data/{path*}',
	method: 'GET',
	handler: {
		directory: {
			path: './src/data',
			listing: false,
			index: false
		}
	}
});
