var Ulna = require('ulna');
var services = require('./services.js');

var dispatcher = new Ulna.Dispatcher({
	actions: [
		'ON_LOAD',
		'INFOGRAPHIC_CHANGE',
		'TIMELINE_YEAR_CHANGE',
		'TIMELINE_DATE_HOVER',
		'TIMELINE_DATE_SELECT',
		'PHOTO_CAROUSEL_VIEW',
		'VIDEO_CAROUSEL_VIEW',
		'ENTER_TIMELINE',
		{
			name: 'HISTORY_PUSH',
			beforeEmit: function(payload, next) {
				// console.log('Dispatcher RouteChange:', payload);

				// history push recieves all route changes. we can expect a normal RouteChange object
				// use its input as a request and generate a response object that represents the state
				// of the application given the request

				// requests can be null, undefined, strings (like "index" or "timeline"), or nested objects
				// expect this kind of functionality to be encapsulated

				var req = payload.route.req;
				var res;

				switch(Ulna.toType( payload.route.req )) {
					case null || undefined:
						console.log('Dispatcher Warning: Payload input null or undefined');
					break;
					case 'string':
						// console.log('Dispatcher: Payload:', req);
					break;
					case 'object':
						// console.log('Dispatcher: Payload:', req);

						// this is hardcoded - in the future we may do some dynamic magic
						// based on the structure of our services object
						var routeKey = Object.keys(req)[0];
						var routeContent = payload.route.req[routeKey];
						switch( routeKey ) {
							case 'timeline':

								// generate timeline state based on our input
								// in our application, this should be a dateUID
								res = {
									timeline: services.utils.constructTimelineStateFromDate(
										services.data.events,
										services.utils.getDateByISO(
											services.data.events,
											routeContent
										)
									)
								}

								// attach the response state to our route object
								// it will get pushed into the history stack later
								payload.route.res = res;

								// titlify and urlify our route based on the response
								payload.route.title = payload.titlifyDate( res.timeline.activeDate );
								payload.route.url = payload.urlifyDate( res.timeline.activeDate );

							break;
						}

					break;
				}

				// console.log('Payload modified:', payload)

				next(payload);
			},
			shouldEmit: function(payload) {
				// if (payload < 2) {
					// console.log('Sorry, son, I can\'t emit ' + payload);
					// return false;
				// }
				// console.log('Aaw yeah, just emiting ' + payload + '!');
				return true;
			}
		},
		{
			name: 'HISTORY_REPLACE',
			beforeEmit: function(payload, next) {
				

				// console.log('HISTORY_REPLACE', payload);
				
				next(payload);
			},
			shouldEmit: function(payload) {
				// if (payload < 2) {
					// console.log('Sorry, son, I can\'t emit ' + payload);
					// return false;
				// }
				// console.log('Aaw yeah, just emiting ' + payload + '!');
				return true;
			}
		},
		{
			name: 'MODAL_CHANGE',
			beforeEmit: function(payload, next) {
				// console.log('MODAL_CHANGE', payload);
				
				next(payload);
			},
			shouldEmit: function(payload) {
				// if (payload < 2) {
					// console.log('Sorry, son, I can\'t emit ' + payload);
					// return false;
				// }
				// console.log('Aaw yeah, just emiting ' + payload + '!');
				return true;
			}
		}
	]
});

module.exports = dispatcher;	