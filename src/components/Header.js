var Ulna = require('ulna');

var Logo = require('./Logo.js');
var Typed = require('./Typewriter.js');
var HotButton = require('./HotButton.js');
var SocialIcons = require('./SocialIcons.js');

var Header = Ulna.Component.extend({
	root: '#header-wrap',

	template: {
		'#header-inner.row': {
			'.col-lg-12': {
				'header#logo.col-lg-12': new Logo(),
				'ul.col-lg-12': {
					'li#call-to-action': new HotButton({
						data: {
							name: 'call-to-action',
							text: 'Enter the Timeline'
						}
					}),
				},
				'#social-icons.col-lg-12': new SocialIcons()	
			}
			
		}
	}
});

module.exports = Header;