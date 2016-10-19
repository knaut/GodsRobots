var Ulna = require('ulna');
var dispatcher = require('./dispatcher.js');
// var services = require('./services.js');

// actions
var RouteChange = require('./actions/RouteChange.js');
var TimelineChange = require('./actions/TimelineChange.js');

var router = new Ulna.Router({
	dispatcher: dispatcher,

	data: {
		history: []
	},

	events: {
		'popstate': function(event) {

			// handle popstates that represent first load
			if ( event.state === null ) {
				var req = 'index'
			} else {
				var req = event.state.req
			}

			this.dispatcher.dispatch('HISTORY_REPLACE', new TimelineChange( event.state.req ) );
		}
	},

	listen: {
		'HISTORY_PUSH': function( payload ) {
			// payload should be a standard RouteChange action
			console.log('Router: HISTORY_PUSH', payload);

			this.history.push(payload.route);
		},
		'HISTORY_REPLACE': function( payload ) {
			// payload should still be a standard action
			console.log('Router: HISTORY_REPLACE', payload);
			
			this.history.replace(payload.route);
		}
	}
});

module.exports = router;