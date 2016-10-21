var Ulna = require('ulna');
var services = require('../services.js');

var Moment = require('moment');

/* our new RouteChange should be able to accept objects that reflect the app's state
	ex:

	new RouteChange({
		timeline: 'someShortID'
	})

	yields:
	{
		timeline: {
			years: [years],
			activeYear: someYear,
			dates: [dates],
			activeDate: someActiveDate
		}
	}

	in other words the RouteChange object should return an entire app state in the payload based
	on the input request. 
	it should store this app state in the req object, so that when popped, 
	the state info is still available.

	similarly, when a keyword is mentioned:
	new RouteChange('about')

	should yield:
	{
		about: { aboutProps }
	}

	urls should be useful:
	new RouteChange('about/janaka-atugoda')

	yields:
	{
		about: {
			janaka-atugoda: { janakaProps }
		}
	}

	objects also make sense:
	new RouteChange({
		about: {
			janaka-atugoda: {}
		}
	})

	yields:
	{
		about: {
			janaka-atugoda: { janakaProps }
		}
	}

	etc.
*/

var RouteChange = function( input, update ) {
	var action = {
		title: null,
		url: null
	};

	switch(Ulna.toType(input)) {
		case 'string': 
			console.log('RouteChange: string', input)
		break;
		case 'object':
			console.log('RouteChange: object', input)
		break;
	}


	return action;
}

RouteChange.prototype = {

}

module.exports = RouteChange;