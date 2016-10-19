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

	// titlify is recursive, so we'll add the domain title there
	action.route.title = services.data.header.title + this.titlify(input);

	// generate a url based on our request
	action.route.url = this.urlify(input);

	// store our original request later
	// handle null or undefined as index
	if (input === null || input === undefined) {
		action.route.req = 'index';
	} else {
		action.route.req = input;
	}


	// assign our props to this
	for (var key in action)	 {
		this[key] = action[key]
	}
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

				string += ' ' + services.data.header.delimiter + ' ' + this.capitalize(key) + this.titlify( input[key] );					
				return string;
			break;
 
			case 'string':

				// we backlist certain routes, like index
				if ( input === 'index' ) {
					return string;
				}

				// blacklist empty string
				if (input.length) {
					string += ' ' + services.data.header.delimiter + ' ' + this.capitalize(input);	
				}
				
				return string;

			break;
		}
		
		return string;
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


}

module.exports = RouteChange;