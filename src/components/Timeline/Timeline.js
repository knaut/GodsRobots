var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var RouteChange = require('../../actions/RouteChange.js');

var DateArticle = require('../DateArticle.js');
var YearControl = require('./YearControl.js');
var Month = require('./Month.js');
var MonthList = require('./MonthList.js');


var years = services.utils.getYears( services.data.events );
var activeYear = services.utils.getYears( services.data.events )[0];

var datesByYear = services.utils.getDatesForYear( services.data.events, activeYear );
var datesByMonths = services.utils.formatDatesByMonth( datesByYear );
var firstMonthKey = Object.keys(datesByMonths[0])[0];
var firstDate = datesByMonths[0][firstMonthKey][0];

var Timeline = Ulna.Component.extend({
	root: '#main-content',
	dispatcher: dispatcher,

	// default data
	data: {
		years: years,
		activeYear: activeYear,
		dates: datesByMonths,
		activeDate: firstDate,
	},
	
	template: {
		
		'#timeline-year-control': new YearControl({
			data: {
				active: activeYear,
				years: years
			}
		}),
		
		'div#timeline-wrap': function() {

			var cols = [];
			var leftCol = {
				'#timeline-months.col-md-4.col-sm-12': new MonthList({
					data: {
						activeDate: this.data.activeDate,
						months: this.data.dates
					}
				})
			};
			
			cols.push(leftCol);

			var rightCol = {};
			var rightColKey = '#timeline-content.col-md-8.col-sm-12.col-md-offset-4';

			rightCol[rightColKey] = new DateArticle({
				data: this.data.activeDate
			});
			
			cols.push(rightCol);

			return cols;
		},
		'#timeline-bg': ''
	}
});

module.exports = Timeline;