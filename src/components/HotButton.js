var Ulna = require('ulna');
var dispatcher = require('../dispatcher.js');
var RouteChange = require('../actions/RouteChange.js');

var services = require('../services.js');

var HotButton = Ulna.Component.extend({
	root: '#call-to-action',

	dispatcher: dispatcher,

	events: {
		'click a': function(e) {
			e.preventDefault();

			// we enter the app by requesting the first date timeline
			this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange({
				timeline: services.utils.buildDateUID( services.utils.getFirstDate( services.data.events ).startDate )
			}));
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