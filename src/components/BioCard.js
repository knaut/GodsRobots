var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var BioCard = Ulna.Component.extend({
	root: '#bio-card-<<this.data.id>>',

	dispatcher: dispatcher,

	listen: {},

	// nerve fix
	interpolate: function(key) {
		// extract stringified refs based on a custom syntax
		var reg = /\<\<([a-zA-Z|\.]*)\>\>/g;
		var arr = key.match(reg);

		// loop through the references
		for (var a = 0; arr.length > a; a++) {

			// better regexing, or passing a handler to replace, might save us this cleanup dance
			var ref = arr[a].replace(/[\<*|\>*]/g, '');

			// we could eval here
			// instead we'll construct a custom function that only returns based on type (for security concerns)
			// then we'll call that in the context of the current object we're mixed into
			var interpolatedRef = (new Function(
				// only strings and numbers should be acceptable as references
				'if (typeof ' + ref + ' === \'string\' || typeof ' + ref + ' === \'number\') { ' +
					'return ' + ref +
				'} else {' +
					'throw new Error("Bad reference encountered while interpolating template:", ' + ref + ');' +
				'}')).call(this);

			// replace each found reference in our array with its interpolated equivalent
			var interpolatedKey = key.replace(arr[a], interpolatedRef);
		}

		return interpolatedKey;
	},

	template: {
		'div.bio-card-inner': function() {
			if (this.data.img) {
				var cols = {
					'.col-sm-4.col-xs-12': function() {
						var imgKey = 'img[src="' + this.data.img.src + '"][title="' + hyphenate(this.data.img.name) + '"][alt="' + this.data.img.name + '"]'
						var img = {};
						img[imgKey] = '';
						return img;
					}
				}

				cols['.col-sm-8.col-xs-12'] = function() {
					var cont = {};
					cont['h1'] = this.data.name;
					cont['p'] = this.data.text;
					return cont;
				}

			} else {
				var cols = {
					'.col-xs-12': function() {
						var cont = {};
						cont['h1'] = this.data.name;
						cont['p'] = this.data.text;
						return cont;
					}
				}
			}

			return cols;
		}
	}
});

module.exports = BioCard;