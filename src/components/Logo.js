var Ulna = require('ulna');

var RouteChange = require('../actions/RouteChange.js');
var dispatcher = require('../dispatcher.js');

var Logo = Ulna.Component.extend({
	root: '#logo',

	dispatcher: dispatcher,

	listen: {
		// 'ON_LOAD': function(payload) {
		// 	console.log('Logo load')
		// }
	},

	data: {
		src: '/media/images/logos/gr_logo.png'
	},

	events: {
		'click a': function(e) {
			this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange('index'))
		}
	},

	template: {
		a: function() {
			var key = 'img[src="' + this.data.src + '"]';
			var obj = {};
			obj[key] = '';

			return obj;
		}
	}
});

module.exports = Logo;