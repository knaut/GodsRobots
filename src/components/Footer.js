var Ulna = require('Ulna');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');
var hyphenate = require('../utils.js').hyphenate;

// var Card = require('./Card.js');

var Footer = Ulna.Component.extend({
	root: '#footer',

	dispatcher: dispatcher,

	data: {
		nav: services.data.index.nav
	},

	events: {
		
	},

	// listen: {
		
	// },

	// mutations: {
		
	// },

	template: {
		'div.container': [
			{
				'.row': {
					'.col-lg-12': [
						{
							p: 'All work herein copyright © 2016 GODS ROBOTS.'
						},
						{
							p: 'Lorem ipsum Consequat proident aute quis ex sunt dolore in sint in non labore magna aliquip dolore magna commodo in est sint veniam culpa sed.'
						}
					]
				}
			},
			{
				'.row': [
					// {
					// 	'.col-sm-4': {
					// 		'a[href="/about"]': 'About',
					// 		'a[href="/music"]': 'Music',
					// 		'a[href="/videos"]': 'Videos',
					// 	}
					// },
					// {
					// 	'.col-sm-4': {
					// 		'a[href="/photos"]': 'Photos',
					// 		'a[href="/events"]': 'Events',
					// 		'a[href="/press"]': 'Press',
					// 	}
					// },
					// {
					// 	'.col-sm-4': {
					// 		'a[href="/contact"]': 'Contact',
					// 	}
					// }
				]
			}
		]
	}
});

module.exports = Footer;