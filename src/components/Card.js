var Ulna = require('ulna');
var services = require('../services.js');
var dispatcher = require('../dispatcher.js');
var RouteChange = require('../actions/RouteChange.js');

// a card is a generic component designed to display content in a visual manner
// it consists of a full-size background image,
// a headline, optionally a jewel (or icon "tag") and optionally a date

/* card kinds:

Photo (Still Image with Text Content),
{
	id: 'test-photo',
	name: 'Test Photo',
	date: null,
	credit: null,
	src: '/test-photo.jpg'
}

Youtube Embed,
{
	id: null,
	src: null
}

Soundcloud Embed
{
	id: null,
	src: null
}

	card data schema must be like:
	{
		kind: null,
		id: null,
		name: 'Test Card',
		date: null,
		credit: null,
		thumb: '/text-thumb.jpg'
	}

*/

var Card = Ulna.Component.extend({
	root: '#card-<<this.data.id>>',
	dispatcher: dispatcher,
	// data: {
	// 	kind: null,
	// 	id: null,
	// 	name: null,
	// 	thumb: null,
	//  date: dateObj
	// },

	events: {
		'click a.card': function(e) {
			e.preventDefault();
			
			console.log(this.data);
			this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange({
				timeline: this.data.iso
			}))
		}
	},

	// cards need to be smarter
	// their general format should be uniform, but can switch based on kind
	template: {
		'div.card-wrap': function() {
			switch(this.data.kind) {
				case 'flier' || 'embed':
					var templ = {
						'h1.name': this.data.name,
						'img[src="<<this.data.src>>"]': ''
					}

					var card = {};
					var cardBackground = 'background-image: url(' + this.data.src + ')';
					var cardKey = 'a.card[style="' + cardBackground + '"]';

					card[cardKey] = templ;

					return card;
				break;
				default:
					var templ = {
						'h1.name': this.data.name,
						'img[src="<<this.data.thumb>>"]': ''
					}

					var card = {};
					var cardBackground = 'background-image: url(' + this.data.thumb + ')';
					var cardKey = 'a.card[style="' + cardBackground + '"]';

					card[cardKey] = templ;

					return card;
				break;
			}
		}
	}
});

module.exports = Card;