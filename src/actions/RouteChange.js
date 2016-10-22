var Ulna = require('ulna');
var services = require('../services.js');

// route changes should be uniform objects
/*
	{
		// can shove optional parameters into the object, but route property should be standard
		route: {
			title: 'Route Title',
			url: '/route-title'
		},
		update: true	// optional param if we want to pop history, but not re-render state
	}
*/

/* accept any number of parameters, like strings or nested objects
ie new RouteChange('index') should yield:
{
	route: {
		title: 'Atypical Products',
		url: '/'
	},
	update: true
}

new RouteChange('about', false) should yield:
{
	route: {
		title: 'Atypical Products - About',
		url: '/about'
	},
	update: false
}

new RouteChange({
	portfolio: 'My Content Item'
}, false);

should return:

{
	route: {
		title: 'Atypical Products - Portfolio - My Content Item',
		url: '/portfolio/my-content-item'
	},
	update: false
}

add in our original input as a request object
we can use it later at the recieving end to access services

*/

var RouteChange = function( input, update ) {
	var action = {
		route: {
			title: null,
			url: null,
			req: null
		},
		update: null,
	}

	// give a default update value
	action.update = this.setUpdate( update );

	// store our input as a request for reference later
	action.route.req = input;

	// generate a response state object
	// instead of handing this business logic to actions, lets put it somewhere more manageable
	// and easy to reason about
	
	// switch(Ulna.toType( input )) {
	// 	case 'string':
	// 		console.log('RouteChange string:', input)
	// 	break;
	// 	case 'object':
			
	// 		var routeKey = Object.keys(input)[0];
			
	// 		switch(routeKey) {
	// 			case 'timeline':
	// 				// add res to our route object
	// 				// for a timeline object, we can expect an ISO timestamp for reference
	// 				action.route['res'] = {
	// 					timeline: services.utils.constructTimelineStateFromDate(
	// 						services.data.events,
	// 						services.utils.getDateByISO(
	// 							services.data.events,
	// 							input[routeKey]
	// 						)
	// 					)
	// 				}

	// 				action.route.title = this.titlifyDate( action.route.res.timeline.activeYear );
	// 				action.route.url = this.urlifyDate( action.route.res.timeline.activeYear );

	// 			break;
	// 		}

	// 	break;
	// }

	// assign our props to this
	for (var key in action)	 {
		this[key] = action[key]
	}

	// console.log('RouteChange actions:', action);
}

RouteChange.prototype = {
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

	titlify: function( input ) {

		var string = '';

		switch( Ulna.toType(input) ) {
			case 'object': 

				var key = Object.keys(input)[0];

				// we backlist certain routes, like index
				if ( key === 'index' ) {
					return string;
				}

				string += services.data.header.delimiter + this.capitalize(key) + this.titlify( input[key] );					
				return string;
			break;
 
			case 'string':

				// we backlist certain routes, like index
				if ( input === 'index' ) {
					return string;
				}

				// blacklist empty string
				if (input.length) {
					string += services.data.header.delimiter + this.capitalize(input);	
				}
				
				return string;

			break;
		}
		
		return string;
	},

	titlifyDate: function( date ) {
		// take our services data and timestamp string and construct a usable window title
		// ex: 'GODS ROBOTS - Timeline - My Event, Oct 28th, 2016'
		var string = services.data.header.title + services.data.header.delimiter + 'Timeline' + services.data.header.delimiter;

		var title = string + date.name + ', ' + date.startDate.format('MMM Do, YYYY');

		return title;
	},

	hyphenate: function( string ) {
		var newString = '';

		for (var s = 0; string.length > s; s++) {
			if (string[s] === ' ') {
				newString += '-'
			} else {
				newString += string[s].toLowerCase();
			}
		}

		return newString;
	},

	urlify: function( input ) {

		var url = '';

		switch( Ulna.toType(input) ) {
			case 'object': 

				var key = Object.keys(input)[0];

				if ( key === 'index' ) {
					return '/';
				}

				url += '/' + this.hyphenate(key) + this.urlify( input[key] );					
				return url;

			break;
 
			case 'string':

				if ( input === 'index' ) {
					return '/';
				}

				// blacklist empty string
				if (input.length) {
					url += '/' + this.hyphenate(input);	
				}
				
				return url;

			break;
		}
		
		return url;
	},

	urlifyDate: function( date ) {
		// take a date and construct a url for it. ex:
		// /timeline/2016/28/10/my-event-name

		return services.utils.buildDateURL( date );
	}


}

module.exports = RouteChange;