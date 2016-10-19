var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var RouteChange = require('../actions/RouteChange.js');

var NavItem = require('./NavItem.js');

var Nav = Ulna.Component.extend({
	root: '#nav-wrap',

	dispatcher: dispatcher,

	data: {
		active: 'index',
		expanded: false,
		list: services.data.index.nav
	},

	events: {
		'click #nav-expander': function(e) {
			this.dispatcher.dispatch('NAV_EXPAND', {
				data: this.state
			});
		}
	},

	listen: {
		'NAV_EXPAND': function( payload ) {

		}
	},

	template: {
		nav: {
			ul: function() {
				var list = [];
				
				for (var i = 0; services.data.index.nav.length > i; i++) {
					
					var itemKey = 'li#' + services.data.index.nav[i].title.toLowerCase();
					var item = {};

					item[itemKey] = new NavItem({
						data: {
							title: services.data.index.nav[i].title.toLowerCase(),
							url: services.data.index.nav[i].url
						}
					});

					list.push(item);
				}

				return list;
			},
			'#nav-expander': ''
		}
	}
});

module.exports = Nav;