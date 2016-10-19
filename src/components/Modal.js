var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var RouteChange = require('../actions/RouteChange.js');

var VideoEmbed = require('./Videos/VideoEmbed.js');

var Modal = Ulna.Component.extend({
	root: '#modal',
	dispatcher: dispatcher,

	events: {
		'click #modal-close': function() {
			this.mutations.removeActive.call(this);

			if (this.state.kind === 'video') {
				var $iframe = this.$root.find('iframe');
				setTimeout(function() {
					$iframe.remove();
				}, 300);
			}
			
		}
	},

	listen: {
		PHOTO_CAROUSEL_VIEW: function( payload ) {
			this.state.kind = 'photo';
			this.data = payload.data;
			
			this.rerender();
			this.mutations.addActive.call(this);
		},
		VIDEO_CAROUSEL_VIEW: function( payload ) {
			this.state.kind = 'video';
			this.data = payload.data;

			this.rerender();
			this.mutations.addActive.call(this);	
		}
	},

	// modal needs a 'kind' state item to tell it what template to render
	state: {
		kind: null
	},

	mutations: {
		addActive: function() {
			this.$root.addClass('active');
		},
		removeActive: function() {
			this.$root.removeClass('active');
		}
	},

	template: {
		'.container': {
			'#modal-close': {
				'i.fa.fa-close': {
					span: 'Close'
				}
			},
			'#modal-inner.col-lg-12': function() {
				var content = {};

				var kindObj = {};
				var kindObjKey = '.modal-' + this.state.kind;

				switch(this.state.kind) {
					case 'photo':
						var photo = {};
						var photoKey = 'img[src="' + this.data.src + '"][title="' + this.data.name + '"][alt="' + this.data.name + '"]';
						photo[photoKey] = '';

						kindObj[kindObjKey] = photo;

						content = {
							h1: this.data.name,
							'.photo-image-wrap': kindObj
						}

					break;
					case 'video':
						var video = new VideoEmbed({
							data: {
								id: services.utils.hyphenate( this.data.name ),
								src: this.data.src
							}
						});

						kindObj[kindObjKey] = video;

						content = {
							h1: this.data.name,
							'.video-content-wrap': kindObj
						}
					break;
				}

				return content;
			}
		}
	}
});

module.exports = Modal;