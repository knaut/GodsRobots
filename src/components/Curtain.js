var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;
var dispatcher = require('../dispatcher.js');
var services = require('../services.js');
var RouteChange = require('../actions/RouteChange.js');

var Curtain = Ulna.Component.extend({
	root: '#curtain-wrap',

	state: {
		active: ''
	},

	template: {
		'#curtain.<<this.state.active>>': function() {
			return {}
		}
	}
});

module.exports = Curtain;