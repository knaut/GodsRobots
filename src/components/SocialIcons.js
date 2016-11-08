var Ulna = require('ulna');

var dispatcher = require('../dispatcher.js');

var SocialIcons = Ulna.Component.extend({
	root: '#social-icons',

	dispatcher: dispatcher,

	template: {
		ul: [
			{
				li: {
					'a[href="mailto:janaka.atugoda@gmail.com"]': {
						'img[src="/media/images/email_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://www.facebook.com/janakaselektamusic/"]': {
						'img[src="/media/images/facebook_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://twitter.com/janakaselekta"]': {
						'img[src="/media/images/twitter_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://open.spotify.com/artist/3DsgLVdK3osXVyeZDWfRQC"]': {
						'img[src="/media/images/spotify_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://www.instagram.com/janakaselekta/"]': {
						'img[src="/media/images/instagram_icon.png"]': ''
					}
				}
			}
		]
	}
});

module.exports = SocialIcons;