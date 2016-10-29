var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');
var hyphenate = require('../../utils.js').hyphenate;

var Month = require('./Month.js');

// var InfographicChange = require('../../actions/InfographicChange.js');
var RouteChange = require('../../actions/RouteChange.js');

var MonthCarousel = Ulna.Component.extend({
	root: '#timeline-months',

	dispatcher: dispatcher,

	data: {
		// upcoming: services.data.index.upcoming,
		months: null,
		activeDate: null,
		index: 0
	},

	events: {
		'click a.carousel-next': function(e) {
			e.preventDefault();

			// get the name of our active month
			var activeMonth = new Moment( this.data.activeDate.startDate ).format('MMMM');
			var allMonths = [];

			for (var i = 0; this.data.months.length > i; i++) {
				allMonths.push( Object.keys(this.data.months[i])[0] );
			}

			// ensuring we're not at the beginning of the carousel
			if (activeMonth !== allMonths[ allMonths.length - 1 ]) {

				// get the first date of the month previous in our list
				var prevMonth;
				var prevDate;

				// when we match the current active month, use that index to grab the next entry
				for (var m = 0; this.data.months.length > m; m++) {
					if ( activeMonth === Object.keys(this.data.months[m])[0] ) {
						prevMonth = this.data.months[m + 1];
						prevDate = prevMonth[ Object.keys(prevMonth)[0] ][0];
					}
				}

				this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange({
					timeline: services.utils.buildDateUID(
						prevDate.startDate
					)
				}));
			}

		},
		'click a.carousel-prev': function(e) {
			e.preventDefault();
			
			// get the name of our active month
			var activeMonth = new Moment( this.data.activeDate.startDate ).format('MMMM');
			var allMonths = [];
			
			for (var i = 0; this.data.months.length > i; i++) {
				allMonths.push( Object.keys(this.data.months[i])[0] );
			}

			// if we're not at the end of the queue
			if (activeMonth !== allMonths[0]) {
				
				// get the first date of the month previous in our list
				var nextMonth;
				var nextDate;
				
				// when we match the current active month, use that index to grab the previous entry
				for (var m = 0; this.data.months.length > m; m++) {
					
					// we match based on our currently active month
					if ( activeMonth === Object.keys(this.data.months[m])[0] ) {

						nextMonth = this.data.months[ m - 1 ];
						nextDate = nextMonth[ Object.keys(nextMonth)[0] ][0];
						
					}
				}

				this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange({
					timeline: services.utils.buildDateUID(
						nextDate.startDate
					)
				}));
			}
		},
		'click .slide-status li': function(e) {
			// bad, tying data to the dom a bit here
			// this.dispatcher.dispatch('INFOGRAPHIC_CHANGE', new InfographicChange({
			// 	data: parseInt(e.target.attributes.id.nodeValue.slice(-1))
			// }));
		}
	},

	// listen: {
	// 	'INFOGRAPHIC_CHANGE': function(payload) {
	// 		var prevState = this.data.active;
	// 		this.data.active = payload.next;
	// 		this.mutations.changeSlide.call(this, prevState);
	// 	}
	// },

	mutations: {
		changeSlide: function(prevState) {
			// console.log('changeslide', this.data.active, prevState);

			// get dom refs
			var $slides = this.$root.find('.slide');
			var $leds = this.$root.find('.slide-status li');

			// update slides
			$($slides[prevState]).removeClass('active');
			$($slides[this.data.active]).addClass('active');

			// update led status
			$($leds[prevState]).removeClass('active');
			$($leds[this.data.active]).addClass('active');

			var index = this.data.active;
			var prevIndex = prevState;

			var left = index * -100 + '%';
			var $container = this.$root.find('.slides');
			$container.css({
				'margin-left': left
			});
		}
	},

	template: {
		'div.slide-status': function() {
			var leds = {
				ul: []
			};
			for (var l = 0; this.data.months.length > l; l++) {						
				if (l === this.data.index) {
					var led = {
						index: l,
						active: 'active'
					}
				} else {
					var led = {
						index: l,
						active: ''
					}
				}
				var liKey = 'li.carousel-slide-status-' + led.index + '.' + led.active;
				var li = {};
				li[liKey] = '';
				leds.ul.push(li);
			}
			return leds;
		},
		'div.carousel-inner': {
			'div.carousel-nav': {
				'a.carousel-prev': {
					span: 'Previous',
					'i.fa.fa-angle-double-left': ''
				},
				'a.carousel-next': {
					span: 'Next',
					'i.fa.fa-angle-double-right': ''
				}
			},
			'.slides-wrap': function() {
				var list = [];
				var style = '';
				var activeDateMonthID = new Moment(this.data.activeDate.startDate).format('MMMM').toLowerCase();
				// each slide object
				
				for (var i = 0; this.data.months.length > i; i++) {
					var currMonthID = services.utils.hyphenate( Object.keys( this.data.months[i] )[0] );
					var active = false;						
				
					if ( currMonthID === activeDateMonthID ) {
						active = this.data.activeDate;
						style = '[style="left:' + i * -100 + '%"]';
					}
				
					var item = {};
					var itemKey = 'li.slide.timeline-month#timeline-month-' + 
						currMonthID + 
						'-' + services.utils.buildMonthUID( this.data.activeDate.startDate ) +
						style;
				
					item[itemKey] = new Month({
						data: {
							id: currMonthID + '-' + services.utils.buildMonthUID( this.data.activeDate.startDate ),
							month: currMonthID,
							active: active,
							dates: this.data.months[i][ Object.keys( this.data.months[i] )[0] ]
						}
					});
				
					list.push(item);
				}

				var listKey = 'ul.slides' + style;

				var obj = {};
				obj[listKey] = list;

				return obj;
			}
		}
	}
});

module.exports = MonthCarousel;