(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//! moment.js
//! version : 2.15.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.moment = factory()
}(this, function () { 'use strict';

    var hookCallback;

    function utils_hooks__hooks () {
        return hookCallback.apply(null, arguments);
    }

    // This is done to register the method called with moment()
    // without creating circular dependencies.
    function setHookCallback (callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
    }

    function isObject(input) {
        // IE8 will treat undefined and null as object if it wasn't for
        // input != null
        return input != null && Object.prototype.toString.call(input) === '[object Object]';
    }

    function isObjectEmpty(obj) {
        var k;
        for (k in obj) {
            // even if its not own property I'd still call it non-empty
            return false;
        }
        return true;
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function create_utc__createUTC (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        // We need to deep clone this object.
        return {
            empty           : false,
            unusedTokens    : [],
            unusedInput     : [],
            overflow        : -2,
            charsLeftOver   : 0,
            nullInput       : false,
            invalidMonth    : null,
            invalidFormat   : false,
            userInvalidated : false,
            iso             : false,
            parsedDateParts : [],
            meridiem        : null
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    var some;
    if (Array.prototype.some) {
        some = Array.prototype.some;
    } else {
        some = function (fun) {
            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(this, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            var parsedParts = some.call(flags.parsedDateParts, function (i) {
                return i != null;
            });
            var isNowValid = !isNaN(m._d.getTime()) &&
                flags.overflow < 0 &&
                !flags.empty &&
                !flags.invalidMonth &&
                !flags.invalidWeekday &&
                !flags.nullInput &&
                !flags.invalidFormat &&
                !flags.userInvalidated &&
                (!flags.meridiem || (flags.meridiem && parsedParts));

            if (m._strict) {
                isNowValid = isNowValid &&
                    flags.charsLeftOver === 0 &&
                    flags.unusedTokens.length === 0 &&
                    flags.bigHour === undefined;
            }

            if (Object.isFrozen == null || !Object.isFrozen(m)) {
                m._isValid = isNowValid;
            }
            else {
                return isNowValid;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid (flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }

        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;

        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    var updateInProgress = false;

    // Moment prototype object
    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment (obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor (number) {
        if (number < 0) {
            // -0 -> 0
            return Math.ceil(number) || 0;
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }

        return value;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
                (typeof console !==  'undefined') && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;

        return extend(function () {
            if (utils_hooks__hooks.deprecationHandler != null) {
                utils_hooks__hooks.deprecationHandler(null, msg);
            }
            if (firstTime) {
                var args = [];
                var arg;
                for (var i = 0; i < arguments.length; i++) {
                    arg = '';
                    if (typeof arguments[i] === 'object') {
                        arg += '\n[' + i + '] ';
                        for (var key in arguments[0]) {
                            arg += key + ': ' + arguments[0][key] + ', ';
                        }
                        arg = arg.slice(0, -2); // Remove trailing comma and space
                    } else {
                        arg = arguments[i];
                    }
                    args.push(arg);
                }
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (utils_hooks__hooks.deprecationHandler != null) {
            utils_hooks__hooks.deprecationHandler(name, msg);
        }
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;
    utils_hooks__hooks.deprecationHandler = null;

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function locale_set__set (config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._config = config;
        // Lenient ordinal parsing accepts just a number in addition to
        // number + (possibly) stuff coming from _ordinalParseLenient.
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) {
            if (hasOwnProp(childConfig, prop)) {
                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                    res[prop] = {};
                    extend(res[prop], parentConfig[prop]);
                    extend(res[prop], childConfig[prop]);
                } else if (childConfig[prop] != null) {
                    res[prop] = childConfig[prop];
                } else {
                    delete res[prop];
                }
            }
        }
        for (prop in parentConfig) {
            if (hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])) {
                // make sure changes to properties don't modify parent config
                res[prop] = extend({}, res[prop]);
            }
        }
        return res;
    }

    function Locale(config) {
        if (config != null) {
            this.set(config);
        }
    }

    var keys;

    if (Object.keys) {
        keys = Object.keys;
    } else {
        keys = function (obj) {
            var i, res = [];
            for (i in obj) {
                if (hasOwnProp(obj, i)) {
                    res.push(i);
                }
            }
            return res;
        };
    }

    var defaultCalendar = {
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        nextWeek : 'dddd [at] LT',
        lastDay : '[Yesterday at] LT',
        lastWeek : '[Last] dddd [at] LT',
        sameElse : 'L'
    };

    function locale_calendar__calendar (key, mom, now) {
        var output = this._calendar[key] || this._calendar['sameElse'];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS  : 'h:mm:ss A',
        LT   : 'h:mm A',
        L    : 'MM/DD/YYYY',
        LL   : 'MMMM D, YYYY',
        LLL  : 'MMMM D, YYYY h:mm A',
        LLLL : 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat (key) {
        var format = this._longDateFormat[key],
            formatUpper = this._longDateFormat[key.toUpperCase()];

        if (format || !formatUpper) {
            return format;
        }

        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });

        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate () {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal (number) {
        return this._ordinal.replace('%d', number);
    }

    var defaultRelativeTime = {
        future : 'in %s',
        past   : '%s ago',
        s  : 'a few seconds',
        m  : 'a minute',
        mm : '%d minutes',
        h  : 'an hour',
        hh : '%d hours',
        d  : 'a day',
        dd : '%d days',
        M  : 'a month',
        MM : '%d months',
        y  : 'a year',
        yy : '%d years'
    };

    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ?
            output(number, withoutSuffix, string, isFuture) :
            output.replace(/%d/i, number);
    }

    function pastFuture (diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    var aliases = {};

    function addUnitAlias (unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    var priorities = {};

    function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
    }

    function getPrioritizedUnits(unitsObj) {
        var units = [];
        for (var u in unitsObj) {
            units.push({unit: u, priority: priorities[u]});
        }
        units.sort(function (a, b) {
            return a.priority - b.priority;
        });
        return units;
    }

    function makeGetSet (unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get (mom, unit) {
        return mom.isValid() ?
            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set (mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    // MOMENTS

    function stringGet (units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) {
            return this[units]();
        }
        return this;
    }


    function stringSet (units, value) {
        if (typeof units === 'object') {
            units = normalizeObjectUnits(units);
            var prioritized = getPrioritizedUnits(units);
            for (var i = 0; i < prioritized.length; i++) {
                this[prioritized[i].unit](units[prioritized[i].unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number),
            zerosToFill = targetLength - absNumber.length,
            sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

    var formatFunctions = {};

    var formatTokenFunctions = {};

    // token:    'M'
    // padded:   ['MM', 2]
    // ordinal:  'Mo'
    // callback: function () { this.month() + 1 }
    function addFormatToken (token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '', i;
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }

    var match1         = /\d/;            //       0 - 9
    var match2         = /\d\d/;          //      00 - 99
    var match3         = /\d{3}/;         //     000 - 999
    var match4         = /\d{4}/;         //    0000 - 9999
    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
    var match1to2      = /\d\d?/;         //       0 - 99
    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
    var match1to3      = /\d{1,3}/;       //       0 - 999
    var match1to4      = /\d{1,4}/;       //       0 - 9999
    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

    var matchUnsigned  = /\d+/;           //       0 - inf
    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

    // any word (or two) characters or numbers including two/three word month in arabic.
    // includes scottish gaelic two word and hyphenated months
    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


    var regexes = {};

    function addRegexToken (token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken (token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }

        return regexes[token](config._strict, config._locale);
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function unescapeFormat(s) {
        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }));
    }

    function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken (token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken (token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    var indexOf;

    if (Array.prototype.indexOf) {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (o) {
            // I know
            var i;
            for (i = 0; i < this.length; ++i) {
                if (this[i] === o) {
                    return i;
                }
            }
            return -1;
        };
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    // FORMATTING

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });

    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });

    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });

    // ALIASES

    addUnitAlias('month', 'M');

    // PRIORITY

    addUnitPriority('month', 8);

    // PARSING

    addRegexToken('M',    match1to2);
    addRegexToken('MM',   match1to2, match2);
    addRegexToken('MMM',  function (isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
    });
    addRegexToken('MMMM', function (isStrict, locale) {
        return locale.monthsRegex(isStrict);
    });

    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });

    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        // if we didn't find a month name, mark the date as invalid.
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });

    // LOCALES

    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
    function localeMonths (m, format) {
        if (!m) {
            return this._months;
        }
        return isArray(this._months) ? this._months[m.month()] :
            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
    function localeMonthsShort (m, format) {
        if (!m) {
            return this._monthsShort;
        }
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function units_month__handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
            // this is not used
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
            for (i = 0; i < 12; ++i) {
                mom = create_utc__createUTC([2000, i]);
                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'MMM') {
                ii = indexOf.call(this._shortMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._longMonthsParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._longMonthsParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortMonthsParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeMonthsParse (monthName, format, strict) {
        var i, mom, regex;

        if (this._monthsParseExact) {
            return units_month__handleStrictParse.call(this, monthName, format, strict);
        }

        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }

        // TODO: add sorting
        // Sorting makes sure if one month (or abbr) is a prefix of another
        // see sorting in computeMonthsParse
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function setMonth (mom, value) {
        var dayOfMonth;

        if (!mom.isValid()) {
            // No op
            return mom;
        }

        if (typeof value === 'string') {
            if (/^\d+$/.test(value)) {
                value = toInt(value);
            } else {
                value = mom.localeData().monthsParse(value);
                // TODO: Another silent failure?
                if (typeof value !== 'number') {
                    return mom;
                }
            }
        }

        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth (value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth () {
        return daysInMonth(this.year(), this.month());
    }

    var defaultMonthsShortRegex = matchWord;
    function monthsShortRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsShortStrictRegex;
            } else {
                return this._monthsShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsShortRegex')) {
                this._monthsShortRegex = defaultMonthsShortRegex;
            }
            return this._monthsShortStrictRegex && isStrict ?
                this._monthsShortStrictRegex : this._monthsShortRegex;
        }
    }

    var defaultMonthsRegex = matchWord;
    function monthsRegex (isStrict) {
        if (this._monthsParseExact) {
            if (!hasOwnProp(this, '_monthsRegex')) {
                computeMonthsParse.call(this);
            }
            if (isStrict) {
                return this._monthsStrictRegex;
            } else {
                return this._monthsRegex;
            }
        } else {
            if (!hasOwnProp(this, '_monthsRegex')) {
                this._monthsRegex = defaultMonthsRegex;
            }
            return this._monthsStrictRegex && isStrict ?
                this._monthsStrictRegex : this._monthsRegex;
        }
    }

    function computeMonthsParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom;
        for (i = 0; i < 12; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, i]);
            shortPieces.push(this.monthsShort(mom, ''));
            longPieces.push(this.months(mom, ''));
            mixedPieces.push(this.months(mom, ''));
            mixedPieces.push(this.monthsShort(mom, ''));
        }
        // Sorting makes sure if one month (or abbr) is a prefix of another it
        // will match the longer piece.
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) {
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    addFormatToken('Y', 0, 0, function () {
        var y = this.year();
        return y <= 9999 ? '' + y : '+' + y;
    });

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });

    addFormatToken(0, ['YYYY',   4],       0, 'year');
    addFormatToken(0, ['YYYYY',  5],       0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

    // ALIASES

    addUnitAlias('year', 'y');

    // PRIORITIES

    addUnitPriority('year', 1);

    // PARSING

    addRegexToken('Y',      matchSigned);
    addRegexToken('YY',     match1to2, match2);
    addRegexToken('YYYY',   match1to4, match4);
    addRegexToken('YYYYY',  match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);

    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });
    addParseToken('Y', function (input, array) {
        array[YEAR] = parseInt(input, 10);
    });

    // HELPERS

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    // HOOKS

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    // MOMENTS

    var getSetYear = makeGetSet('FullYear', true);

    function getIsLeapYear () {
        return isLeapYear(this.year());
    }

    function createDate (y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate (y) {
        var date = new Date(Date.UTC.apply(null, arguments));

        //the Date.UTC function remaps years 0-99 to 1900-1999
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    // start-of-first-week - start-of-year
    function firstWeekOffset(year, dow, doy) {
        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
            fwd = 7 + dow - doy,
            // first-week day local weekday -- which local weekday is fwd
            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

        return -fwdlw + fwd - 1;
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7,
            weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
            resYear, resDayOfYear;

        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }

        return {
            year: resYear,
            dayOfYear: resDayOfYear
        };
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
            resWeek, resYear;

        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }

        return {
            week: resWeek,
            year: resYear
        };
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy),
            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    // FORMATTING

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

    // ALIASES

    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');

    // PRIORITIES

    addUnitPriority('week', 5);
    addUnitPriority('isoWeek', 5);

    // PARSING

    addRegexToken('w',  match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W',  match1to2);
    addRegexToken('WW', match1to2, match2);

    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    // HELPERS

    // LOCALES

    function localeWeek (mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {
        dow : 0, // Sunday is the first day of the week.
        doy : 6  // The week that contains Jan 1st is the first week of the year.
    };

    function localeFirstDayOfWeek () {
        return this._week.dow;
    }

    function localeFirstDayOfYear () {
        return this._week.doy;
    }

    // MOMENTS

    function getSetWeek (input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek (input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    // FORMATTING

    addFormatToken('d', 0, 'do', 'day');

    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });

    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });

    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });

    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');

    // ALIASES

    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');

    // PRIORITY
    addUnitPriority('day', 11);
    addUnitPriority('weekday', 11);
    addUnitPriority('isoWeekday', 11);

    // PARSING

    addRegexToken('d',    match1to2);
    addRegexToken('e',    match1to2);
    addRegexToken('E',    match1to2);
    addRegexToken('dd',   function (isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
    });
    addRegexToken('ddd',   function (isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
    });
    addRegexToken('dddd',   function (isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
    });

    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        // if we didn't get a weekday name, mark the date as invalid
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });

    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    // HELPERS

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }

        if (!isNaN(input)) {
            return parseInt(input, 10);
        }

        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }

        return null;
    }

    function parseIsoWeekday(input, locale) {
        if (typeof input === 'string') {
            return locale.weekdaysParse(input) % 7 || 7;
        }
        return isNaN(input) ? null : input;
    }

    // LOCALES

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
    function localeWeekdays (m, format) {
        if (!m) {
            return this._weekdays;
        }
        return isArray(this._weekdays) ? this._weekdays[m.day()] :
            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
    function localeWeekdaysShort (m) {
        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
    function localeWeekdaysMin (m) {
        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
    }

    function day_of_week__handleStrictParse(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._minWeekdaysParse = [];

            for (i = 0; i < 7; ++i) {
                mom = create_utc__createUTC([2000, 1]).day(i);
                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
            }
        }

        if (strict) {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        } else {
            if (format === 'dddd') {
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else if (format === 'ddd') {
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._minWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            } else {
                ii = indexOf.call(this._minWeekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._weekdaysParse, llc);
                if (ii !== -1) {
                    return ii;
                }
                ii = indexOf.call(this._shortWeekdaysParse, llc);
                return ii !== -1 ? ii : null;
            }
        }
    }

    function localeWeekdaysParse (weekdayName, format, strict) {
        var i, mom, regex;

        if (this._weekdaysParseExact) {
            return day_of_week__handleStrictParse.call(this, weekdayName, format, strict);
        }

        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }

        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already

            mom = create_utc__createUTC([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            // test the regex
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    // MOMENTS

    function getSetDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek (input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }

        // behaves the same as moment#day except
        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
        // as a setter, sunday should belong to the previous week.

        if (input != null) {
            var weekday = parseIsoWeekday(input, this.localeData());
            return this.day(this.day() % 7 ? weekday : weekday - 7);
        } else {
            return this.day() || 7;
        }
    }

    var defaultWeekdaysRegex = matchWord;
    function weekdaysRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysStrictRegex;
            } else {
                return this._weekdaysRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                this._weekdaysRegex = defaultWeekdaysRegex;
            }
            return this._weekdaysStrictRegex && isStrict ?
                this._weekdaysStrictRegex : this._weekdaysRegex;
        }
    }

    var defaultWeekdaysShortRegex = matchWord;
    function weekdaysShortRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysShortStrictRegex;
            } else {
                return this._weekdaysShortRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
            }
            return this._weekdaysShortStrictRegex && isStrict ?
                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
    }

    var defaultWeekdaysMinRegex = matchWord;
    function weekdaysMinRegex (isStrict) {
        if (this._weekdaysParseExact) {
            if (!hasOwnProp(this, '_weekdaysRegex')) {
                computeWeekdaysParse.call(this);
            }
            if (isStrict) {
                return this._weekdaysMinStrictRegex;
            } else {
                return this._weekdaysMinRegex;
            }
        } else {
            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
            }
            return this._weekdaysMinStrictRegex && isStrict ?
                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
    }


    function computeWeekdaysParse () {
        function cmpLenRev(a, b) {
            return b.length - a.length;
        }

        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
            i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
            // make the regex if we don't have it already
            mom = create_utc__createUTC([2000, 1]).day(i);
            minp = this.weekdaysMin(mom, '');
            shortp = this.weekdaysShort(mom, '');
            longp = this.weekdays(mom, '');
            minPieces.push(minp);
            shortPieces.push(shortp);
            longPieces.push(longp);
            mixedPieces.push(minp);
            mixedPieces.push(shortp);
            mixedPieces.push(longp);
        }
        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
        // will match the longer piece.
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 7; i++) {
            shortPieces[i] = regexEscape(shortPieces[i]);
            longPieces[i] = regexEscape(longPieces[i]);
            mixedPieces[i] = regexEscape(mixedPieces[i]);
        }

        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;

        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
    }

    // FORMATTING

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    function kFormat() {
        return this.hours() || 24;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('k', ['kk', 2], 0, kFormat);

    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });

    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });

    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem (token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);

    // ALIASES

    addUnitAlias('hour', 'h');

    // PRIORITY
    addUnitPriority('hour', 13);

    // PARSING

    function matchMeridiem (isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a',  matchMeridiem);
    addRegexToken('A',  matchMeridiem);
    addRegexToken('H',  match1to2);
    addRegexToken('h',  match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);

    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);

    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    // LOCALES

    function localeIsPM (input) {
        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
        // Using charAt should be more compatible.
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
    function localeMeridiem (hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }


    // MOMENTS

    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    var getSetHour = makeGetSet('Hours', true);

    var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        ordinalParse: defaultOrdinalParse,
        relativeTime: defaultRelativeTime,

        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,

        week: defaultLocaleWeek,

        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,

        meridiemParse: defaultLocaleMeridiemParse
    };

    // internal storage for locale config files
    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        // TODO: Find a better way to register and load all the locales in Node
        if (!locales[name] && (typeof module !== 'undefined') &&
                module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we
                // want to undo that for lazy loaded locales
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    function locale_locales__getSetGlobalLocale (key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }

            if (data) {
                // moment.duration._locale = moment._locale = data;
                globalLocale = data;
            }
        }

        return globalLocale._abbr;
    }

    function defineLocale (name, config) {
        if (config !== null) {
            var parentConfig = baseConfig;
            config.abbr = name;
            if (locales[name] != null) {
                deprecateSimple('defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                        'an existing locale. moment.defineLocale(localeName, ' +
                        'config) should only be used for creating a new locale ' +
                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                parentConfig = locales[name]._config;
            } else if (config.parentLocale != null) {
                if (locales[config.parentLocale] != null) {
                    parentConfig = locales[config.parentLocale]._config;
                } else {
                    // treat as if there is no base config
                    deprecateSimple('parentLocaleUndefined',
                            'specified parentLocale is not defined yet. See http://momentjs.com/guides/#/warnings/parent-locale/');
                }
            }
            locales[name] = new Locale(mergeConfigs(parentConfig, config));

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    }

    function updateLocale(name, config) {
        if (config != null) {
            var locale, parentConfig = baseConfig;
            // MERGE
            if (locales[name] != null) {
                parentConfig = locales[name]._config;
            }
            config = mergeConfigs(parentConfig, config);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;

            // backwards compat for now: also set the locale
            locale_locales__getSetGlobalLocale(name);
        } else {
            // pass null for config to unupdate, useful for tests
            if (locales[name] != null) {
                if (locales[name].parentLocale != null) {
                    locales[name] = locales[name].parentLocale;
                } else if (locales[name] != null) {
                    delete locales[name];
                }
            }
        }
        return locales[name];
    }

    // returns locale data
    function locale_locales__getLocale (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return globalLocale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    }

    function locale_locales__listLocales() {
        return keys(locales);
    }

    function checkOverflow (m) {
        var overflow;
        var a = m._a;

        if (a && getParsingFlags(m).overflow === -2) {
            overflow =
                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }

            getParsingFlags(m).overflow = overflow;
        }

        return m;
    }

    // iso 8601 regex
    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

    var isoDates = [
        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
        ['YYYY-DDD', /\d{4}-\d{3}/],
        ['YYYY-MM', /\d{4}-\d\d/, false],
        ['YYYYYYMMDD', /[+-]\d{10}/],
        ['YYYYMMDD', /\d{8}/],
        // YYYYMM is NOT allowed by the standard
        ['GGGG[W]WWE', /\d{4}W\d{3}/],
        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
        ['YYYYDDD', /\d{7}/]
    ];

    // iso time formats and regexes
    var isoTimes = [
        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
        ['HH:mm', /\d\d:\d\d/],
        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
        ['HHmmss', /\d\d\d\d\d\d/],
        ['HHmm', /\d\d\d\d/],
        ['HH', /\d\d/]
    ];

    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    // date from iso format
    function configFromISO(config) {
        var i, l,
            string = config._i,
            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
            allowTime, dateFormat, timeFormat, tzFormat;

        if (match) {
            getParsingFlags(config).iso = true;

            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        // match[2] should be 'T' or space
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);

        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }

        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate(
        'value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' +
        'which is not reliable across all browsers and versions. Non ISO date formats are ' +
        'discouraged and will be removed in an upcoming major release. Please refer to ' +
        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick the first defined of two or three arguments.
    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        // hooks is actually the exported moment object
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function configFromArray (config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }

            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    // constant that refers to the ISO standard
    utils_hooks__hooks.ISO_8601 = function () {};

    // date from string and format string
    function configFromStringAndFormat(config) {
        // TODO: Move this to another part of the creation flow to prevent circular deps
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }

        config._a = [];
        getParsingFlags(config).empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            // console.log('token', token, 'parsedInput', parsedInput,
            //         'regex', getParseRegexForToken(token, config));
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._a[HOUR] <= 12 &&
            getParsingFlags(config).bigHour === true &&
            config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }

        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

        configFromArray(config);
        checkOverflow(config);
    }


    function meridiemFixWrap (locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // this is not supposed to happen
            return hour;
        }
    }

    // date from string and array of format strings
    function configFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);

            if (!valid__isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += getParsingFlags(tempConfig).charsLeftOver;

            //or tokens
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

            getParsingFlags(tempConfig).score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }

        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });

        configFromArray(config);
    }

    function createFromConfig (config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    function prepareConfig (config) {
        var input = config._i,
            format = config._f;

        config._locale = config._locale || locale_locales__getLocale(config._l);

        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (isDate(input)) {
            config._d = input;
        } else if (format) {
            configFromStringAndFormat(config);
        }  else {
            configFromInput(config);
        }

        if (!valid__isValid(config)) {
            config._d = null;
        }

        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(input.valueOf());
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC (input, format, locale, strict, isUTC) {
        var c = {};

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }

        if ((isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)) {
            input = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;

        return createFromConfig(c);
    }

    function local__createLocal (input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate(
        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other < this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    var prototypeMax = deprecate(
        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
        function () {
            var other = local__createLocal.apply(null, arguments);
            if (this.isValid() && other.isValid()) {
                return other > this ? this : other;
            } else {
                return valid__createInvalid();
            }
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    // TODO: Use [].sort instead?
    function min () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    }

    function max () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    }

    var now = function () {
        return Date.now ? Date.now() : +(new Date());
    };

    function Duration (duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = locale_locales__getLocale();

        this._bubble();
    }

    function isDuration (obj) {
        return obj instanceof Duration;
    }

    function absRound (number) {
        if (number < 0) {
            return Math.round(-1 * number) * -1;
        } else {
            return Math.round(number);
        }
    }

    // FORMATTING

    function offset (token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');

    // PARSING

    addRegexToken('Z',  matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });

    // HELPERS

    // timezone chunker
    // '+10:00' > ['10',  '00']
    // '-1530'  > ['-15', '30']
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk   = matches[matches.length - 1] || [];
        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // Return a moment from input, that is local/utc/zone equivalent to model.
    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? input.valueOf() : local__createLocal(input).valueOf()) - res.valueOf();
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(res._d.valueOf() + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset (m) {
        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
        // https://github.com/moment/moment/pull/1871
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    // HOOKS

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    utils_hooks__hooks.updateOffset = function () {};

    // MOMENTS

    // keepLocalTime = true means only change the timezone, without
    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
    // +0200, so we adjust the time as needed, to be valid.
    //
    // Keeping the time actually adds/subtracts (one hour)
    // from the actual represented time. That is why we call updateOffset
    // a second time. In case it wants us to change the offset again
    // _changeInProgress == true case, then we have to adjust, because
    // there is no such time in the given timezone.
    function getSetOffset (input, keepLocalTime) {
        var offset = this._offset || 0,
            localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone (input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }

            this.utcOffset(input, keepLocalTime);

            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC (keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal (keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;

            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset () {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            var tZone = offsetFromString(matchOffset, this._i);

            if (tZone === 0) {
                this.utcOffset(0, true);
            } else {
                this.utcOffset(offsetFromString(matchOffset, this._i));
            }
        }
        return this;
    }

    function hasAlignedHourOffset (input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;

        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime () {
        return (
            this.utcOffset() > this.clone().month(0).utcOffset() ||
            this.utcOffset() > this.clone().month(5).utcOffset()
        );
    }

    function isDaylightSavingTimeShifted () {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }

        var c = {};

        copyConfig(c, this);
        c = prepareConfig(c);

        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() &&
                compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }

        return this._isDSTShifted;
    }

    function isLocal () {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset () {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc () {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    // ASP.NET json date format regex
    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
    // and further modified to allow for strings containing both week and day
    var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

    function create__createDuration (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            diffRes;

        if (isDuration(input)) {
            duration = {
                ms : input._milliseconds,
                d  : input._days,
                M  : input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y  : 0,
                d  : toInt(match[DATE])                         * sign,
                h  : toInt(match[HOUR])                         * sign,
                m  : toInt(match[MINUTE])                       * sign,
                s  : toInt(match[SECOND])                       * sign,
                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y : parseIso(match[2], sign),
                M : parseIso(match[3], sign),
                w : parseIso(match[4], sign),
                d : parseIso(match[5], sign),
                h : parseIso(match[6], sign),
                m : parseIso(match[7], sign),
                s : parseIso(match[8], sign)
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso (inp, sign) {
        // We'd normally use ~~inp for this, but unfortunately it also
        // converts floats to ints.
        // inp may be undefined, so careful calling replace on it.
        var res = inp && parseFloat(inp.replace(',', '.'));
        // apply sign while we're at it
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }

        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = absRound(duration._days),
            months = absRound(duration._months);

        if (!mom.isValid()) {
            // No op
            return;
        }

        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add      = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, 'days', true);
        return diff < -6 ? 'sameElse' :
                diff < -1 ? 'lastWeek' :
                diff < 0 ? 'lastDay' :
                diff < 1 ? 'sameDay' :
                diff < 2 ? 'nextDay' :
                diff < 7 ? 'nextWeek' : 'sameElse';
    }

    function moment_calendar__calendar (time, formats) {
        // We want to compare the start of today, vs this.
        // Getting start-of-today depends on whether we're local/utc/offset or not.
        var now = time || local__createLocal(),
            sod = cloneWithOffset(now, this).startOf('day'),
            format = utils_hooks__hooks.calendarFormat(this, sod) || 'sameElse';

        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone () {
        return new Moment(this);
    }

    function isAfter (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() > localInput.valueOf();
        } else {
            return localInput.valueOf() < this.clone().startOf(units).valueOf();
        }
    }

    function isBefore (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() < localInput.valueOf();
        } else {
            return this.clone().endOf(units).valueOf() < localInput.valueOf();
        }
    }

    function isBetween (from, to, units, inclusivity) {
        inclusivity = inclusivity || '()';
        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
    }

    function isSame (input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input),
            inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return this.valueOf() === localInput.valueOf();
        } else {
            inputMs = localInput.valueOf();
            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
        }
    }

    function isSameOrAfter (input, units) {
        return this.isSame(input, units) || this.isAfter(input,units);
    }

    function isSameOrBefore (input, units) {
        return this.isSame(input, units) || this.isBefore(input,units);
    }

    function diff (input, units, asFloat) {
        var that,
            zoneDelta,
            delta, output;

        if (!this.isValid()) {
            return NaN;
        }

        that = cloneWithOffset(input, this);

        if (!that.isValid()) {
            return NaN;
        }

        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

        units = normalizeUnits(units);

        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : // 1000
                units === 'minute' ? delta / 6e4 : // 1000 * 60
                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff (a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        //check for negative zero, return zero if negative zero
        return -(wholeMonthDiff + adjust) || 0;
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
    utils_hooks__hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

    function toString () {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString () {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format (inputString) {
        if (!inputString) {
            inputString = this.isUtc() ? utils_hooks__hooks.defaultFormatUtc : utils_hooks__hooks.defaultFormat;
        }
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
    }

    function from (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow (withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to (time, withoutSuffix) {
        if (this.isValid() &&
                ((isMoment(time) && time.isValid()) ||
                 local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow (withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    // If passed a locale key, it will set the locale for this
    // instance.  Otherwise, it will return the locale configuration
    // variables for this instance.
    function locale (key) {
        var newLocaleData;

        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate(
        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
        function (key) {
            if (key === undefined) {
                return this.localeData();
            } else {
                return this.locale(key);
            }
        }
    );

    function localeData () {
        return this._locale;
    }

    function startOf (units) {
        units = normalizeUnits(units);
        // the following switch intentionally omits break keywords
        // to utilize falling through the cases.
        switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
            case 'date':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
        }

        // weeks are a special case
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }

        // quarters are also special
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }

        return this;
    }

    function endOf (units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }

        // 'date' is an alias for 'day', so it should be considered as such.
        if (units === 'date') {
            units = 'day';
        }

        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf () {
        return this._d.valueOf() - ((this._offset || 0) * 60000);
    }

    function unix () {
        return Math.floor(this.valueOf() / 1000);
    }

    function toDate () {
        return new Date(this.valueOf());
    }

    function toArray () {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject () {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON () {
        // new Date(NaN).toJSON() === null
        return this.isValid() ? this.toISOString() : null;
    }

    function moment_valid__isValid () {
        return valid__isValid(this);
    }

    function parsingFlags () {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt () {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }

    // FORMATTING

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });

    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken (token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg',     'weekYear');
    addWeekYearFormatToken('ggggg',    'weekYear');
    addWeekYearFormatToken('GGGG',  'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

    // ALIASES

    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');

    // PRIORITY

    addUnitPriority('weekYear', 1);
    addUnitPriority('isoWeekYear', 1);


    // PARSING

    addRegexToken('G',      matchSigned);
    addRegexToken('g',      matchSigned);
    addRegexToken('GG',     match1to2, match2);
    addRegexToken('gg',     match1to2, match2);
    addRegexToken('GGGG',   match1to4, match4);
    addRegexToken('gggg',   match1to4, match4);
    addRegexToken('GGGGG',  match1to6, match6);
    addRegexToken('ggggg',  match1to6, match6);

    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });

    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    // MOMENTS

    function getSetWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy);
    }

    function getSetISOWeekYear (input) {
        return getSetWeekYearHelper.call(this,
                input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear () {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear () {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    // FORMATTING

    addFormatToken('Q', 0, 'Qo', 'quarter');

    // ALIASES

    addUnitAlias('quarter', 'Q');

    // PRIORITY

    addUnitPriority('quarter', 7);

    // PARSING

    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    // MOMENTS

    function getSetQuarter (input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    // FORMATTING

    addFormatToken('D', ['DD', 2], 'Do', 'date');

    // ALIASES

    addUnitAlias('date', 'D');

    // PRIOROITY
    addUnitPriority('date', 9);

    // PARSING

    addRegexToken('D',  match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });

    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });

    // MOMENTS

    var getSetDayOfMonth = makeGetSet('Date', true);

    // FORMATTING

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

    // ALIASES

    addUnitAlias('dayOfYear', 'DDD');

    // PRIORITY
    addUnitPriority('dayOfYear', 4);

    // PARSING

    addRegexToken('DDD',  match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    // HELPERS

    // MOMENTS

    function getSetDayOfYear (input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    // FORMATTING

    addFormatToken('m', ['mm', 2], 0, 'minute');

    // ALIASES

    addUnitAlias('minute', 'm');

    // PRIORITY

    addUnitPriority('minute', 14);

    // PARSING

    addRegexToken('m',  match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);

    // MOMENTS

    var getSetMinute = makeGetSet('Minutes', false);

    // FORMATTING

    addFormatToken('s', ['ss', 2], 0, 'second');

    // ALIASES

    addUnitAlias('second', 's');

    // PRIORITY

    addUnitPriority('second', 15);

    // PARSING

    addRegexToken('s',  match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);

    // MOMENTS

    var getSetSecond = makeGetSet('Seconds', false);

    // FORMATTING

    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });

    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });

    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });


    // ALIASES

    addUnitAlias('millisecond', 'ms');

    // PRIORITY

    addUnitPriority('millisecond', 16);

    // PARSING

    addRegexToken('S',    match1to3, match1);
    addRegexToken('SS',   match1to3, match2);
    addRegexToken('SSS',  match1to3, match3);

    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    // MOMENTS

    var getSetMillisecond = makeGetSet('Milliseconds', false);

    // FORMATTING

    addFormatToken('z',  0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    // MOMENTS

    function getZoneAbbr () {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName () {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;

    momentPrototype__proto.add               = add_subtract__add;
    momentPrototype__proto.calendar          = moment_calendar__calendar;
    momentPrototype__proto.clone             = clone;
    momentPrototype__proto.diff              = diff;
    momentPrototype__proto.endOf             = endOf;
    momentPrototype__proto.format            = format;
    momentPrototype__proto.from              = from;
    momentPrototype__proto.fromNow           = fromNow;
    momentPrototype__proto.to                = to;
    momentPrototype__proto.toNow             = toNow;
    momentPrototype__proto.get               = stringGet;
    momentPrototype__proto.invalidAt         = invalidAt;
    momentPrototype__proto.isAfter           = isAfter;
    momentPrototype__proto.isBefore          = isBefore;
    momentPrototype__proto.isBetween         = isBetween;
    momentPrototype__proto.isSame            = isSame;
    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
    momentPrototype__proto.isValid           = moment_valid__isValid;
    momentPrototype__proto.lang              = lang;
    momentPrototype__proto.locale            = locale;
    momentPrototype__proto.localeData        = localeData;
    momentPrototype__proto.max               = prototypeMax;
    momentPrototype__proto.min               = prototypeMin;
    momentPrototype__proto.parsingFlags      = parsingFlags;
    momentPrototype__proto.set               = stringSet;
    momentPrototype__proto.startOf           = startOf;
    momentPrototype__proto.subtract          = add_subtract__subtract;
    momentPrototype__proto.toArray           = toArray;
    momentPrototype__proto.toObject          = toObject;
    momentPrototype__proto.toDate            = toDate;
    momentPrototype__proto.toISOString       = moment_format__toISOString;
    momentPrototype__proto.toJSON            = toJSON;
    momentPrototype__proto.toString          = toString;
    momentPrototype__proto.unix              = unix;
    momentPrototype__proto.valueOf           = to_type__valueOf;
    momentPrototype__proto.creationData      = creationData;

    // Year
    momentPrototype__proto.year       = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;

    // Week Year
    momentPrototype__proto.weekYear    = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

    // Quarter
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

    // Month
    momentPrototype__proto.month       = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;

    // Week
    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
    momentPrototype__proto.weeksInYear    = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

    // Day
    momentPrototype__proto.date       = getSetDayOfMonth;
    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

    // Hour
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

    // Minute
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

    // Second
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

    // Millisecond
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

    // Offset
    momentPrototype__proto.utcOffset            = getSetOffset;
    momentPrototype__proto.utc                  = setOffsetToUTC;
    momentPrototype__proto.local                = setOffsetToLocal;
    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST                = isDaylightSavingTime;
    momentPrototype__proto.isLocal              = isLocal;
    momentPrototype__proto.isUtcOffset          = isUtcOffset;
    momentPrototype__proto.isUtc                = isUtc;
    momentPrototype__proto.isUTC                = isUtc;

    // Timezone
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;

    // Deprecations
    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
    momentPrototype__proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

    var momentPrototype = momentPrototype__proto;

    function moment__createUnix (input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone () {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    function preParsePostFormat (string) {
        return string;
    }

    var prototype__proto = Locale.prototype;

    prototype__proto.calendar        = locale_calendar__calendar;
    prototype__proto.longDateFormat  = longDateFormat;
    prototype__proto.invalidDate     = invalidDate;
    prototype__proto.ordinal         = ordinal;
    prototype__proto.preparse        = preParsePostFormat;
    prototype__proto.postformat      = preParsePostFormat;
    prototype__proto.relativeTime    = relative__relativeTime;
    prototype__proto.pastFuture      = pastFuture;
    prototype__proto.set             = locale_set__set;

    // Month
    prototype__proto.months            =        localeMonths;
    prototype__proto.monthsShort       =        localeMonthsShort;
    prototype__proto.monthsParse       =        localeMonthsParse;
    prototype__proto.monthsRegex       = monthsRegex;
    prototype__proto.monthsShortRegex  = monthsShortRegex;

    // Week
    prototype__proto.week = localeWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

    // Day of Week
    prototype__proto.weekdays       =        localeWeekdays;
    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

    prototype__proto.weekdaysRegex       =        weekdaysRegex;
    prototype__proto.weekdaysShortRegex  =        weekdaysShortRegex;
    prototype__proto.weekdaysMinRegex    =        weekdaysMinRegex;

    // Hours
    prototype__proto.isPM = localeIsPM;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get (format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function listMonthsImpl (format, index, field) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }

        format = format || '';

        if (index != null) {
            return lists__get(format, index, field, 'month');
        }

        var i;
        var out = [];
        for (i = 0; i < 12; i++) {
            out[i] = lists__get(format, i, field, 'month');
        }
        return out;
    }

    // ()
    // (5)
    // (fmt, 5)
    // (fmt)
    // (true)
    // (true, 5)
    // (true, fmt, 5)
    // (true, fmt)
    function listWeekdaysImpl (localeSorted, format, index, field) {
        if (typeof localeSorted === 'boolean') {
            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        } else {
            format = localeSorted;
            index = format;
            localeSorted = false;

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            format = format || '';
        }

        var locale = locale_locales__getLocale(),
            shift = localeSorted ? locale._week.dow : 0;

        if (index != null) {
            return lists__get(format, (index + shift) % 7, field, 'day');
        }

        var i;
        var out = [];
        for (i = 0; i < 7; i++) {
            out[i] = lists__get(format, (i + shift) % 7, field, 'day');
        }
        return out;
    }

    function lists__listMonths (format, index) {
        return listMonthsImpl(format, index, 'months');
    }

    function lists__listMonthsShort (format, index) {
        return listMonthsImpl(format, index, 'monthsShort');
    }

    function lists__listWeekdays (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
    }

    function lists__listWeekdaysShort (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
    }

    function lists__listWeekdaysMin (localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
    }

    locale_locales__getSetGlobalLocale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    // Side effect imports
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

    var mathAbs = Math.abs;

    function duration_abs__abs () {
        var data           = this._data;

        this._milliseconds = mathAbs(this._milliseconds);
        this._days         = mathAbs(this._days);
        this._months       = mathAbs(this._months);

        data.milliseconds  = mathAbs(data.milliseconds);
        data.seconds       = mathAbs(data.seconds);
        data.minutes       = mathAbs(data.minutes);
        data.hours         = mathAbs(data.hours);
        data.months        = mathAbs(data.months);
        data.years         = mathAbs(data.years);

        return this;
    }

    function duration_add_subtract__addSubtract (duration, input, value, direction) {
        var other = create__createDuration(input, value);

        duration._milliseconds += direction * other._milliseconds;
        duration._days         += direction * other._days;
        duration._months       += direction * other._months;

        return duration._bubble();
    }

    // supports only 2.0-style add(1, 's') or add(duration)
    function duration_add_subtract__add (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    // supports only 2.0-style subtract(1, 's') or subtract(duration)
    function duration_add_subtract__subtract (input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil (number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble () {
        var milliseconds = this._milliseconds;
        var days         = this._days;
        var months       = this._months;
        var data         = this._data;
        var seconds, minutes, hours, years, monthsFromDays;

        // if we have a mix of positive and negative values, bubble down first
        // check: https://github.com/moment/moment/issues/2166
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }

        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1000;

        seconds           = absFloor(milliseconds / 1000);
        data.seconds      = seconds % 60;

        minutes           = absFloor(seconds / 60);
        data.minutes      = minutes % 60;

        hours             = absFloor(minutes / 60);
        data.hours        = hours % 24;

        days += absFloor(hours / 24);

        // convert days to months
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));

        // 12 months -> 1 year
        years = absFloor(months / 12);
        months %= 12;

        data.days   = days;
        data.months = months;
        data.years  = years;

        return this;
    }

    function daysToMonths (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        // 400 years have 12 months === 4800
        return days * 4800 / 146097;
    }

    function monthsToDays (months) {
        // the reverse of daysToMonths
        return months * 146097 / 4800;
    }

    function as (units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;

        units = normalizeUnits(units);

        if (units === 'month' || units === 'year') {
            days   = this._days   + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            // handle milliseconds separately because of floating point math errors (issue #1867)
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case 'week'   : return days / 7     + milliseconds / 6048e5;
                case 'day'    : return days         + milliseconds / 864e5;
                case 'hour'   : return days * 24    + milliseconds / 36e5;
                case 'minute' : return days * 1440  + milliseconds / 6e4;
                case 'second' : return days * 86400 + milliseconds / 1000;
                // Math.floor prevents floating point math errors here
                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                default: throw new Error('Unknown unit ' + units);
            }
        }
    }

    // TODO: Use this.as('ms')?
    function duration_as__valueOf () {
        return (
            this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6
        );
    }

    function makeAs (alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds      = makeAs('s');
    var asMinutes      = makeAs('m');
    var asHours        = makeAs('h');
    var asDays         = makeAs('d');
    var asWeeks        = makeAs('w');
    var asMonths       = makeAs('M');
    var asYears        = makeAs('y');

    function duration_get__get (units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds      = makeGetter('seconds');
    var minutes      = makeGetter('minutes');
    var hours        = makeGetter('hours');
    var days         = makeGetter('days');
    var months       = makeGetter('months');
    var years        = makeGetter('years');

    function weeks () {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {
        s: 45,  // seconds to minute
        m: 45,  // minutes to hour
        h: 22,  // hours to day
        d: 26,  // days to month
        M: 11   // months to year
    };

    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds  = round(duration.as('s'));
        var minutes  = round(duration.as('m'));
        var hours    = round(duration.as('h'));
        var days     = round(duration.as('d'));
        var months   = round(duration.as('M'));
        var years    = round(duration.as('y'));

        var a = seconds < thresholds.s && ['s', seconds]  ||
                minutes <= 1           && ['m']           ||
                minutes < thresholds.m && ['mm', minutes] ||
                hours   <= 1           && ['h']           ||
                hours   < thresholds.h && ['hh', hours]   ||
                days    <= 1           && ['d']           ||
                days    < thresholds.d && ['dd', days]    ||
                months  <= 1           && ['M']           ||
                months  < thresholds.M && ['MM', months]  ||
                years   <= 1           && ['y']           || ['yy', years];

        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    // This function allows you to set the rounding function for relative time strings
    function duration_humanize__getSetRelativeTimeRounding (roundingFunction) {
        if (roundingFunction === undefined) {
            return round;
        }
        if (typeof(roundingFunction) === 'function') {
            round = roundingFunction;
            return true;
        }
        return false;
    }

    // This function allows you to set a threshold for relative time strings
    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize (withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }

        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        // for ISO strings we do not use the normal bubbling rules:
        //  * milliseconds bubble up until they become hours
        //  * days do not bubble at all
        //  * months bubble up until they become years
        // This is because there is no context-free conversion between hours and days
        // (think of clock changes)
        // and also not between days and months (28-31 days per month)
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days         = iso_string__abs(this._days);
        var months       = iso_string__abs(this._months);
        var minutes, hours, years;

        // 3600 seconds -> 60 minutes -> 1 hour
        minutes           = absFloor(seconds / 60);
        hours             = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;

        // 12 months -> 1 year
        years  = absFloor(months / 12);
        months %= 12;


        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();

        if (!total) {
            // this is the same as C#'s (Noda) and python (isodate)...
            // but not other JS (goog.date)
            return 'P0D';
        }

        return (total < 0 ? '-' : '') +
            'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;

    duration_prototype__proto.abs            = duration_abs__abs;
    duration_prototype__proto.add            = duration_add_subtract__add;
    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
    duration_prototype__proto.as             = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds      = asSeconds;
    duration_prototype__proto.asMinutes      = asMinutes;
    duration_prototype__proto.asHours        = asHours;
    duration_prototype__proto.asDays         = asDays;
    duration_prototype__proto.asWeeks        = asWeeks;
    duration_prototype__proto.asMonths       = asMonths;
    duration_prototype__proto.asYears        = asYears;
    duration_prototype__proto.valueOf        = duration_as__valueOf;
    duration_prototype__proto._bubble        = bubble;
    duration_prototype__proto.get            = duration_get__get;
    duration_prototype__proto.milliseconds   = milliseconds;
    duration_prototype__proto.seconds        = seconds;
    duration_prototype__proto.minutes        = minutes;
    duration_prototype__proto.hours          = hours;
    duration_prototype__proto.days           = days;
    duration_prototype__proto.weeks          = weeks;
    duration_prototype__proto.months         = months;
    duration_prototype__proto.years          = years;
    duration_prototype__proto.humanize       = humanize;
    duration_prototype__proto.toISOString    = iso_string__toISOString;
    duration_prototype__proto.toString       = iso_string__toISOString;
    duration_prototype__proto.toJSON         = iso_string__toISOString;
    duration_prototype__proto.locale         = locale;
    duration_prototype__proto.localeData     = localeData;

    // Deprecations
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;

    // Side effect imports

    // FORMATTING

    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');

    // PARSING

    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });

    // Side effect imports


    utils_hooks__hooks.version = '2.15.1';

    setHookCallback(local__createLocal);

    utils_hooks__hooks.fn                    = momentPrototype;
    utils_hooks__hooks.min                   = min;
    utils_hooks__hooks.max                   = max;
    utils_hooks__hooks.now                   = now;
    utils_hooks__hooks.utc                   = create_utc__createUTC;
    utils_hooks__hooks.unix                  = moment__createUnix;
    utils_hooks__hooks.months                = lists__listMonths;
    utils_hooks__hooks.isDate                = isDate;
    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid               = valid__createInvalid;
    utils_hooks__hooks.duration              = create__createDuration;
    utils_hooks__hooks.isMoment              = isMoment;
    utils_hooks__hooks.weekdays              = lists__listWeekdays;
    utils_hooks__hooks.parseZone             = moment__createInZone;
    utils_hooks__hooks.localeData            = locale_locales__getLocale;
    utils_hooks__hooks.isDuration            = isDuration;
    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale          = defineLocale;
    utils_hooks__hooks.updateLocale          = updateLocale;
    utils_hooks__hooks.locales               = locale_locales__listLocales;
    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
    utils_hooks__hooks.relativeTimeRounding = duration_humanize__getSetRelativeTimeRounding;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.calendarFormat        = getCalendarFormat;
    utils_hooks__hooks.prototype             = momentPrototype;

    var _moment = utils_hooks__hooks;

    return _moment;

}));
},{}],2:[function(require,module,exports){
nerve = {};
nerve.type = 'nerve';

nerve.parse = {};
nerve.parse.css = require('./modules/parse/css.js');

nerve.toType = require('./modules/toType.js')
nerve.normalize = require('./modules/normalize.js');
nerve.stringify = require('./modules/stringify.js');
nerve.interpolate = require('./modules/interpolate.js');

module.exports = nerve;
},{"./modules/interpolate.js":3,"./modules/normalize.js":4,"./modules/parse/css.js":5,"./modules/stringify.js":6,"./modules/toType.js":7}],3:[function(require,module,exports){
module.exports = function(key) {
	// extract stringified refs based on a custom syntax
	var reg = /\<\<([a-zA-Z|\.]*)\>\>/g;
	var arr = key.match(reg);

	// loop through the references
	for (var a = 0; arr.length > a; a++) {

		// better regexing, or passing a handler to replace, might save us this cleanup dance
		var ref = arr[a].replace(/[\<*|\>*]/g, '');

		// we could eval here
		// instead we'll construct a custom function that only returns based on type (for security concerns)
		// then we'll call that in the context of the current object we're mixed into
		var interpolatedRef = (new Function(
			// only strings and numbers should be acceptable as references
			'if (typeof ' + ref + ' === \'string\' || typeof ' + ref + ' === \'number\') { ' +
				'return ' + ref +
			'} else {' +
				'throw new Error("Bad reference encountered while interpolating template:", ' + ref + ');' +
			'}')).call(this);

		// replace each found reference in our array with its interpolated equivalent
		key = key.replace(arr[a], interpolatedRef)
	}

	return key;
}
},{}],4:[function(require,module,exports){
module.exports = function(struct) {
	var normalized = [];
	switch (this.toType(struct)) {
		case 'string':
			return struct;
			break;
		case 'number':
			return struct;
			break;
		case 'array':
			// for component based library (Ulna), check if we're mixed into the component
			// prototype, and assume on its api

			if (this.type === 'component') {
				// this is uninintuitive but works because of recursion
				// when we loop, we push to the normalized struct (component's) children
				for (var x = 0; struct.length > x; x++) {
					normalized.push( this.normalize(struct[x])[0] );	// normalized always returns an array
				}

				// by setting normalized to the struct, we return the array for normalized templates
				// normalized = struct;

			} else {
				
				// code where we assume every array holds another nerve template object
				for (var i = 0; struct.length > i; i++) {

					var obj = struct[i];

					for (var key in obj) {

						// check for interpolated keys
						key = this.interpolate( key );

						var parsed = this.parse.css.selector(key);
						parsed.inner = this.normalize(obj[key]);
					}

					normalized.push(parsed)
				}
			}

			break;
		case 'object':
			var keys = Object.keys(struct);

			for (var k = 0; keys.length > k; k++) {
				var obj = {};
				var key = keys[k];
				var val = struct[key];

				obj[key] = val;

				for (var keyS in obj) {

					// check for interpolatable keys
					if (key.indexOf('<<') > -1 && key.indexOf('>>') > -1) {

						var interpObj = {};
						var interpolatedKey = this.interpolate( keyS );
						
						interpObj[interpolatedKey] = obj[keyS];

						Object.defineProperty( obj, keyS, interpObj);

						var parsed = this.parse.css.selector(interpolatedKey);
						parsed.inner = this.normalize(interpObj[interpolatedKey]);
					} else {

						var parsed = this.parse.css.selector(keyS);
						parsed.inner = this.normalize(struct[keyS]);
					}
					
				}

				normalized.push(parsed);
			}
			break;
		case 'function':
			// console.log('found a function', struct);

			// here we set the returned object as the result of whatever the function ran,
			// resulting in a structure that should also be normalized

			// we call this as the current context, assuming that this is a component
			normalized = this.normalize(struct.call(this));

			// console.log(normalized, struct.call(this));

			break;
		case 'component':
			// console.log('found a component');

			// for components we push a parent reference
			struct['parent'] = this;

			// assuming refactored Ulna api
			// we push to a children array for convenient references
			this.children.push(struct);

			// we push to the normalized template
			// or, we could just set the normalized array as the next component structure
			// depends if we want the component's api in normalized object
			normalized = struct.normalized;
			// normalized.push( struct );

			break;
	}

	return normalized;
}
},{}],5:[function(require,module,exports){
module.exports = {
	selector: function(string) {
		// parse a CSS selector and normalize it as a a JS object
		/* 
		example:
			{
				type: 'dom',
				attrs: [ { 
					attrKey: 'data-val'
					attrVal: 'value' } ],
				classes: [ 'className' ],
				id: 'string',
				tagName: 'string'
			}
		*/
		var parsed = {
			type: 'html',
			tagName: 'div', // default element
			attrs: [],
			classes: [],
			id: ''
		};

		var selector = string;
		
		// regexes from CSSUtilities
		// http://onwebdev.blogspot.com/2011/09/javascript-parsing-css-selectors-with.html
		var rAttrs = /(\[\s*[_a-z0-9-:\.\|\\]+\s*(?:[~\|\*\^\$]?(=)\s*[\"\'][^\"\']*[\"\'])?\s*\])/gi;
		
		var attrs = string.match(rAttrs);
		
		if (attrs !== null && attrs.length !== 0) {

			// console.log(attrs)

			for (var a = 0; attrs.length > a; a++) {

				// parse a single attr string as provided by our loop, ex: [key="3"]
				var rKey = /\[(\s*[_a-z0-9-:\.\|\\]+\s*)/gi;
				var rVal = /(?:[~\|\*\^\$]?=\s*[\"\']([^\"\']*)[\"\'])?\s*\]/gi;

				var key = rKey.exec(attrs[a])[1];
				var val = rVal.exec(attrs[a])[1];

				var pair = {
					attrKey: key,
					attrVal: val
				};

				// assign class or id attributes to parsed object directly
				switch(pair.attrKey) {
					case 'id':
						parsed.id = pair.attrVal;
					break;
					case 'class':
						var classString = pair.attrVal;

						var classArr = classString.match(/[^\s]*/g);
						
						var cleanedArr = [];
						for (var i = 0; classArr.length > i; i++) {

							if (classArr[i].length) {
								cleanedArr.push(classArr[i]);
							}
						}
						parsed.classes = cleanedArr;

					break;
					default:
						// console.log(pair)
						parsed.attrs.push(pair);
					break;
				}

				// remove the attributes we've already parsed from our string
				// this saves us from interpreting ids or classes potentially nested in attributes as such
				selector = selector.replace(attrs[a], '');

			}
		}

		// check for id in our selector, if we haven't already got one
		if (parsed.id === '') {
			var rId = /#([a-z]+[_a-z0-9-:\\]*)/ig;
			
			var id = rId.exec( selector );
			
			// if none found, exec returns null
			if (id !== null) {
				parsed.id = id[1];

				// update our selector
				selector = selector.replace(id[1], '');
			}
		}

		// check for classes in our selector, if we haven't already got them
		if (parsed.classes.length === 0) {
			var rClasses = /(\.[_a-z]+[_a-z0-9-:\\]*)/ig;
			var classes = string.match(rClasses);

			if (classes !== null) {
				for (var c = 0; classes.length > c; c++) {
					classes[c] = classes[c].slice(1)

					// update our selector
					selector = selector.replace(classes[c], '');
				}

				parsed.classes = classes;
			}


		}

		// get the tag name
		var rTagName = /(^\w*)/gi;
		var tagName = string.match(rTagName)[0];

		if (tagName.length) {
			parsed.tagName = tagName;
			selector = selector.replace(tagName, '');
		}

		return parsed;
	}
};



},{}],6:[function(require,module,exports){
module.exports = {
	normalized: function(normalized) {
		// let one do function do one thing:
		// take a normalized structure and recursively stringify it

		var string = '';
		for (var n = 0; normalized.length > n; n++) {
			var normalizedType = nerve.toType(normalized[n]);

			switch (normalizedType) {
				case 'object':
					string += this.object(normalized[n]);
					break;
				case 'component':
					// seriously
					string += this.normalized( normalized[n].normalized );
					break;
			}
		}
		return string;
	},

	object: function(obj) {
		// helps split up the control logic
		// we can stringify based on the type of object we normalized
		// or easily add more type cases in the future
		var string = '';
		switch (obj.type) {
			case 'html':
				string = this.html(obj);
				break;
			case 'function':
				string = this.func(obj);
				break;
		}
		return string;
	},

	html: function(obj) {
		var string = '<' + obj.tagName;

		// id
		if (obj.id) {
			string += ' id="' + obj.id + '"';
		}

		// classes
		if (obj.hasOwnProperty('classes') && obj.classes.length) {
			string += ' class="' + obj.classes.join(' ') + '"';
		}

		// custom attrs
		if (obj.hasOwnProperty('attrs') && obj.attrs.length) {

			// loop through array of key/vals
			for (var a = 0; obj.attrs.length > a; a++) {
				var attr = obj.attrs[a];

				// for each pair, concatenate them as a single string
				var pair = []

				for (var key in attr) {
					pair.push(attr[key])
				}

				if (pair[1] === undefined) {
					
					string += ' ' + pair[0];

				} else {

					pair[1] = '"' + pair[1] + '"';
					pair = pair.join('=');

					// we add to the string each time in the loop, accounting for each attr in the array
					string += ' ' + pair;	

				}
				
			}
		}

		// end the opening tag
		string += '>';
		var innerType = nerve.toType(obj.inner);
		if (obj.hasOwnProperty('inner') && innerType === 'array' && innerType !== 'string') {
			string += this.normalized(obj.inner);
		} else if (innerType === 'string' || innerType === 'number') {
			string += obj.inner;
		}

		string += '</' + obj.tagName + '>';

		return string;
	}
}
},{}],7:[function(require,module,exports){
module.exports = function(obj) {
	// better type checking
	// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	
	// not sure why toType gets called again, happens accessing data sub-keys in components
	if (obj === undefined) return;


	if (obj.hasOwnProperty('type') && obj.type === 'component') {
		return 'component';
	} else {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}
}
},{}],8:[function(require,module,exports){
Ulna = {};

if (typeof window === 'undefined') {
	Ulna.env = 'node'
} else {
	Ulna.env = 'browser'
}

Ulna.extend = require('./src/extend.js');
Ulna.toType = require('./src/toType.js');
Ulna.Dispatcher = require('./src/Dispatcher.js');
Ulna.Component = require('./src/Component.js');
Ulna.Services = require('./src/Services.js');

if (Ulna.env === 'browser') {
	Ulna.Router = require('./src/Router.js');
} else {
	Ulna.Router = null;
}

module.exports = Ulna;
},{"./src/Component.js":9,"./src/Dispatcher.js":10,"./src/Router.js":12,"./src/Services.js":13,"./src/extend.js":14,"./src/toType.js":15}],9:[function(require,module,exports){
var _ = require('underscore');
var nerve = require('nerve-templates');
var extend = require('./extend.js');

var Component = function(obj) {
	this.type = 'component';
	this.eventsBound = false;
	this.children = [];
	this.normalized = null;
	this.$root = [];

	for (var prop in obj) {
		this[prop] = obj[prop];
	}
	
	this.initialize.call(this);

	// we bind dispatcher listeners on construction.
	// we use initialize/deinitialize for dom-related setup and teardown
	if (this.listen) {
		this.bindListen();	
	}
}

var methods = {
	initialize: function() {
		// fires on construction
		this.normalized = this.normalize( this.template );	
		this.stringified = this.stringify.normalized( this.normalized );
	},

	// DOM
	bindRoot: function() {
		
		if (this.root.indexOf('<<') > -1 && this.root.indexOf('>>') > -1) {
		
			if (typeof this.parent !== 'undefined') {
				this.$root = this.parent.$root.find( $( this.interpolate( this.root) ) );
			} else {
				this.$root = $( this.interpolate( this.root) );
			}
			
		} else {

			if (typeof this.parent !== 'undefined') {

				this.$root = this.parent.$root.find( this.root );
			} else {
				this.$root = $(this.root);
			}
		}


		return this.$root;
	},

	unbindRoot: function() {
		this.$root = [];
		
		return this.$root;
	},

	bindEvents: function() {
		// backbone-style hash pairs for easy event config


		this.eventsBound = true;

		for (var key in this.events) {
			var culledKey = this.cullEventKey(key);

			// shortcut to just binding the root
			if (culledKey[1] === 'root') {
				// bind the root event based on the event type and the handler we supplied
				this.$root.on(culledKey[0], this.events[key].bind(this));
			} else {
				this.$root.find(culledKey[1]).on(culledKey[0], this.events[key].bind(this));
			}
		}

		return this.eventsBound;
	},

	unbindEvents: function() {
		
		this.eventsBound = false;

		for (var key in this.events) {
			var culledKey = this.cullEventKey(key);

			// shortcut to just binding the root
			if (culledKey[1] === 'root') {
				// bind the root event based on the event type and the handler we supplied
				this.$root.off(culledKey[0]);
			} else {
				this.$root.find(culledKey[1]).off(culledKey[0]);
			}
		}

		return this.eventsBound;
	},

	cullEventKey: function(key) {
		var reg = /[a-z|A-Z]*/;
		var eventString = key.match(reg)[0];
		var selector = key.replace(eventString + ' ', '');

		return [eventString, selector];
	},

	bindToDOM: function() {
		this.bindRoot();
		this.bindEvents();

		return this.eventsBound;
	},

	unbindFromDOM: function() {
		this.unbindEvents();
		this.unbindRoot();

		return this.eventsBound;
	},

	render: function() {
		return this.stringify.normalized( this.normalized );
	},

	renderToDOM: function() {
		this.$root.html( this.render() );

		return this.$root;
	},

	unrenderFromDOM: function() {
		this.$root.empty();

		return this.$root;
	},

	rerender: function() {
		// assume we are bound to the dom and recieved new data
		// unbind, reset children, re-render template, then re-bind
		this.unbindEvents();
		this.unbindDescendants();
		this.children = [];
		this.initialize();
		this.renderToDOM();
		this.bind();

		return this.$root;
	},

	bind: function() {
		this.bindToDOM();
		this.bindDescendants();

		return this.eventsBound;
	},

	unbind: function() {
		this.unbindFromDOM();
		this.unbindDescendants();

		return this.eventsBound;
	},

	// FLUX
	bindListen: function() {
		// backbone-style hashes for flux-style action configuration
		for (var action in this.listen) {
			this.dispatcher.register(action, this, this.listen[action].bind(this));
		}
	},

	cloneData: function() {
		var clone = {};

		for (var prop in this.data) {
			clone[prop] = this.data[prop];
		}

		return clone;
	},

	setData: function( obj ) {
		var newData = {};
		var currData = this.cloneData();

		for (var prop in currData) {
			newData[prop] = obj[prop];	
		}

		this.data = newData;

		return this.data;
	},

	// CHILDREN
	bindChildren: function() {
		if (!this.children.length) return false;

		for (var c = 0; this.children.length > c; c++) {
			this.children[c].bindToDOM();
		}

		return this.children;
	},

	unbindChildren: function() {
		if (!this.children.length) return false;

		for (var c = 0; this.children.length > c; c++) {
			this.children[c].unbindFromDOM();
		}

		return this.children;
	},

	renderChildrenToDOM: function() {
		if (!this.children.length) return false;

		for (var c = 0; this.children.length > c; c++) {
			this.children[c].bindRoot();
			this.children[c].renderToDOM();
			this.children[c].bindEvents();
		}

		return this.$root;
	},

	unrenderChildrenFromDOM: function() {
		if (!this.children.length) return false;

		for (var c = 0; this.children.length > c; c++) {
			this.children[c].unbindEvents();
			this.children[c].unrenderFromDOM();
			this.children[c].unbindRoot();
		}

		return this.$root;
	},

	bindDescendants: function() {
		if (!this.children.length) return false;

		for (var c = 0; this.children.length > c; c++) {
			this.children[c].bind();
		}
	},

	unbindDescendants: function() {
		if (!this.children.length) return false;

		for (var c = 0; this.children.length > c; c++) {
			this.children[c].unbind();
		}
	}
}

// we need to use the nerve object like a mixin
// every component should have access to its library

for (var prop in nerve) {
	Component.prototype[prop] = nerve[prop];
}

_.extend(Component.prototype, methods);

Component.extend = extend;

module.exports = Component;
},{"./extend.js":14,"nerve-templates":2,"underscore":16}],10:[function(require,module,exports){
var underscore = require('underscore');
var Events = require('./Events.js');
var extend = require('./extend.js');

var Dispatcher = function(options) {
	if (options && options.actions) {
		if (typeof options.actions === 'string') {
			this.createAction(options.actions);
		} else {
			this.createActions(options.actions);
		}
	}

	Object.defineProperty(this, '_actions', {
		enumerable: false,
		value: {}
	});

	underscore.extend(this._actions, Events);

	this.initialize.apply(this, arguments);
}

Dispatcher.prototype = {
	initialize: function() {},

	_prepareAction: function(name, callbacks) {
		var action = {};
		if (underscore.isString(name)) {
			action.name = name;
			if (callbacks) {
				if (underscore.isFunction(callbacks)) {
					action.beforeEmit = callbacks;
				} else {
					for (var c in callbacks) {
						if (callbacks.hasOwnProperty(c)) {
							action[c] = callbacks[c];
						}
					}
				}
			}
		} else {
			action = name;
		}
		return action;
	},

	createAction: function(name, callbacks) {
		var action = this._prepareAction(name, callbacks);
		var dispatch;
		var emit = function(payload) {
			this._triggerAction(action.name, payload);
		}.bind(this);
		var beforeEmit = function(payload) {
			action.beforeEmit(payload, function(newPayload) {
				emit(newPayload);
			});
		};
		var shouldEmit = function(fn) {
			return function(payload) {
				if (action.shouldEmit(payload)) {
					fn(payload);
				}
			};
		};
		if (action.shouldEmit) {
			if (action.beforeEmit) {
				dispatch = shouldEmit(beforeEmit);
			} else {
				dispatch = shouldEmit(emit);
			}
		} else if (action.beforeEmit) {
			dispatch = beforeEmit;
		} else {
			dispatch = emit;
		}
		Object.defineProperty(this, action.name, {
			enumerable: false,
			value: dispatch
		});
	},

	createActions: function(actions) {
		var action;
		for (action in actions) {
			if (actions.hasOwnProperty(action)) {
				this.createAction(actions[action]);
			}
		}
	},

	register: function(action, listener, method) {
		if (!listener) {
			throw new Error('The listener is undefined!');
		}
		method = (typeof(method) === 'function') ? method : listener[method || action];
		if (typeof(method) !== 'function') {
			throw new Error('Cannot register callback `' + method +
				'` for the action `' + action +
				'`: the method is undefined on the provided listener object!');
		}
		this._actions.on(action, method.bind(listener));
	},

	registerStore: function(actions, listener, methods) {
		var isUniqueCallback = (typeof methods) === 'string' || (typeof methods) === 'function';
		var actionsNames;
		if (underscore.isArray(actions)) {
			methods = methods || actions;
			if (!isUniqueCallback && actions.length !== methods.length) {
				throw new RangeError('The # of callbacks differs from the # of action names!');
			}
		} else if (underscore.isObject(actions)) {
			actionsNames = Object.keys(actions);
			methods = actionsNames.map(function(actionName) {
				return actions[actionName];
			});
			actions = actionsNames;
		}
		for (var i = 0, action;
			(action = actions[i]); i++) {
			this.register(action, listener, isUniqueCallback ? methods : methods[i]);
		}
	},

	dispatch: function(actionName, payload) {
		if (this.hasOwnProperty(actionName)) {
			return this[actionName](payload);
		}
		throw new Error('There is not an action called `' + actionName + '`');
	},

	_triggerAction: function(actionName, payload) {
		this._actions.trigger(actionName, payload);
	}
};

Dispatcher.extend = extend;

module.exports = Dispatcher;
},{"./Events.js":11,"./extend.js":14,"underscore":16}],11:[function(require,module,exports){
var Events = (function() {
	// Events, stolen from Backbone
	// only needed for Dispatcher at this point

	// Events
	// ---------------
	// A module that can be mixed in to *any object* in order to provide it with
	// custom events. You may bind with `on` or remove with `off` callback
	// functions to an event; `trigger`-ing an event fires all callbacks in
	// succession.
	//
	//     var object = {};
	//     _.extend(object, Events);
	//     object.on('expand', function(){ alert('expanded'); });
	//     object.trigger('expand');
	//

	var Events = {};
	// Regular expression used to split event strings.
	var eventSplitter = /\s+/;

	// Iterates over the standard `event, callback` (as well as the fancy multiple
	// space-separated events `"change blur", callback` and jQuery-style event
	// maps `{event: callback}`), reducing them by manipulating `memo`.
	// Passes a normalized single event name and callback, as well as any
	// optional `opts`.
	var eventsApi = function(iteratee, memo, name, callback, opts) {
		var i = 0,
			names;
		if (name && typeof name === 'object') {
			// Handle event maps.
			if (callback !== void 0 && 'context' in opts && opts.context === void 0) opts.context = callback;
			for (names = _.keys(name); i < names.length; i++) {
				memo = iteratee(memo, names[i], name[names[i]], opts);
			}
		} else if (name && eventSplitter.test(name)) {
			// Handle space separated event names.
			for (names = name.split(eventSplitter); i < names.length; i++) {
				memo = iteratee(memo, names[i], callback, opts);
			}
		} else {
			memo = iteratee(memo, name, callback, opts);
		}
		return memo;
	};

	// Bind an event to a `callback` function. Passing `"all"` will bind
	// the callback to all events fired.
	Events.on = function(name, callback, context) {
		return internalOn(this, name, callback, context);
	};

	// An internal use `on` function, used to guard the `listening` argument from
	// the public API.
	var internalOn = function(obj, name, callback, context, listening) {
		obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
			context: context,
			ctx: obj,
			listening: listening
		});

		if (listening) {
			var listeners = obj._listeners || (obj._listeners = {});
			listeners[listening.id] = listening;
		}

		return obj;
	};

	// Inversion-of-control versions of `on`. Tell *this* object to listen to
	// an event in another object... keeping track of what it's listening to.
	Events.listenTo = function(obj, name, callback) {
		if (!obj) return this;
		var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
		var listeningTo = this._listeningTo || (this._listeningTo = {});
		var listening = listeningTo[id];

		// This object is not listening to any other events on `obj` yet.
		// Setup the necessary references to track the listening callbacks.
		if (!listening) {
			var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
			listening = listeningTo[id] = {
				obj: obj,
				objId: id,
				id: thisId,
				listeningTo: listeningTo,
				count: 0
			};
		}

		// Bind callbacks on obj, and keep track of them on listening.
		internalOn(obj, name, callback, this, listening);
		return this;
	};

	// The reducing API that adds a callback to the `events` object.
	var onApi = function(events, name, callback, options) {
		if (callback) {
			var handlers = events[name] || (events[name] = []);
			var context = options.context,
				ctx = options.ctx,
				listening = options.listening;
			if (listening) listening.count++;

			handlers.push({
				callback: callback,
				context: context,
				ctx: context || ctx,
				listening: listening
			});
		}
		return events;
	};

	// Remove one or many callbacks. If `context` is null, removes all
	// callbacks with that function. If `callback` is null, removes all
	// callbacks for the event. If `name` is null, removes all bound
	// callbacks for all events.
	Events.off = function(name, callback, context) {
		if (!this._events) return this;
		this._events = eventsApi(offApi, this._events, name, callback, {
			context: context,
			listeners: this._listeners
		});
		return this;
	};

	// Tell this object to stop listening to either specific events ... or
	// to every object it's currently listening to.
	Events.stopListening = function(obj, name, callback) {
		var listeningTo = this._listeningTo;
		if (!listeningTo) return this;

		var ids = obj ? [obj._listenId] : _.keys(listeningTo);

		for (var i = 0; i < ids.length; i++) {
			var listening = listeningTo[ids[i]];

			// If listening doesn't exist, this object is not currently
			// listening to obj. Break out early.
			if (!listening) break;

			listening.obj.off(name, callback, this);
		}
		if (_.isEmpty(listeningTo)) this._listeningTo = void 0;

		return this;
	};

	// The reducing API that removes a callback from the `events` object.
	var offApi = function(events, name, callback, options) {
		// No events to consider.
		if (!events) return;

		var i = 0,
			listening;
		var context = options.context,
			listeners = options.listeners;

		// Delete all events listeners and "drop" events.
		if (!name && !callback && !context) {
			var ids = _.keys(listeners);
			for (; i < ids.length; i++) {
				listening = listeners[ids[i]];
				delete listeners[listening.id];
				delete listening.listeningTo[listening.objId];
			}
			return;
		}

		var names = name ? [name] : _.keys(events);
		for (; i < names.length; i++) {
			name = names[i];
			var handlers = events[name];

			// Bail out if there are no events stored.
			if (!handlers) break;

			// Replace events if there are any remaining.  Otherwise, clean up.
			var remaining = [];
			for (var j = 0; j < handlers.length; j++) {
				var handler = handlers[j];
				if (
					callback && callback !== handler.callback &&
					callback !== handler.callback._callback ||
					context && context !== handler.context
				) {
					remaining.push(handler);
				} else {
					listening = handler.listening;
					if (listening && --listening.count === 0) {
						delete listeners[listening.id];
						delete listening.listeningTo[listening.objId];
					}
				}
			}

			// Update tail event if the list has any events.  Otherwise, clean up.
			if (remaining.length) {
				events[name] = remaining;
			} else {
				delete events[name];
			}
		}
		if (_.size(events)) return events;
	};

	// Bind an event to only be triggered a single time. After the first time
	// the callback is invoked, it will be removed. When multiple events are
	// passed in using the space-separated syntax, the event will fire once for every
	// event you passed in, not once for a combination of all events
	Events.once = function(name, callback, context) {
		// Map the event into a `{event: once}` object.
		var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
		return this.on(events, void 0, context);
	};

	// Inversion-of-control versions of `once`.
	Events.listenToOnce = function(obj, name, callback) {
		// Map the event into a `{event: once}` object.
		var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
		return this.listenTo(obj, events);
	};

	// Reduces the event callbacks into a map of `{event: onceWrapper}`.
	// `offer` unbinds the `onceWrapper` after it has been called.
	var onceMap = function(map, name, callback, offer) {
		if (callback) {
			var once = map[name] = _.once(function() {
				offer(name, once);
				callback.apply(this, arguments);
			});
			once._callback = callback;
		}
		return map;
	};

	// Trigger one or many events, firing all bound callbacks. Callbacks are
	// passed the same arguments as `trigger` is, apart from the event name
	// (unless you're listening on `"all"`, which will cause your callback to
	// receive the true name of the event as the first argument).
	Events.trigger = function(name) {
		if (!this._events) return this;

		var length = Math.max(0, arguments.length - 1);
		var args = Array(length);
		for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

		eventsApi(triggerApi, this._events, name, void 0, args);
		return this;
	};

	// Handles triggering the appropriate event callbacks.
	var triggerApi = function(objEvents, name, cb, args) {
		if (objEvents) {
			var events = objEvents[name];
			var allEvents = objEvents.all;
			if (events && allEvents) allEvents = allEvents.slice();
			if (events) triggerEvents(events, args);
			if (allEvents) triggerEvents(allEvents, [name].concat(args));
		}
		return objEvents;
	};

	// A difficult-to-believe, but optimized internal dispatch function for
	// triggering events. Tries to keep the usual cases speedy (most internal
	// Backbone events have 3 arguments).
	var triggerEvents = function(events, args) {
		var ev, i = -1,
			l = events.length,
			a1 = args[0],
			a2 = args[1],
			a3 = args[2];
		switch (args.length) {
			case 0:
				while (++i < l)(ev = events[i]).callback.call(ev.ctx);
				return;
			case 1:
				while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1);
				return;
			case 2:
				while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2);
				return;
			case 3:
				while (++i < l)(ev = events[i]).callback.call(ev.ctx, a1, a2, a3);
				return;
			default:
				while (++i < l)(ev = events[i]).callback.apply(ev.ctx, args);
				return;
		}
	};

	// Aliases for backwards compatibility.
	Events.bind = Events.on;
	Events.unbind = Events.off;

	module.exports = Events;

})();
},{}],12:[function(require,module,exports){
var _ = require('underscore');
var extend = require('./extend.js');

var Router = function(obj) {
	this.type = 'router';
	this.eventsBound = false;
	this.location = false;

	for (var prop in obj) {
		this[prop] = obj[prop];
	}
	
	if (this.routes) {
		this.bindRoutes();	
	}

	if (this.events) {
		this.bindEvents();
	}
	
	this.initialize.call(this);

	if (this.listen) {
		this.bindListen();	
	}
}

var methods = {
	initialize: function() {
		this.location = window.location.pathname;
	},

	// FLUX
	bindListen: function() {
		// backbone-style hashes for flux-style action configuration
		for (var action in this.listen) {
			this.dispatcher.register(action, this, this.listen[action].bind(this));
		}
	},

	bindRoutes: function() {
		for (var route in this.routes) {
			this.routes[route] = this.routes[route].bind(this);
		}
	},

	bindEvents: function() {
		for (var event in this.events) {
			// presume only window events
			window.addEventListener(event, this.events[event].bind(this));
		}
	},

	// HISTORY shorthand
	history: {
		push: function( obj ) {
			document.title = obj.title;
			history.pushState(obj, obj.title, obj.url);	
		},
		replace: function( obj ) {
			document.title = obj.title;
			history.replaceState(obj, obj.title, obj.url);
		}
	}
};


_.extend(Router.prototype, methods);

Router.extend = extend;

module.exports = Router;
},{"./extend.js":14,"underscore":16}],13:[function(require,module,exports){
var _ = require('underscore');
var extend = require('./extend.js');

var Services = function(obj) {
	this.data = null;
	this.history = []; 	// could push state changes to an array

	for (var prop in obj) {
		this[prop] = obj[prop];
	}

	if (this.listen) {
		this.bindListen();	
	}

	if (this.modifiers) {
		this.bindModifiers();
	}
}

var methods = {
	cloneData: function() {
		// accept a component as optional, otherwise clone whole state
		var clone = {};

		for (var prop in this.data) {
			clone[prop] = this.data[prop];
		}			

		return clone;
	},

	cloneState: function() {
		// accept a component as optional, otherwise clone whole state
		var clone = {};

		for (var prop in this.state) {
			clone[prop] = this.state[prop];
		}			

		return clone;
	},

	setData: function( obj ) {
		for (var prop in obj) {
			if (this.data.hasOwnProperty(prop)) {
				this.data[prop] = obj[prop]
			}
		}

		return this.data;
	},

	// FLUX
	bindListen: function() {
		// backbone-style hashes for flux-style action configuration
		for (var action in this.listen) {
			this.dispatcher.register(action, this, this.listen[action].bind(this));
		}
	},

	// MODIFIERS
	bindModifiers: function() {
		for (var func in this.modifiers) {
			this.modifiers[func] = this.modifiers[func].bind(this)
		}
	}
}

_.extend(Services.prototype, methods);

Services.extend = extend;

module.exports = Services;
},{"./extend.js":14,"underscore":16}],14:[function(require,module,exports){
var _ = require('underscore');

module.exports = function(protoProps, staticProps) {
	var parent = this;
	var child;

	if (protoProps && _.has(protoProps, 'constructor')) {
		child = protoProps.constructor;
	} else {
		child = function() {
			return parent.apply(this, arguments);
		};
	}

	_.extend(child, parent, staticProps);

	var Surrogate = function() {
		this.constructor = child;
	};

	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate();

	if (protoProps) {
		_.extend(child.prototype, protoProps);
	}

	child.__super__ = parent.prototype;

	return child;
};
},{"underscore":16}],15:[function(require,module,exports){
module.exports = function(obj) {
	// better type checking
	// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	var type = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();

	// for components, we assume they will be capitalized or pascal cased
	// if (type === 'string') {
	// 	if (obj.toLowerCase() !== obj) {
	// 		type = 'component'
	// 	}
	// }

	return type;
}
},{}],16:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],17:[function(require,module,exports){
var Ulna = require('ulna');
var Moment = require('moment');
var services = require('../services.js');

// route changes should be uniform objects
/*
	{
		// can shove optional parameters into the object, but route property should be standard
		route: {
			title: 'Route Title',
			url: '/route-title'
		},
		update: true	// optional param if we want to pop history, but not re-render state
	}
*/

/* accept any number of parameters, like strings or nested objects
ie new RouteChange('index') should yield:
{
	route: {
		title: 'Atypical Products',
		url: '/'
	},
	update: true
}

new RouteChange('about', false) should yield:
{
	route: {
		title: 'Atypical Products - About',
		url: '/about'
	},
	update: false
}

new RouteChange({
	portfolio: 'My Content Item'
}, false);

should return:

{
	route: {
		title: 'Atypical Products - Portfolio - My Content Item',
		url: '/portfolio/my-content-item'
	},
	update: false
}

add in our original input as a request object
we can use it later at the recieving end to access services

*/

var RouteChange = function( input, update ) {
	var action = {
		route: {
			title: null,
			url: null,
			req: null
		},
		update: null,
	}

	// give a default update value
	action.update = this.setUpdate( update );

	// store our input as a request for reference later
	action.route.req = input;


	// we still need to generate a title, so we'll use a state getter to generate
	// the upcoming state object
	// hardcoded for the current implementation
	var state = services.utils.getState( services.data.events, input );

	if (Ulna.toType(input) === 'object' && Object.keys(input)[0] === 'timeline') {
		action.route.title = this.titlifyDate( 
			state.timeline.activeDate
		);

		// same
		action.route.url = this.urlifyDate( 
			state.timeline.activeDate
		);	
	} else {
		action.route.title = this.titlify( 
			state
		);

		// same
		action.route.url = this.urlify( 
			state
		);
	}

	

	// assign our props to this
	for (var key in action)	 {
		this[key] = action[key]
	}
}

RouteChange.prototype = {
	setUpdate: function( update ) {
		// if it's anything but false, set it to true
		if (update === false) {
			return false
		} else {
			return true
		}
	},

	capitalize: function( string ) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	titlify: function( input ) {

		var string = '';

		switch( Ulna.toType(input) ) {
			case 'object': 

				var key = Object.keys(input)[0];

				// we backlist certain routes, like index
				if ( key === 'index' ) {
					return string;
				}

				string += services.data.header.delimiter + this.capitalize(key) + this.titlify( input[key] );					
				return string;
			break;
 
			case 'string':

				// we backlist certain routes, like index
				if ( input === 'index' ) {
					return string;
				}

				// blacklist empty string
				if (input.length) {
					string += services.data.header.delimiter + this.capitalize(input);	
				}
				
				return string;

			break;
		}
		
		return string;
	},

	titlifyDate: function( date ) {
		// take our services data and timestamp string and construct a usable window title
		// ex: 'GODS ROBOTS - Timeline - My Event, Oct 28th, 2016'
		var string = services.data.header.title + services.data.header.delimiter + 'Timeline' + services.data.header.delimiter;

		var title = string + date.name + ', ' + new Moment( date.startDate ).format('MMM Do, YYYY');

		return title;
	},

	hyphenate: function( string ) {
		var newString = '';

		for (var s = 0; string.length > s; s++) {
			if (string[s] === ' ') {
				newString += '-'
			} else {
				newString += string[s].toLowerCase();
			}
		}

		return newString;
	},

	urlify: function( input ) {

		var url = '';

		switch( Ulna.toType(input) ) {
			case 'object': 

				var key = Object.keys(input)[0];

				if ( key === 'index' ) {
					return '/';
				}

				url += '/' + this.hyphenate(key) + this.urlify( input[key] );					
				return url;

			break;
 
			case 'string':

				if ( input === 'index' ) {
					return '/';
				}

				// blacklist empty string
				if (input.length) {
					url += '/' + this.hyphenate(input);	
				}
				
				return url;

			break;
		}
		
		return url;
	},

	urlifyDate: function( date ) {
		// take a date and construct a url for it. ex:
		// /timeline/2016/28/10/my-event-name

		return services.utils.buildDateURL( date );
	}


}

module.exports = RouteChange;
},{"../services.js":63,"moment":1,"ulna":8}],18:[function(require,module,exports){
var Ulna = require('ulna');

var dispatcher = require('./dispatcher.js');
var services = require('./services.js');

var Header = require('./components/Header.js');
var Nav = require('./components/Nav.js');
var Modal = require('./components/Modal.js');
var Curtain = require('./components/Curtain.js');
var Main = require('./components/Main.js');
var Footer = require('./components/Footer.js');

var App = Ulna.Component.extend({
	root: '#app-root',

	dispatcher: dispatcher,
	services: services,

	data: {
		index: {}
	},

	listen: {
		HISTORY_PUSH: function( payload ) {
			// generate a state response
			var state = services.utils.getState( services.data.events, payload.route.req );

			this.data = state;

			this.rerender();
		},

		HISTORY_REPLACE: function( payload ) {
			// generate a state response
			var state = services.utils.getState( services.data.events, payload.route.req );

			this.data = state;

			this.rerender();
		}
	},

	template: {
		// '#curtain-wrap': new Curtain(),
		'#modal': new Modal(),
		'#main-wrap': function() {
			var route = Object.keys(this.data)[0];
			var mainKey = 'article#main' + '.page-' + route;
			var content = {};

			if (route === 'index') {

				// we pass on our props to Main, which is our main content area
				// content['#nav-wrap.container'] = new Nav();
				// content['#header-wrap.container'] = new Header();
				content[mainKey] = new Main({
					data: this.data
				});

			} else {

				// content['#nav-wrap.container'] = new Nav();
				content[mainKey] = new Main({
					data: this.data
				});
			}

			return content;
		},
		'footer#footer': new Footer()
	}
});

if (Ulna.env === 'browser') {
	var router = require('./router.js');
	Ulna.App = App;
}

module.exports = App;
},{"./components/Curtain.js":23,"./components/Footer.js":27,"./components/Header.js":28,"./components/Main.js":32,"./components/Modal.js":33,"./components/Nav.js":34,"./dispatcher.js":61,"./router.js":62,"./services.js":63,"ulna":8}],19:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var BioCard = Ulna.Component.extend({
	root: '#bio-card-<<this.data.id>>',

	dispatcher: dispatcher,

	listen: {},

	// nerve fix
	interpolate: function(key) {
		// extract stringified refs based on a custom syntax
		var reg = /\<\<([a-zA-Z|\.]*)\>\>/g;
		var arr = key.match(reg);

		// loop through the references
		for (var a = 0; arr.length > a; a++) {

			// better regexing, or passing a handler to replace, might save us this cleanup dance
			var ref = arr[a].replace(/[\<*|\>*]/g, '');

			// we could eval here
			// instead we'll construct a custom function that only returns based on type (for security concerns)
			// then we'll call that in the context of the current object we're mixed into
			var interpolatedRef = (new Function(
				// only strings and numbers should be acceptable as references
				'if (typeof ' + ref + ' === \'string\' || typeof ' + ref + ' === \'number\') { ' +
					'return ' + ref +
				'} else {' +
					'throw new Error("Bad reference encountered while interpolating template:", ' + ref + ');' +
				'}')).call(this);

			// replace each found reference in our array with its interpolated equivalent
			var interpolatedKey = key.replace(arr[a], interpolatedRef);
		}

		return interpolatedKey;
	},

	template: {
		'div.bio-card-inner': function() {
			if (this.data.img) {
				var cols = {
					'.col-sm-4.col-xs-12': function() {
						var imgKey = 'img[src="' + this.data.img.src + '"][title="' + hyphenate(this.data.img.name) + '"][alt="' + this.data.img.name + '"]'
						var img = {};
						img[imgKey] = '';
						return img;
					}
				}

				cols['.col-sm-8.col-xs-12'] = function() {
					var cont = {};
					cont['h1'] = this.data.name;
					cont['p'] = this.data.text;
					return cont;
				}

			} else {
				var cols = {
					'.col-xs-12': function() {
						var cont = {};
						cont['h1'] = this.data.name;
						cont['p'] = this.data.text;
						return cont;
					}
				}
			}

			return cols;
		}
	}
});

module.exports = BioCard;
},{"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"ulna":8}],20:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var BioCard = require('./BioCard.js');

var BioCardList = Ulna.Component.extend({
	root: '#bio-cards',

	dispatcher: dispatcher,

	data: {
		list: services.data.about.bios
	},

	listen: {},

	template: {
		'.container': function() {
			var list = [];
			for (var i = 0; this.data.list.length > i; i++) {
				var itemKey = '#bio-card-' + hyphenate(this.data.list[i].name);
				var item = {};

				var data = this.data.list[i];
				data['id'] = hyphenate(this.data.list[i].name);

				item[itemKey] = new BioCard({
					data: data
				}); 
				list.push(item);
			}
			return list;
		}
	}
});

module.exports = BioCardList;
},{"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"./BioCard.js":19,"ulna":8}],21:[function(require,module,exports){
var Ulna = require('ulna');

var dispatcher = require('../dispatcher.js');

var BrandCarousel = Ulna.Component.extend({
	root: '#brand-carousel',

	dispatcher: dispatcher,

	data: {
		tagline: null,
		brands: []
	},

	listen: {
		'ON_LOAD': function(payload) {
			console.log('Brand Carousel load')
		}
	},

	template: {
		div: function() {
			if (this.data.tagline) {
				return {
					h1: this.data.tagline
				};
			}
		},
		ul: function() {
			var brands = [];
			for (var b = 0; this.data.brands.length > b; b++) {
				var brandKey = 'img[src="' + this.data.brands[b].src + '"]' +
					'[title="' + this.data.brands[b].name + '"]' +
					'[alt="' + this.data.brands[b].name + '"].brand-img';
				
				var brandObj = {};
				brandObj[brandKey] = '';

				var anchorLink = 'a[href="' + this.data.brands[b].url + '"]';
				var anchor = {};

				anchor[anchorLink] = brandObj;

				brands.push({
					li: anchor
				});
			}
			return brands;
		}
	}
});

module.exports = BrandCarousel;
},{"../dispatcher.js":61,"ulna":8}],22:[function(require,module,exports){
var Ulna = require('ulna');
var services = require('../services.js');
var dispatcher = require('../dispatcher.js');
var RouteChange = require('../actions/RouteChange.js');

// a card is a generic component designed to display content in a visual manner
// it consists of a full-size background image,
// a headline, optionally a jewel (or icon "tag") and optionally a date

/* card kinds:

Photo (Still Image with Text Content),
{
	id: 'test-photo',
	name: 'Test Photo',
	date: null,
	credit: null,
	src: '/test-photo.jpg'
}

Youtube Embed,
{
	id: null,
	src: null
}

Soundcloud Embed
{
	id: null,
	src: null
}

	card data schema must be like:
	{
		kind: null,
		id: null,
		name: 'Test Card',
		date: null,
		credit: null,
		thumb: '/text-thumb.jpg'
	}

*/

var Card = Ulna.Component.extend({
	root: '#card-<<this.data.id>>',
	dispatcher: dispatcher,
	// data: {
	// 	kind: null,
	// 	id: null,
	// 	name: null,
	// 	thumb: null,
	//  date: dateObj
	// },

	events: {
		'click a.card': function(e) {
			e.preventDefault();

			// this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange({
			// 	timeline: this.data.iso
			// }))

			var kind = this.data.kind;

			this.dispatcher.dispatch('MODAL_VIEW', {
				data: this.data
			});
		}
	},

	// cards need to be smarter
	// their general format should be uniform, but can switch based on kind
	template: {
		'div.card-wrap': function() {
			switch(this.data.kind) {
				case 'flier' || 'embed':
					var templ = {
						'h1.name': this.data.name,
						'img[src="<<this.data.src>>"]': ''
					}

					var card = {};
					var cardBackground = 'background-image: url(' + this.data.src + ')';
					var cardKey = 'a.card[style="' + cardBackground + '"]';

					card[cardKey] = templ;

					return card;
				break;
				default:
					var templ = {
						'h1.name': this.data.name,
						'img[src="<<this.data.thumb>>"]': ''
					}

					var card = {};
					var cardBackground = 'background-image: url(' + this.data.thumb + ')';
					var cardKey = 'a.card[style="' + cardBackground + '"]';

					card[cardKey] = templ;

					return card;
				break;
			}
		}
	}
});

module.exports = Card;
},{"../actions/RouteChange.js":17,"../dispatcher.js":61,"../services.js":63,"ulna":8}],23:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;
var dispatcher = require('../dispatcher.js');
var services = require('../services.js');
var RouteChange = require('../actions/RouteChange.js');

var Curtain = Ulna.Component.extend({
	root: '#curtain-wrap',

	state: {
		active: ''
	},

	template: {
		'#curtain.<<this.state.active>>': function() {
			return {}
		}
	}
});

module.exports = Curtain;
},{"../actions/RouteChange.js":17,"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"ulna":8}],24:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var Moment = require('moment');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var RouteChange = require('../actions/RouteChange.js');
var PhotoCarousel = require('./Photos/PhotoCarousel.js');
var PhotoGallery = require('./Photos/PhotoGallery.js');
var VideoCarousel = require('./Videos/VideoCarousel.js');
var SlickCarousel = require('./SlickCarousel.js');



var DateArticle = Ulna.Component.extend({
	root: '#timeline-content',
	dispatcher: dispatcher,

	listen: {
		
	},

	template: {
		'.col-lg-12': function() {
			var content = {
				h1: this.data.name,
				date: new Moment( this.data.startDate ).format('MMM D, YYYY'),
				p: this.data.desc
			};

			var videos = [];
			for (var i = 0; this.data.media.length > i; i++) {
				if (this.data.media[i].kind === 'video') {
					videos.push(this.data.media[i]);
				}
			}

			if (videos.length) {
				content['#videos.slick-gallery'] = new SlickCarousel({
					root: '#videos',
					data: {
						name: 'Videos',
						items: videos
					}
				});
			}

			var imgs = [];
			for (var i = 0; this.data.media.length > i; i++) {
				if (this.data.media[i].kind === 'flier' || this.data.media[i].kind === 'photo') {
					imgs.push(this.data.media[i]);
				}
			}

			if (imgs.length) {
				content['#photos.slick-gallery'] = new SlickCarousel({
					root: '#photos',
					data: {
						name: 'Photos',
						items: imgs
					}
				});
			}

			var embeds = [];
			for (var i = 0; this.data.media.length > i; i++) {
				if (this.data.media[i].kind === 'embed') {
					embeds.push(this.data.media[i]);
				}
			}

			if (embeds.length) {
				content['#embeds.slick-gallery'] = new SlickCarousel({
					root: '#embeds',
					data: {
						name: 'Soundcloud',
						items: embeds
					}
				});
			}

			return content;
		}
	}
});

module.exports = DateArticle;
},{"../actions/RouteChange.js":17,"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"./Photos/PhotoCarousel.js":37,"./Photos/PhotoGallery.js":38,"./SlickCarousel.js":39,"./Videos/VideoCarousel.js":53,"moment":1,"ulna":8}],25:[function(require,module,exports){
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
},{"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"ulna":8}],26:[function(require,module,exports){
var Ulna = require('ulna');
var Moment = require('moment');

var Card = require('./Card.js');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');
var hyphenate = require('../utils.js').hyphenate;

var RouteChange = require('../actions/RouteChange.js');

var FeaturedCarousel = Ulna.Component.extend({
	dispatcher: dispatcher,

	slickConfig: {
		dots: true,
		slidesToShow: 4,
		infinite: false,
		responsive: [
			{
				breakpoint: 1091,
				settings: {
					slidesToShow: 4
				}
			},
			{
				breakpoint: 975,
				settings: {
					slidesToShow: 3
				}
			},
			{
				breakpoint: 640,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1
				}
			}
		]
	},

	bindSlick() {
		this.$root.find('.carousel').slick( this.slickConfig );
	},

	unbindSlick() {
		this.$root.children('.carousel').slick('unslick');
	},

	bindToDOM() {
		this.bindRoot();
		this.bindSlick();
		this.bindEvents();
		
		return this.eventsBound;
	},

	unbindFromDOM() {
		this.unbindSlick();
		this.unbindEvents();
		this.unbindRoot();
		

		return this.eventsBound;
	},

	data: {
		items: [],
		active: 0
	},

	template: {
		'.featured-wrap': function() {
			var templ = {
				'h1.carousel-title': this.data.title ? this.data.title : '',
				'div.carousel': function() {
					var items = [];
					for (var v = 0; this.data.items.length > v; v++) {
						var card = {};
						var cardKey = 'div#card-' + this.data.items[v].id;
						card[cardKey] = new Card({
							data: this.data.items[v]
						});							
						items.push(card);
					}
					return items;
				}
			}

			return templ;
			
		}
	}

});


module.exports = FeaturedCarousel;

},{"../actions/RouteChange.js":17,"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"./Card.js":22,"moment":1,"ulna":8}],27:[function(require,module,exports){
var Ulna = require('ulna');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');
var hyphenate = require('../utils.js').hyphenate;

// var Card = require('./Card.js');

var Footer = Ulna.Component.extend({
	root: '#footer',

	dispatcher: dispatcher,

	data: {
		nav: services.data.index.nav
	},

	events: {
		
	},

	// listen: {
		
	// },

	// mutations: {
		
	// },

	template: {
		'div.container': [
			{
				'.row': {
					'.col-lg-12': [
						{
							// p: 'All work herein copyright © 2016 GODS ROBOTS.'
						},
					]
				}
			},
			{
				'.row': [
					// {
					// 	'.col-sm-4': {
					// 		'a[href="/about"]': 'About',
					// 		'a[href="/music"]': 'Music',
					// 		'a[href="/videos"]': 'Videos',
					// 	}
					// },
					// {
					// 	'.col-sm-4': {
					// 		'a[href="/photos"]': 'Photos',
					// 		'a[href="/events"]': 'Events',
					// 		'a[href="/press"]': 'Press',
					// 	}
					// },
					// {
					// 	'.col-sm-4': {
					// 		'a[href="/contact"]': 'Contact',
					// 	}
					// }
				]
			}
		]
	}
});

module.exports = Footer;
},{"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"ulna":8}],28:[function(require,module,exports){
var Ulna = require('ulna');

var Logo = require('./Logo.js');
var Typed = require('./Typewriter.js');
var HotButton = require('./HotButton.js');
var SocialIcons = require('./SocialIcons.js');

var Header = Ulna.Component.extend({
	root: '#header-wrap',

	template: {
		'#header-inner.row': {
			'.col-lg-12': {
				'header#logo.col-lg-12': new Logo(),
				'ul.col-lg-12': {
					'li#call-to-action': new HotButton({
						data: {
							name: 'call-to-action',
							text: 'Enter the Timeline'
						}
					}),
				},
				'#social-icons.col-lg-12': new SocialIcons()	
			}
			
		}
	}
});

module.exports = Header;
},{"./HotButton.js":30,"./Logo.js":31,"./SocialIcons.js":40,"./Typewriter.js":50,"ulna":8}],29:[function(require,module,exports){
var Ulna = require('ulna');

var Hero = Ulna.Component.extend({
	root: '#hero-wrap',

	data: {
		name: 'Sample Hero',
		img: '/media/images/about/hero_sample.jpg'
	},

	template: {
		'#hero': function() {
			var img = {};
			var imgKey = 'img[src="' + this.data.img + '"][alt="' + this.data.name + '"]' + '[alt="' + this.data.name + '"]';

			img[imgKey] = '';

			return img;
		}
	}
});

module.exports = Hero;
},{"ulna":8}],30:[function(require,module,exports){
var Ulna = require('ulna');
var dispatcher = require('../dispatcher.js');
var RouteChange = require('../actions/RouteChange.js');

var services = require('../services.js');

var HotButton = Ulna.Component.extend({
	root: '#call-to-action',

	dispatcher: dispatcher,

	events: {
		'click a': function(e) {
			e.preventDefault();

			// we enter the app by requesting the first date timeline
			this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange({
				timeline: services.utils.buildDateUID( services.utils.getFirstDate( services.data.events ).startDate )
			}));
		}
	},

	data: {
		name: 'Hot Button',
		text: 'This is a hot button',
		active: ''
	},

	template: {
		div: function() {
			var anchor = {};
			var anchorKey = 'a[href="' + services.utils.buildDateURL( 
				services.utils.getFirstDate( services.data.events )
			) + '"]';

			anchor[anchorKey] = {
				'button[type="button"].btn.btn-default': {
					span: 'Enter the Timeline'
				}
			}

			return anchor;
		}
		
	}
});

module.exports = HotButton;
},{"../actions/RouteChange.js":17,"../dispatcher.js":61,"../services.js":63,"ulna":8}],31:[function(require,module,exports){
var Ulna = require('ulna');

var RouteChange = require('../actions/RouteChange.js');
var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var Logo = Ulna.Component.extend({
	root: '#logo',

	dispatcher: dispatcher,

	listen: {
		// 'ON_LOAD': function(payload) {
		// 	console.log('Logo load')
		// }
	},

	data: {
		src: services.data.brand.logo
	},	

	events: {
		'click a': function(e) {
			this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange('index'))
		}
	},

	template: {
		a: function() {
			var key = 'img[src="' + this.data.src + '"]';
			var obj = {};
			obj[key] = '';

			return obj;
		}
	}
});

module.exports = Logo;
},{"../actions/RouteChange.js":17,"../dispatcher.js":61,"../services.js":63,"ulna":8}],32:[function(require,module,exports){
var Ulna = require('ulna');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var VFrame = require('./VFrame.js');
var HotButton = require('./HotButton.js');
var BrandCarousel = require('./BrandCarousel.js');
// var InfographicCarousel = require('./InfographicCarousel.js');
var UpcomingCarousel = require('./UpcomingCarousel.js');
var TimelinePrev = require('./TimelinePrev.js');
var Timeline = require('./Timeline/Timeline.js');
var Footer = require('./Footer.js');
var Hero = require('./Hero.js');
var BioCardList = require('./BioCardList.js');
var Discography = require('./Discography.js');
var PhotoGallery = require('./Photos/PhotoGallery.js');
var PhotoCarousel = require('./Photos/PhotoCarousel.js');
var FeaturedCarousel = require('./FeaturedCarousel.js');
var SlickCarousel = require('./SlickCarousel.js');

var Logo = require('./Logo.js');
var HotButton = require('./HotButton.js');
var SocialIcons = require('./SocialIcons.js');


var Main = Ulna.Component.extend({
	root: '#main',
	dispatcher: dispatcher,

	state: {
		active: 'state-inactive'
	},

	listen: {
		ON_LOAD( payload ) {
			console.log('Main: ON_LOAD');

			this.state.active = 'state-active';
			this.mutations.fadeIn.call(this);
		}
	},

	mutations: {
		fadeIn() {
			this.$root.find('#main-content').addClass('state-active').removeClass('state-inactive');
		},
		fadeOut() {
			this.$root.find('#main-content').removeClass('state-active').addClass('state-active');
		}
	},

	data: {
		index: {}
	},

	template: {
		'#main-content.<<this.state.active>>': function() {
			var route = Object.keys(this.data)[0];
			var obj = {
				'header#logo.col-lg-12': new Logo()
			};

			switch (route) {
				case 'index':
					
					obj['article#main-inner.container'] = {
						'#featured.col-lg-12.card-carousel': new FeaturedCarousel({
							root: '#featured',
							data: {
								title: 'Featured',
								items: services.utils.getFeaturedItems( services.data.events )
							}
						}),
						'ul.col-lg-12': {
							'li#call-to-action': new HotButton({
								data: {
									name: 'call-to-action',
									text: 'Enter the Timeline'
								}
							}),
						},
						'#social-icons.col-lg-12': new SocialIcons(),
					};

				break;
				
				case 'timeline':
					obj['#timeline'] = new Timeline({
						root: '#timeline',
						data: this.data.timeline
					});
				break;
			}

			return obj;
		}
	}
});

module.exports = Main;
},{"../dispatcher.js":61,"../services.js":63,"./BioCardList.js":20,"./BrandCarousel.js":21,"./Discography.js":25,"./FeaturedCarousel.js":26,"./Footer.js":27,"./Hero.js":29,"./HotButton.js":30,"./Logo.js":31,"./Photos/PhotoCarousel.js":37,"./Photos/PhotoGallery.js":38,"./SlickCarousel.js":39,"./SocialIcons.js":40,"./Timeline/Timeline.js":46,"./TimelinePrev.js":49,"./UpcomingCarousel.js":51,"./VFrame.js":52,"ulna":8}],33:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var RouteChange = require('../actions/RouteChange.js');

var VideoEmbed = require('./Videos/VideoEmbed.js');
var SoundcloudEmbed = require('./SoundcloudEmbed.js');

var Modal = Ulna.Component.extend({
	root: '#modal',
	dispatcher: dispatcher,

	events: {
		'click #modal-close': function() {
			this.mutations.removeActive.call(this);

			if (this.state.kind === 'video' || this.state.kind === 'embed') {
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
		},

		MODAL_VIEW( payload ) {
			console.log('MODAL_VIEW', payload);
			switch(payload.data.kind) {
				case 'photo':
					this.state.kind = 'photo';
					this.data = payload.data;
					
					this.rerender();
					this.mutations.addActive.call(this);
				break;
				case 'video':
					this.state.kind = 'video';
					this.data = payload.data;

					this.rerender();
					this.mutations.addActive.call(this);	
				break;
				case 'embed':
					this.state.kind = 'embed';
					this.data = payload.data;

					this.rerender();
					this.mutations.addActive.call(this);	
				break;
				default:
					console.log('default', payload)
				break;
			}
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
					case 'embed':
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
},{"../actions/RouteChange.js":17,"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"./SoundcloudEmbed.js":41,"./Videos/VideoEmbed.js":54,"ulna":8}],34:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var RouteChange = require('../actions/RouteChange.js');

var NavItem = require('./NavItem.js');

var Nav = Ulna.Component.extend({
	root: '#nav-wrap',

	dispatcher: dispatcher,

	data: {
		active: 'index',
		expanded: false,
		list: services.data.index.nav
	},

	events: {
		'click #nav-expander': function(e) {
			this.dispatcher.dispatch('NAV_EXPAND', {
				data: this.state
			});
		}
	},

	listen: {
		'NAV_EXPAND': function( payload ) {

		}
	},

	template: {
		nav: {
			ul: function() {
				var list = [];
				
				for (var i = 0; services.data.index.nav.length > i; i++) {
					
					var itemKey = 'li#' + services.data.index.nav[i].title.toLowerCase();
					var item = {};

					item[itemKey] = new NavItem({
						data: {
							title: services.data.index.nav[i].title.toLowerCase(),
							url: services.data.index.nav[i].url
						}
					});

					list.push(item);
				}

				return list;
			},
			'#nav-expander': ''
		}
	}
});

module.exports = Nav;
},{"../actions/RouteChange.js":17,"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"./NavItem.js":35,"ulna":8}],35:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var RouteChange = require('../actions/RouteChange.js');

var NavItem = Ulna.Component.extend({
	root: 'li#<<this.data.title>>',

	dispatcher: dispatcher,

	data: {
		active: '',
		title: 'home',
		url: '/home'
	},

	events: {
		'click a': function(e) {
			e.preventDefault();
			this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange( this.data.title ));
		}
	},

	// nerve fix
	// interpolate: function(key) {
	// 	// extract stringified refs based on a custom syntax
	// 	var reg = /\<\<([a-zA-Z|\.]*)\>\>/g;
	// 	var arr = key.match(reg);

	// 	// loop through the references
	// 	for (var a = 0; arr.length > a; a++) {

	// 		// better regexing, or passing a handler to replace, might save us this cleanup dance
	// 		var ref = arr[a].replace(/[\<*|\>*]/g, '');

	// 		// we could eval here
	// 		// instead we'll construct a custom function that only returns based on type (for security concerns)
	// 		// then we'll call that in the context of the current object we're mixed into
	// 		var interpolatedRef = (new Function(
	// 			// only strings and numbers should be acceptable as references
	// 			'if (typeof ' + ref + ' === \'string\' || typeof ' + ref + ' === \'number\') { ' +
	// 				'return ' + ref +
	// 			'} else {' +
	// 				'throw new Error("Bad reference encountered while interpolating template:", ' + ref + ');' +
	// 			'}')).call(this);

	// 		// replace each found reference in our array with its interpolated equivalent
	// 		var interpolatedKey = key.replace(arr[a], interpolatedRef)
	// 	}

	// 	return interpolatedKey;
	// },

	template: {
		'a[href="<<this.data.url>>"]': function() {
			return {
				span: this.data.title
			}
		}
	}
});

module.exports = NavItem;
},{"../actions/RouteChange.js":17,"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"ulna":8}],36:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var Photo = Ulna.Component.extend({
	root: '#photo-thumb-<<this.data.id>>',
	dispatcher: dispatcher,

	data: {
		id: 'test-photo',
		name: 'Test Photo',
		date: null,
		credit: null,
		src: '/test-photo.jpg'
	},

	events: {
		'click root': function(e) {
			this.dispatcher.dispatch('PHOTO_CAROUSEL_VIEW', {
				data: this.data
			});
		}
	},

	template: {
		'.photo-wrap': function() {
			var img = {};
			var imgKey = 'img[src="' + this.data.src + '"][alt="' + this.data.name + '"][name="' + this.data.name + '"]';

			img[imgKey] = '';

			return img;
		}
	}
});

module.exports = Photo;
},{"../../dispatcher.js":61,"../../services.js":63,"../../utils.js":64,"ulna":8}],37:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var Photo = require('./Photo.js');

var PhotoCarousel = Ulna.Component.extend({
	root: '#photo-carousel',

	data: {
		name: 'Photos',
		photos: []
	},

	events: {
		'click .fa-chevron-left': function() {

		},

		'click .fa-chevron-right': function() {
			
		}
	},

	template: {
		h1: function() {
			return this.data.name;
		},
		'div#photo-carousel-inner': {
			'i#photo-carousel-next.fa.fa-angle-left': '',
			div: function() {
				var photos = [];
				for (var i = 0; this.data.photos.length > i; i++) {

					var li = {};
					var liKey = 'li#photo-thumb-' + hyphenate(this.data.photos[i].name);
					

					var data = this.data.photos[i];

					li[liKey] = new Photo({
						data: data
					});

					photos.push(li);
				}
				var content = {};
				content['ul'] = photos;

				return content;
			},
			'i#photo-carousel-prev.fa.fa-angle-right': '',
		}
	}
});

module.exports = PhotoCarousel;
},{"../../dispatcher.js":61,"../../services.js":63,"../../utils.js":64,"./Photo.js":36,"ulna":8}],38:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var Photo = require('./Photo.js');

var PhotoGallery = Ulna.Component.extend({
	root: '#photo-gallery',

	template: {
		'div.container': function() {
			var content = {};
			content['h1.col-lg-12'] = 'Photos';
			
			var photos = [];
			for (var i = 0; this.data.photos.length > i; i++) {

				var key = 'li#photo-thumb-' + hyphenate(this.data.photos[i].name);
				var item = {};

				var data = this.data.photos[i];

				item[key] = new Photo({
					data: data
				});

				photos.push(item);
			}

			content['ul.col-lg-12'] = photos;

			return content;
		}
	}
});

module.exports = PhotoGallery;
},{"../../dispatcher.js":61,"../../services.js":63,"../../utils.js":64,"./Photo.js":36,"ulna":8}],39:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;
var dispatcher = require('../dispatcher.js');

var Photo = require('./Photos/Photo.js');
var VideoThumb = require('./Videos/VideoThumb.js');
var SoundcloudEmbed = require('./SoundcloudEmbed.js');

var SlickCarousel = Ulna.Component.extend({
	root: '#slick-carousel-<<this.data.id>>',
	dispatcher: dispatcher,

	// data: {
	// 	id: null,
	// 	items: []
	// },

	listen: {

	},

	bindSlick() {
		this.$root.children('div').slick({
			infinite: false,
			dots: true,
			slidesToShow: 1,
			// centerMode: true,
			// variableWidth: true
		});
	},

	unbindSlick() {
		this.$root.children('div').slick('unslick');
	},

	bindToDOM() {
		this.bindRoot();
		this.bindEvents();
		this.bindSlick();

		return this.eventsBound;
	},

	unbindFromDOM() {
		this.unbindSlick();
		this.unbindEvents();
		this.unbindRoot();
		

		return this.eventsBound;
	},

	template: {
		h1() {
			return this.data.name;
		},
		div() {
			var items = [];
			for (var i = 0; this.data.items.length > i; i++) {

				switch(this.data.items[i].kind) {
					case 'flier' || 'photo' || 'still':
						var li = {};
						var liKey = 'div#photo-thumb-' + hyphenate(this.data.items[i].name);					
						var data = this.data.items[i];

						li[liKey] = new Photo({
							data: data
						});

						items.push(li);
					break;
					case 'video':
						var li = {};
						var liKey = 'div#video-thumb-' + hyphenate(this.data.items[i].name);					
						var data = this.data.items[i];

						li[liKey] = new VideoThumb({
							data: data
						});

						items.push(li);
					break;
					case 'embed':
						var li = {};
						var liKey = 'div#embed-thumb-' + hyphenate(this.data.items[i].name);					
						var data = this.data.items[i];

						li[liKey] = new SoundcloudEmbed({
							data: data
						});

						items.push(li);
					break;
				}
				
			}

			return items;
		}
	}
});

module.exports = SlickCarousel;
},{"../dispatcher.js":61,"../utils.js":64,"./Photos/Photo.js":36,"./SoundcloudEmbed.js":41,"./Videos/VideoThumb.js":55,"ulna":8}],40:[function(require,module,exports){
var Ulna = require('ulna');

var dispatcher = require('../dispatcher.js');

var SocialIcons = Ulna.Component.extend({
	root: '#social-icons',

	dispatcher: dispatcher,

	template: {
		ul: [
			{
				li: {
					'a[href="mailto:janaka.atugoda@gmail.com"]': {
						'img[src="/media/images/email_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://www.facebook.com/janakaselektamusic/"]': {
						'img[src="/media/images/facebook_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://twitter.com/janakaselekta"]': {
						'img[src="/media/images/twitter_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://open.spotify.com/artist/3DsgLVdK3osXVyeZDWfRQC"]': {
						'img[src="/media/images/spotify_icon.png"]': ''
					}
				}
			},
			{
				li: {
					'a[href="https://www.instagram.com/janakaselekta/"]': {
						'img[src="/media/images/instagram_icon.png"]': ''
					}
				}
			}
		]
	}
});

module.exports = SocialIcons;
},{"../dispatcher.js":61,"ulna":8}],41:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var SoundcloudEmbed = Ulna.Component.extend({
	root: '#embed-thumb-<<this.data.id>>',
	dispatcher: dispatcher,

	events: {
		'click root': function(e) {
			this.dispatcher.dispatch('VIDEO_CAROUSEL_VIEW', {
				data: this.data
			});
		}
	},

	template: {
		'iframe[src="<<this.data.src>>"][frameborder="0"][allowfullscreen]': ''
	}
});

module.exports = SoundcloudEmbed;
},{"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"ulna":8}],42:[function(require,module,exports){
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

			this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange({
				timeline: services.utils.buildDateUID( this.data.date.startDate )
			}));
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

			var anchorKey = 'a[href="/timeline' + new Moment( this.data.date.startDate ).format('/YYYY/MM/DD/') + services.utils.hyphenate(this.data.date.name) + '"]' + isSelected;
			var obj = {};
			var objKey = '#timeline-popover-' + this.data.date.id;

			if (this.data.selected) {
				obj[objKey] = {
					'.timeline-popover.selected': {
						h1: this.data.date.name,
						date: new Moment( this.data.date.startDate ).format('MMM D, YYYY'),
					}
				};	
			} else {
				obj[objKey] = {
					'.timeline-popover': {
						h1: this.data.date.name,
						date: new Moment( this.data.date.startDate ).format('MMM D, YYYY'),
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



},{"../../actions/RouteChange.js":17,"../../dispatcher.js":61,"../../services.js":63,"moment":1,"ulna":8}],43:[function(require,module,exports){
var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var RouteChange = require('../../actions/RouteChange.js');
var DateNode = require('./DateNode.js');


/* we'll store the business logic of this template externally for now */

var monthTemplate = {
	'h1.timeline-month-title': function() {
		return this.data.month;
	},
	'ul.timeline-month-nodes': function() {							
		// populate this month with dates
		var items = [];
		for (var d = 0; this.data.dates.length > d; d++) {
			var item = {};
			var date = this.data.dates[d];
			// use an inline style to space out our nodes
			var nodeStyle = '[style="left:' + services.utils.calcNodeDistance( new Moment( date.startDate ).toObject().date ) + '%"]';
			var itemKey = 'li#timeline-node-' + date.id + '-' + services.utils.buildDateUID(date.startDate) + '.timeline-nodes' + nodeStyle;								
			var selected = false;
			
			if (this.data.active !== false) {
				if ( services.utils.buildDateUID( this.data.active.startDate ) === services.utils.buildDateUID( date.startDate ) ) {
					selected = true;
				}	
			}
			
			item[itemKey] = new DateNode({
				data: {
					id: date.id + '-' + services.utils.buildDateUID(date.startDate),
					selected: selected,
					date: date
				}
			});
			items.push(item);
		}							
		return items;
	}
}

var Month = Ulna.Component.extend({
	root: '#timeline-month-<<this.data.id>>',

	data: {
		id: null,
		month: null,
		active: null,
		dates: null
	},

	template: {
		'.timeline-month-inner-wrap': function() {
			if (Ulna.toType(this.data.active) === 'object') {
				return {
					'div.active': monthTemplate
				}
			} else {
				return {
					div: monthTemplate
				}
			}
		}
	}
});

module.exports = Month;
},{"../../actions/RouteChange.js":17,"../../dispatcher.js":61,"../../services.js":63,"./DateNode.js":42,"moment":1,"ulna":8}],44:[function(require,module,exports){
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
		'.container': {
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
	}
});

module.exports = MonthCarousel;
},{"../../actions/RouteChange.js":17,"../../dispatcher.js":61,"../../services.js":63,"../../utils.js":64,"./Month.js":43,"moment":1,"ulna":8}],45:[function(require,module,exports){
var Ulna = require('ulna');
var Moment = require('moment');
var utils = require('../../utils.js');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var Month = require('./Month.js');

var MonthList = Ulna.Component.extend({
	root: '#timeline-months',
	dispatcher: dispatcher,

	data: {
		activeDate: null,
		months: null
	},

	listen: {
		
	},

	template: {
		ul: function() {
			var list = [];
			var activeDateMonthID = new Moment(this.data.activeDate.startDate).format('MMMM').toLowerCase();

			// convert our keyed data structure to an unordered list with titles
			for (var i = 0; this.data.months.length > i; i++) {

				var currMonthID = utils.hyphenate( Object.keys( this.data.months[i] )[0] );
				var active = false;

				if ( currMonthID === activeDateMonthID ) {
					active = this.data.activeDate;
				}

				var item = {};
				var itemKey = 'li.timeline-month#timeline-month-' + currMonthID + '-' + services.utils.buildMonthUID( this.data.activeDate.startDate );

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

			return list;
		}
	}
});

module.exports = MonthList;
},{"../../dispatcher.js":61,"../../services.js":63,"../../utils.js":64,"./Month.js":43,"moment":1,"ulna":8}],46:[function(require,module,exports){
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
},{"../../actions/RouteChange.js":17,"../../dispatcher.js":61,"../../services.js":63,"../DateArticle.js":24,"../Logo.js":31,"./Month.js":43,"./MonthCarousel.js":44,"./MonthList.js":45,"./YearControl.js":47,"moment":1,"ulna":8}],47:[function(require,module,exports){
var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var RouteChange = require('../../actions/RouteChange.js');
var YearItem = require('./YearItem.js');


var YearControl = Ulna.Component.extend({
	root: '#timeline-year-control',

	data: {
		// first year active by default
		activeYear: services.utils.getYears( services.data.events )[0],
		years: services.utils.getYears( services.data.events )
	},

	template: {
		'#timeline-year-control-content': function() {
			var items = [];
			
			for (var y = 0; this.data.years.length > y; y++) {
				var item = {};
				var itemKey = 'li#timeline-year-control-' + this.data.years[y];

				var isYearActive = false;

				if (this.data.years[y] === this.data.activeYear) {
					isYearActive = true;
				}

				item[itemKey] = new YearItem({
					data: {
						year: this.data.years[y],
						active: isYearActive
					}
				});
				
				items.push( item );
			}

			// deal with next/prev later
			// controls will be relative to current state of the year
			
			var content = {
				// 'a#timeline-year-control-next': 'Next',
				ul: items,
				// 'a#timeline-year-control-prev': 'Previous',
			}

			return content;
		}
	}
});

module.exports = YearControl;
},{"../../actions/RouteChange.js":17,"../../dispatcher.js":61,"../../services.js":63,"./YearItem.js":48,"moment":1,"ulna":8}],48:[function(require,module,exports){
var Ulna = require('ulna');
var Moment = require('moment');

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var RouteChange = require('../../actions/RouteChange.js');

var YearItem = Ulna.Component.extend({
	root: 'li#timeline-year-control-<<this.data.year>>',

	dispatcher: dispatcher,

	events: {
		'click a': function(e) {
			e.preventDefault();

			// this.dispatcher.dispatch('TIMELINE_YEAR_CHANGE', {
			// 	data: this.data.year
			// });

			this.dispatcher.dispatch('HISTORY_PUSH', new RouteChange({
				timeline: services.utils.buildDateUID(
					services.utils.getFirstDateInYear( services.data.events, this.data.year ).startDate
				)
			}));
		}
	},

	listen: {
		
	},

	template: {
		span: function() {
			var anchor = {};
			var anchorKey = 'a[href="' + services.utils.buildDateURL(
				services.utils.getFirstDateInYear( services.data.events, this.data.year )
			) + '"]';

			if (this.data.active) {
				anchorKey = anchorKey + '.active';
			}

			anchor[anchorKey] = this.data.year;

			return anchor;
		}
	}
});

module.exports = YearItem;
},{"../../actions/RouteChange.js":17,"../../dispatcher.js":61,"../../services.js":63,"moment":1,"ulna":8}],49:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../utils.js').hyphenate;

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');

var moment = require('moment');


var Timeline = Ulna.Component.extend({
	root: '#timeline-wrap',

	dispatcher: dispatcher,

	data: {
		events: services.data.events
	},

	events: {
		// 'click #nav-expander': function(e) {
		// 	this.dispatcher.dispatch('NAV_EXPAND', {
		// 		data: this.state
		// 	});
		// }
	},

	listen: {
		// 'NAV_EXPAND': function( payload ) {

		// }
	},

	template: {
		'.container': {
			'.col-lg-12': function() {
				// event nodes are popovers on the timeline
				var nodes = [];
				
				for (var e = 0; this.data.events.length > e; e++) {
					
					var ev = this.data.events[e];
					var node = {};
					
					var popover = {};
					var popoverKey = 'div.timeline-popover';

					var mDate = moment(this.data.events[e].startDate).format('MMM Do, YYYY');

					var anchorKey = 'a[href="events/' + this.data.events[e].url + '"]';
					var h1 = {};
					h1[anchorKey] = ev.name;
					
					// popover contains event info
					popover[popoverKey] = {
						h1: h1,
						date: mDate,
						p: ev.desc
					}

					var nodeKey = 'li.timeline-node' + '[style="top:' + this.data.events[e].date + 'px"]';
					
					node[nodeKey] = popover;

					nodes.push(node);
				}

				// get the max length of the timeline
				var len = [];
				var pegs = [];

				for (var l = 0; this.data.events.length > l; l++) {
					len.push(this.data.events[l].date);
					var peg = {};
					
					// console.log(mDate);
					var pegKey = 'span.timeline-peg[style="top:' + this.data.events[l].date + 'px;"]';
					peg[pegKey] = '';
					pegs.push(peg);
				}

				var max = Math.max.apply(null, len);
				var timelineKey = 'div.timeline[style="height:' + max + 'px;"]';

				var content = {
					h1: 'Events',
					ul: nodes
				};

				content[timelineKey] = pegs;

				var contentWrap = {};
				var contentWrapKey = ''

				return content;
			}	
		}
	}
});

module.exports = Timeline;
},{"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"moment":1,"ulna":8}],50:[function(require,module,exports){
var Ulna = require('ulna');

var Typed = Ulna.Component.extend({
	root: '#typedwriter',

	bindToDOM: function() {
		this.bindRoot();
		this.bindEvents();

		// lifecycle callbacks would be nice. for instance, here we have to extend a function to
		// assign some kind of plugin functionality

		$(function(){
			$("#typed").typed({
				stringsElement: $("#typed-strings"),
				loop: true,
				typeSpeed: 50,
				startDelay: 1000,
				backSpeed: 20,
				backDelay: 2000,
			});
		});

		return this.eventsBound;
	},

	template: {
		'span#typed-wrap': {
			span: 'Design a spatial interface for ',
			'span#typed-strings': [
				{
					p: 'artists.'
				},
				{
					p: 'musicians.'
				},
				{
					p: 'performers.'
				},
				{
					p: 'scientists.'
				},
				{
					p: 'engineers.'
				}
			]
		},
		'span#typed': ''
	}
});

module.exports = Typed;
},{"ulna":8}],51:[function(require,module,exports){
var Ulna = require('ulna');

var dispatcher = require('../dispatcher.js');
var services = require('../services.js');
var hyphenate = require('../utils.js').hyphenate;

var Card = require('./Card.js');

var UpcomingCarousel = Ulna.Component.extend({
	root: '#upcoming-carousel',

	dispatcher: dispatcher,

	data: {
		upcoming: services.data.index.upcoming,
		active: 0
	},

	events: {
		'click #upcoming-carousel-inner-prev': function(e) {
			this.dispatcher.dispatch('INFOGRAPHIC_CHANGE', new InfographicChange({
				data: {
					key: 'prev',
					active: this.data.active
				}
			}));
		},
		'click #upcoming-carousel-inner-next': function(e) {
			this.dispatcher.dispatch('INFOGRAPHIC_CHANGE', new InfographicChange({
				data: {
					key: 'next',
					active: this.data.active
				}
			}));
		},
		'click .slide-status li': function(e) {
			// bad, tying data to the dom a bit here
			this.dispatcher.dispatch('INFOGRAPHIC_CHANGE', new InfographicChange({
				data: parseInt(e.target.attributes.id.nodeValue.slice(-1))
			}));
		}
	},

	listen: {
		'INFOGRAPHIC_CHANGE': function(payload) {
			var prevState = this.data.active;
			this.data.active = payload.next;
			this.mutations.changeSlide.call(this, prevState);
		}
	},

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
		h1: 'Upcoming',
		'div.slide-status': function() {
			var leds = {
				ul: []
			};
			for (var l = 0; this.data.upcoming.length > l; l++) {						
				if (l === this.data.active) {
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
				var liKey = 'li#upcoming-slide-status-' + led.index + '.' + led.active;
				var li = {};
				li[liKey] = '';
				leds.ul.push(li);
			}
			return leds;
		},
		'div#upcoming-carousel-inner': {
			'span#upcoming-carousel-inner-prev': {
				span: 'previous slide'
			},
			'.slides-wrap': {
				'ul.slides': function() {
					var cards = [];
					// each slide object
					for (var i = 0; this.data.upcoming.length > i; i++) {
						var hyphTitle = hyphenate(this.data.upcoming[i].title);
						cards.push(new Card({
							root: '#' + hyphTitle + '-card',
							data: {
								title: this.data.upcoming[i].title,
								summary: this.data.upcoming[i].summary,
								upcoming: this.data.upcoming[i].upcoming,
								image: this.data.upcoming[i].image,
								kind: this.data.upcoming[i].image
							}
						}));
					}
					return cards;
				}
			},
			'span#upcoming-carousel-inner-next': {
				span: 'next slide'
			}
		}
	}
});

module.exports = UpcomingCarousel;
},{"../dispatcher.js":61,"../services.js":63,"../utils.js":64,"./Card.js":22,"ulna":8}],52:[function(require,module,exports){
var Ulna = require('ulna');

var VFrame = Ulna.Component.extend({
	root: '#vframe',

	template: {
		'#vframe-video': ''
		// 'video#vframe-video[autoplay=""][muted][poster="/media/knautilus_horiz_logo_solid.png][loop=""]': {
		// 	'source[src="/media/videos/burnItUp.mp4"][type="video/mp4"]':'',
		// }
	}
});

module.exports = VFrame;
},{"ulna":8}],53:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var VideoThumb = require('./VideoThumb.js');

var VideoCarousel = Ulna.Component.extend({
	root: '#video-carousel',

	data: {
		name: 'Videos',
		videos: []
	},

	template: {
		h1: function() {
			return this.data.name;
		},
		'div#video-carousel-inner': {
			'i#video-carousel-next.fa.fa-angle-left': '',
			div: function() {
				var videos = [];
				for (var i = 0; this.data.videos.length > i; i++) {

					var li = {};
					var liKey = 'li#video-thumb-' + hyphenate(this.data.videos[i].name);
					var data = this.data.videos[i];

					li[liKey] = new VideoThumb({
						data: data
					});

					videos.push(li);
				}
				var content = {};
				content['ul'] = videos;

				return content;
			},
			'i#video-carousel-prev.fa.fa-angle-right': '',
		}
	}
});

module.exports = VideoCarousel;
},{"../../dispatcher.js":61,"../../services.js":63,"../../utils.js":64,"./VideoThumb.js":55,"ulna":8}],54:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var VideoEmbed = Ulna.Component.extend({
	root: '#embed-<<this.data.id>>',

	data: {
		id: null,
		src: null
	},

	template: {
		'iframe[src="<<this.data.src>>"][frameborder="0"][allowfullscreen]': ''
	}
});

module.exports = VideoEmbed;
},{"../../dispatcher.js":61,"../../services.js":63,"../../utils.js":64,"ulna":8}],55:[function(require,module,exports){
var Ulna = require('ulna');
var hyphenate = require('../../utils.js').hyphenate;

var dispatcher = require('../../dispatcher.js');
var services = require('../../services.js');

var VideoThumb = Ulna.Component.extend({
	root: '#video-thumb-<<this.data.id>>',
	dispatcher: dispatcher,

	events: {
		'click root': function(e) {
			this.dispatcher.dispatch('VIDEO_CAROUSEL_VIEW', {
				data: this.data
			});
		}
	},

	template: {
		'.video-wrap': function() {
			var img = {};
			var imgKey = 'img[src="' + this.data.thumb + '"][alt="' + this.data.name + '"][name="' + this.data.name + '"]';

			img[imgKey] = '';

			return img;
		}
	}
});

module.exports = VideoThumb;
},{"../../dispatcher.js":61,"../../services.js":63,"../../utils.js":64,"ulna":8}],56:[function(require,module,exports){
module.exports = {
	bios: [
		{
			name: 'Gods Robots',
			img: {
				name: 'Gods Robots',
				src: 'media/images/about/gods_robots_example.jpg'
			},
			text: 'GODS ROBOTS is an international EDM fusion phenomenon. Lorem ipsum In sed nostrud amet aliquip tempor magna veniam ut officia labore ut commodo laborum culpa dolor sit minim ad eiusmod. Lorem ipsum Officia reprehenderit aute exercitation laboris enim officia et aute nulla minim Excepteur enim et pariatur ut velit Ut non dolore est velit aliquip ad dolore cupidatat sit sint do elit officia Duis aliqua nisi aliqua eu ex Excepteur.'
		}
	]
};
},{}],57:[function(require,module,exports){
var Moment = require('moment');
var hyphenate = require('../../utils.js').hyphenate;

var dates = [
	{
		name: 'Mui Ne, Vietnam',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 11,
			day: 5,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/mui-ne/flier.jpg',
				name: 'Mui Ne, Vietnam Flier'
			}
		]
	},
	{
		name: 'Vinyl Dreams',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 10,
			day: 7,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/vinyl-dreams/flier.jpg',
				name: 'Vinyl Dreams Flier'
			}
		]
	},
	{
		name: 'Good Vibes EP Release',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 10,
			day: 1,
			hour: 19,
			minute: 0
		},
		media: [
			//  more types to add here
			{
				kind: 'flier',
				src: '/media/images/events/good-vibes-ep/flier.jpg',
				name: 'Good Vibes EP Release'
			},
			{
				kind: 'embed',
				src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/149636988&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true',
				name: 'Good Vibes EP Soundcloud',
				thumb: '/media/images/events/good-vibes-ep/video_thumb.jpg'
			}
		]
	},
	{
		name: 'Non-Stop Bhangra',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 9,
			day: 27,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/nonstop-bhangra/1.jpg',
				name: 'Non-Stop Bhangra Flier'
			}
		]
	},
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
		name: 'Dub Mission',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 8,
			day: 3,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/dubmission/flier.jpg',
				name: 'Dub Mission Flier'
			},
			{
				kind: 'video',
				src: 'https://www.youtube.com/embed/H0BalatB7ZU',
				name: 'Dub Mission Live',
				thumb: '/media/images/events/dubmission/video_thumb.jpg'
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
				src: 'https://www.youtube.com/embed/H_87Eukt20s',
				name: 'The Chapel Rehearsal 2',
				thumb: '/media/images/events/the-chapel-sf/rehearsal-2_thumb.png'
			},
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/ATlui8zUdjk',
				name: 'The Chapel, SF Live',
				thumb: '/media/images/events/the-chapel-sf/video_thumb.png',
			}
		]
	},
	{
		name: 'Luminous Movement, LA',
		kind: 'show',
		startDate: {
			year: 2016,
			month: 1,
			day: 10,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/luminous-movement/flier.jpg',
				name: 'Luminous Movement Flier'
			}
		]
	},
	{
		name: 'NYE 2016, SF',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 11,
			day: 31,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/nye-convent/flier.jpg',
				name: 'NYE 2016, SF Flier'
			}
		]
	},
	{
		name: 'Offbeat Festival, Reno, NV',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 10,
			day: 6,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/offbeat-festival/flier.jpg',
				name: 'Offbeat Festival Flier'
			}
		]
	},
	{
		name: 'Treasure Island Music Festival',
		kind: 'show',
		startDate: {
			year: 2015,
			month: 9,
			day: 17,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'flier',
				src: '/media/images/events/treasure-island-2015/flier.jpg',
				name: 'Treasure Island Music Festival Flier'
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
	},
	{
		name: 'Beloved Festival',
		kind: 'show',
		startDate: {
			year: 2014,
			month: 9,
			day: 9,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/SHp3Sgsy7as?list=PLtNX5LA73hT0lsy_jgOkCiwJvsffTL-zV',
				name: 'Beloved Festival Live',
				thumb: '/media/images/events/beloved-festival/video_thumb.jpg'
			}
		]
	},
	{
		name: 'Gods Robots - Stormy Weather Music Video',
		kind: 'release',
		startDate: {
			year: 2013,
			month: 7,
			day: 13,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				src: 'https://www.youtube.com/embed/SHp3Sgsy7as?list=PLtNX5LA73hT0lsy_jgOkCiwJvsffTL-zV',
				name: 'GODS ROBOTS Stormy Weather Music Video',
				thumb: '/media/images/events/stormy-weather-video/video_thumb.jpg'
			}
		]
	},
	{
		name: 'Gods Robots - Burn It Up Music Video',
		kind: 'release',
		startDate: {
			year: 2013,
			month: 4,
			day: 10,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/vUgMR3BB8ls',
				name: 'GODS ROBOTS Burn It Up Music Video',
				thumb: '/media/images/events/burn-it-up-video/video_thumb.jpg'
			}
		]
	},


	{
		name: 'Gods Robots Stay Music Video',
		kind: 'release',
		startDate: {
			year: 2011,
			month: 11,
			day: 14,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/5BBYaI1WD-E',
				name: 'GODS ROBOTS Stay Music Video',
				thumb: '/media/images/events/stay-video/video_thumb.jpg'
			}
		]
	},

	

	{
		name: 'Mighty Dub Killaz Music Video',
		kind: 'release',
		startDate: {
			year: 2010,
			month: 9,
			day: 7,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				src: 'https://www.youtube.com/embed/l_ga0nkYDX4',
				name: 'Mighty Dub Killaz Music Video',
				thumb: '/media/images/events/mighty-dub-killaz-video/video_thumb.jpg'
			}
		]
	},

	{
		name: 'Mighty Dub Killaz at Dub Mission',
		kind: 'show',
		startDate: {
			year: 2009,
			month: 8,
			day: 8,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/SGF9uV32o78',
				name: 'Mighty Dub Killaz Live At Dub Mission - Music Video',
				thumb: '/media/images/events/mighty-dub-killaz-dub-mission/video_thumb.jpg'
			}
		]
	},

	{
		name: 'Mighty Dub Killaz Wisely Music Video',
		kind: 'release',
		startDate: {
			year: 2009,
			month: 8,
			day: 7,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				featured: true,
				src: 'https://player.vimeo.com/video/6045432',
				name: 'Mighty Dub Killaz Wisely Music Video',
				thumb: '/media/images/events/mighty-dub-killaz-wisely-video/video_thumb.jpg'
			}
		]
	},

	{
		name: 'How Weird Street Faire',
		kind: 'show',
		startDate: {
			year: 2009,
			month: 6,
			day: 10,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/C7ob6Ca-jcM?list=PL8HA1vBrREHrugfGY-XCgxp6UG0yaOmlM',
				name: 'How Weird Street Faire \'09 Live Video',
				thumb: '/media/images/events/how-weird-street-faire-09/video_thumb.jpg'
			}
		]
	},
	{
		name: 'Harmony Festival',
		kind: 'show',
		startDate: {
			year: 2005,
			month: 6,
			day: 11,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/DEnhZCHh5DE?list=PL8HA1vBrREHrugfGY-XCgxp6UG0yaOmlM',
				name: 'Harmony Festival Live',
				thumb: '/media/images/events/harmony-festival/video_thumb.jpg'
			},
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/VJljtafxz9c?list=PL8HA1vBrREHrugfGY-XCgxp6UG0yaOmlM',
				name: 'Harmony Festival Live 2',
				thumb: '/media/images/events/harmony-festival/video_thumb_2.jpg'
			}
		]
	},
	{
		name: 'Worldly, SF',
		kind: 'show',
		startDate: {
			year: 2005,
			month: 4,
			day: 20,
			hour: 19,
			minute: 0
		},
		media: [
			{
				kind: 'video',
				featured: true,
				src: 'https://www.youtube.com/embed/ocoyYRzYbpA',
				name: 'Worldly, SF Live',
				thumb: '/media/images/events/worldly-sf/video_thumb.jpg'
			},
			{
				kind: 'flier',
				src: '/media/images/events/worldly-sf/flier.jpg',
				name: 'Worldly SF Flier'
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
},{"../../utils.js":64,"moment":1}],58:[function(require,module,exports){
module.exports = {
	nav: [
		{
			title: 'About',
			url: '/about'
		},
		{
			title: 'Music',
			url: '/music'
		},
		{
			title: 'Videos',
			url: '/videos'
		},
		{
			title: 'Photos',
			url: '/photos'
		},
		{
			title: 'Events',
			url: '/events'
		},
		{
			title: 'Press',
			url: '/press'
		},
		{
			title: 'Contact',
			url: '/contact'
		}
	]
};
},{}],59:[function(require,module,exports){
module.exports = {
	discography: [
		{
			name: 'Gods Robots',
			id: 'gods-robots',
			artist: 'GODS ROBOTS',
			date: '2014',
			img: '/media/images/music/gods_robots_album_cover.jpg',
			tracks: [
				{
					name: 'Stay',
					playable: false
				},
				{
					name: 'Falling',
					playable: false
				},
				{
					name: 'Missing A Beat',
					playable: false
				},
				{
					name: 'Burn It Up',
					playable: true,
					srcs: [
						{
							type: 'mp3',
							ref: '/media/audio/burnItUp.mp3'
						}
					]
				},
				{
					name: 'Stormy Weather',
					playable: false
				},
				{
					name: 'One By Four',
					playable: false
				},
				{
					name: 'Rain',
					playable: false
				},
				{
					name: 'Jamuna',
					playable: false
				},
				{
					name: 'All You Have',
					playable: false
				},
				{
					name: 'Shine',
					playable: false
				},
				{
					name: 'Break The Spell',
					playable: false
				},
				{
					name: 'Strange Old Song',
					playable: false
				}
			]
		}
	]
};
},{}],60:[function(require,module,exports){
module.exports = {
	title: 'Photos',
	photos: [
		{
			title: null,
			id: 'test-photo-1',
			name: 'Test Photo 1',
			date: null,
			credit: null,
			src: '/media/images/photos/1.jpg'
		},
		{
			title: null,
			id: 'test-photo-2',
			name: 'Test Photo 2',
			date: null,
			credit: null,
			src: '/media/images/photos/2.jpg'
		},
		{
			title: null,
			id: 'test-photo-3',
			name: 'Test Photo 3',
			date: null,
			credit: null,
			src: '/media/images/photos/3.jpg'
		},
		{
			title: null,
			id: 'test-photo-4',
			name: 'Test Photo 4',
			date: null,
			credit: null,
			src: '/media/images/photos/4.jpg'
		},
		{
			title: null,
			id: 'test-photo-5',
			name: 'Test Photo 5',
			date: null,
			credit: null,
			src: '/media/images/photos/5.jpg'
		},
		{
			title: null,
			id: 'test-photo-6',
			name: 'Test Photo 6',
			date: null,
			credit: null,
			src: '/media/images/photos/6.jpg'
		}
	]
}
},{}],61:[function(require,module,exports){
var Ulna = require('ulna');
var services = require('./services.js');

var dispatcher = new Ulna.Dispatcher({
	actions: [
		'ON_LOAD',
		'INFOGRAPHIC_CHANGE',
		'TIMELINE_YEAR_CHANGE',
		'TIMELINE_DATE_HOVER',
		'TIMELINE_DATE_SELECT',
		'PHOTO_CAROUSEL_VIEW',
		'VIDEO_CAROUSEL_VIEW',
		'ENTER_TIMELINE',
		'MODAL_VIEW',
		{
			name: 'HISTORY_PUSH',
			beforeEmit: function(payload, next) {

				next(payload);
			},
			shouldEmit: function(payload) {
				// if (payload < 2) {
					// console.log('Sorry, son, I can\'t emit ' + payload);
					// return false;
				// }
				// console.log('Aaw yeah, just emiting ' + payload + '!');
				return true;
			}
		},
		{
			name: 'HISTORY_REPLACE',
			beforeEmit: function(payload, next) {
				

				// console.log('HISTORY_REPLACE', payload);
				
				next(payload);
			},
			shouldEmit: function(payload) {
				// if (payload < 2) {
					// console.log('Sorry, son, I can\'t emit ' + payload);
					// return false;
				// }
				// console.log('Aaw yeah, just emiting ' + payload + '!');
				return true;
			}
		},
		{
			name: 'MODAL_CHANGE',
			beforeEmit: function(payload, next) {
				// console.log('MODAL_CHANGE', payload);
				
				next(payload);
			},
			shouldEmit: function(payload) {
				// if (payload < 2) {
					// console.log('Sorry, son, I can\'t emit ' + payload);
					// return false;
				// }
				// console.log('Aaw yeah, just emiting ' + payload + '!');
				return true;
			}
		}
	]
});

module.exports = dispatcher;	
},{"./services.js":63,"ulna":8}],62:[function(require,module,exports){
var Ulna = require('ulna');
var dispatcher = require('./dispatcher.js');
// var services = require('./services.js');

// actions
var RouteChange = require('./actions/RouteChange.js');

var router = new Ulna.Router({
	dispatcher: dispatcher,

	data: {
		history: []
	},

	events: {
		'popstate': function(event) {
			// handle popstates that represent first load
			if ( event.state === null || event.state === 'index' ) {
				var req = 'index'
				this.dispatcher.dispatch('HISTORY_REPLACE', new RouteChange( req ) );
			} else {
				var req = event.state.req;
				this.dispatcher.dispatch('HISTORY_REPLACE', new RouteChange( req ) );
			}

			
		}
	},

	listen: {
		HISTORY_PUSH: function( payload ) {
			// payload should be a standard RouteChange action
			console.log('Router: HISTORY_PUSH', payload);

			this.history.push(payload.route);

		},
		HISTORY_REPLACE: function( payload ) {
			// payload should still be a standard action
			console.log('Router: HISTORY_REPLACE', payload);
			
			this.history.replace(payload.route);
		}
	}
});

module.exports = router;
},{"./actions/RouteChange.js":17,"./dispatcher.js":61,"ulna":8}],63:[function(require,module,exports){
var Ulna = require('ulna');
var dispatcher = require('./dispatcher.js');
var utils = require('./utils.js');

var Moment = require('moment');

// let services be a global object that contains all static props and basic utils

var services = new Ulna.Services({
	dispatcher: dispatcher,

	data: {
		header: {
			title: 'GODS ROBOTS',
			delimiter: ' - ',
		},
		brand: {
			logo: '/media/images/logos/janaka_selekta_logo.png'
		},
		index: require('./data/index.js'),
		about: require('./data/about/index.js'),
		music: require('./data/music/index.js'),
		photos: require('./data/photos/index.js'),
		events: require('./data/events/index.js')
	},

	utils: utils
});

services.data.events = services.utils.momentize( services.data.events, 'startDate' );

module.exports = services;
},{"./data/about/index.js":56,"./data/events/index.js":57,"./data/index.js":58,"./data/music/index.js":59,"./data/photos/index.js":60,"./dispatcher.js":61,"./utils.js":64,"moment":1,"ulna":8}],64:[function(require,module,exports){
var Moment = require('moment');

module.exports = {
	momentize: function( collection, key ) {
		// take a collection and based on a key turn the objects with that key into Moments
		var momentized = [];
		for (var c = 0; collection.length > c; c++) {
			if (collection[c].hasOwnProperty(key)) {
				momentized.push(collection[c]);
				momentized[c][key] = new Moment(momentized[c][key]);
			}
		}

		return momentized;
	},
		
		
	hyphenate: function( string ) {
		// simple hyphenation util

		var reg = /([a-zA-Z\S]*)/g;
		var match = string.match(reg);
		var arr = [];
		var punc = /(\W)/g;
		for (var s = 0; match.length > s; s++) {
			var ms = match[s].toLowerCase();
			if (ms !== '') {
				ms = ms.replace(punc, '');
				arr.push(ms)
			}
		}
		var hyphenated = arr.join('-');
		
		return hyphenated;
	},

	capitalize: function( string ) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	// buildDateUID
	buildDateUID: function( date ) {
		// build a unique id for a given Moment
		// use a standard ISO format, like YYYYMMDDThhmm

		return new Moment( date ).format('YYYYMMDDThhmm');
	},
	// buildShortDateUID
	buildShortDateUID: function( date ) {
		// build a unique id for a given Moment
		// use a standard short ISO format, like YYYYMMDD

		return new Moment( date ).format('YYYYMMDD');
	},
	// buildMonthUID
	buildMonthUID: function( date ) {
		// build unique ID for a given Moment month
		return new Moment( date ).format('YYYYMM');
	},

	buildDateURL: function( date ) {
		/* take a nested date obj like:
			{
				name: 'Test Date',
				startDate: new Moment({
					year: 1970,
					month: 2,
					day: 1,
					hour: 12,
					minute: 0
				})
			}

			return a stringified format we can use as a route URL like:
			/timeline/1970/02/01/test-date
		*/

		return string = '/timeline/' + new Moment( date.startDate ).format('YYYY/MM/DD/') + this.hyphenate(date.name);

	},

	buildShortISOfromURL: function( string ) {
		var arr = string.split('/');
		var iso = [ arr[0], arr[1], arr[2] ].join('');
		return iso;
	},

	getDateByURL: function( events, url ) {
		// assume events is a flat collection with nested Moment objects
		// a url is a string with timestamp hidden inside, eg: '2016/07/12/some-event-name'
		// extract the timestamp from the url and return the event that matches
		var iso = this.buildShortISOfromURL( events, url);
		var date = this.getDateByPartialISO( events, iso );

		return date;
	},

	getDateByPartialISO: function( events, string ) {
		var date = false;
		for (var e = 0; events.length > e; e++) {
			var testShortISO = this.buildShortDateUID( events[e].startDate );
			if (testShortISO === string) {
				date = events[e];
			}
		}
		return date;
	},

	getDateByISO: function( events, string ) {
		// assume events is a flat collection with nested Moment objects
		// based on an ISO string, like "20160702T0700", return the matching date
		var date = false;
		for (var e = 0; events.length > e; e++) {
			var testISO = this.buildDateUID( events[e].startDate );
			if (testISO === string) {
				date = events[e];
			}
		}
		return date;
	},

	getYears: function( events ) {

		// assume events is a flat collection with nested Moment objects
		// should return an array with all available years

		var years = [];

		for (var y = 0; events.length > y; y++) {
			var year = new Moment( events[y].startDate ).toObject().years;
			
			// add if we've just started our loop
			if (years.length === 0) {
				years.push( year );
			} else {

				// make sure we don't add duplicates
				for (var i = 0; years.length > i; i ++) {

					var hasYear = false;
					
					if (years[i] == year) {
						hasYear = true;
					}
				}

				// if we don't have this year yet, push it
				if (!hasYear) {
					years.push( year )
				}
			}
		}

		return years;
	},

	getMonthsForYear: function( events, year ) {
		// given a year and a flat collection of events where the events are nested Moment objects,
		// return all months in that year.

		var months = [];

		for (var m = 0; events.length > m; m++) {
			var eventYear = new Moment( events[m].startDate ).toObject().years;
			
			// only accept event events that match our given year
			if (eventYear == year) {

				var date = events[m];
				var monthNum = new Moment( date.startDate ).toObject().months;
				var monthName = new Moment( date.startDate ).format('MMM');

				months.push(monthName);

			}
		}

		return months;
	},

	getDatesForYear: function( events, year ) {
		// take a year and a flat collection of events where there are nested Moment objects
		// and return that year's dates

		var dates = [];

		for ( var d = 0; events.length > d; d++ ) {
			// match our year
			if (year == new Moment( events[d].startDate ).toObject().years) {
				dates.push(events[d]);
			}
		}

		return dates;
	},

	formatDatesByMonth: function( events ) {
		// accept a flat collection of events with nested Moment objects
		// and return a new array where events are contained in an object
		// whose key is the name of those associated events' month
		/* ex:
		[
			{
				'October': [
					{
						name: 'Some Date'
						startDate: new Moment()
					}
				]
			}
		]
		*/
		
		// create a collection with just months
		var arr = [];

		months = [];
		for (var i = 0; events.length > i; i++) {
			var month = new Moment( events[i].startDate ).toObject().months;
			
			// add by default if it's the first iteration
			if (months.length === 0) {
				months.push(month);
			} else {
				// add this month only if it doesn't match anything in our collection so far
				var hasThisMonth = false;
				for (var m = 0; months.length > m; m++) {
					if (months[m] === month) {
						hasThisMonth = true;
					}
				}

				if (!hasThisMonth) {
					months.push(month)
				}
			}
		}

		// gather events that match our month(s)
		for (var m = 0; months.length > m; m++) {
			// gather events for this month
			var monthKey = Moment({ month: months[m] }).format('MMMM');
			
			var monthEvents = [];

			for (var d = 0; events.length > d; d++) {
				// only match events with this month
				if (months[m] === new Moment( events[d].startDate ).toObject().months) {
					monthEvents.push(events[d]);
				}
			}

			monthObj = {};
			monthObj[monthKey] = monthEvents;

			arr.push(monthObj);
		}
		return arr;
	},

	getFirstDateInMonths: function( months ) {
		/* assume months is an array of nested objects like:
		[ 
			{ 
				'October': [
					{ name: 'Some Event' }
				] 
			}
		]
		get the first date of the first month
		*/

		var monthKey = Object.keys(months[0])[0];
		return months[0][monthKey][0];
	},

	calcNodeDistance: function( nodeDate ) {
		/*
			nodes should have some information that determines their placement on the timeline
			get the length of a given month (in days)
			given the node's date, calculate its lateral placement on the timeline
		*/
		// assume relative distance (height or width) based on percentages
		var distance = 100;
		var daysInMonths = 30; // nothing fancy for now
		var ratio = distance / daysInMonths;

		var nodeDistance = ratio * nodeDate;

		return nodeDistance;
	},

	getFirstDate: function( events ) {
		// get the first date chronologically regardless of the collection's order
		return this.getFirstDateInMonths( 
					this.formatDatesByMonth( 
						this.getDatesForYear( 
							events,
							this.getYears( events )[0]
						)
					)
				)
	},

	getFirstDateInYear: function( events, year ) {
		// get the first date in a given year
		return this.getFirstDateInMonths( 
					this.formatDatesByMonth( 
						this.getDatesForYear( 
							events,
							year
						)
					)
				)
	},

	constructTimelineStateFromURL: function( events, url ) {
		// var path = window.location.pathname.split('/timeline')[1];
		var date = this.getDateByURL( events, url );

		var state = {
			years: this.getYears( events ),
			activeYear: date.startDate.year(),
			dates: this.formatDatesByMonth( this.getDatesForYear( events, date.startDate.year() ) ) ,
			activeDate: date
		};

		return state;
	},

	constructTimelineStateFromDate: function( events, event ) {
		var state = {
			years: this.getYears( events ),
			activeYear: new Moment( event.startDate ).year(),
			dates: this.formatDatesByMonth( this.getDatesForYear( events, new Moment( event.startDate ).year() ) ) ,
			activeDate: event
		};

		return state;
	},

	getFeaturedItems( events ) {
		// get a collection of timeline events and return their featured media items
		var items = [];

		for (var d = 0; events.length > d; d++) {

			for (var m = 0; events[d].media.length > m; m++) {

				if (events[d].media[m].hasOwnProperty('featured')) {
					var media = events[d].media[m];
					// need a way to find our date from featured media items
					media['iso'] = this.buildDateUID( events[d].startDate )

					items.push( media );
				}

			}
		}

		return items;
	},

	getDateByName( events, name ) {
		var date;

		for (var i = 0; events.length > i; i++) {
			if (events[i].name === name) {
				date = events[i];
			}
		}

		return date;
	},

	getState: function( events, req ) {

		// use some input as a request and and a collection to generate a response object that 
		// represents the state of the application given the request
		
		// requests can be null, undefined, strings (like "index" or "timeline"), or nested objects
		// expect this kind of functionality to be encapsulated
		
		var res;
		
		switch(Ulna.toType( req )) {
			case 'null' || 'undefined':
				console.log('State Warning: Payload input null or undefined');					
			break;
			case 'string':
				// console.log('Dispatcher: Payload:', req);
				if (req === 'index') {
					return {
						index: {}
					}
				}
			break;
			case 'object':
				// console.log('Dispatcher: Payload:', req);

				// this is hardcoded - in the future we may do some dynamic magic
				// based on the structure of our services object (or collection)

				var key = Object.keys(req)[0];
				var routeContent = req[key];

				switch( key ) {
					case 'timeline':
						// generate timeline state based on our input
						// in our application, this should be a dateUID
						res = {
							timeline: this.constructTimelineStateFromDate(
								events,
								this.getDateByISO(
									events,
									routeContent
								)
							)
						}
						
					break;
				}
			break;
		}

		return res;
	}
}

},{"moment":1}]},{},[18]);
