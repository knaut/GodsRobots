var Cheerio = require('cheerio');

var appHead = function( state, initializer ) {
	var templStart = '<!DOCTYPE html>' +
		'<html>' +
			'<head>' +
				'<title>Janaka Selekta</title>' +
				'<meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0">' +
				'<meta charset="UTF-8">' +
				'<meta name="description" content="Janaka Selekta is a world EDM producer who also works under the names GODS ROBOTS and Might Dub Killaz, with other performers.">' +
				'<meta name="keywords" content="music,world,fusion,indian,EDM,producer,musician,performer,reggae,dub,dnb">' +
				'<meta name="author" content="Janaka Selekta">' +
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