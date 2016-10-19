var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var AudioTrack = Ulna.Component.extend({
	root: '#audio-track-<<this.data.id>>',

	dispatcher: dispatcher,

	data: {
		playable: false,
		name: 'Track Name',
		srcs: [],
	},

	template: {
		'div.audio-track': function() {
			var name = {
				span: function() {
					return this.data.name
				}
			};

			var content = [];
			content.push(name);

			if (this.data.playable) {
				var audio = {};
				var audioKey = 'audio[controls="controls"]';

				var srcs = [];

				for (var i = 0; i < this.data.srcs.length; i++) {
					var srcKey = 'source[src="' + this.data.srcs[i].ref + '"][type="audio/' + this.data.srcs[i].type + '"]';
					var src = {};
					src[srcKey] = '';
					srcs.push(src);
				}

				audio[audioKey] = srcs;

				content.push(audio);
				
			} else {
				content.push({
					span: 'Track not playable.'
				});
			}

			return content;
		}
	}
});

var Album = Ulna.Component.extend({
	root: '#audio-album-<<this.data.id>>',
	dispatcher: dispatcher,

	template: {
		'#discography-inner': function() {
			var cols = [];

			cols.push({
				'.col-lg-12': {
					h1: 'Discography'
				}
			});
			
			// create column for album cover
			var imgCol = {};
			var imgColKey = '.col-sm-4.col-xs-12';
			var img = {};
			var imgKey = 'img[src="' + this.data.img + '"][title="' + this.data.name + '"][alt="' + this.data.name + '"]';
			
			img[imgKey] = '';
			imgCol[imgColKey] = img;

			// push column
			cols.push(imgCol);

			var tracks = [];

			// create column for album info and tracks
			var tracksCol = {};
			var tracksColKey = '.col-sm-8.col-xs-12';
			var content = {
				h1: this.data.name,
				date: this.data.date
			};

			for (var i = 0; this.data.tracks.length > i; i++) {
				var trackRoot = 'li#audio-track-' + i + '-' + hyphenate(this.data.tracks[i].name);
				var track = {};
				track[trackRoot] = new AudioTrack({
					data: {
						id: hyphenate(this.data.tracks[i].name),
						playable: this.data.tracks[i].playable,
						name: this.data.tracks[i].name,
						ref: this.data.tracks[i].ref,
						type: this.data.tracks[i].type,
						srcs: this.data.tracks[i].srcs
					}
				});

				tracks.push(track);
			}

			content['ul'] = tracks;
			tracksCol[tracksColKey] = content;

			// push column
			cols.push(tracksCol);

			return cols;
		}
	}
});

var Discography = Ulna.Component.extend({
	root: '#discography',
	dispatcher: dispatcher,

	data: {
		albums: []
	},

	template: {
		'div.container': function() {
			var albums = [];

			for (var i = 0; i < this.data.albums.length; i++) {
				var album = {};
				var albumKey = '#audio-album-' + hyphenate(this.data.albums[i].name);
				
				album[albumKey] = new Album({
					data: this.data.albums[i]
				});

				albums.push(album);
			}

			return albums;
		}
	}
});

module.exports = Discography;