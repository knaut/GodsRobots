var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var RouteChange = require('../../actions/RouteChange.js');

var DateNode = Ulna.Component.extend({
	root: 'li#timeline-node-<<this.data.id>>',
	dispatcher: dispatcher,

	/*
	data: {
		selected: false,
		date: null
	}
	*/

	events: {
		'mouseenter a': function(e) {
			e.preventDefault();
			this.$root.find('.timeline-popover').addClass('active');
		},

		'mouseleave a': function(e) {
			e.preventDefault();
			this.$root.find('.timeline-popover').removeClass('active');
		},

		'click a': function(e) {
			e.preventDefault();

			if (this.data.selected === true) {
				this.data.selected = false;
				this.mutations.removeSelected.call(this);	
			} else if (this.data.selected === false) {
				this.data.selected = true;
				this.mutations.addSelected.call(this);
			}

			this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange( 
				services.utils.buildDateUID( this.data.date.startDate )
			));
		}
	},

	listen: {
		
	},

	mutations: {

		addSelected: function() {
			var $anchor = this.$root.find('.timeline-node > a');
			$anchor.addClass('selected');
			var $popover = this.$root.find('div.timeline-popover');
			$popover.addClass('selected');
		},

		removeSelected: function() {
			var $anchor = this.$root.find('.timeline-node > a');
			$anchor.removeClass('selected');
			var $popover = this.$root.find('div.timeline-popover');
			$popover.removeClass('selected');
		}
	},

	template: {
		'div.timeline-node': function() {
			var isSelected = '';

			if (this.data.selected) {
				isSelected = '.selected';
			}

			var anchorKey = 'a[href="/timeline' + this.data.date.startDate.format('/YYYY/MM/DD/') + services.utils.hyphenate(this.data.date.name) + '"]' + isSelected;
			var obj = {};
			var objKey = '#timeline-popover-' + this.data.date.id;

			if (this.data.selected) {
				obj[objKey] = {
					'.timeline-popover.selected': {
						h1: this.data.date.name,
						date: this.data.date.startDate.format('MMM D, YYYY'),
					}
				};	
			} else {
				obj[objKey] = {
					'.timeline-popover': {
						h1: this.data.date.name,
						date: this.data.date.startDate.format('MMM D, YYYY'),
					}
				};
			}
			
			obj[anchorKey] = {
				span: this.data.date.name
			};

			return obj;
		}
	}
});

module.exports = DateNode;


