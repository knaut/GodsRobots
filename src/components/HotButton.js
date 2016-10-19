var Ulna = require('ulna');
var dispatcher = require('../dispatcher.js');
var RouteChange = require('../actions/RouteChange.js');

// var RouteChange = require('../actions/RouteChange.js');
var TimelineChange = require('../actions/TimelineChange.js');

var services = require('../services.js');

var HotButton = Ulna.Component.extend({
	root: '#call-to-action',

	dispatcher: dispatcher,

	events: {
		'click button': function(e) {
			// we enter the app by requesting the timeline
			this.dispatcher.dispatch('HISTORY_PUSH', new TimelineChange() );
		}
	},

	data: {
		name: 'Hot Button',
		text: 'This is a hot button',
		active: ''
	},

	template: {
		'button[type="button"].btn.btn-default': {
			span: function() {
				return this.data.text;
			}
		}
	}
});

module.exports = HotButton;