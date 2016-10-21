var Ulna = require('ulna');
var Moment = require('moment');
var utils = require('../../utils.js');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var TimelineChange = require('../../actions/TimelineChange.js');
var Month = require('./Month.js');

var MonthList = Ulna.Component.extend({
	root: '#timeline-months',
	dispatcher: dispatcher,

	data: {
		activeDate: null,
		months: null
	},

	listen: {
		HISTORY_PUSH: function( payload ) {
			if (payload.hasOwnProperty('date')) {
				if (services.utils.buildMonthUID( payload.date.startDate ) !== services.utils.buildMonthUID( this.data.activeDate.startDate ) ) {

					console.log('MonthList: HISTORY_PUSH', this.data, payload)

					this.data.months = services.utils.formatDatesByMonth( services.utils.getDatesForYear( services.data.events, payload.date.startDate.year() ) );
					this.data.activeDate = payload.date;

					this.rerender();
				}

			}

		},
		HISTORY_REPLACE: function( payload ) {
			if (payload.hasOwnProperty('date')) {
				// only rerender if the upcoming date's month doesn't match the currently active month
				if ( services.utils.buildMonthUID( payload.date.startDate ) !== services.utils.buildMonthUID( this.data.activeDate.startDate ) ) {

					console.log('MonthList: HISTORY_REPLACE', this.data, payload)

					this.data.months = services.utils.formatDatesByMonth( services.utils.getDatesForYear( services.data.events, payload.date.startDate.year() ) );
					this.data.activeDate = payload.date;

					this.rerender();
				}	
			}
			
		}
	},

	template: {
		ul: function() {
			var list = [];
			var activeDateMonthID = this.data.activeDate.startDate.format('MMMM').toLowerCase();

			// convert our keyed data structure to an unordered list with titles
			for (var i = 0; this.data.months.length > i; i++) {

				var currMonthID = utils.hyphenate( Object.keys( this.data.months[i] )[0] );
				var active = false;

				if ( currMonthID === activeDateMonthID ) {
					active = this.data.activeDate;
				}

				var item = {};
				var itemKey = 'li.timeline-month#timeline-month-' + currMonthID + '-' + services.utils.buildMonthUID( this.data.activeDate.startDate );

				item[itemKey] = new Month({
					data: {
						id: currMonthID + '-' + services.utils.buildMonthUID( this.data.activeDate.startDate ),
						month: currMonthID,
						active: active,
						dates: this.data.months[i][ Object.keys( this.data.months[i] )[0] ]
					}
				});

				list.push(item);
			}

			return list;
		}
	}
});

module.exports = MonthList;