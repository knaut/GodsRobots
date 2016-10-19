var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var RouteChange = require('../../actions/RouteChange.js');
var YearItem = require('./YearItem.js');


var YearControl = Ulna.Component.extend({
	root: '#timeline-year-control',

	data: {
		// first year active by default
		active: services.utils.getYears( services.data.events )[0],
		years: services.utils.getYears( services.data.events )
	},

	template: {
		'#timeline-year-control-content': function() {
			var items = [];
			
			for (var y = 0; this.data.years.length > y; y++) {
				var item = {};
				var itemKey = 'li#timeline-year-control-' + this.data.years[y];

				var isYearActive = false;
				if (this.data.years[y] === this.data.active) {
					isYearActive = true;
				}

				item[itemKey] = new YearItem({
					data: {
						year: this.data.years[y],
						active: isYearActive
					}
				});
				
				items.push( item );
			}

			// deal with next/prev later
			// controls will be relative to current state of the year
			
			var content = {
				// 'a#timeline-year-control-next': 'Next',
				ul: items,
				// 'a#timeline-year-control-prev': 'Previous',
			}

			return content;
		}
	}
});

module.exports = YearControl;