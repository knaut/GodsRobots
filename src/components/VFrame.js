var Ulna = require('ulna');

var VFrame = Ulna.Component.extend({
	root: '#vframe',

	template: {
		'#vframe-video': ''
		// 'video#vframe-video[autoplay=""][muted][poster="/media/knautilus_horiz_logo_solid.png][loop=""]': {
		// 	'source[src="/media/videos/burnItUp.mp4"][type="video/mp4"]':'',
		// }
	}
});

module.exports = VFrame;