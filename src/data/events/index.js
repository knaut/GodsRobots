var Moment = require('moment');
var hyphenate = require('../../utils.js').hyphenate;

var dates = [
	{
		name: 'SuperHeroes Street Fair',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 9,
			day: 22,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				featured: true,
				src: '/media/images/events/superheroes-street-fair/flier.jpg',
				name: 'SuperHeroes Street Fair Flier'
			}
		]
	},
	{
		name: 'Temple of Chaos, LA',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 8,
			day: 10,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				src: '/media/images/events/temple-of-chaos-la/video.mp4',
				name: 'Temple of Chaos',
				thumb: '/media/images/events/temple-of-chaos-la/video_thumb.png'
			}
		]
	},
	{
		name: 'Sizzla Remixes Release',
		kind: 'release',
		startDate: {
			year: 2016,
			month: 8,
			day: 9,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/sizzla-remixes/flier.jpg',
				name: 'Sizzla Remixes Flier'
			},
			{
				kind: 'embed',
				featured: true,
				src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/241463587&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true',
				name: 'Sizzla Remixes Release Music',
				thumb: '/media/images/events/sizzla-remixes/flier.jpg'
			}
		]
	},
	{
		name: 'Janaka Selekta Live at Slim\'s',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 6,
			day: 2,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				src: 'https://www.youtube.com/embed/WkRJ5LDZugs',
				name: 'Live at Slim\'s',
				thumb: '/media/images/events/live-at-slims/video_thumb.png'
			}
		]
	},
	{
		name: 'How Weird Street Faire',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 4,
			day: 7,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'photo',
				src: '/media/images/events/how-weird-street-faire/photo-1.jpg',
				name: 'How Weird Street Faire Live'
			},
			{
				kind: 'flier',
				src: '/media/images/events/how-weird-street-faire/flier.jpg',
				name: 'How Weird Street Faire Flier'
			}
		]
	},
	{
		name: 'Worldly, LA',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 3,
			day: 21,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/worldly-la/flier.jpg',
				name: 'Worldly, LA Flier'
			}
		]
	},
	{
		name: 'The Chapel, SF',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 2,
			day: 30,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/the-chapel-sf/flier.jpg',
				name: 'The Chapel, SF Flier'
			},
			{
				kind: 'video',
				src: 'https://www.youtube.com/embed/ZGuZaFGk070',
				name: 'The Chapel Rehearsal',
				thumb: '/media/images/events/the-chapel-sf/rehearsal_thumb.png',
			},
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/ATlui8zUdjk',
				name: 'The Chapel Rehearsal 2',
				thumb: '/media/images/events/the-chapel-sf/rehearsal-2_thumb.png'
			},
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/H_87Eukt20s',
				name: 'The Chapel, SF Live',
				thumb: '/media/images/events/the-chapel-sf/video_thumb.png',
			}
		]
	},
	{
		name: 'Symbiosis Festival',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 8,
			day: 17,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/symbiosis/flier.jpg',
				name: 'Symbiosis Festival Flier'
			},
			{
				kind: 'video',
				src: 'https://www.youtube.com/embed/7g1WaM2lRI8',
				name: 'Gods Robots live at Symbiosis',
				thumb: '/media/images/events/symbiosis/video_thumb.png',
			}
		]
	},
	{
		name: 'Day La Sol',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 7,
			day: 1,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/day-la-sol/flier.jpg',
				name: 'Day La Sol Flier'
			}
		]
	},
	{
		name: 'Karsh Kale, The Chapel, SF',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 6,
			day: 10,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'photo',
				src: '/media/images/events/karsh-kale-chapel-sf/photo-1.jpg',
				name: 'Karsh Kale, The Chapel'
			},
			{
				kind: 'flier',
				src: '/media/images/events/karsh-kale-chapel-sf/flier.jpg',
				name: 'Karsh Kale at The Chapel Flier'
			}
		]
	},
	{
		name: 'Union of the Kingdoms',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 6,
			day: 4,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'photo',
				src: '/media/images/events/union-of-the-kingdoms/photo-1.jpg',
				name: 'Union of the Kingdoms Live'
			},
			{
				kind: 'flier',
				src: '/media/images/events/union-of-the-kingdoms/flier.png',
				name: 'Union of the Kingdoms Flier'
			}
		]
	},
	{
		name: 'Burning Man, Precompression',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 5,
			day: 20,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/burning-man-precompression/photo-1.jpg',
				name: 'Burning Man Precompression Flier'
			}
		]
	},
	{
		name: 'A Night For Nepal, Oakland',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 4,
			day: 30,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/night-for-nepal/flier.jpg',
				name: 'A Night For Nepal Flier'
			}
		]
	},
	{
		name: 'How Weird Street Faire 2015',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 3,
			day: 26,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/how-weird-street-faire/flier.jpg',
				name: 'How Weird Street Faire 2015 Flier'
			},
			{
				kind: 'photo',
				src: '/media/images/events/how-weird-street-faire/photo-1.jpg',
				name: 'How Weird Street Faire 2015 Photo'
			}
		]
	},
	{
		name: 'Wormhole Wednesday 4-11-15',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 3,
			day: 11,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/wormhole-wednesday/flier.jpg',
				name: 'Wormhole Wednesday 4-11-15'
			},
			{
				kind: 'video',
				src: 'https://www.youtube.com/embed/gfYt2jjikp0',
				name: 'Janaka Selekta live at Wormhole Wednesday',
				thumb: '/media/images/events/wormhole-wednesday/video_thumb.png',
			}
		]
	}
];

// add id's
for (var d = 0; dates.length > d; d++) {
	dates[d]['id'] = hyphenate(dates[d].name);

	for (var m = 0; dates[d].media.length > m; m++) {
		dates[d].media[m]['id'] = hyphenate(dates[d].media[m].name);
	}
}

/*
{
		name: 'SuperHeroes Street Fair',
		url: 'superheroes-street-fair',
		id: 'superheroes-street-fair',
		hero: '/media/images/events/superheroesStreetFair/flier.jpg',
		photos: [
			{
				name: 'Live Photo 1',
				id: 'live-photo-1',
				src: '//media/images/events/globalBeatMovement/test_1.jpg'
			},
			{
				name: 'Live Photo 2',
				id: 'live-photo-2',
				src: '//media/images/events/globalBeatMovement/test_2.jpg'
			},
			{
				name: 'Live Photo 3',
				id: 'live-photo-3',
				src: '//media/images/events/globalBeatMovement/test_3.jpg'
			},
			{
				name: 'Live Photo 4',
				id: 'live-photo-4',
				src: '//media/images/events/globalBeatMovement/test_4.jpg'
			},
			{
				name: 'Live Photo 5',
				id: 'live-photo-5',
				src: '//media/images/events/globalBeatMovement/test_5.jpg'
			},
			{
				name: 'Live Photo 6',
				id: 'live-photo-6',
				src: '//media/images/events/globalBeatMovement/test_6.jpg'
			}
		],
		startDate: {
			year: 2016,
			month: 8,
			day: 5,
			hour: 19,
			minute: 0
		},
		desc: 'LA, we are less than a week away for Temple of Chaos, come check out GODS ROBOTS ft Ishmeet Narula, Rusty Rickshaw, 108Hill & Bassfakira on the 10th at Los Globos.'
	},
*/

module.exports = dates;