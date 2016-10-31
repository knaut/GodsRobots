var Moment = require('moment');

module.exports = {
	momentize: function( collection, key ) {
		// take a collection and based on a key turn the objects with that key into Moments
		var momentized = [];
		for (var c = 0; collection.length > c; c++) {
			if (collection[c].hasOwnProperty(key)) {
				momentized.push(collection[c]);
				momentized[c][key] = new Moment(momentized[c][key]);
			}
		}

		return momentized;
	},
		
		
	hyphenate: function( string ) {
		// simple hyphenation util

		var reg = /([a-zA-Z\S]*)/g;
		var match = string.match(reg);
		var arr = [];
		var punc = /(\W)/g;
		for (var s = 0; match.length > s; s++) {
			var ms = match[s].toLowerCase();
			if (ms !== '') {
				ms = ms.replace(punc, '');
				arr.push(ms)
			}
		}
		var hyphenated = arr.join('-');
		
		return hyphenated;
	},

	capitalize: function( string ) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	// buildDateUID
	buildDateUID: function( date ) {
		// build a unique id for a given Moment
		// use a standard ISO format, like YYYYMMDDThhmm

		return new Moment( date ).format('YYYYMMDDThhmm');
	},
	// buildShortDateUID
	buildShortDateUID: function( date ) {
		// build a unique id for a given Moment
		// use a standard short ISO format, like YYYYMMDD

		return new Moment( date ).format('YYYYMMDD');
	},
	// buildMonthUID
	buildMonthUID: function( date ) {
		// build unique ID for a given Moment month
		return new Moment( date ).format('YYYYMM');
	},

	buildDateURL: function( date ) {
		/* take a nested date obj like:
			{
				name: 'Test Date',
				startDate: new Moment({
					year: 1970,
					month: 2,
					day: 1,
					hour: 12,
					minute: 0
				})
			}

			return a stringified format we can use as a route URL like:
			/timeline/1970/02/01/test-date
		*/

		return string = '/timeline/' + new Moment( date.startDate ).format('YYYY/MM/DD/') + this.hyphenate(date.name);

	},

	buildShortISOfromURL: function( string ) {
		var arr = string.split('/');
		var iso = [ arr[0], arr[1], arr[2] ].join('');
		return iso;
	},

	getDateByURL: function( events, url ) {
		// assume events is a flat collection with nested Moment objects
		// a url is a string with timestamp hidden inside, eg: '2016/07/12/some-event-name'
		// extract the timestamp from the url and return the event that matches
		var iso = this.buildShortISOfromURL( events, url);
		var date = this.getDateByPartialISO( events, iso );

		return date;
	},

	getDateByPartialISO: function( events, string ) {
		var date = false;
		for (var e = 0; events.length > e; e++) {
			var testShortISO = this.buildShortDateUID( events[e].startDate );
			if (testShortISO === string) {
				date = events[e];
			}
		}
		return date;
	},

	getDateByISO: function( events, string ) {
		// assume events is a flat collection with nested Moment objects
		// based on an ISO string, like "20160702T0700", return the matching date
		var date = false;
		for (var e = 0; events.length > e; e++) {
			var testISO = this.buildDateUID( events[e].startDate );
			if (testISO === string) {
				date = events[e];
			}
		}
		return date;
	},

	getYears: function( events ) {

		// assume events is a flat collection with nested Moment objects
		// should return an array with all available years

		var years = [];

		for (var y = 0; events.length > y; y++) {
			var year = new Moment( events[y].startDate ).toObject().years;
			
			// add if we've just started our loop
			if (years.length === 0) {
				years.push( year );
			} else {

				// make sure we don't add duplicates
				for (var i = 0; years.length > i; i ++) {

					var hasYear = false;
					
					if (years[i] == year) {
						hasYear = true;
					}
				}

				// if we don't have this year yet, push it
				if (!hasYear) {
					years.push( year )
				}
			}
		}

		return years;
	},

	getMonthsForYear: function( events, year ) {
		// given a year and a flat collection of events where the events are nested Moment objects,
		// return all months in that year.

		var months = [];

		for (var m = 0; events.length > m; m++) {
			var eventYear = new Moment( events[m].startDate ).toObject().years;
			
			// only accept event events that match our given year
			if (eventYear == year) {

				var date = events[m];
				var monthNum = new Moment( date.startDate ).toObject().months;
				var monthName = new Moment( date.startDate ).format('MMM');

				months.push(monthName);

			}
		}

		return months;
	},

	getDatesForYear: function( events, year ) {
		// take a year and a flat collection of events where there are nested Moment objects
		// and return that year's dates

		var dates = [];

		for ( var d = 0; events.length > d; d++ ) {
			// match our year
			if (year == new Moment( events[d].startDate ).toObject().years) {
				dates.push(events[d]);
			}
		}

		return dates;
	},

	formatDatesByMonth: function( events ) {
		// accept a flat collection of events with nested Moment objects
		// and return a new array where events are contained in an object
		// whose key is the name of those associated events' month
		/* ex:
		[
			{
				'October': [
					{
						name: 'Some Date'
						startDate: new Moment()
					}
				]
			}
		]
		*/
		
		// create a collection with just months
		var arr = [];

		months = [];
		for (var i = 0; events.length > i; i++) {
			var month = new Moment( events[i].startDate ).toObject().months;
			
			// add by default if it's the first iteration
			if (months.length === 0) {
				months.push(month);
			} else {
				// add this month only if it doesn't match anything in our collection so far
				var hasThisMonth = false;
				for (var m = 0; months.length > m; m++) {
					if (months[m] === month) {
						hasThisMonth = true;
					}
				}

				if (!hasThisMonth) {
					months.push(month)
				}
			}
		}

		// gather events that match our month(s)
		for (var m = 0; months.length > m; m++) {
			// gather events for this month
			var monthKey = Moment({ month: months[m] }).format('MMMM');
			
			var monthEvents = [];

			for (var d = 0; events.length > d; d++) {
				// only match events with this month
				if (months[m] === new Moment( events[d].startDate ).toObject().months) {
					monthEvents.push(events[d]);
				}
			}

			monthObj = {};
			monthObj[monthKey] = monthEvents;

			arr.push(monthObj);
		}
		return arr;
	},

	getFirstDateInMonths: function( months ) {
		/* assume months is an array of nested objects like:
		[ 
			{ 
				'October': [
					{ name: 'Some Event' }
				] 
			}
		]
		get the first date of the first month
		*/

		var monthKey = Object.keys(months[0])[0];
		return months[0][monthKey][0];
	},

	calcNodeDistance: function( nodeDate ) {
		/*
			nodes should have some information that determines their placement on the timeline
			get the length of a given month (in days)
			given the node's date, calculate its lateral placement on the timeline
		*/
		// assume relative distance (height or width) based on percentages
		var distance = 100;
		var daysInMonths = 30; // nothing fancy for now
		var ratio = distance / daysInMonths;

		var nodeDistance = ratio * nodeDate;

		return nodeDistance;
	},

	getFirstDate: function( events ) {
		// get the first date chronologically regardless of the collection's order
		return this.getFirstDateInMonths( 
					this.formatDatesByMonth( 
						this.getDatesForYear( 
							events,
							this.getYears( events )[0]
						)
					)
				)
	},

	getFirstDateInYear: function( events, year ) {
		// get the first date in a given year
		return this.getFirstDateInMonths( 
					this.formatDatesByMonth( 
						this.getDatesForYear( 
							events,
							year
						)
					)
				)
	},

	constructTimelineStateFromURL: function( events, url ) {
		// var path = window.location.pathname.split('/timeline')[1];
		var date = this.getDateByURL( events, url );

		var state = {
			years: this.getYears( events ),
			activeYear: date.startDate.year(),
			dates: this.formatDatesByMonth( this.getDatesForYear( events, date.startDate.year() ) ) ,
			activeDate: date
		};

		return state;
	},

	constructTimelineStateFromDate: function( events, event ) {
		var state = {
			years: this.getYears( events ),
			activeYear: new Moment( event.startDate ).year(),
			dates: this.formatDatesByMonth( this.getDatesForYear( events, new Moment( event.startDate ).year() ) ) ,
			activeDate: event
		};

		return state;
	},

	getFeaturedItems( events ) {
		// get a collection of timeline events and return their featured media items
		var items = [];

		for (var d = 0; events.length > d; d++) {

			for (var m = 0; events[d].media.length > m; m++) {

				if (events[d].media[m].hasOwnProperty('featured')) {
					var media = events[d].media[m];
					// need a way to find our date from featured media items
					media['iso'] = this.buildDateUID( events[d].startDate )

					items.push( media );
				}

			}
		}

		return items;
	},

	getDateByName( events, name ) {
		var date;

		for (var i = 0; events.length > i; i++) {
			if (events[i].name === name) {
				date = events[i];
			}
		}

		return date;
	},

	getState: function( events, req ) {

		// use some input as a request and and a collection to generate a response object that 
		// represents the state of the application given the request
		
		// requests can be null, undefined, strings (like "index" or "timeline"), or nested objects
		// expect this kind of functionality to be encapsulated
		
		var res;
		
		switch(Ulna.toType( req )) {
			case 'null' || 'undefined':
				console.log('State Warning: Payload input null or undefined');					
			break;
			case 'string':
				// console.log('Dispatcher: Payload:', req);
				if (req === 'index') {
					return {
						index: {}
					}
				}
			break;
			case 'object':
				// console.log('Dispatcher: Payload:', req);

				// this is hardcoded - in the future we may do some dynamic magic
				// based on the structure of our services object (or collection)

				var key = Object.keys(req)[0];
				var routeContent = req[key];

				switch( key ) {
					case 'timeline':
						// generate timeline state based on our input
						// in our application, this should be a dateUID
						res = {
							timeline: this.constructTimelineStateFromDate(
								events,
								this.getDateByISO(
									events,
									routeContent
								)
							)
						}
						
					break;
				}
			break;
		}

		return res;
	}
}
