var Cheerio = require('cheerio');

var appHead = '<!DOCTYPE html>' +
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
		'<script src="/js/app.bundle.js"></script>' +
		'<script src="/js/libs/typed.min.js"></script>' +
		'<script type="text/javascript">' +
			'console.log("initialize");' +
			'app.bind();' +
			'app.dispatcher.dispatch("ON_LOAD", {});' +
		'</script>' +
	'</body>' +
'</html>';

var $ = Cheerio.load( appHead );

module.exports = $;