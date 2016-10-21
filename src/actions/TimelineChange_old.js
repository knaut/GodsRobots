var Ulna = require('ulna');
var services = require('../services.js');

var Moment = require('moment');

// Timeline Change
/* 	return a normalized timeline change object
	it should carry the format needed to be pushed into History API
	and also an independent date identifier that can be used to recall
	information from services.

	an example:

	new TimelineChange('index');

	let's keyword index to yield the very first date in the collection
	should yield:

	{
		route: {
			title: 'GODS ROBOTS - Timeline - My Event Name, Sep 31st, 2016',
			url: '/timeline/2016/9/31/my-event-name',
			req: 'index'
		}
	}

	using a standardized ISO datestamp based on moment's formatting capability
	such as: "20161017T0511"
	formatting legend: 'YYYYMMDDThhmm'

	new TimelineChange({
		timeline: "20161017T0511"
	})

	should yield:

	{
		route: {
			title: 'GODS ROBOTS - Timeline - Fancy Timestamped Event, Oct 17, 2016',
			url: '/timeline/2016/10/17/fancy-timestamped-event',
			req: {
				timeline: "20161017T0511"
			}
		}
	}

*/
	

var TimelineChange = function( input, update ) {
	
	// create a default TimelineChange object
	var action = {
		route: {
			title: null,
			url: null,
			req: null
		},
		update: null
	}

	// deal with falsey inputs
	if (!input) {
		action.route.req = 'index';
	} else {

		
		action.route.req = input;
	}

	// give a default update value
	action.update = this.setUpdate( update );

	// based on our input, we retrieve a date item from services

	// we need the date info for titlifying and urlifying, which depends on the name of the event
	// we also store it here so we only run the getter once, and can access the data through 
	// the history API
	action.date = this.getDate( action.route.req.timeline );

	// construct the title based on date info
	action.route.title = this.titlify( action.date );

	// construct the url based on date info
	action.route.url = this.urlify( action.date );

	// assign our props to this
	for (var key in action)	 {
		this[key] = action[key]
	}
}

TimelineChange.prototype = {

	getDate: function( string ) {

		// query our services based on our input, which is either
		// a keyword or an ISO timestamp
		if ( string === 'timeline' ) {
			// get the first date in our timeline
			return this.getFirstDate();
		} else {
			// get the date in our timeline that matches our requested
			var date = services.utils.getDateByISO( services.data.events, string);

			return date;
		}
	},

	getFirstDate: function() {
		// get the first date in a flat collection
		var firstYearDates = services.utils.getDatesForYear( services.data.events, services.utils.getYears( services.data.events )[0] );
		var firstMonthDates = services.utils.formatDatesByMonth( firstYearDates )[0];
		var firstMonthKey = Object.keys( firstMonthDates )[0];
		var firstDate = firstMonthDates[ firstMonthKey ][0];

		return firstDate;
	},

	setUpdate: function( update ) {
		// if it's anything but false, set it to true
		if (update === false) {
			return false
		} else {
			return true
		}
	},

	capitalize: function( string ) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	titlify: function( date ) {
		// take our services data and timestamp string and construct a usable window title
		// ex: 'GODS ROBOTS - Timeline - My Event, Oct 28th, 2016'
		var string = services.data.header.title + services.data.header.delimiter + 'Timeline' + services.data.header.delimiter;

		var title = string + date.name + ', ' + date.startDate.format('MMM Do, YYYY');

		return title;
	},

	urlify: function( date ) {
		// take a date and construct a url for it. ex:
		// /timeline/2016/28/10/my-event-name

		return services.utils.buildDateURL( date );
	}
}

module.exports = TimelineChange;