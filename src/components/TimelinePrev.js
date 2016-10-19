var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var moment = require('moment');


var Timeline = Ulna.Component.extend({
	root: '#timeline-wrap',

	dispatcher: dispatcher,

	data: {
		events: services.data.events
	},

	events: {
		// 'click #nav-expander': function(e) {
		// 	this.dispatcher.dispatch('NAV_EXPAND', {
		// 		data: this.state
		// 	});
		// }
	},

	listen: {
		// 'NAV_EXPAND': function( payload ) {

		// }
	},

	template: {
		'.container': {
			'.col-lg-12': function() {
				// event nodes are popovers on the timeline
				var nodes = [];
				
				for (var e = 0; this.data.events.length > e; e++) {
					
					var ev = this.data.events[e];
					var node = {};
					
					var popover = {};
					var popoverKey = 'div.timeline-popover';

					var mDate = moment(this.data.events[e].startDate).format('MMM Do, YYYY');

					var anchorKey = 'a[href="events/' + this.data.events[e].url + '"]';
					var h1 = {};
					h1[anchorKey] = ev.name;
					
					// popover contains event info
					popover[popoverKey] = {
						h1: h1,
						date: mDate,
						p: ev.desc
					}

					var nodeKey = 'li.timeline-node' + '[style="top:' + this.data.events[e].date + 'px"]';
					
					node[nodeKey] = popover;

					nodes.push(node);
				}

				// get the max length of the timeline
				var len = [];
				var pegs = [];

				for (var l = 0; this.data.events.length > l; l++) {
					len.push(this.data.events[l].date);
					var peg = {};
					
					// console.log(mDate);
					var pegKey = 'span.timeline-peg[style="top:' + this.data.events[l].date + 'px;"]';
					peg[pegKey] = '';
					pegs.push(peg);
				}

				var max = Math.max.apply(null, len);
				var timelineKey = 'div.timeline[style="height:' + max + 'px;"]';

				var content = {
					h1: 'Events',
					ul: nodes
				};

				content[timelineKey] = pegs;

				var contentWrap = {};
				var contentWrapKey = ''

				return content;
			}	
		}
	}
});

module.exports = Timeline;