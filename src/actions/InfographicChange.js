var Ulna = require('ulna');
var services = require('../services.js');
var hyphenate = require('../utils.js').hyphenate;

var length = services.data.index.infographics.length - 1;

// infographic change should carry a uniform payload any listening component can consume
/*

	{
		next: 1,
		key: 'some-id'
	}

	// all it needs to know is which number is next, and which one was previous

	// we could be recieving objects like the following:
	// a string telling to move back or forward
	{
		data: {
			key: 'next',
			active: 0
		}
	}

	// a number in the case of a selected index
	{
		data: 1		
	}

	// a string value associated with some corresponding name/key
	{
		data: {
			key: 'some-string'
		}
	}
*/

var InfographicChange = function( input ) {
	var action = {
		next: null,
		key: null
	}	

	// we let normalize delegate the business logic
	var normalized = this.normalize(input, action);

	return normalized;
}

InfographicChange.prototype = {
	normalize: function( input, action ) {
		var normalized = action;
		var type = Ulna.toType(input.data);

		switch(type) {
			case 'number':

				normalized = this.numbered(input, action);

			break;
			case 'object':
			
				normalized = this.objectified(input, action);

			break;
		}

		return normalized;
	},
	numbered: function( input, action ) {
		// simply set our next id as the input data number
		action.next = input.data;

		// get the name-key of the next infographic based on index
		var key = hyphenate( services.data.index.infographics[ action.next ].intro );

		action.key = key;

		return action;
	},
	objectified: function( input, action ) {
		// object will either container a 'next/prev' keyword with a currently active index
		// or a name-key

		var objectified;

		if (input.data.hasOwnProperty('active')) {
			objectified = this.keyworded(input, action);
		} else {
			objectified = this.named(input, action);
		}

		return objectified;
	},
	keyworded: function( input, action ) {
		// we're accepting either a next/prev keyword, and have an active index to work against
		var id = input.data.active;
		var nextId = null;

		switch(input.data.key) {
			case 'next':
				
				if (id === length) {
					// if we're at the end, start at zero
					nextId = 0;
				} else {
					nextId = id + 1;
				}

			break;
			case 'prev':

				if (id === 0) {
					// if we're at the beginning, start at the end
					nextId = length;
				} else {
					nextId = id - 1;
				}

			break;
		}

		action.next = nextId;
		action.key = hyphenate(services.data.index.infographics[nextId].intro);

		return action;
	},
	named: function( input, action ) {
		// accepting only named-key strings

		var key = null;
		var nextId = null;

		for (var i = 0; services.data.index.infographics.length > i; i++) {
			key = hyphenate(services.data.index.infographics[i].intro);
			
			// get the index that matches our key
			if (key === input.data.key) {
				nextId = i;
			}
		}
		
		action.next = nextId;
		action.key = input.data.key;

		return action;
	}
}

module.exports = InfographicChange;
