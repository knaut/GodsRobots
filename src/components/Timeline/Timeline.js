var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var RouteChange = require('../../actions/RouteChange.js');

var DateArticle = require('../DateArticle.js');
var YearControl = require('./YearControl.js');
var Month = require('./Month.js');
var MonthList = require('./MonthList.js');
var MonthCarousel = require('./MonthCarousel.js');

var Logo = require('../Logo.js');

var years = services.utils.getYears( services.data.events );
var activeYear = services.utils.getYears( services.data.events )[0];

var datesByYear = services.utils.getDatesForYear( services.data.events, activeYear );
var datesByMonths = services.utils.formatDatesByMonth( datesByYear );
var firstMonthKey = Object.keys(datesByMonths[0])[0];
var firstDate = datesByMonths[0][firstMonthKey][0];

var Timeline = Ulna.Component.extend({
	dispatcher: dispatcher,

	// default data
	data: {
		years: years,
		activeYear: activeYear,
		dates: datesByMonths,
		activeDate: firstDate,
	},
	
	template: {
		// use a function to avoid scope issues when passing down data
		'#timeline-year-control': function() {
			return new YearControl({
				data: {
					activeYear: this.data.activeYear,
					years: this.data.years
				}
			});
		},
		
		'#timeline-wrap': function() {

			var cols = [];
			var leftCol = {
				'#timeline-months': new MonthCarousel({
					data: {
						months: this.data.dates,
						activeDate: this.data.activeDate	
					}
					
				})
			// 	'#timeline-months': new MonthList({
			// 		data: {
			// 			activeDate: this.data.activeDate,
			// 			months: this.data.dates
			// 		}
			// 	})
			};
			
			cols.push(leftCol);

			var rightCol = {};
			var rightColKey = '#timeline-content';

			rightCol[rightColKey] = {
				'.container': new DateArticle({
					data: this.data.activeDate
				})
			};
			
			cols.push(rightCol);

			return cols;
		},
		'#timeline-bg': ''
	}
});

module.exports = Timeline;