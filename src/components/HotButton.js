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
		div: function() {
			var anchor = {};
			var anchorKey = 'a[href="' + services.utils.buildDateURL( 
				services.utils.getFirstDate( services.data.events )
			) + '"]';

			anchor[anchorKey] = {
				'button[type="button"].btn.btn-default': {
					span: 'Enter the Timeline'
				}
			}

			return anchor;
		}
		
	}
});

module.exports = HotButton;