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