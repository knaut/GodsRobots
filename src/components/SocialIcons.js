var Ulna = require('Ulna');

var dispatcher = require('../dispatcher.js');

var SocialIcons = Ulna.Component.extend({
	root: '#social-icons',

	dispatcher: dispatcher,

	listen: {
		// 'ON_LOAD': function(payload) {
		// 	console.log('Social Icons load')
		// }
	},

	template: {
		ul: [
			{
				li: {
					'a[href="mailto:info@knaut.net"]': {
						'img[src="/media/images/email_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://facebook.com/knautwerk"]': {
						'img[src="/media/images/facebook_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://twitter.com/knautwerk"]': {
						'img[src="/media/images/twitter_icon.png"]': ''
					}
				}
			},
			// {
			// 	li: {
			// 		'a[href="https://instagram.com/knautwerk"]': {
			// 			'img[src="/media/images/instagram_icon.png"]': ''
			// 		}
			// 	}
			// }
		]
	}
});

module.exports = SocialIcons;