var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var RouteChange = require('../../actions/RouteChange.js');
var DateNode = require('./DateNode.js');


/* we'll store the business logic of this template externally for now */

var monthTemplate = {
	'h1.timeline-month-title': function() {
		return this.data.month;
	},
	'ul.timeline-month-nodes': function() {							
		// populate this month with dates
		var items = [];
		for (var d = 0; this.data.dates.length > d; d++) {
			var item = {};
			var date = this.data.dates[d];
			// use an inline style to space out our nodes
			var nodeStyle = '[style="left:' + services.utils.calcNodeDistance( date.startDate.toObject().date ) + '%"]';
			var itemKey = 'li#timeline-node-' + date.id + '-' + services.utils.buildDateUID(date.startDate) + '.timeline-nodes' + nodeStyle;								
			var selected = false;
			
			if (this.data.active) {
				if (date.startDate.format('YYYYMMDDThhmm') && this.data.active.startDate.format('YYYYMMDDThhmm')) {
					selected = true;
				}	
			}
										
			item[itemKey] = new DateNode({
				data: {
					id: date.id + '-' + services.utils.buildDateUID(date.startDate),
					selected: selected,
					date: date
				}
			});
			items.push(item);
		}							
		return items;
	}
}

var Month = Ulna.Component.extend({
	root: '#timeline-month-<<this.data.id>>',

	data: {
		id: null,
		month: null,
		active: null,
		dates: null
	},

	template: {
		'.timeline-month-inner-wrap': function() {
			if (Ulna.toType(this.data.active) === 'object') {
				return {
					'div.active': monthTemplate
				}
			} else {
				return {
					div: monthTemplate
				}
			}
		}
	}
});

module.exports = Month;