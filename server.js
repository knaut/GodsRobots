// REQUIRES, SERVER
var Hapi = require("hapi");

// head
var $ = require('./src/appHead.js');

// server stuff
var server = new Hapi.Server(process.env.PORT || 3000, '0.0.0.0');

server.start(function() {
    console.log("Hapi server started @", server.info.uri);
});

// load the app
var app = require('./src/app.js');

server.route({
	path: '/',
	method: 'GET',
	handler: function(request, reply) {
		// initialize the app and its components
		app.initialize();

		// modify our server-side DOM with the html generated from our component chain
		$(app.root).html( app.stringified );

		// reply with the updated html
		reply( $.html() );
	}
});

// server.route({
// 	path: '/about',
// 	method: 'GET',
// 	handler: function(request, reply) {
// 		// set the app's active root on its data
// 		app.data.active = 'about';

// 		// reinitialize the app and its components
// 		app.initialize();

// 		// modify our server-side DOM with the html generated from our component chain
// 		$(app.root).html( app.stringified );

// 		// reply with the updated html
// 		reply( $.html() );
// 	}
// });

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
