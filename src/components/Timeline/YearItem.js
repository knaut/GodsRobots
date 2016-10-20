var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var RouteChange = require('../../actions/RouteChange.js');


var YearItem = Ulna.Component.extend({
	root: 'li#timeline-year-control-<<this.data.year>>',

	dispatcher: dispatcher,

	events: {
		'click a': function(e) {
			e.preventDefault();

			this.dispatcher.dispatch('TIMELINE_YEAR_CHANGE', {
				data: this.data.year
			});
		}
	},

	listen: {
		TIMELINE_YEAR_CHANGE: function( payload ) {
			if (payload.data === this.data.year) {
				this.$root.addClass('active');
			} else {
				this.$root.removeClass('active');
			}
		}
	},

	template: {
		span: function() {
			var anchor = {};
			var anchorKey = 'a[href="' + services.utils.buildDateURL(
				services.utils.getFirstDateInYear( services.data.events, this.data.year )
			) + '"]';

			if (this.data.active) {
				anchorKey = anchorKey + '.active';
			}

			anchor[anchorKey] = this.data.year;

			return anchor;
		}
	}
});

module.exports = YearItem;