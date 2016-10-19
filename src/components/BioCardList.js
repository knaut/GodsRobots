var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var BioCard = require('./BioCard.js');

var BioCardList = Ulna.Component.extend({
	root: '#bio-cards',

	dispatcher: dispatcher,

	data: {
		list: services.data.about.bios
	},

	listen: {},

	template: {
		'.container': function() {
			var list = [];
			for (var i = 0; this.data.list.length > i; i++) {
				var itemKey = '#bio-card-' + hyphenate(this.data.list[i].name);
				var item = {};

				var data = this.data.list[i];
				data['id'] = hyphenate(this.data.list[i].name);

				item[itemKey] = new BioCard({
					data: data
				}); 
				list.push(item);
			}
			return list;
		}
	}
});

module.exports = BioCardList;