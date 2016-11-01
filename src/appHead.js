var Cheerio = require('cheerio');

var appHead = function( state, initializer ) {
	var templStart = '<!DOCTYPE html>' +
		'<html>' +
			'<head>' +
				'<title>GODS ROBOTS</title>' +
				'<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0">' +
				'<link href=\'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,300|Roboto:400,100&subset=latin,latin-ext\' rel=\'stylesheet\' type=\'text/css\'>' +
				'<link rel="stylesheet" href="/css/theme.min.css"/>' +
				'<link rel="stylesheet" href="/css/app.css"/>' +
				'<link rel="stylesheet" href="/css/font-awesome.min.css">' +
			'</head>' +
			'<body>' +
				'<div id="app-root"></div>' +
				'<script src="/js/libs/jquery.js"></script>' +
				'<script src="/js/libs/slick.min.js"></script>' +
				'<script src="/js/app.bundle.js"></script>';

	var templEnd = '</body>' +
		'</html>';


	var templ = templStart + 
		'<script type="text/javascript">' + 
			'var appState = ' + state + ';' +
			'(' + initializer.toString() + ')();' +
		'</script>' +
	templEnd;

	return templ;
};

module.exports = appHead;