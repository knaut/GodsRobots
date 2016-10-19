var Ulna = require('ulna');

// a card is a generic component designed to display content in a visual manner
// it consists of a full-size background image,
// a headline, optionally a jewel (or icon "tag") and optionally a date

/* card kinds:

Still,
Video,
Event
Installation

cards

*/

var Card = Ulna.Component.extend({
	// feed root programatically later
	template: {
		'div.card-wrap': function() {
			var card = {};

			var templ = {
				'h1.title': this.data.title,
				'p.summary': this.data.summary,
				'img[src="<<this.data.image>>"]': ''
			}

			if (this.data.upcoming) {
				templ['span.upcoming'] = 'Upcoming'
			}

			var cardBackground = 'background-image: url(' + this.data.image + ')';
			var cardKey = '.card[style="' + cardBackground + '"]';

			card[cardKey] = templ;

			return card;
		}
	}
});

module.exports = Card;