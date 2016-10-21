var Ulna = require('ulna');

var dispatcher = require('./dispatcher.js');
var services = require('./services.js');

var Header = require('./components/Header.js');
var Nav = require('./components/Nav.js');
var Modal = require('./components/Modal.js');
var Curtain = require('./components/Curtain.js');
var Main = require('./components/Main.js');

var App = Ulna.Component.extend({
	root: '#app-root',

	dispatcher: dispatcher,
	services: services,

	data: {
		index: {}
	},

	listen: {
		
	},

	template: {
		// '#curtain-wrap': new Curtain(),
		'#modal': new Modal(),
		'#main-wrap': function() {
			var route = Object.keys(this.data)[0];
			var mainKey = 'article#main' + '.page-' + route;
			var content = {};

			if (route === 'index') {

				// we pass on our props to Main, which is our main content area
				// content['#nav-wrap.container'] = new Nav();
				content['#header-wrap.container'] = new Header();
				content[mainKey] = new Main({
					data: this.data
				});

			} else {

				// content['#nav-wrap.container'] = new Nav();
				content[mainKey] = new Main({
					data: this.data
				});
			}

			return content;
		}
	}
});

if (Ulna.env === 'browser') {
	var router = require('./router.js');
	Ulna.App = App;
}

module.exports = App;