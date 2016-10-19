var Ulna = require('ulna');

var Typed = Ulna.Component.extend({
	root: '#typedwriter',

	bindToDOM: function() {
		this.bindRoot();
		this.bindEvents();

		// lifecycle callbacks would be nice. for instance, here we have to extend a function to
		// assign some kind of plugin functionality

		$(function(){
			$("#typed").typed({
				stringsElement: $("#typed-strings"),
				loop: true,
				typeSpeed: 50,
				startDelay: 1000,
				backSpeed: 20,
				backDelay: 2000,
			});
		});

		return this.eventsBound;
	},

	template: {
		'span#typed-wrap': {
			span: 'Design a spatial interface for ',
			'span#typed-strings': [
				{
					p: 'artists.'
				},
				{
					p: 'musicians.'
				},
				{
					p: 'performers.'
				},
				{
					p: 'scientists.'
				},
				{
					p: 'engineers.'
				}
			]
		},
		'span#typed': ''
	}
});

module.exports = Typed;