/*!
 * jQuery JavaScript Library v2.1.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-18T15:11Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.3",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];
	nodeType = context.nodeType;

	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	if ( !seed && documentIsHTML ) {

		// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
		if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType !== 1 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;
	parent = doc.defaultView;

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Support tests
	---------------------------------------------------------------------- */
	documentIsHTML = !isXML( doc );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\f]' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// We once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android<4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android<4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Support: Firefox, Chrome, Safari
// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optimization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		if ( elem.ownerDocument.defaultView.opener ) {
			return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
		}

		return window.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {

				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {

				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );
				div.removeChild( marginDiv );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*.
					// Use string for doubling so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur(),
				// break the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// Ensure the complete handler is called before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// Don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// Toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// Handle most common string cases
					ret.replace(rreturn, "") :
					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = window.location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// Support: BlackBerry 5, iOS 3 (original iPhone)
		// If we don't have gBCR, just use 0,0 rather than error
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Support: Safari<7+, Chrome<37+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

/*
 AngularJS v1.2.29-build.592+sha.b041b66
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(W,X,u){'use strict';function z(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.29-build.592+sha.b041b66/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function Sa(b){if(null==
b||Ja(b))return!1;var a=b.length;return 1===b.nodeType&&a?!0:G(b)||L(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function r(b,a,c){var d;if(b)if(N(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(L(b)||Sa(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else if(b.forEach&&b.forEach!==r)b.forEach(a,c);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Xb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);
return a.sort()}function Tc(b,a,c){for(var d=Xb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Yb(b){return function(a,c){b(c,a)}}function ib(){for(var b=na.length,a;b;){b--;a=na[b].charCodeAt(0);if(57==a)return na[b]="A",na.join("");if(90==a)na[b]="0";else return na[b]=String.fromCharCode(a+1),na.join("")}na.unshift("0");return na.join("")}function Zb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function E(b){var a=b.$$hashKey;r(arguments,function(a){a!==b&&r(a,function(a,c){b[c]=a})});
Zb(b,a);return b}function U(b){return parseInt(b,10)}function $b(b,a){return E(new (E(function(){},{prototype:b})),a)}function v(){}function ga(b){return b}function aa(b){return function(){return b}}function F(b){return"undefined"===typeof b}function D(b){return"undefined"!==typeof b}function T(b){return null!=b&&"object"===typeof b}function G(b){return"string"===typeof b}function jb(b){return"number"===typeof b}function va(b){return"[object Date]"===Ba.call(b)}function N(b){return"function"===typeof b}
function kb(b){return"[object RegExp]"===Ba.call(b)}function Ja(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Uc(b){return!(!b||!(b.nodeName||b.prop&&b.attr&&b.find))}function Vc(b,a,c){var d=[];r(b,function(b,f,g){d.push(a.call(c,b,f,g))});return d}function Ta(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Ua(b,a){var c=Ta(b,a);0<=c&&b.splice(c,1);return a}function Ka(b,a,c,d){if(Ja(b)||b&&b.$evalAsync&&b.$watch)throw Va("cpws");
if(a){if(b===a)throw Va("cpi");c=c||[];d=d||[];if(T(b)){var e=Ta(c,b);if(-1!==e)return d[e];c.push(b);d.push(a)}if(L(b))for(var f=a.length=0;f<b.length;f++)e=Ka(b[f],null,c,d),T(b[f])&&(c.push(b[f]),d.push(e)),a.push(e);else{var g=a.$$hashKey;L(a)?a.length=0:r(a,function(b,c){delete a[c]});for(f in b)e=Ka(b[f],null,c,d),T(b[f])&&(c.push(b[f]),d.push(e)),a[f]=e;Zb(a,g)}}else if(a=b)L(b)?a=Ka(b,[],c,d):va(b)?a=new Date(b.getTime()):kb(b)?(a=RegExp(b.source,b.toString().match(/[^\/]*$/)[0]),a.lastIndex=
b.lastIndex):T(b)&&(a=Ka(b,{},c,d));return a}function ha(b,a){if(L(b)){a=a||[];for(var c=0;c<b.length;c++)a[c]=b[c]}else if(T(b))for(c in a=a||{},b)!lb.call(b,c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(a[c]=b[c]);return a||b}function Ca(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&"object"==c)if(L(b)){if(!L(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!Ca(b[d],a[d]))return!1;return!0}}else{if(va(b))return va(a)?isNaN(b.getTime())&&
isNaN(a.getTime())||b.getTime()===a.getTime():!1;if(kb(b)&&kb(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||Ja(b)||Ja(a)||L(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!N(b[d])){if(!Ca(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==u&&!N(a[d]))return!1;return!0}return!1}function Bb(b,a){var c=2<arguments.length?wa.call(arguments,2):[];return!N(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?
a.apply(b,c.concat(wa.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Wc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=u:Ja(a)?c="$WINDOW":a&&X===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function oa(b,a){return"undefined"===typeof b?u:JSON.stringify(b,Wc,a?"  ":null)}function ac(b){return G(b)?JSON.parse(b):b}function Wa(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=x(""+b),b=!("f"==b||"0"==b||"false"==
b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function ia(b){b=A(b).clone();try{b.empty()}catch(a){}var c=A("<div>").append(b).html();try{return 3===b[0].nodeType?x(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+x(b)})}catch(d){return x(c)}}function bc(b){try{return decodeURIComponent(b)}catch(a){}}function cc(b){var a={},c,d;r((b||"").split("&"),function(b){b&&(c=b.replace(/\+/g,"%20").split("="),d=bc(c[0]),D(d)&&(b=D(c[1])?bc(c[1]):!0,lb.call(a,d)?L(a[d])?a[d].push(b):a[d]=
[a[d],b]:a[d]=b))});return a}function Cb(b){var a=[];r(b,function(b,d){L(b)?r(b,function(b){a.push(Da(d,!0)+(!0===b?"":"="+Da(b,!0)))}):a.push(Da(d,!0)+(!0===b?"":"="+Da(b,!0)))});return a.length?a.join("&"):""}function mb(b){return Da(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function Da(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Xc(b,a){function c(a){a&&d.push(a)}
var d=[b],e,f,g=["ng:app","ng-app","x-ng-app","data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;r(g,function(a){g[a]=!0;c(X.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(r(b.querySelectorAll("."+a),c),r(b.querySelectorAll("."+a+"\\:"),c),r(b.querySelectorAll("["+a+"]"),c))});r(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,f=(b[2]||"").replace(/\s+/g,",")):r(a.attributes,function(b){!e&&g[b.name]&&(e=a,f=b.value)})}});e&&a(e,f?[f]:[])}function dc(b,a){var c=function(){b=
A(b);if(b.injector()){var c=b[0]===X?"document":ia(b);throw Va("btstrpd",c.replace(/</,"&lt;").replace(/>/,"&gt;"));}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=ec(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(W&&!d.test(W.name))return c();W.name=W.name.replace(d,"");Xa.resumeBootstrap=function(b){r(b,function(b){a.push(b)});
c()}}function nb(b,a){a=a||"_";return b.replace(Yc,function(b,d){return(d?a:"")+b.toLowerCase()})}function Db(b,a,c){if(!b)throw Va("areq",a||"?",c||"required");return b}function Ya(b,a,c){c&&L(b)&&(b=b[b.length-1]);Db(N(b),a,"not a function, got "+(b&&"object"===typeof b?b.constructor.name||"Object":typeof b));return b}function Ea(b,a){if("hasOwnProperty"===b)throw Va("badname",a);}function fc(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,f=a.length,g=0;g<f;g++)d=a[g],b&&(b=(e=b)[d]);return!c&&
N(b)?Bb(e,b):b}function Eb(b){var a=b[0];b=b[b.length-1];if(a===b)return A(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return A(c)}function Zc(b){var a=z("$injector"),c=z("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||z;return b.module||(b.module=function(){var b={};return function(e,f,g){if("hasOwnProperty"===e)throw c("badname","module");f&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);
return n}}if(!f)throw a("nomod",e);var c=[],d=[],m=b("$injector","invoke"),n={_invokeQueue:c,_runBlocks:d,requires:f,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide","constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:m,run:function(a){d.push(a);
return this}};g&&m(g);return n}())}}())}function $c(b){E(b,{bootstrap:dc,copy:Ka,extend:E,equals:Ca,element:A,forEach:r,injector:ec,noop:v,bind:Bb,toJson:oa,fromJson:ac,identity:ga,isUndefined:F,isDefined:D,isString:G,isFunction:N,isObject:T,isNumber:jb,isElement:Uc,isArray:L,version:ad,isDate:va,lowercase:x,uppercase:La,callbacks:{counter:0},$$minErr:z,$$csp:Za});$a=Zc(W);try{$a("ngLocale")}catch(a){$a("ngLocale",[]).provider("$locale",bd)}$a("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:cd});
a.provider("$compile",gc).directive({a:dd,input:hc,textarea:hc,form:ed,script:fd,select:gd,style:hd,option:id,ngBind:jd,ngBindHtml:kd,ngBindTemplate:ld,ngClass:md,ngClassEven:nd,ngClassOdd:od,ngCloak:pd,ngController:qd,ngForm:rd,ngHide:sd,ngIf:td,ngInclude:ud,ngInit:vd,ngNonBindable:wd,ngPluralize:xd,ngRepeat:yd,ngShow:zd,ngStyle:Ad,ngSwitch:Bd,ngSwitchWhen:Cd,ngSwitchDefault:Dd,ngOptions:Ed,ngTransclude:Fd,ngModel:Gd,ngList:Hd,ngChange:Id,required:ic,ngRequired:ic,ngValue:Jd}).directive({ngInclude:Kd}).directive(Fb).directive(jc);
a.provider({$anchorScroll:Ld,$animate:Md,$browser:Nd,$cacheFactory:Od,$controller:Pd,$document:Qd,$exceptionHandler:Rd,$filter:kc,$interpolate:Sd,$interval:Td,$http:Ud,$httpBackend:Vd,$location:Wd,$log:Xd,$parse:Yd,$rootScope:Zd,$q:$d,$sce:ae,$sceDelegate:be,$sniffer:ce,$templateCache:de,$timeout:ee,$window:fe,$$rAF:ge,$$asyncCallback:he})}])}function ab(b){return b.replace(ie,function(a,b,d,e){return e?d.toUpperCase():d}).replace(je,"Moz$1")}function Gb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:
[this],k=a,l,m,n,q,p,s;if(!d||null!=b)for(;e.length;)for(l=e.shift(),m=0,n=l.length;m<n;m++)for(q=A(l[m]),k?q.triggerHandler("$destroy"):k=!k,p=0,q=(s=q.children()).length;p<q;p++)e.push(Fa(s[p]));return f.apply(this,arguments)}var f=Fa.fn[b],f=f.$original||f;e.$original=f;Fa.fn[b]=e}function S(b){if(b instanceof S)return b;G(b)&&(b=$(b));if(!(this instanceof S)){if(G(b)&&"<"!=b.charAt(0))throw Hb("nosel");return new S(b)}if(G(b)){var a=b;b=X;var c;if(c=ke.exec(a))b=[b.createElement(c[1])];else{var d=
b,e;b=d.createDocumentFragment();c=[];if(Ib.test(a)){d=b.appendChild(d.createElement("div"));e=(le.exec(a)||["",""])[1].toLowerCase();e=da[e]||da._default;d.innerHTML="<div>&#160;</div>"+e[1]+a.replace(me,"<$1></$2>")+e[2];d.removeChild(d.firstChild);for(a=e[0];a--;)d=d.lastChild;a=0;for(e=d.childNodes.length;a<e;++a)c.push(d.childNodes[a]);d=b.firstChild;d.textContent=""}else c.push(d.createTextNode(a));b.textContent="";b.innerHTML="";b=c}Jb(this,b);A(X.createDocumentFragment()).append(this)}else Jb(this,
b)}function Kb(b){return b.cloneNode(!0)}function Ma(b){Lb(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Ma(b[a])}function lc(b,a,c,d){if(D(d))throw Hb("offargs");var e=pa(b,"events");pa(b,"handle")&&(F(a)?r(e,function(a,c){bb(b,c,a);delete e[c]}):r(a.split(" "),function(a){F(c)?(bb(b,a,e[a]),delete e[a]):Ua(e[a]||[],c)}))}function Lb(b,a){var c=b.ng339,d=cb[c];d&&(a?delete cb[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),lc(b)),delete cb[c],b.ng339=u))}function pa(b,a,c){var d=
b.ng339,d=cb[d||-1];if(D(c))d||(b.ng339=d=++ne,d=cb[d]={}),d[a]=c;else return d&&d[a]}function Mb(b,a,c){var d=pa(b,"data"),e=D(c),f=!e&&D(a),g=f&&!T(a);d||g||pa(b,"data",d={});if(e)d[a]=c;else if(f){if(g)return d&&d[a];E(d,a)}else return d}function Nb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function ob(b,a){a&&b.setAttribute&&r(a.split(" "),function(a){b.setAttribute("class",$((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g,
" ").replace(" "+$(a)+" "," ")))})}function pb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");r(a.split(" "),function(a){a=$(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",$(c))}}function Jb(b,a){if(a){a=a.nodeName||!D(a.length)||Ja(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function mc(b,a){return qb(b,"$"+(a||"ngController")+"Controller")}function qb(b,a,c){9==b.nodeType&&(b=b.documentElement);for(a=L(a)?a:[a];b;){for(var d=
0,e=a.length;d<e;d++)if((c=A.data(b,a[d]))!==u)return c;b=b.parentNode||11===b.nodeType&&b.host}}function nc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ma(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function oc(b,a){var c=rb[a.toLowerCase()];return c&&pc[b.nodeName]&&c}function oe(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||X);if(F(c.defaultPrevented)){var f=
c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;f.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var g=ha(a[e||c.type]||[]);r(g,function(a){a.call(b,c)});8>=R?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Na(b,a){var c=typeof b,d;"function"==c||"object"==c&&null!==b?"function"==typeof(d=
b.$$hashKey)?d=b.$$hashKey():d===u&&(d=b.$$hashKey=(a||ib)()):d=b;return c+":"+d}function db(b,a){if(a){var c=0;this.nextUid=function(){return++c}}r(b,this.put,this)}function qc(b){var a,c;"function"===typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(pe,""),c=c.match(qe),r(c[1].split(re),function(b){b.replace(se,function(b,c,d){a.push(d)})})),b.$inject=a):L(b)?(c=b.length-1,Ya(b[c],"fn"),a=b.slice(0,c)):Ya(b,"fn",!0);return a}function ec(b){function a(a){return function(b,c){if(T(b))r(b,
Yb(a));else return a(b,c)}}function c(a,b){Ea(a,"service");if(N(b)||L(b))b=n.instantiate(b);if(!b.$get)throw eb("pget",a);return m[a+h]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,f,h;r(a,function(a){if(!l.get(a)){l.put(a,!0);try{if(G(a))for(c=$a(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,f=0,h=d.length;f<h;f++){var g=d[f],k=n.get(g[0]);k[g[1]].apply(k,g[2])}else N(a)?b.push(n.invoke(a)):L(a)?b.push(n.invoke(a)):Ya(a,"module")}catch(p){throw L(a)&&(a=
a[a.length-1]),p.message&&(p.stack&&-1==p.stack.indexOf(p.message))&&(p=p.message+"\n"+p.stack),eb("modulerr",a,p.stack||p.message||p);}}});return b}function f(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===g)throw eb("cdep",d+" <- "+k.join(" <- "));return a[d]}try{return k.unshift(d),a[d]=g,a[d]=b(d)}catch(e){throw a[d]===g&&delete a[d],e;}finally{k.shift()}}function d(a,b,e){var f=[],h=qc(a),g,k,p;k=0;for(g=h.length;k<g;k++){p=h[k];if("string"!==typeof p)throw eb("itkn",p);f.push(e&&e.hasOwnProperty(p)?
e[p]:c(p))}L(a)&&(a=a[g]);return a.apply(b,f)}return{invoke:d,instantiate:function(a,b){var c=function(){},e;c.prototype=(L(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return T(e)||N(e)?e:c},get:c,annotate:qc,has:function(b){return m.hasOwnProperty(b+h)||a.hasOwnProperty(b)}}}var g={},h="Provider",k=[],l=new db([],!0),m={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,aa(b))}),constant:a(function(a,
b){Ea(a,"constant");m[a]=b;q[a]=b}),decorator:function(a,b){var c=n.get(a+h),d=c.$get;c.$get=function(){var a=p.invoke(d,c);return p.invoke(b,null,{$delegate:a})}}}},n=m.$injector=f(m,function(){throw eb("unpr",k.join(" <- "));}),q={},p=q.$injector=f(q,function(a){a=n.get(a+h);return p.invoke(a.$get,a)});r(e(b),function(a){p.invoke(a||v)});return p}function Ld(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;
r(a,function(a){b||"a"!==x(a.nodeName)||(b=a)});return b}function f(){var b=c.hash(),d;b?(d=g.getElementById(b))?d.scrollIntoView():(d=e(g.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var g=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(f)});return f}]}function he(){this.$get=["$$rAF","$timeout",function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function te(b,a,c,d){function e(a){try{a.apply(null,
wa.call(arguments,1))}finally{if(s--,0===s)for(;J.length;)try{J.pop()()}catch(b){c.error(b)}}}function f(a,b){(function ea(){r(w,function(a){a()});t=b(ea,a)})()}function g(){y!=h.url()&&(y=h.url(),r(ba,function(a){a(h.url())}))}var h=this,k=a[0],l=b.location,m=b.history,n=b.setTimeout,q=b.clearTimeout,p={};h.isMock=!1;var s=0,J=[];h.$$completeOutstandingRequest=e;h.$$incOutstandingRequestCount=function(){s++};h.notifyWhenNoOutstandingRequests=function(a){r(w,function(a){a()});0===s?a():J.push(a)};
var w=[],t;h.addPollFn=function(a){F(t)&&f(100,n);w.push(a);return a};var y=l.href,K=a.find("base"),B=null;h.url=function(a,c){l!==b.location&&(l=b.location);m!==b.history&&(m=b.history);if(a){if(y!=a){var e=y&&Ga(y)===Ga(a);y=a;if(!e&&d.history)c?m.replaceState(null,"",a):(m.pushState(null,"",a),K.attr("href",K.attr("href")));else if(e||(B=a),c)l.replace(a);else if(e){var e=l,f;f=a.indexOf("#");f=-1===f?"":a.substr(f+1);e.hash=f}else l.href=a;return h}}else return B||l.href.replace(/%27/g,"'")};
var ba=[],O=!1;h.onUrlChange=function(a){if(!O){if(d.history)A(b).on("popstate",g);if(d.hashchange)A(b).on("hashchange",g);else h.addPollFn(g);O=!0}ba.push(a);return a};h.$$checkUrlChange=g;h.baseHref=function(){var a=K.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};var M={},ca="",P=h.baseHref();h.cookies=function(a,b){var d,e,f,h;if(a)b===u?k.cookie=escape(a)+"=;path="+P+";expires=Thu, 01 Jan 1970 00:00:00 GMT":G(b)&&(d=(k.cookie=escape(a)+"="+escape(b)+";path="+P).length+1,4096<
d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(k.cookie!==ca)for(ca=k.cookie,d=ca.split("; "),M={},f=0;f<d.length;f++)e=d[f],h=e.indexOf("="),0<h&&(a=unescape(e.substring(0,h)),M[a]===u&&(M[a]=unescape(e.substring(h+1))));return M}};h.defer=function(a,b){var c;s++;c=n(function(){delete p[c];e(a)},b||0);p[c]=!0;return c};h.defer.cancel=function(a){return p[a]?(delete p[a],q(a),e(v),!0):!1}}function Nd(){this.$get=["$window","$log",
"$sniffer","$document",function(b,a,c,d){return new te(b,d,a,c)}]}function Od(){this.$get=function(){function b(b,d){function e(a){a!=n&&(q?q==a&&(q=a.n):q=a,f(a.n,a.p),f(a,n),n=a,n.n=null)}function f(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw z("$cacheFactory")("iid",b);var g=0,h=E({},d,{id:b}),k={},l=d&&d.capacity||Number.MAX_VALUE,m={},n=null,q=null;return a[b]={put:function(a,b){if(l<Number.MAX_VALUE){var c=m[a]||(m[a]={key:a});e(c)}if(!F(b))return a in k||g++,k[a]=b,g>l&&this.remove(q.key),
b},get:function(a){if(l<Number.MAX_VALUE){var b=m[a];if(!b)return;e(b)}return k[a]},remove:function(a){if(l<Number.MAX_VALUE){var b=m[a];if(!b)return;b==n&&(n=b.p);b==q&&(q=b.n);f(b.n,b.p);delete m[a]}delete k[a];g--},removeAll:function(){k={};g=0;m={};n=q=null},destroy:function(){m=h=k=null;delete a[b]},info:function(){return E({},h,{size:g})}}}var a={};b.info=function(){var b={};r(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function de(){this.$get=["$cacheFactory",
function(b){return b("templates")}]}function gc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w_\-]+)\s+(.*)$/,f=/(([\d\w_\-]+)(?:\:([^;]+))?;?)/,g=/^(on[a-z]+|formaction)$/;this.directive=function k(a,e){Ea(a,"directive");G(a)?(Db(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];r(c[a],function(c,f){try{var g=b.invoke(c);N(g)?g={compile:aa(g)}:!g.compile&&g.link&&(g.compile=aa(g.link));g.priority=g.priority||0;g.index=
f;g.name=g.name||a;g.require=g.require||g.controller&&g.name;g.restrict=g.restrict||"A";e.push(g)}catch(k){d(k)}});return e}])),c[a].push(e)):r(a,Yb(k));return this};this.aHrefSanitizationWhitelist=function(b){return D(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return D(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache",
"$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,m,n,q,p,s,J,w,t,y,K){function B(a,b,c,d,e){a instanceof A||(a=A(a));r(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=A(b).wrap("<span></span>").parent()[0])});var f=O(a,b,a,c,d,e);ba(a,"ng-scope");return function(b,c,d,e){Db(b,"scope");var g=c?Oa.clone.call(a):a;r(d,function(a,b){g.data("$"+b+"Controller",a)});d=0;for(var k=g.length;d<k;d++){var p=g[d].nodeType;1!==p&&9!==p||g.eq(d).data("$scope",
b)}c&&c(g,b);f&&f(b,g,g,e);return g}}function ba(a,b){try{a.addClass(b)}catch(c){}}function O(a,b,c,d,e,f){function g(a,c,d,e){var f,p,m,l,q,n,w;f=c.length;var s=Array(f);for(l=0;l<f;l++)s[l]=c[l];n=l=0;for(q=k.length;l<q;n++)p=s[n],c=k[l++],f=k[l++],c?(c.scope?(m=a.$new(),A.data(p,"$scope",m)):m=a,w=c.transcludeOnThisElement?M(a,c.transclude,e):!c.templateOnThisElement&&e?e:!e&&b?M(a,b):null,c(f,m,p,d,w)):f&&f(a,p.childNodes,u,e)}for(var k=[],p,m,l,q,n=0;n<a.length;n++)p=new Ob,m=ca(a[n],[],p,0===
n?d:u,e),(f=m.length?I(m,a[n],p,b,c,null,[],[],f):null)&&f.scope&&ba(p.$$element,"ng-scope"),p=f&&f.terminal||!(l=a[n].childNodes)||!l.length?null:O(l,f?(f.transcludeOnThisElement||!f.templateOnThisElement)&&f.transclude:b),k.push(f,p),q=q||f||p,f=null;return q?g:null}function M(a,b,c){return function(d,e,f){var g=!1;d||(d=a.$new(),g=d.$$transcluded=!0);e=b(d,e,f,c);if(g)e.on("$destroy",function(){d.$destroy()});return e}}function ca(a,b,c,d,g){var k=c.$attr,p;switch(a.nodeType){case 1:ea(b,qa(Pa(a).toLowerCase()),
"E",d,g);for(var l,m,q,n=a.attributes,w=0,s=n&&n.length;w<s;w++){var t=!1,J=!1;l=n[w];if(!R||8<=R||l.specified){p=l.name;m=$(l.value);l=qa(p);if(q=U.test(l))p=nb(l.substr(6),"-");var y=l.replace(/(Start|End)$/,"");l===y+"Start"&&(t=p,J=p.substr(0,p.length-5)+"end",p=p.substr(0,p.length-6));l=qa(p.toLowerCase());k[l]=p;if(q||!c.hasOwnProperty(l))c[l]=m,oc(a,l)&&(c[l]=!0);S(a,b,m,l);ea(b,l,"A",d,g,t,J)}}a=a.className;if(G(a)&&""!==a)for(;p=f.exec(a);)l=qa(p[2]),ea(b,l,"C",d,g)&&(c[l]=$(p[3])),a=a.substr(p.index+
p[0].length);break;case 3:x(b,a.nodeValue);break;case 8:try{if(p=e.exec(a.nodeValue))l=qa(p[1]),ea(b,l,"M",d,g)&&(c[l]=$(p[2]))}catch(B){}}b.sort(F);return b}function P(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ja("uterdir",b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return A(d)}function C(a,b,c){return function(d,e,f,g,k){e=P(e[0],b,c);return a(d,e,f,g,k)}}function I(a,c,d,e,f,g,k,q,n){function w(a,
b,c,d){if(a){c&&(a=C(a,c,d));a.require=H.require;a.directiveName=z;if(K===H||H.$$isolateScope)a=rc(a,{isolateScope:!0});k.push(a)}if(b){c&&(b=C(b,c,d));b.require=H.require;b.directiveName=z;if(K===H||H.$$isolateScope)b=rc(b,{isolateScope:!0});q.push(b)}}function t(a,b,c,d){var e,f="data",g=!1;if(G(b)){for(;"^"==(e=b.charAt(0))||"?"==e;)b=b.substr(1),"^"==e&&(f="inheritedData"),g=g||"?"==e;e=null;d&&"data"===f&&(e=d[b]);e=e||c[f]("$"+b+"Controller");if(!e&&!g)throw ja("ctreq",b,a);}else L(b)&&(e=[],
r(b,function(b){e.push(t(a,b,c,d))}));return e}function J(a,e,f,g,n){function w(a,b){var c;2>arguments.length&&(b=a,a=u);Ia&&(c=ca);return n(a,b,c)}var y,Q,B,M,C,P,ca={},ra;y=c===f?d:ha(d,new Ob(A(f),d.$attr));Q=y.$$element;if(K){var ve=/^\s*([@=&])(\??)\s*(\w*)\s*$/;P=e.$new(!0);!I||I!==K&&I!==K.$$originalDirective?Q.data("$isolateScopeNoTemplate",P):Q.data("$isolateScope",P);ba(Q,"ng-isolate-scope");r(K.scope,function(a,c){var d=a.match(ve)||[],f=d[3]||c,g="?"==d[2],d=d[1],k,m,n,q;P.$$isolateBindings[c]=
d+f;switch(d){case "@":y.$observe(f,function(a){P[c]=a});y.$$observers[f].$$scope=e;y[f]&&(P[c]=b(y[f])(e));break;case "=":if(g&&!y[f])break;m=p(y[f]);q=m.literal?Ca:function(a,b){return a===b||a!==a&&b!==b};n=m.assign||function(){k=P[c]=m(e);throw ja("nonassign",y[f],K.name);};k=P[c]=m(e);P.$watch(function(){var a=m(e);q(a,P[c])||(q(a,k)?n(e,a=P[c]):P[c]=a);return k=a},null,m.literal);break;case "&":m=p(y[f]);P[c]=function(a){return m(e,a)};break;default:throw ja("iscp",K.name,c,a);}})}ra=n&&w;O&&
r(O,function(a){var b={$scope:a===K||a.$$isolateScope?P:e,$element:Q,$attrs:y,$transclude:ra},c;C=a.controller;"@"==C&&(C=y[a.name]);c=s(C,b);ca[a.name]=c;Ia||Q.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});g=0;for(B=k.length;g<B;g++)try{M=k[g],M(M.isolateScope?P:e,Q,y,M.require&&t(M.directiveName,M.require,Q,ca),ra)}catch(H){m(H,ia(Q))}g=e;K&&(K.template||null===K.templateUrl)&&(g=P);a&&a(g,f.childNodes,u,n);for(g=q.length-1;0<=g;g--)try{M=q[g],M(M.isolateScope?P:
e,Q,y,M.require&&t(M.directiveName,M.require,Q,ca),ra)}catch(D){m(D,ia(Q))}}n=n||{};for(var y=-Number.MAX_VALUE,M,O=n.controllerDirectives,K=n.newIsolateScopeDirective,I=n.templateDirective,ea=n.nonTlbTranscludeDirective,F=!1,E=!1,Ia=n.hasElementTranscludeDirective,x=d.$$element=A(c),H,z,V,S=e,R,Ha=0,sa=a.length;Ha<sa;Ha++){H=a[Ha];var U=H.$$start,Y=H.$$end;U&&(x=P(c,U,Y));V=u;if(y>H.priority)break;if(V=H.scope)M=M||H,H.templateUrl||(fb("new/isolated scope",K,H,x),T(V)&&(K=H));z=H.name;!H.templateUrl&&
H.controller&&(V=H.controller,O=O||{},fb("'"+z+"' controller",O[z],H,x),O[z]=H);if(V=H.transclude)F=!0,H.$$tlb||(fb("transclusion",ea,H,x),ea=H),"element"==V?(Ia=!0,y=H.priority,V=x,x=d.$$element=A(X.createComment(" "+z+": "+d[z]+" ")),c=x[0],ra(f,wa.call(V,0),c),S=B(V,e,y,g&&g.name,{nonTlbTranscludeDirective:ea})):(V=A(Kb(c)).contents(),x.empty(),S=B(V,e));if(H.template)if(E=!0,fb("template",I,H,x),I=H,V=N(H.template)?H.template(x,d):H.template,V=W(V),H.replace){g=H;V=Ib.test(V)?A($(V)):[];c=V[0];
if(1!=V.length||1!==c.nodeType)throw ja("tplrt",z,"");ra(f,x,c);sa={$attr:{}};V=ca(c,[],sa);var Z=a.splice(Ha+1,a.length-(Ha+1));K&&D(V);a=a.concat(V).concat(Z);v(d,sa);sa=a.length}else x.html(V);if(H.templateUrl)E=!0,fb("template",I,H,x),I=H,H.replace&&(g=H),J=ue(a.splice(Ha,a.length-Ha),x,d,f,F&&S,k,q,{controllerDirectives:O,newIsolateScopeDirective:K,templateDirective:I,nonTlbTranscludeDirective:ea}),sa=a.length;else if(H.compile)try{R=H.compile(x,d,S),N(R)?w(null,R,U,Y):R&&w(R.pre,R.post,U,Y)}catch(we){m(we,
ia(x))}H.terminal&&(J.terminal=!0,y=Math.max(y,H.priority))}J.scope=M&&!0===M.scope;J.transcludeOnThisElement=F;J.templateOnThisElement=E;J.transclude=S;n.hasElementTranscludeDirective=Ia;return J}function D(a){for(var b=0,c=a.length;b<c;b++)a[b]=$b(a[b],{$$isolateScope:!0})}function ea(b,e,f,g,p,l,n){if(e===p)return null;p=null;if(c.hasOwnProperty(e)){var q;e=a.get(e+d);for(var w=0,s=e.length;w<s;w++)try{q=e[w],(g===u||g>q.priority)&&-1!=q.restrict.indexOf(f)&&(l&&(q=$b(q,{$$start:l,$$end:n})),b.push(q),
p=q)}catch(y){m(y)}}return p}function v(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;r(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&b[e]!==d&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});r(b,function(b,f){"class"==f?(ba(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):"style"==f?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==f.charAt(0)||a.hasOwnProperty(f)||(a[f]=b,d[f]=c[f])})}function ue(a,b,c,d,e,f,g,k){var p=[],l,m,w=b[0],s=a.shift(),y=E({},s,{templateUrl:null,
transclude:null,replace:null,$$originalDirective:s}),J=N(s.templateUrl)?s.templateUrl(b,c):s.templateUrl;b.empty();n.get(t.getTrustedResourceUrl(J),{cache:q}).success(function(q){var n,t;q=W(q);if(s.replace){q=Ib.test(q)?A($(q)):[];n=q[0];if(1!=q.length||1!==n.nodeType)throw ja("tplrt",s.name,J);q={$attr:{}};ra(d,b,n);var B=ca(n,[],q);T(s.scope)&&D(B);a=B.concat(a);v(c,q)}else n=w,b.html(q);a.unshift(y);l=I(a,n,c,e,b,s,f,g,k);r(d,function(a,c){a==n&&(d[c]=b[0])});for(m=O(b[0].childNodes,e);p.length;){q=
p.shift();t=p.shift();var K=p.shift(),C=p.shift(),B=b[0];if(t!==w){var P=t.className;k.hasElementTranscludeDirective&&s.replace||(B=Kb(n));ra(K,A(t),B);ba(A(B),P)}t=l.transcludeOnThisElement?M(q,l.transclude,C):C;l(m,q,B,d,t)}p=null}).error(function(a,b,c,d){throw ja("tpload",d.url);});return function(a,b,c,d,e){a=e;p?(p.push(b),p.push(c),p.push(d),p.push(a)):(l.transcludeOnThisElement&&(a=M(b,l.transclude,e)),l(m,b,c,d,a))}}function F(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?
a.name<b.name?-1:1:a.index-b.index}function fb(a,b,c,d){if(b)throw ja("multidir",b.name,c.name,a,ia(d));}function x(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:function(a){var b=a.parent().length;b&&ba(a.parent(),"ng-binding");return function(a,c){var e=c.parent(),f=e.data("$binding")||[];f.push(d);e.data("$binding",f);b||ba(e,"ng-binding");a.$watch(d,function(a){c[0].nodeValue=a})}}})}function z(a,b){if("srcdoc"==b)return t.HTML;var c=Pa(a);if("xlinkHref"==b||"FORM"==c&&"action"==b||"IMG"!=
c&&("src"==b||"ngSrc"==b))return t.RESOURCE_URL}function S(a,c,d,e){var f=b(d,!0);if(f){if("multiple"===e&&"SELECT"===Pa(a))throw ja("selmulti",ia(a));c.push({priority:100,compile:function(){return{pre:function(c,d,k){d=k.$$observers||(k.$$observers={});if(g.test(e))throw ja("nodomevents");if(f=b(k[e],!0,z(a,e)))k[e]=f(c),(d[e]||(d[e]=[])).$$inter=!0,(k.$$observers&&k.$$observers[e].$$scope||c).$watch(f,function(a,b){"class"===e&&a!=b?k.$updateClass(a,b):k.$set(e,a)})}}}})}}function ra(a,b,c){var d=
b[0],e=b.length,f=d.parentNode,g,k;if(a)for(g=0,k=a.length;g<k;g++)if(a[g]==d){a[g++]=c;k=g+e-1;for(var p=a.length;g<p;g++,k++)k<p?a[g]=a[k]:delete a[g];a.length-=e-1;break}f&&f.replaceChild(c,d);a=X.createDocumentFragment();a.appendChild(d);c[A.expando]=d[A.expando];d=1;for(e=b.length;d<e;d++)f=b[d],A(f).remove(),a.appendChild(f),delete b[d];b[0]=c;b.length=1}function rc(a,b){return E(function(){return a.apply(null,arguments)},a,b)}var Ob=function(a,b){this.$$element=a;this.$attr=b||{}};Ob.prototype=
{$normalize:qa,$addClass:function(a){a&&0<a.length&&y.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&y.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=sc(a,b),d=sc(b,a);0===c.length?y.removeClass(this.$$element,d):0===d.length?y.addClass(this.$$element,c):y.setClass(this.$$element,c,d)},$set:function(a,b,c,d){var e=oc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=nb(a,"-"));e=Pa(this.$$element);
if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=K(b,"src"===a);!1!==c&&(null===b||b===u?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&r(c[a],function(a){try{a(b)}catch(c){m(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);J.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var sa=b.startSymbol(),Ia=b.endSymbol(),W="{{"==sa||"}}"==Ia?ga:function(a){return a.replace(/\{\{/g,sa).replace(/}}/g,Ia)},U=/^ngAttr[A-Z]/;
return B}]}function qa(b){return ab(b.replace(xe,""))}function sc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),f=0;a:for(;f<d.length;f++){for(var g=d[f],h=0;h<e.length;h++)if(g==e[h])continue a;c+=(0<c.length?" ":"")+g}return c}function Pd(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){Ea(a,"controller");T(a)?E(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,f){var g,h,k;G(e)&&(g=e.match(a),h=g[1],k=g[3],e=b.hasOwnProperty(h)?b[h]:fc(f.$scope,h,
!0)||fc(d,h,!0),Ya(e,h,!0));g=c.instantiate(e,f);if(k){if(!f||"object"!==typeof f.$scope)throw z("$controller")("noscp",h||e.name,k);f.$scope[k]=g}return g}}]}function Qd(){this.$get=["$window",function(b){return A(b.document)}]}function Rd(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function tc(b){var a={},c,d,e;if(!b)return a;r(b.split("\n"),function(b){e=b.indexOf(":");c=x($(b.substr(0,e)));d=$(b.substr(e+1));c&&(a[c]=a[c]?a[c]+", "+d:d)});return a}function uc(b){var a=
T(b)?b:u;return function(c){a||(a=tc(b));return c?a[x(c)]||null:a}}function vc(b,a,c){if(N(c))return c(b,a);r(c,function(c){b=c(b,a)});return b}function Ud(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){G(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=ac(d)));return d}],transformRequest:[function(a){return T(a)&&"[object File]"!==Ba.call(a)&&"[object Blob]"!==Ba.call(a)?oa(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},
post:ha(d),put:ha(d),patch:ha(d)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},f=this.interceptors=[],g=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,n,q){function p(a){function b(a){var d=E({},a,{data:vc(a.data,a.headers,c.transformResponse)});return 200<=a.status&&300>a.status?d:n.reject(d)}var c={method:"get",transformRequest:e.transformRequest,transformResponse:e.transformResponse},d=function(a){var b=
e.headers,c=E({},a.headers),d,f,b=E({},b.common,b[x(a.method)]);a:for(d in b){a=x(d);for(f in c)if(x(f)===a)continue a;c[d]=b[d]}(function(a){var b;r(a,function(c,d){N(c)&&(b=c(),null!=b?a[d]=b:delete a[d])})})(c);return c}(a);E(c,a);c.headers=d;c.method=La(c.method);var f=[function(a){d=a.headers;var c=vc(a.data,uc(d),a.transformRequest);F(c)&&r(d,function(a,b){"content-type"===x(b)&&delete d[b]});F(a.withCredentials)&&!F(e.withCredentials)&&(a.withCredentials=e.withCredentials);return s(a,c,d).then(b,
b)},u],g=n.when(c);for(r(t,function(a){(a.request||a.requestError)&&f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;){a=f.shift();var h=f.shift(),g=g.then(a,h)}g.success=function(a){g.then(function(b){a(b.data,b.status,b.headers,c)});return g};g.error=function(a){g.then(null,function(b){a(b.data,b.status,b.headers,c)});return g};return g}function s(c,f,g){function l(a,b,c,e){C&&(200<=a&&300>a?C.put(A,[a,b,tc(c),e]):C.remove(A));q(b,
a,c,e);d.$$phase||d.$apply()}function q(a,b,d,e){b=Math.max(b,0);(200<=b&&300>b?t.resolve:t.reject)({data:a,status:b,headers:uc(d),config:c,statusText:e})}function s(){var a=Ta(p.pendingRequests,c);-1!==a&&p.pendingRequests.splice(a,1)}var t=n.defer(),r=t.promise,C,I,A=J(c.url,c.params);p.pendingRequests.push(c);r.then(s,s);!c.cache&&!e.cache||(!1===c.cache||"GET"!==c.method&&"JSONP"!==c.method)||(C=T(c.cache)?c.cache:T(e.cache)?e.cache:w);if(C)if(I=C.get(A),D(I)){if(I&&N(I.then))return I.then(s,
s),I;L(I)?q(I[1],I[0],ha(I[2]),I[3]):q(I,200,{},"OK")}else C.put(A,r);F(I)&&((I=Pb(c.url)?b.cookies()[c.xsrfCookieName||e.xsrfCookieName]:u)&&(g[c.xsrfHeaderName||e.xsrfHeaderName]=I),a(c.method,A,f,l,g,c.timeout,c.withCredentials,c.responseType));return r}function J(a,b){if(!b)return a;var c=[];Tc(b,function(a,b){null===a||F(a)||(L(a)||(a=[a]),r(a,function(a){T(a)&&(a=va(a)?a.toISOString():oa(a));c.push(Da(b)+"="+Da(a))}))});0<c.length&&(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}var w=
c("$http"),t=[];r(f,function(a){t.unshift(G(a)?q.get(a):q.invoke(a))});r(g,function(a,b){var c=G(a)?q.get(a):q.invoke(a);t.splice(b,0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});p.pendingRequests=[];(function(a){r(arguments,function(a){p[a]=function(b,c){return p(E(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){r(arguments,function(a){p[a]=function(b,c,d){return p(E(d||{},{method:a,url:b,data:c}))}})})("post","put","patch");
p.defaults=e;return p}]}function ye(b){if(8>=R&&(!b.match(/^(get|post|head|put|delete|options)$/i)||!W.XMLHttpRequest))return new W.ActiveXObject("Microsoft.XMLHTTP");if(W.XMLHttpRequest)return new W.XMLHttpRequest;throw z("$httpBackend")("noxhr");}function Vd(){this.$get=["$browser","$window","$document",function(b,a,c){return ze(b,ye,b.defer,a.angular.callbacks,c[0])}]}function ze(b,a,c,d,e){function f(a,b,c){var f=e.createElement("script"),g=null;f.type="text/javascript";f.src=a;f.async=!0;g=function(a){bb(f,
"load",g);bb(f,"error",g);e.body.removeChild(f);f=null;var h=-1,s="unknown";a&&("load"!==a.type||d[b].called||(a={type:"error"}),s=a.type,h="error"===a.type?404:200);c&&c(h,s)};sb(f,"load",g);sb(f,"error",g);8>=R&&(f.onreadystatechange=function(){G(f.readyState)&&/loaded|complete/.test(f.readyState)&&(f.onreadystatechange=null,g({type:"load"}))});e.body.appendChild(f);return g}var g=-1;return function(e,k,l,m,n,q,p,s){function J(){t=g;K&&K();B&&B.abort()}function w(a,d,e,f,g){O&&c.cancel(O);K=B=null;
0===d&&(d=e?200:"file"==xa(k).protocol?404:0);a(1223===d?204:d,e,f,g||"");b.$$completeOutstandingRequest(v)}var t;b.$$incOutstandingRequestCount();k=k||b.url();if("jsonp"==x(e)){var y="_"+(d.counter++).toString(36);d[y]=function(a){d[y].data=a;d[y].called=!0};var K=f(k.replace("JSON_CALLBACK","angular.callbacks."+y),y,function(a,b){w(m,a,d[y].data,"",b);d[y]=v})}else{var B=a(e);B.open(e,k,!0);r(n,function(a,b){D(a)&&B.setRequestHeader(b,a)});B.onreadystatechange=function(){if(B&&4==B.readyState){var a=
null,b=null,c="";t!==g&&(a=B.getAllResponseHeaders(),b="response"in B?B.response:B.responseText);t===g&&10>R||(c=B.statusText);w(m,t||B.status,b,a,c)}};p&&(B.withCredentials=!0);if(s)try{B.responseType=s}catch(ba){if("json"!==s)throw ba;}B.send(l||null)}if(0<q)var O=c(J,q);else q&&N(q.then)&&q.then(J)}}function Sd(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function f(f,
l,m){for(var n,q,p=0,s=[],J=f.length,w=!1,t=[];p<J;)-1!=(n=f.indexOf(b,p))&&-1!=(q=f.indexOf(a,n+g))?(p!=n&&s.push(f.substring(p,n)),s.push(p=c(w=f.substring(n+g,q))),p.exp=w,p=q+h,w=!0):(p!=J&&s.push(f.substring(p)),p=J);(J=s.length)||(s.push(""),J=1);if(m&&1<s.length)throw wc("noconcat",f);if(!l||w)return t.length=J,p=function(a){try{for(var b=0,c=J,g;b<c;b++){if("function"==typeof(g=s[b]))if(g=g(a),g=m?e.getTrusted(m,g):e.valueOf(g),null==g)g="";else switch(typeof g){case "string":break;case "number":g=
""+g;break;default:g=oa(g)}t[b]=g}return t.join("")}catch(h){a=wc("interr",f,h.toString()),d(a)}},p.exp=f,p.parts=s,p}var g=b.length,h=a.length;f.startSymbol=function(){return b};f.endSymbol=function(){return a};return f}]}function Td(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,g,h,k){var l=a.setInterval,m=a.clearInterval,n=c.defer(),q=n.promise,p=0,s=D(k)&&!k;h=D(h)?h:0;q.then(null,null,d);q.$$intervalId=l(function(){n.notify(p++);0<h&&p>=h&&(n.resolve(p),m(q.$$intervalId),
delete e[q.$$intervalId]);s||b.$apply()},g);e[q.$$intervalId]=n;return q}var e={};d.cancel=function(b){return b&&b.$$intervalId in e?(e[b.$$intervalId].reject("canceled"),a.clearInterval(b.$$intervalId),delete e[b.$$intervalId],!0):!1};return d}]}function bd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",
negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",
mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function Qb(b){b=b.split("/");for(var a=b.length;a--;)b[a]=mb(b[a]);return b.join("/")}function xc(b,a,c){b=xa(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=U(b.port)||Ae[b.protocol]||null}function yc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=xa(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=
cc(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function ta(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Ga(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function zc(b){return b.replace(/(#.+)|#$/,"$1")}function Rb(b){return b.substr(0,Ga(b).lastIndexOf("/")+1)}function Ac(b,a){this.$$html5=!0;a=a||"";var c=Rb(b);xc(b,this,b);this.$$parse=function(a){var e=ta(c,a);if(!G(e))throw Sb("ipthprfx",a,c);yc(e,this,b);this.$$path||
(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Cb(this.$$search),b=this.$$hash?"#"+mb(this.$$hash):"";this.$$url=Qb(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$parseLinkUrl=function(d,e){var f,g;(f=ta(b,d))!==u?(g=f,g=(f=ta(a,f))!==u?c+(ta("/",f)||f):b+g):(f=ta(c,d))!==u?g=c+f:c==d+"/"&&(g=c);g&&this.$$parse(g);return!!g}}function Tb(b,a){var c=Rb(b);xc(b,this,b);this.$$parse=function(d){var e=ta(b,d)||ta(c,d),e="#"==e.charAt(0)?ta(a,e):this.$$html5?
e:"";if(!G(e))throw Sb("ihshprfx",d,a);yc(e,this,b);d=this.$$path;var f=/^\/[A-Z]:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));f.exec(e)||(d=(e=f.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Cb(this.$$search),e=this.$$hash?"#"+mb(this.$$hash):"";this.$$url=Qb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$parseLinkUrl=function(a,c){return Ga(b)==Ga(a)?(this.$$parse(a),!0):!1}}function Bc(b,a){this.$$html5=!0;Tb.apply(this,arguments);
var c=Rb(b);this.$$parseLinkUrl=function(d,e){var f,g;b==Ga(d)?f=d:(g=ta(c,d))?f=b+a+g:c===d+"/"&&(f=c);f&&this.$$parse(f);return!!f};this.$$compose=function(){var c=Cb(this.$$search),e=this.$$hash?"#"+mb(this.$$hash):"";this.$$url=Qb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+a+this.$$url}}function tb(b){return function(){return this[b]}}function Cc(b,a){return function(c){if(F(c))return this[b];this[b]=a(c);this.$$compose();return this}}function Wd(){var b="",a=!1;this.hashPrefix=function(a){return D(a)?
(b=a,this):b};this.html5Mode=function(b){return D(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,f){function g(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,k=d.baseHref(),l=d.url();a?(k=l.substring(0,l.indexOf("/",l.indexOf("//")+2))+(k||"/"),e=e.history?Ac:Bc):(k=Ga(l),e=Tb);h=new e(k,"#"+b);h.$$parseLinkUrl(l,l);var m=/^\s*(javascript|mailto):/i;f.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var b=A(a.target);"a"!==
x(b[0].nodeName);)if(b[0]===f[0]||!(b=b.parent())[0])return;var e=b.prop("href"),g=b.attr("href")||b.attr("xlink:href");T(e)&&"[object SVGAnimatedString]"===e.toString()&&(e=xa(e.animVal).href);m.test(e)||(!e||(b.attr("target")||a.isDefaultPrevented())||!h.$$parseLinkUrl(e,g))||(a.preventDefault(),h.absUrl()!=d.url()&&(c.$apply(),W.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=l&&d.url(h.absUrl(),!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$evalAsync(function(){var b=h.absUrl();h.$$parse(a);
c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(h.$$parse(b),d.url(b)):g(b)}),c.$$phase||c.$digest())});var n=0;c.$watch(function(){var a=zc(d.url()),b=zc(h.absUrl()),e=h.$$replace;n&&a==b||(n++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a).defaultPrevented?h.$$parse(a):(d.url(h.absUrl(),e),g(a))}));h.$$replace=!1;return n});return h}]}function Xd(){var b=!0,a=this;this.debugEnabled=function(a){return D(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof
Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||v;a=!1;try{a=!!e.apply}catch(k){}return a?function(){var a=[];r(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,
arguments)}}()}}]}function ka(b,a){if("__defineGetter__"===b||"__defineSetter__"===b||"__lookupGetter__"===b||"__lookupSetter__"===b||"__proto__"===b)throw la("isecfld",a);return b}function ma(b,a){if(b){if(b.constructor===b)throw la("isecfn",a);if(b.document&&b.location&&b.alert&&b.setInterval)throw la("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw la("isecdom",a);if(b===Object)throw la("isecobj",a);}return b}function ub(b,a,c,d,e){ma(b,d);e=e||{};a=a.split(".");for(var f,
g=0;1<a.length;g++){f=ka(a.shift(),d);var h=ma(b[f],d);h||(h={},b[f]=h);b=h;b.then&&e.unwrapPromises&&(ya(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===u&&(b.$$v={}),b=b.$$v)}f=ka(a.shift(),d);ma(b[f],d);return b[f]=c}function Qa(b){return"constructor"==b}function Dc(b,a,c,d,e,f,g){ka(b,f);ka(a,f);ka(c,f);ka(d,f);ka(e,f);var h=function(a){return ma(a,f)},k=g.expensiveChecks,l=k||Qa(b)?h:ga,m=k||Qa(a)?h:ga,n=k||Qa(c)?h:ga,q=k||Qa(d)?h:ga,p=k||Qa(e)?h:ga;return g.unwrapPromises?
function(g,h){var k=h&&h.hasOwnProperty(b)?h:g,t;if(null==k)return k;(k=l(k[b]))&&k.then&&(ya(f),"$$v"in k||(t=k,t.$$v=u,t.then(function(a){t.$$v=l(a)})),k=l(k.$$v));if(!a)return k;if(null==k)return u;(k=m(k[a]))&&k.then&&(ya(f),"$$v"in k||(t=k,t.$$v=u,t.then(function(a){t.$$v=m(a)})),k=m(k.$$v));if(!c)return k;if(null==k)return u;(k=n(k[c]))&&k.then&&(ya(f),"$$v"in k||(t=k,t.$$v=u,t.then(function(a){t.$$v=n(a)})),k=n(k.$$v));if(!d)return k;if(null==k)return u;(k=q(k[d]))&&k.then&&(ya(f),"$$v"in k||
(t=k,t.$$v=u,t.then(function(a){t.$$v=q(a)})),k=q(k.$$v));if(!e)return k;if(null==k)return u;(k=p(k[e]))&&k.then&&(ya(f),"$$v"in k||(t=k,t.$$v=u,t.then(function(a){t.$$v=p(a)})),k=p(k.$$v));return k}:function(f,g){var h=g&&g.hasOwnProperty(b)?g:f;if(null==h)return h;h=l(h[b]);if(!a)return h;if(null==h)return u;h=m(h[a]);if(!c)return h;if(null==h)return u;h=n(h[c]);if(!d)return h;if(null==h)return u;h=q(h[d]);return e?null==h?u:h=p(h[e]):h}}function Be(b,a){return function(c,d){return b(c,d,ya,ma,
a)}}function Ec(b,a,c){var d=a.expensiveChecks,e=d?Ce:De;if(e.hasOwnProperty(b))return e[b];var f=b.split("."),g=f.length,h;if(a.csp)h=6>g?Dc(f[0],f[1],f[2],f[3],f[4],c,a):function(b,d){var e=0,h;do h=Dc(f[e++],f[e++],f[e++],f[e++],f[e++],c,a)(b,d),d=u,b=h;while(e<g);return h};else{var k="var p;\n";d&&(k+="s = eso(s, fe);\nl = eso(l, fe);\n");var l=d;r(f,function(b,e){ka(b,c);var f=(e?"s":'((l&&l.hasOwnProperty("'+b+'"))?l:s)')+'["'+b+'"]',g=d||Qa(b);g&&(f="eso("+f+", fe)",l=!0);k+="if(s == null) return undefined;\ns="+
f+";\n";a.unwrapPromises&&(k+='if (s && s.then) {\n pw("'+c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v='+(g?"eso(v)":"v")+";});\n}\n s="+(g?"eso(s.$$v)":"s.$$v")+"\n}\n")});k+="return s;";h=new Function("s","l","pw","eso","fe",k);h.toString=aa(k);if(l||a.unwrapPromises)h=Be(h,c)}"hasOwnProperty"!==b&&(e[b]=h);return h}function Yd(){var b={},a={},c={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0,expensiveChecks:!1};this.unwrapPromises=
function(a){return D(a)?(c.unwrapPromises=!!a,this):c.unwrapPromises};this.logPromiseWarnings=function(a){return D(a)?(c.logPromiseWarnings=a,this):c.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(d,e,f){c.csp=e.csp;var g={csp:c.csp,unwrapPromises:c.unwrapPromises,logPromiseWarnings:c.logPromiseWarnings,expensiveChecks:!0};ya=function(a){c.logPromiseWarnings&&!Fc.hasOwnProperty(a)&&(Fc[a]=!0,f.warn("[$parse] Promise found in the expression `"+a+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};
return function(e,f){var l;switch(typeof e){case "string":var m=f?a:b;if(m.hasOwnProperty(e))return m[e];l=f?g:c;var n=new Ub(l);l=(new gb(n,d,l)).parse(e);"hasOwnProperty"!==e&&(m[e]=l);return l;case "function":return e;default:return v}}}]}function $d(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return Ee(function(a){b.$evalAsync(a)},a)}]}function Ee(b,a){function c(a){return a}function d(a){return g(a)}var e=function(){var g=[],l,m;return m={resolve:function(a){if(g){var c=g;g=u;
l=f(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],l.then(a[0],a[1],a[2])})}},reject:function(a){m.resolve(h(a))},notify:function(a){if(g){var c=g;g.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,f,h){var m=e(),J=function(d){try{m.resolve((N(b)?b:c)(d))}catch(e){m.reject(e),a(e)}},w=function(b){try{m.resolve((N(f)?f:d)(b))}catch(c){m.reject(c),a(c)}},t=function(b){try{m.notify((N(h)?h:c)(b))}catch(d){a(d)}};g?g.push([J,w,t]):l.then(J,
w,t);return m.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,f){var g=null;try{g=(a||c)()}catch(h){return b(h,!1)}return g&&N(g.then)?g.then(function(){return b(e,f)},function(a){return b(a,!1)}):b(e,f)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},f=function(a){return a&&N(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},
g=function(a){var b=e();b.reject(a);return b.promise},h=function(c){return{then:function(f,g){var h=e();b(function(){try{h.resolve((N(g)?g:d)(c))}catch(b){h.reject(b),a(b)}});return h.promise}}};return{defer:e,reject:g,when:function(h,l,m,n){var q=e(),p,s=function(b){try{return(N(l)?l:c)(b)}catch(d){return a(d),g(d)}},J=function(b){try{return(N(m)?m:d)(b)}catch(c){return a(c),g(c)}},w=function(b){try{return(N(n)?n:c)(b)}catch(d){a(d)}};b(function(){f(h).then(function(a){p||(p=!0,q.resolve(f(a).then(s,
J,w)))},function(a){p||(p=!0,q.resolve(J(a)))},function(a){p||q.notify(w(a))})});return q.promise},all:function(a){var b=e(),c=0,d=L(a)?[]:{};r(a,function(a,e){c++;f(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function ge(){this.$get=["$window","$timeout",function(b,a){var c=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame,d=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||
b.mozCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,e=!!c,f=e?function(a){var b=c(a);return function(){d(b)}}:function(b){var c=a(b,16.66,!1);return function(){a.cancel(c)}};f.supported=e;return f}]}function Zd(){var b=10,a=z("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,f,g){function h(){this.$id=ib();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=
this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings={}}function k(b){if(q.$$phase)throw a("inprog",q.$$phase);q.$$phase=b}function l(a,b){var c=f(a);Ya(c,b);return c}function m(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}h.prototype={constructor:h,$new:function(a){a?(a=new h,
a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(this.$$childScopeClass||(this.$$childScopeClass=function(){this.$$watchers=this.$$nextSibling=this.$$childHead=this.$$childTail=null;this.$$listeners={};this.$$listenerCount={};this.$id=ib();this.$$childScopeClass=null},this.$$childScopeClass.prototype=this),a=new this.$$childScopeClass);a["this"]=a;a.$parent=this;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=
a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=l(a,"watch"),f=this.$$watchers,g={fn:b,last:n,get:e,exp:a,eq:!!d};c=null;if(!N(b)){var h=l(b||v,"listener");g.fn=function(a,b,c){h(c)}}if("string"==typeof a&&e.constant){var k=g.fn;g.fn=function(a,b,c){k.call(this,a,b,c);Ua(f,g)}}f||(f=this.$$watchers=[]);f.unshift(g);return function(){Ua(f,g);c=null}},$watchCollection:function(a,b){var c=this,d,e,g,h=1<b.length,k=0,l=f(a),m=[],n={},q=!0,r=0;return this.$watch(function(){d=
l(c);var a,b,f;if(T(d))if(Sa(d))for(e!==m&&(e=m,r=e.length=0,k++),a=d.length,r!==a&&(k++,e.length=r=a),b=0;b<a;b++)f=e[b]!==e[b]&&d[b]!==d[b],f||e[b]===d[b]||(k++,e[b]=d[b]);else{e!==n&&(e=n={},r=0,k++);a=0;for(b in d)d.hasOwnProperty(b)&&(a++,e.hasOwnProperty(b)?(f=e[b]!==e[b]&&d[b]!==d[b],f||e[b]===d[b]||(k++,e[b]=d[b])):(r++,e[b]=d[b],k++));if(r>a)for(b in k++,e)e.hasOwnProperty(b)&&!d.hasOwnProperty(b)&&(r--,delete e[b])}else e!==d&&(e=d,k++);return k},function(){q?(q=!1,b(d,d,c)):b(d,g,c);if(h)if(T(d))if(Sa(d)){g=
Array(d.length);for(var a=0;a<d.length;a++)g[a]=d[a]}else for(a in g={},d)lb.call(d,a)&&(g[a]=d[a]);else g=d})},$digest:function(){var d,f,h,l,m=this.$$asyncQueue,r=this.$$postDigestQueue,K,B,u=b,O,M=[],A,P,C;k("$digest");g.$$checkUrlChange();c=null;do{B=!1;for(O=this;m.length;){try{C=m.shift(),C.scope.$eval(C.expression)}catch(I){q.$$phase=null,e(I)}c=null}a:do{if(l=O.$$watchers)for(K=l.length;K--;)try{if(d=l[K])if((f=d.get(O))!==(h=d.last)&&!(d.eq?Ca(f,h):"number"===typeof f&&"number"===typeof h&&
isNaN(f)&&isNaN(h)))B=!0,c=d,d.last=d.eq?Ka(f,null):f,d.fn(f,h===n?f:h,O),5>u&&(A=4-u,M[A]||(M[A]=[]),P=N(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,P+="; newVal: "+oa(f)+"; oldVal: "+oa(h),M[A].push(P));else if(d===c){B=!1;break a}}catch(D){q.$$phase=null,e(D)}if(!(l=O.$$childHead||O!==this&&O.$$nextSibling))for(;O!==this&&!(l=O.$$nextSibling);)O=O.$parent}while(O=l);if((B||m.length)&&!u--)throw q.$$phase=null,a("infdig",b,oa(M));}while(B||m.length);for(q.$$phase=null;r.length;)try{r.shift()()}catch(x){e(x)}},
$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==q&&(r(this.$$listenerCount,Bb(null,m,this)),a.$$childHead==this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=
this.$root=null,this.$$listeners={},this.$$watchers=this.$$asyncQueue=this.$$postDigestQueue=[],this.$destroy=this.$digest=this.$apply=v,this.$on=this.$watch=function(){return v})}},$eval:function(a,b){return f(a)(this,b)},$evalAsync:function(a){q.$$phase||q.$$asyncQueue.length||g.defer(function(){q.$$asyncQueue.length&&q.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return k("$apply"),this.$eval(a)}catch(b){e(b)}finally{q.$$phase=
null;try{q.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){var d=Ta(c,b);-1!==d&&(c[d]=null,m(e,1,a))}},$emit:function(a,b){var c=[],d,f=this,g=!1,h={name:a,targetScope:f,stopPropagation:function(){g=!0},preventDefault:function(){h.defaultPrevented=!0},defaultPrevented:!1},k=[h].concat(wa.call(arguments,
1)),l,m;do{d=f.$$listeners[a]||c;h.currentScope=f;l=0;for(m=d.length;l<m;l++)if(d[l])try{d[l].apply(null,k)}catch(n){e(n)}else d.splice(l,1),l--,m--;if(g)break;f=f.$parent}while(f);return h},$broadcast:function(a,b){for(var c=this,d=this,f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},g=[f].concat(wa.call(arguments,1)),h,k;c=d;){f.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,g)}catch(l){e(l)}else d.splice(h,
1),h--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return f}};var q=new h;return q}]}function cd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*((https?|ftp|file):|data:image\/)/;this.aHrefSanitizationWhitelist=function(a){return D(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return D(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,f;if(!R||8<=R)if(f=xa(c).href,""!==f&&!f.match(e))return"unsafe:"+
f;return c}}}function Fe(b){if("self"===b)return b;if(G(b)){if(-1<b.indexOf("***"))throw za("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+b+"$")}if(kb(b))return RegExp("^"+b.source+"$");throw za("imatcher");}function Gc(b){var a=[];D(b)&&r(b,function(b){a.push(Fe(b))});return a}function be(){this.SCE_CONTEXTS=fa;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&
(b=Gc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=Gc(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw za("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var f=d(),g={};g[fa.HTML]=d(f);
g[fa.CSS]=d(f);g[fa.URL]=d(f);g[fa.JS]=d(f);g[fa.RESOURCE_URL]=d(g[fa.URL]);return{trustAs:function(a,b){var c=g.hasOwnProperty(a)?g[a]:null;if(!c)throw za("icontext",a,b);if(null===b||b===u||""===b)return b;if("string"!==typeof b)throw za("itype",a);return new c(b)},getTrusted:function(c,d){if(null===d||d===u||""===d)return d;var f=g.hasOwnProperty(c)?g[c]:null;if(f&&d instanceof f)return d.$$unwrapTrustedValue();if(c===fa.RESOURCE_URL){var f=xa(d.toString()),m,n,q=!1;m=0;for(n=b.length;m<n;m++)if("self"===
b[m]?Pb(f):b[m].exec(f.href)){q=!0;break}if(q)for(m=0,n=a.length;m<n;m++)if("self"===a[m]?Pb(f):a[m].exec(f.href)){q=!1;break}if(q)return d;throw za("insecurl",d.toString());}if(c===fa.HTML)return e(d);throw za("unsafe");},valueOf:function(a){return a instanceof f?a.$$unwrapTrustedValue():a}}}]}function ae(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw za("iequirks");var e=
ha(fa);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=ga);e.parseAs=function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,d(a,c))}};var f=e.parseAs,g=e.getTrusted,h=e.trustAs;r(fa,function(a,b){var c=x(b);e[ab("parse_as_"+c)]=function(b){return f(a,b)};e[ab("get_trusted_"+c)]=function(b){return g(a,b)};e[ab("trust_as_"+c)]=function(b){return h(a,b)}});
return e}]}function ce(){this.$get=["$window","$document",function(b,a){var c={},d=U((/android (\d+)/.exec(x((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),f=a[0]||{},g=f.documentMode,h,k=/^(Moz|webkit|O|ms)(?=[A-Z])/,l=f.body&&f.body.style,m=!1,n=!1;if(l){for(var q in l)if(m=k.exec(q)){h=m[0];h=h.substr(0,1).toUpperCase()+h.substr(1);break}h||(h="WebkitOpacity"in l&&"webkit");m=!!("transition"in l||h+"Transition"in l);n=!!("animation"in l||h+"Animation"in l);
!d||m&&n||(m=G(f.body.style.webkitTransition),n=G(f.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!g||7<g),hasEvent:function(a){if("input"==a&&9==R)return!1;if(F(c[a])){var b=f.createElement("div");c[a]="on"+a in b}return c[a]},csp:Za(),vendorPrefix:h,transitions:m,animations:n,android:d,msie:R,msieDocumentMode:g}}]}function ee(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,h,k){var l=
c.defer(),m=l.promise,n=D(k)&&!k;h=a.defer(function(){try{l.resolve(e())}catch(a){l.reject(a),d(a)}finally{delete f[m.$$timeoutId]}n||b.$apply()},h);m.$$timeoutId=h;f[h]=l;return m}var f={};e.cancel=function(b){return b&&b.$$timeoutId in f?(f[b.$$timeoutId].reject("canceled"),delete f[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function xa(b,a){var c=b;R&&(Y.setAttribute("href",c),c=Y.href);Y.setAttribute("href",c);return{href:Y.href,protocol:Y.protocol?Y.protocol.replace(/:$/,""):
"",host:Y.host,search:Y.search?Y.search.replace(/^\?/,""):"",hash:Y.hash?Y.hash.replace(/^#/,""):"",hostname:Y.hostname,port:Y.port,pathname:"/"===Y.pathname.charAt(0)?Y.pathname:"/"+Y.pathname}}function Pb(b){b=G(b)?xa(b):b;return b.protocol===Hc.protocol&&b.host===Hc.host}function fe(){this.$get=aa(W)}function kc(b){function a(d,e){if(T(d)){var f={};r(d,function(b,c){f[c]=a(c,b)});return f}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+
c)}}];a("currency",Ic);a("date",Jc);a("filter",Ge);a("json",He);a("limitTo",Ie);a("lowercase",Je);a("number",Kc);a("orderBy",Lc);a("uppercase",Ke)}function Ge(){return function(b,a,c){if(!L(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Xa.equals(a,b)}:function(a,b){if(a&&b&&"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&lb.call(a,d)&&c(a[d],b[d]))return!0;
return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var f=function(a,b){if("string"===typeof b&&"!"===b.charAt(0))return!f(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&f(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(f(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a=
{$:a};case "object":for(var g in a)(function(b){"undefined"!==typeof a[b]&&e.push(function(c){return f("$"==b?c:c&&c[b],a[b])})})(g);break;case "function":e.push(a);break;default:return b}d=[];for(g=0;g<b.length;g++){var h=b[g];e.check(h)&&d.push(h)}return d}}function Ic(b){var a=b.NUMBER_FORMATS;return function(b,d){F(d)&&(d=a.CURRENCY_SYM);return Mc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Kc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Mc(b,a.PATTERNS[0],
a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Mc(b,a,c,d,e){if(null==b||!isFinite(b)||T(b))return"";var f=0>b;b=Math.abs(b);var g=b+"",h="",k=[],l=!1;if(-1!==g.indexOf("e")){var m=g.match(/([\d\.]+)e(-?)(\d+)/);m&&"-"==m[2]&&m[3]>e+1?(g="0",b=0):(h=g,l=!0)}if(l)0<e&&(-1<b&&1>b)&&(h=b.toFixed(e));else{g=(g.split(Nc)[1]||"").length;F(e)&&(e=Math.min(Math.max(a.minFrac,g),a.maxFrac));b=+(Math.round(+(b.toString()+"e"+e)).toString()+"e"+-e);0===b&&(f=!1);b=(""+b).split(Nc);g=b[0];b=b[1]||"";var m=0,n=a.lgSize,
q=a.gSize;if(g.length>=n+q)for(m=g.length-n,l=0;l<m;l++)0===(m-l)%q&&0!==l&&(h+=c),h+=g.charAt(l);for(l=m;l<g.length;l++)0===(g.length-l)%n&&0!==l&&(h+=c),h+=g.charAt(l);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,e))}k.push(f?a.negPre:a.posPre);k.push(h);k.push(f?a.negSuf:a.posSuf);return k.join("")}function Vb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function Z(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=
c;0===e&&-12==c&&(e=12);return Vb(e,a,d)}}function vb(b,a){return function(c,d){var e=c["get"+b](),f=La(a?"SHORT"+b:b);return d[f][e]}}function Jc(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var f=0,g=0,h=b[8]?a.setUTCFullYear:a.setFullYear,k=b[8]?a.setUTCHours:a.setHours;b[9]&&(f=U(b[9]+b[10]),g=U(b[9]+b[11]));h.call(a,U(b[1]),U(b[2])-1,U(b[3]));f=U(b[4]||0)-f;g=U(b[5]||0)-g;h=U(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));k.call(a,f,g,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
return function(c,e){var f="",g=[],h,k;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;G(c)&&(c=Le.test(c)?U(c):a(c));jb(c)&&(c=new Date(c));if(!va(c))return c;for(;e;)(k=Me.exec(e))?(g=g.concat(wa.call(k,1)),e=g.pop()):(g.push(e),e=null);r(g,function(a){h=Ne[a];f+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return f}}function He(){return function(b){return oa(b,!0)}}function Ie(){return function(b,a){return L(b)||G(b)?(a=Infinity===Math.abs(Number(a))?Number(a):U(a))?0<a?
b.slice(0,a):b.slice(a):G(b)?"":[]:b}}function Lc(b){return function(a,c,d){function e(a,b){return Wa(b)?function(b,c){return a(c,b)}:a}function f(a,b){var c=typeof a,d=typeof b;return c==d?(va(a)&&va(b)&&(a=a.valueOf(),b=b.valueOf()),"string"==c&&(a=a.toLowerCase(),b=b.toLowerCase()),a===b?0:a<b?-1:1):c<d?-1:1}if(!Sa(a))return a;c=L(c)?c:[c];0===c.length&&(c=["+"]);c=Vc(c,function(a){var c=!1,d=a||ga;if(G(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);if(""===a)return e(function(a,
b){return f(a,b)},c);d=b(a);if(d.constant){var l=d();return e(function(a,b){return f(a[l],b[l])},c)}}return e(function(a,b){return f(d(a),d(b))},c)});return wa.call(a).sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function Aa(b){N(b)&&(b={link:b});b.restrict=b.restrict||"AC";return aa(b)}function Oc(b,a,c,d){function e(a,c){c=c?"-"+nb(c,"-"):"";d.setClass(b,(a?wb:xb)+c,(a?xb:wb)+c)}var f=this,g=b.parent().controller("form")||yb,h=0,k=f.$error={},
l=[];f.$name=a.name||a.ngForm;f.$dirty=!1;f.$pristine=!0;f.$valid=!0;f.$invalid=!1;g.$addControl(f);b.addClass(Ra);e(!0);f.$addControl=function(a){Ea(a.$name,"input");l.push(a);a.$name&&(f[a.$name]=a)};f.$removeControl=function(a){a.$name&&f[a.$name]===a&&delete f[a.$name];r(k,function(b,c){f.$setValidity(c,!0,a)});Ua(l,a)};f.$setValidity=function(a,b,c){var d=k[a];if(b)d&&(Ua(d,c),d.length||(h--,h||(e(b),f.$valid=!0,f.$invalid=!1),k[a]=!1,e(!0,a),g.$setValidity(a,!0,f)));else{h||e(b);if(d){if(-1!=
Ta(d,c))return}else k[a]=d=[],h++,e(!1,a),g.$setValidity(a,!1,f);d.push(c);f.$valid=!1;f.$invalid=!0}};f.$setDirty=function(){d.removeClass(b,Ra);d.addClass(b,zb);f.$dirty=!0;f.$pristine=!1;g.$setDirty()};f.$setPristine=function(){d.removeClass(b,zb);d.addClass(b,Ra);f.$dirty=!1;f.$pristine=!0;r(l,function(a){a.$setPristine()})}}function ua(b,a,c,d){b.$setValidity(a,c);return c?d:u}function Pc(b,a){var c,d;if(a)for(c=0;c<a.length;++c)if(d=a[c],b[d])return!0;return!1}function Oe(b,a,c,d,e){T(e)&&(b.$$hasNativeValidators=
!0,b.$parsers.push(function(f){if(b.$error[a]||Pc(e,d)||!Pc(e,c))return f;b.$setValidity(a,!1)}))}function Ab(b,a,c,d,e,f){var g=a.prop(Pe),h=a[0].placeholder,k={},l=x(a[0].type);d.$$validityState=g;if(!e.android){var m=!1;a.on("compositionstart",function(a){m=!0});a.on("compositionend",function(){m=!1;n()})}var n=function(e){if(!m){var f=a.val();if(R&&"input"===(e||k).type&&a[0].placeholder!==h)h=a[0].placeholder;else if("password"!==l&&Wa(c.ngTrim||"T")&&(f=$(f)),e=g&&d.$$hasNativeValidators,d.$viewValue!==
f||""===f&&e)b.$root.$$phase?d.$setViewValue(f):b.$apply(function(){d.$setViewValue(f)})}};if(e.hasEvent("input"))a.on("input",n);else{var q,p=function(){q||(q=f.defer(function(){n();q=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||p()});if(e.hasEvent("paste"))a.on("paste cut",p)}a.on("change",n);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var s=c.ngPattern;s&&((e=s.match(/^\/(.*)\/([gim]*)$/))?(s=RegExp(e[1],e[2]),e=function(a){return ua(d,
"pattern",d.$isEmpty(a)||s.test(a),a)}):e=function(c){var e=b.$eval(s);if(!e||!e.test)throw z("ngPattern")("noregexp",s,e,ia(a));return ua(d,"pattern",d.$isEmpty(c)||e.test(c),c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var r=U(c.ngMinlength);e=function(a){return ua(d,"minlength",d.$isEmpty(a)||a.length>=r,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var w=U(c.ngMaxlength);e=function(a){return ua(d,"maxlength",d.$isEmpty(a)||a.length<=w,a)};d.$parsers.push(e);
d.$formatters.push(e)}}function Wb(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=[],d=0;a:for(;d<a.length;d++){for(var e=a[d],m=0;m<b.length;m++)if(e==b[m])continue a;c.push(e)}return c}function e(a){if(!L(a)){if(G(a))return a.split(" ");if(T(a)){var b=[];r(a,function(a,c){a&&(b=b.concat(c.split(" ")))});return b}}return a}return{restrict:"AC",link:function(f,g,h){function k(a,b){var c=g.data("$classCounts")||{},d=[];r(a,function(a){if(0<b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<
b)&&d.push(a)});g.data("$classCounts",c);return d.join(" ")}function l(b){if(!0===a||f.$index%2===a){var l=e(b||[]);if(!m){var p=k(l,1);h.$addClass(p)}else if(!Ca(b,m)){var s=e(m),p=d(l,s),l=d(s,l),l=k(l,-1),p=k(p,1);0===p.length?c.removeClass(g,l):0===l.length?c.addClass(g,p):c.setClass(g,p,l)}}m=ha(b)}var m;f.$watch(h[b],l,!0);h.$observe("class",function(a){l(f.$eval(h[b]))});"ngClass"!==b&&f.$watch("$index",function(c,d){var g=c&1;if(g!==(d&1)){var l=e(f.$eval(h[b]));g===a?(g=k(l,1),h.$addClass(g)):
(g=k(l,-1),h.$removeClass(g))}})}}}]}var Pe="validity",x=function(b){return G(b)?b.toLowerCase():b},lb=Object.prototype.hasOwnProperty,La=function(b){return G(b)?b.toUpperCase():b},R,A,Fa,wa=[].slice,Qe=[].push,Ba=Object.prototype.toString,Va=z("ng"),Xa=W.angular||(W.angular={}),$a,Pa,na=["0","0","0"];R=U((/msie (\d+)/.exec(x(navigator.userAgent))||[])[1]);isNaN(R)&&(R=U((/trident\/.*; rv:(\d+)/.exec(x(navigator.userAgent))||[])[1]));v.$inject=[];ga.$inject=[];var L=function(){return N(Array.isArray)?
Array.isArray:function(b){return"[object Array]"===Ba.call(b)}}(),$=function(){return String.prototype.trim?function(b){return G(b)?b.trim():b}:function(b){return G(b)?b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();Pa=9>R?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?La(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var Za=function(){if(D(Za.isActive_))return Za.isActive_;var b=!(!X.querySelector("[ng-csp]")&&!X.querySelector("[data-ng-csp]"));
if(!b)try{new Function("")}catch(a){b=!0}return Za.isActive_=b},Yc=/[A-Z]/g,ad={full:"1.2.29-build.592+sha.b041b66",major:1,minor:2,dot:29,codeName:"snapshot"};S.expando="ng339";var cb=S.cache={},ne=1,sb=W.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},bb=W.document.removeEventListener?function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)};S._data=function(b){return this.cache[b[this.expando]]||{}};var ie=
/([\:\-\_]+(.))/g,je=/^moz([A-Z])/,Hb=z("jqLite"),ke=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Ib=/<|&#?\w+;/,le=/<([\w:]+)/,me=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,da={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};da.optgroup=da.option;da.tbody=da.tfoot=da.colgroup=da.caption=
da.thead;da.th=da.td;var Oa=S.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===X.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),S(W).on("load",a))},toString:function(){var b=[];r(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?A(this[b]):A(this[this.length+b])},length:0,push:Qe,sort:[].sort,splice:[].splice},rb={};r("multiple selected checked disabled readOnly required open".split(" "),function(b){rb[x(b)]=b});var pc={};
r("input select option textarea button form details".split(" "),function(b){pc[La(b)]=!0});r({data:Mb,removeData:Lb},function(b,a){S[a]=b});r({data:Mb,inheritedData:qb,scope:function(b){return A.data(b,"$scope")||qb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return A.data(b,"$isolateScope")||A.data(b,"$isolateScopeNoTemplate")},controller:mc,injector:function(b){return qb(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Nb,css:function(b,a,c){a=ab(a);
if(D(c))b.style[a]=c;else{var d;8>=R&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=R&&(d=""===d?u:d);return d}},attr:function(b,a,c){var d=x(a);if(rb[d])if(D(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||v).specified?d:u;else if(D(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?u:b},prop:function(b,a,c){if(D(c))b[a]=c;else return b[a]},text:function(){function b(b,
d){var e=a[b.nodeType];if(F(d))return e?b[e]:"";b[e]=d}var a=[];9>R?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(F(a)){if("SELECT"===Pa(b)&&b.multiple){var c=[];r(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(F(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)Ma(d[c]);b.innerHTML=a},empty:nc},function(b,a){S.prototype[a]=function(a,d){var e,
f,g=this.length;if(b!==nc&&(2==b.length&&b!==Nb&&b!==mc?a:d)===u){if(T(a)){for(e=0;e<g;e++)if(b===Mb)b(this[e],a);else for(f in a)b(this[e],f,a[f]);return this}e=b.$dv;g=e===u?Math.min(g,1):g;for(f=0;f<g;f++){var h=b(this[f],a,d);e=e?e+h:h}return e}for(e=0;e<g;e++)b(this[e],a,d);return this}});r({removeData:Lb,dealoc:Ma,on:function a(c,d,e,f){if(D(f))throw Hb("onargs");var g=pa(c,"events"),h=pa(c,"handle");g||pa(c,"events",g={});h||pa(c,"handle",h=oe(c,g));r(d.split(" "),function(d){var f=g[d];if(!f){if("mouseenter"==
d||"mouseleave"==d){var m=X.body.contains||X.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};g[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;c&&(c===this||m(this,c))||h(a,d)})}else sb(c,d,h),g[d]=[];f=g[d]}f.push(e)})},
off:lc,one:function(a,c,d){a=A(a);a.on(c,function f(){a.off(c,d);a.off(c,f)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Ma(a);r(new S(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];r(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,c){r(new S(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,
c){if(1===a.nodeType){var d=a.firstChild;r(new S(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=A(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ma(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;r(new S(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:pb,removeClass:ob,toggleClass:function(a,c,d){c&&r(c.split(" "),function(c){var f=d;F(f)&&(f=!Nb(a,c));(f?pb:ob)(a,c)})},parent:function(a){return(a=
a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Kb,triggerHandler:function(a,c,d){var e,f;e=c.type||c;var g=(pa(a,"events")||{})[e];g&&(e={preventDefault:function(){this.defaultPrevented=!0},isDefaultPrevented:function(){return!0===this.defaultPrevented},stopPropagation:v,type:e,target:a},
c.type&&(e=E(e,c)),c=ha(g),f=d?[e].concat(d):[e],r(c,function(c){c.apply(a,f)}))}},function(a,c){S.prototype[c]=function(c,e,f){for(var g,h=0;h<this.length;h++)F(g)?(g=a(this[h],c,e,f),D(g)&&(g=A(g))):Jb(g,a(this[h],c,e,f));return D(g)?g:this};S.prototype.bind=S.prototype.on;S.prototype.unbind=S.prototype.off});db.prototype={put:function(a,c){this[Na(a,this.nextUid)]=c},get:function(a){return this[Na(a,this.nextUid)]},remove:function(a){var c=this[a=Na(a,this.nextUid)];delete this[a];return c}};var qe=
/^function\s*[^\(]*\(\s*([^\)]*)\)/m,re=/,/,se=/^\s*(_?)(\S+?)\1\s*$/,pe=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,eb=z("$injector"),Re=z("$animate"),Md=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Re("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout","$$asyncCallback",
function(a,d){return{enter:function(a,c,g,h){g?g.after(a):(c&&c[0]||(c=g.parent()),c.append(a));h&&d(h)},leave:function(a,c){a.remove();c&&d(c)},move:function(a,c,d,h){this.enter(a,c,d,h)},addClass:function(a,c,g){c=G(c)?c:L(c)?c.join(" "):"";r(a,function(a){pb(a,c)});g&&d(g)},removeClass:function(a,c,g){c=G(c)?c:L(c)?c.join(" "):"";r(a,function(a){ob(a,c)});g&&d(g)},setClass:function(a,c,g,h){r(a,function(a){pb(a,c);ob(a,g)});h&&d(h)},enabled:v}}]}],ja=z("$compile");gc.$inject=["$provide","$$sanitizeUriProvider"];
var xe=/^(x[\:\-_]|data[\:\-_])/i,wc=z("$interpolate"),Se=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,Ae={http:80,https:443,ftp:21},Sb=z("$location");Bc.prototype=Tb.prototype=Ac.prototype={$$html5:!1,$$replace:!1,absUrl:tb("$$absUrl"),url:function(a){if(F(a))return this.$$url;a=Se.exec(a);a[1]&&this.path(decodeURIComponent(a[1]));(a[2]||a[1])&&this.search(a[3]||"");this.hash(a[5]||"");return this},protocol:tb("$$protocol"),host:tb("$$host"),port:tb("$$port"),path:Cc("$$path",function(a){a=null!==a?a.toString():
"";return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(G(a)||jb(a))a=a.toString(),this.$$search=cc(a);else if(T(a))r(a,function(c,e){null==c&&delete a[e]}),this.$$search=a;else throw Sb("isrcharg");break;default:F(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:Cc("$$hash",function(a){return null!==a?a.toString():""}),replace:function(){this.$$replace=!0;return this}};var la=z("$parse"),Fc=
{},ya,Te=Function.prototype.call,Ue=Function.prototype.apply,Qc=Function.prototype.bind,hb={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:v,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return D(d)?D(e)?d+e:d:D(e)?e:u},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(D(d)?d:0)-(D(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^
e(a,c)},"=":v,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,
c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Ve={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Ub=function(a){this.options=a};Ub.prototype={constructor:Ub,lex:function(a){this.text=a;this.index=0;this.ch=u;this.lastCh=":";for(this.tokens=[];this.index<this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent();
else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch}),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{a=this.ch+this.peek();var c=a+this.peek(2),d=hb[this.ch],e=hb[a],f=hb[c];f?(this.tokens.push({index:this.index,text:c,fn:f}),this.index+=3):e?(this.tokens.push({index:this.index,text:a,fn:e}),this.index+=2):d?(this.tokens.push({index:this.index,text:this.ch,fn:d}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+
1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},
throwError:function(a,c,d){d=d||this.index;c=D(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw la("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=x(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-
1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,literal:!0,constant:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,f,g,h;this.index<this.text.length;){h=this.text.charAt(this.index);if("."===h||this.isIdent(h)||this.isNumber(h))"."===h&&(e=this.index),c+=h;else break;this.index++}if(e)for(f=this.index;f<this.text.length;){h=this.text.charAt(f);if("("===h){g=c.substr(e-d+1);c=c.substr(0,e-d);this.index=f;break}if(this.isWhitespace(h))f++;
else break}d={index:d,text:c};if(hb.hasOwnProperty(c))d.fn=hb[c],d.literal=!0,d.constant=!0;else{var k=Ec(c,this.options,this.text);d.fn=E(function(a,c){return k(a,c)},{assign:function(d,e){return ub(d,c,e,a.text,a.options)}})}this.tokens.push(d);g&&(this.tokens.push({index:e,text:"."}),this.tokens.push({index:e+1,text:g}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,f=!1;this.index<this.text.length;){var g=this.text.charAt(this.index),e=e+g;if(f)"u"===g?(f=this.text.substring(this.index+
1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d+=Ve[g]||g,f=!1;else if("\\"===g)f=!0;else{if(g===a){this.index++;this.tokens.push({index:c,text:e,string:d,literal:!0,constant:!0,fn:function(){return d}});return}d+=g}this.index++}this.throwError("Unterminated quote",c)}};var gb=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};gb.ZERO=E(function(){return 0},{constant:!0});gb.prototype={constructor:gb,
parse:function(a){this.text=a;this.tokens=this.lexer.lex(a);a=this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);a.literal=!!a.literal;a.constant=!!a.constant;return a},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);a.literal=!!c.literal;a.constant=
!!c.constant}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw la("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw la("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var f=this.tokens[0],g=f.text;if(g===
a||g===c||g===d||g===e||!(a||c||d||e))return f}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return E(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return E(function(e,f){return a(e,f)?c(e,f):d(e,f)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return E(function(e,f){return c(e,
f,a,d)},{constant:a.constant&&d.constant})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,f=0;f<a.length;f++){var g=a[f];g&&(e=g(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());
else{var e=function(a,e,h){h=[h];for(var k=0;k<d.length;k++)h.push(d[k](a,e));return c.apply(a,h)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),function(d,f){return a.assign(d,c(d,f),f)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.assignment();
if(d=this.expect(":"))return this.ternaryFn(a,c,this.assignment());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},
relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(gb.ZERO,a.fn,
this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=Ec(d,this.options,this.text);return E(function(c,d,h){return e(h||a(c,d))},{assign:function(e,g,h){(h=a(e,h))||a.assign(e,h={});return ub(h,d,g,c.text,c.options)}})},objectIndex:function(a){var c=this,d=this.expression();this.consume("]");return E(function(e,f){var g=a(e,f),h=d(e,f),k;ka(h,c.text);if(!g)return u;(g=ma(g[h],c.text))&&(g.then&&c.options.unwrapPromises)&&
(k=g,"$$v"in g||(k.$$v=u,k.then(function(a){k.$$v=a})),g=g.$$v);return g},{assign:function(e,f,g){var h=ka(d(e,g),c.text);(g=ma(a(e,g),c.text))||a.assign(e,g={});return g[h]=f}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(f,g){for(var h=[],k=c?c(f,g):f,l=0;l<d.length;l++)h.push(ma(d[l](f,g),e.text));l=a(f,g,k)||v;ma(k,e.text);var m=e.text;if(l){if(l.constructor===l)throw la("isecfn",
m);if(l===Te||l===Ue||Qc&&l===Qc)throw la("isecff",m);}h=l.apply?l.apply(k,h):l(h[0],h[1],h[2],h[3],h[4]);return ma(h,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{if(this.peek("]"))break;var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return E(function(c,d){for(var g=[],h=0;h<a.length;h++)g.push(a[h](c,d));return g},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;
var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return E(function(c,d){for(var e={},k=0;k<a.length;k++){var l=a[k];e[l.key]=l.value(c,d)}return e},{literal:!0,constant:c})}};var De={},Ce={},za=z("$sce"),fa={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},Y=X.createElement("a"),Hc=xa(W.location.href,!0);kc.$inject=["$provide"];Ic.$inject=["$locale"];Kc.$inject=["$locale"];
var Nc=".",Ne={yyyy:Z("FullYear",4),yy:Z("FullYear",2,0,!0),y:Z("FullYear",1),MMMM:vb("Month"),MMM:vb("Month",!0),MM:Z("Month",2,1),M:Z("Month",1,1),dd:Z("Date",2),d:Z("Date",1),HH:Z("Hours",2),H:Z("Hours",1),hh:Z("Hours",2,-12),h:Z("Hours",1,-12),mm:Z("Minutes",2),m:Z("Minutes",1),ss:Z("Seconds",2),s:Z("Seconds",1),sss:Z("Milliseconds",3),EEEE:vb("Day"),EEE:vb("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Vb(Math[0<
a?"floor":"ceil"](a/60),2)+Vb(Math.abs(a%60),2))}},Me=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,Le=/^\-?\d+$/;Jc.$inject=["$locale"];var Je=aa(x),Ke=aa(La);Lc.$inject=["$parse"];var dd=aa({restrict:"E",compile:function(a,c){8>=R&&(c.href||c.name||c.$set("href",""),a.append(X.createComment("IE fix")));if(!c.href&&!c.xlinkHref&&!c.name)return function(a,c){var f="[object SVGAnimatedString]"===Ba.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(f)||
a.preventDefault()})}}}),Fb={};r(rb,function(a,c){if("multiple"!=a){var d=qa("ng-"+c);Fb[d]=function(){return{priority:100,link:function(a,f,g){a.$watch(g[d],function(a){g.$set(c,!!a)})}}}}});r(["src","srcset","href"],function(a){var c=qa("ng-"+a);Fb[c]=function(){return{priority:99,link:function(d,e,f){var g=a,h=a;"href"===a&&"[object SVGAnimatedString]"===Ba.call(e.prop("href"))&&(h="xlinkHref",f.$attr[h]="xlink:href",g=null);f.$observe(c,function(c){c?(f.$set(h,c),R&&g&&e.prop(g,f[h])):"href"===
a&&f.$set(h,null)})}}}});var yb={$addControl:v,$removeControl:v,$setValidity:v,$setDirty:v,$setPristine:v};Oc.$inject=["$element","$attrs","$scope","$animate"];var Rc=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:Oc,compile:function(){return{pre:function(a,e,f,g){if(!f.action){var h=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};sb(e[0],"submit",h);e.on("$destroy",function(){c(function(){bb(e[0],"submit",h)},0,!1)})}var k=e.parent().controller("form"),
l=f.name||f.ngForm;l&&ub(a,l,g,l);if(k)e.on("$destroy",function(){k.$removeControl(g);l&&ub(a,l,u,l);E(g,yb)})}}}}}]},ed=Rc(),rd=Rc(!0),We=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,Xe=/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,Ye=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Sc={text:Ab,number:function(a,c,d,e,f,g){Ab(a,c,d,e,f,g);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||Ye.test(a))return e.$setValidity("number",
!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return u});Oe(e,"number",Ze,null,e.$$validityState);e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);return ua(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return ua(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return ua(e,"number",e.$isEmpty(a)||
jb(a),a)})},url:function(a,c,d,e,f,g){Ab(a,c,d,e,f,g);a=function(a){return ua(e,"url",e.$isEmpty(a)||We.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,f,g){Ab(a,c,d,e,f,g);a=function(a){return ua(e,"email",e.$isEmpty(a)||Xe.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){F(d.name)&&c.attr("name",ib());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};
d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var f=d.ngTrueValue,g=d.ngFalseValue;G(f)||(f=!0);G(g)||(g=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==f};e.$formatters.push(function(a){return a===f});e.$parsers.push(function(a){return a?f:g})},hidden:v,button:v,submit:v,reset:v,file:v},Ze=["badInput"],hc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",
link:function(d,e,f,g){g&&(Sc[x(f.type)]||Sc.text)(d,e,f,g,c,a)}}}],wb="ng-valid",xb="ng-invalid",Ra="ng-pristine",zb="ng-dirty",$e=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate",function(a,c,d,e,f,g){function h(a,c){c=c?"-"+nb(c,"-"):"";g.removeClass(e,(a?xb:wb)+c);g.addClass(e,(a?wb:xb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=
d.name;var k=f(d.ngModel),l=k.assign;if(!l)throw z("ngModel")("nonassign",d.ngModel,ia(e));this.$render=v;this.$isEmpty=function(a){return F(a)||""===a||null===a||a!==a};var m=e.inheritedData("$formController")||yb,n=0,q=this.$error={};e.addClass(Ra);h(!0);this.$setValidity=function(a,c){q[a]!==!c&&(c?(q[a]&&n--,n||(h(!0),this.$valid=!0,this.$invalid=!1)):(h(!1),this.$invalid=!0,this.$valid=!1,n++),q[a]=!c,h(c,a),m.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=
!0;g.removeClass(e,zb);g.addClass(e,Ra)};this.$setViewValue=function(d){this.$viewValue=d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,g.removeClass(e,Ra),g.addClass(e,zb),m.$setDirty());r(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,l(a,d),r(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}}))};var p=this;a.$watch(function(){var c=k(a);if(p.$modelValue!==c){var d=p.$formatters,e=d.length;for(p.$modelValue=c;e--;)c=d[e](c);p.$viewValue!==c&&(p.$viewValue=
c,p.$render())}return c})}],Gd=function(){return{require:["ngModel","^?form"],controller:$e,link:function(a,c,d,e){var f=e[0],g=e[1]||yb;g.$addControl(f);a.$on("$destroy",function(){g.$removeControl(f)})}}},Id=aa({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),ic=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var f=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",
!0),a};e.$formatters.push(f);e.$parsers.unshift(f);d.$observe("required",function(){f(e.$viewValue)})}}}},Hd=function(){return{require:"ngModel",link:function(a,c,d,e){var f=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!F(a)){var c=[];a&&r(a.split(f),function(a){a&&c.push($(a))});return c}});e.$formatters.push(function(a){return L(a)?a.join(", "):u});e.$isEmpty=function(a){return!a||!a.length}}}},af=/^(true|false|\d+)$/,Jd=function(){return{priority:100,
compile:function(a,c){return af.test(c.ngValue)?function(a,c,f){f.$set("value",a.$eval(f.ngValue))}:function(a,c,f){a.$watch(f.ngValue,function(a){f.$set("value",a)})}}}},jd=Aa({compile:function(a){a.addClass("ng-binding");return function(a,d,e){d.data("$binding",e.ngBind);a.$watch(e.ngBind,function(a){d.text(a==u?"":a)})}}}),ld=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],
kd=["$sce","$parse",function(a,c){return{compile:function(d){d.addClass("ng-binding");return function(d,f,g){f.data("$binding",g.ngBindHtml);var h=c(g.ngBindHtml);d.$watch(function(){return(h(d)||"").toString()},function(c){f.html(a.getTrustedHtml(h(d))||"")})}}}}],md=Wb("",!0),od=Wb("Odd",0),nd=Wb("Even",1),pd=Aa({compile:function(a,c){c.$set("ngCloak",u);a.removeClass("ng-cloak")}}),qd=[function(){return{scope:!0,controller:"@",priority:500}}],jc={},bf={blur:!0,focus:!0};r("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),
function(a){var c=qa("ng-"+a);jc[c]=["$parse","$rootScope",function(d,e){return{compile:function(f,g){var h=d(g[c],!0);return function(c,d){d.on(a,function(d){var f=function(){h(c,{$event:d})};bf[a]&&e.$$phase?c.$evalAsync(f):c.$apply(f)})}}}}]});var td=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,f,g){var h,k,l;c.$watch(e.ngIf,function(f){Wa(f)?k||(k=c.$new(),g(k,function(c){c[c.length++]=X.createComment(" end ngIf: "+e.ngIf+
" ");h={clone:c};a.enter(c,d.parent(),d)})):(l&&(l.remove(),l=null),k&&(k.$destroy(),k=null),h&&(l=Eb(h.clone),a.leave(l,function(){l=null}),h=null))})}}}],ud=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,f){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Xa.noop,compile:function(g,h){var k=h.ngInclude||h.src,l=h.onload||"",m=h.autoscroll;return function(g,h,p,r,J){var w=0,t,y,u,B=function(){y&&(y.remove(),y=null);t&&(t.$destroy(),t=null);
u&&(e.leave(u,function(){y=null}),y=u,u=null)};g.$watch(f.parseAsResourceUrl(k),function(f){var k=function(){!D(m)||m&&!g.$eval(m)||d()},p=++w;f?(a.get(f,{cache:c}).success(function(a){if(p===w){var c=g.$new();r.template=a;a=J(c,function(a){B();e.enter(a,null,h,k)});t=c;u=a;t.$emit("$includeContentLoaded");g.$eval(l)}}).error(function(){p===w&&B()}),g.$emit("$includeContentRequested")):(B(),r.template=null)})}}}}],Kd=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",
link:function(c,d,e,f){d.html(f.template);a(d.contents())(c)}}}],vd=Aa({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),wd=Aa({terminal:!0,priority:1E3}),xd=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,f,g){var h=g.count,k=g.$attr.when&&f.attr(g.$attr.when),l=g.offset||0,m=e.$eval(k)||{},n={},q=c.startSymbol(),p=c.endSymbol(),s=/^when(Minus)?(.+)$/;r(g,function(a,c){s.test(c)&&(m[x(c.replace("when","").replace("Minus","-"))]=
f.attr(g.$attr[c]))});r(m,function(a,e){n[e]=c(a.replace(d,q+h+"-"+l+p))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in m||(c=a.pluralCat(c-l));return n[c](e,f,!0)},function(a){f.text(a)})}}}],yd=["$parse","$animate",function(a,c){var d=z("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,f,g,h,k){var l=g.ngRepeat,m=l.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,q,p,s,u,w,t={$id:Na};if(!m)throw d("iexp",
l);g=m[1];h=m[2];(m=m[3])?(n=a(m),q=function(a,c,d){w&&(t[w]=a);t[u]=c;t.$index=d;return n(e,t)}):(p=function(a,c){return Na(c)},s=function(a){return a});m=g.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!m)throw d("iidexp",g);u=m[3]||m[1];w=m[2];var y={};e.$watchCollection(h,function(a){var g,h,m=f[0],n,t={},D,C,I,x,G,v,z,F=[];if(Sa(a))v=a,G=q||p;else{G=q||s;v=[];for(I in a)a.hasOwnProperty(I)&&"$"!=I.charAt(0)&&v.push(I);v.sort()}D=v.length;h=F.length=v.length;for(g=0;g<h;g++)if(I=a===
v?g:v[g],x=a[I],n=G(I,x,g),Ea(n,"`track by` id"),y.hasOwnProperty(n))z=y[n],delete y[n],t[n]=z,F[g]=z;else{if(t.hasOwnProperty(n))throw r(F,function(a){a&&a.scope&&(y[a.id]=a)}),d("dupes",l,n,oa(x));F[g]={id:n};t[n]=!1}for(I in y)y.hasOwnProperty(I)&&(z=y[I],g=Eb(z.clone),c.leave(g),r(g,function(a){a.$$NG_REMOVED=!0}),z.scope.$destroy());g=0;for(h=v.length;g<h;g++){I=a===v?g:v[g];x=a[I];z=F[g];F[g-1]&&(m=F[g-1].clone[F[g-1].clone.length-1]);if(z.scope){C=z.scope;n=m;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);
z.clone[0]!=n&&c.move(Eb(z.clone),null,A(m));m=z.clone[z.clone.length-1]}else C=e.$new();C[u]=x;w&&(C[w]=I);C.$index=g;C.$first=0===g;C.$last=g===D-1;C.$middle=!(C.$first||C.$last);C.$odd=!(C.$even=0===(g&1));z.scope||k(C,function(a){a[a.length++]=X.createComment(" end ngRepeat: "+l+" ");c.enter(a,null,A(m));m=a;z.scope=C;z.clone=a;t[z.id]=z})}y=t})}}}],zd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Wa(c)?"removeClass":"addClass"](d,"ng-hide")})}}],sd=["$animate",
function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Wa(c)?"addClass":"removeClass"](d,"ng-hide")})}}],Ad=Aa(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&r(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Bd=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,f){var g=[],h=[],k=[],l=[];c.$watch(e.ngSwitch||e.on,function(d){var n,q;n=0;for(q=k.length;n<q;++n)k[n].remove();n=k.length=0;for(q=
l.length;n<q;++n){var p=h[n];l[n].$destroy();k[n]=p;a.leave(p,function(){k.splice(n,1)})}h.length=0;l.length=0;if(g=f.cases["!"+d]||f.cases["?"])c.$eval(e.change),r(g,function(d){var e=c.$new();l.push(e);d.transclude(e,function(c){var e=d.element;h.push(c);a.enter(c,e.parent(),e)})})})}}}],Cd=Aa({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:f,element:c})}}),Dd=
Aa({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:f,element:c})}}),Fd=Aa({link:function(a,c,d,e,f){if(!f)throw z("ngTransclude")("orphan",ia(c));f(function(a){c.empty();c.append(a)})}}),fd=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],cf=z("ngOptions"),Ed=aa({terminal:!0}),gd=["$compile","$parse",function(a,c){var d=
/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,e={$setViewValue:v};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var k=this,l={},m=e,n;k.databound=d.ngModel;k.init=function(a,c,d){m=a;n=d};k.addOption=function(c){Ea(c,'"option value"');l[c]=!0;m.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};
k.removeOption=function(a){this.hasOption(a)&&(delete l[a],m.$viewValue==a&&this.renderUnknownOption(a))};k.renderUnknownOption=function(c){c="? "+Na(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",!0)};k.hasOption=function(a){return l.hasOwnProperty(a)};c.$on("$destroy",function(){k.renderUnknownOption=v})}],link:function(e,g,h,k){function l(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(x.parent()&&x.remove(),c.val(a),""===a&&w.prop("selected",!0)):F(a)&&w?c.val(""):e.renderUnknownOption(a)};
c.on("change",function(){a.$apply(function(){x.parent()&&x.remove();d.$setViewValue(c.val())})})}function m(a,c,d){var e;d.$render=function(){var a=new db(d.$viewValue);r(c.find("option"),function(c){c.selected=D(a.get(c.value))})};a.$watch(function(){Ca(e,d.$viewValue)||(e=ha(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];r(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function h(){var a={"":[]},c=[""],d,k,
s,u,v;s=g.$modelValue;u=A(e)||[];var F=n?Xb(u):u,G,Q,C;Q={};C=!1;if(p)if(k=g.$modelValue,w&&L(k))for(C=new db([]),d={},v=0;v<k.length;v++)d[m]=k[v],C.put(w(e,d),k[v]);else C=new db(k);v=C;var E,K;for(C=0;G=F.length,C<G;C++){k=C;if(n){k=F[C];if("$"===k.charAt(0))continue;Q[n]=k}Q[m]=u[k];d=r(e,Q)||"";(k=a[d])||(k=a[d]=[],c.push(d));p?d=D(v.remove(w?w(e,Q):x(e,Q))):(w?(d={},d[m]=s,d=w(e,d)===w(e,Q)):d=s===x(e,Q),v=v||d);E=l(e,Q);E=D(E)?E:"";k.push({id:w?w(e,Q):n?F[C]:C,label:E,selected:d})}p||(z||null===
s?a[""].unshift({id:"",label:"",selected:!v}):v||a[""].unshift({id:"?",label:"",selected:!0}));Q=0;for(F=c.length;Q<F;Q++){d=c[Q];k=a[d];B.length<=Q?(s={element:y.clone().attr("label",d),label:k.label},u=[s],B.push(u),f.append(s.element)):(u=B[Q],s=u[0],s.label!=d&&s.element.attr("label",s.label=d));E=null;C=0;for(G=k.length;C<G;C++)d=k[C],(v=u[C+1])?(E=v.element,v.label!==d.label&&(E.text(v.label=d.label),E.prop("label",v.label)),v.id!==d.id&&E.val(v.id=d.id),E[0].selected!==d.selected&&(E.prop("selected",
v.selected=d.selected),R&&E.prop("selected",v.selected))):(""===d.id&&z?K=z:(K=t.clone()).val(d.id).prop("selected",d.selected).attr("selected",d.selected).prop("label",d.label).text(d.label),u.push({element:K,label:d.label,id:d.id,selected:d.selected}),q.addOption(d.label,K),E?E.after(K):s.element.append(K),E=K);for(C++;u.length>C;)d=u.pop(),q.removeOption(d.label),d.element.remove()}for(;B.length>Q;)B.pop()[0].element.remove()}var k;if(!(k=s.match(d)))throw cf("iexp",s,ia(f));var l=c(k[2]||k[1]),
m=k[4]||k[6],n=k[5],r=c(k[3]||""),x=c(k[2]?k[1]:m),A=c(k[7]),w=k[8]?c(k[8]):null,B=[[{element:f,label:""}]];z&&(a(z)(e),z.removeClass("ng-scope"),z.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=A(e)||[],d={},k,l,q,r,s,t,v;if(p)for(l=[],r=0,t=B.length;r<t;r++)for(a=B[r],q=1,s=a.length;q<s;q++){if((k=a[q].element)[0].selected){k=k.val();n&&(d[n]=k);if(w)for(v=0;v<c.length&&(d[m]=c[v],w(e,d)!=k);v++);else d[m]=c[k];l.push(x(e,d))}}else if(k=f.val(),"?"==k)l=u;else if(""===
k)l=null;else if(w)for(v=0;v<c.length;v++){if(d[m]=c[v],w(e,d)==k){l=x(e,d);break}}else d[m]=c[k],n&&(d[n]=k),l=x(e,d);g.$setViewValue(l);h()})});g.$render=h;e.$watchCollection(A,h);e.$watchCollection(function(){var a={},c=A(e);if(c){for(var d=Array(c.length),f=0,g=c.length;f<g;f++)a[m]=c[f],d[f]=l(e,a);return d}},h);p&&e.$watchCollection(function(){return g.$modelValue},h)}if(k[1]){var q=k[0];k=k[1];var p=h.multiple,s=h.ngOptions,z=!1,w,t=A(X.createElement("option")),y=A(X.createElement("optgroup")),
x=t.clone();h=0;for(var B=g.children(),v=B.length;h<v;h++)if(""===B[h].value){w=z=B.eq(h);break}q.init(k,z,x);p&&(k.$isEmpty=function(a){return!a||0===a.length});s?n(e,g,k):p?m(e,g,k):l(e,g,k,q)}}}}],id=["$interpolate",function(a){var c={addOption:v,removeOption:v};return{restrict:"E",priority:100,compile:function(d,e){if(F(e.value)){var f=a(d.text(),!0);f||e.$set("value",d.text())}return function(a,d,e){var l=d.parent(),m=l.data("$selectController")||l.parent().data("$selectController");m&&m.databound?
d.prop("selected",!1):m=c;f?a.$watch(f,function(a,c){e.$set("value",a);a!==c&&m.removeOption(c);m.addOption(a)}):m.addOption(e.value);d.on("$destroy",function(){m.removeOption(e.value)})}}}}],hd=aa({restrict:"E",terminal:!0});W.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):((Fa=W.jQuery)&&Fa.fn.on?(A=Fa,E(Fa.fn,{scope:Oa.scope,isolateScope:Oa.isolateScope,controller:Oa.controller,injector:Oa.injector,inheritedData:Oa.inheritedData}),Gb("remove",!0,!0,!1),Gb("empty",
!1,!1,!1),Gb("html",!1,!1,!0)):A=S,Xa.element=A,$c(Xa),A(X).ready(function(){Xc(X,dc)}))})(window,document);!window.angular.$$csp()&&window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}.ng-hide-add-active,.ng-hide-remove{display:block!important;}</style>');
//# sourceMappingURL=angular.min.js.map

/**
 * State-based routing for AngularJS
 * @version v0.2.13
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports="ui.router"),function(a,b,c){"use strict";function d(a,b){return M(new(M(function(){},{prototype:a})),b)}function e(a){return L(arguments,function(b){b!==a&&L(b,function(b,c){a.hasOwnProperty(c)||(a[c]=b)})}),a}function f(a,b){var c=[];for(var d in a.path){if(a.path[d]!==b.path[d])break;c.push(a.path[d])}return c}function g(a){if(Object.keys)return Object.keys(a);var c=[];return b.forEach(a,function(a,b){c.push(b)}),c}function h(a,b){if(Array.prototype.indexOf)return a.indexOf(b,Number(arguments[2])||0);var c=a.length>>>0,d=Number(arguments[2])||0;for(d=0>d?Math.ceil(d):Math.floor(d),0>d&&(d+=c);c>d;d++)if(d in a&&a[d]===b)return d;return-1}function i(a,b,c,d){var e,i=f(c,d),j={},k=[];for(var l in i)if(i[l].params&&(e=g(i[l].params),e.length))for(var m in e)h(k,e[m])>=0||(k.push(e[m]),j[e[m]]=a[e[m]]);return M({},j,b)}function j(a,b,c){if(!c){c=[];for(var d in a)c.push(d)}for(var e=0;e<c.length;e++){var f=c[e];if(a[f]!=b[f])return!1}return!0}function k(a,b){var c={};return L(a,function(a){c[a]=b[a]}),c}function l(a){var b={},c=Array.prototype.concat.apply(Array.prototype,Array.prototype.slice.call(arguments,1));for(var d in a)-1==h(c,d)&&(b[d]=a[d]);return b}function m(a,b){var c=K(a),d=c?[]:{};return L(a,function(a,e){b(a,e)&&(d[c?d.length:e]=a)}),d}function n(a,b){var c=K(a)?[]:{};return L(a,function(a,d){c[d]=b(a,d)}),c}function o(a,b){var d=1,f=2,i={},j=[],k=i,m=M(a.when(i),{$$promises:i,$$values:i});this.study=function(i){function n(a,c){if(s[c]!==f){if(r.push(c),s[c]===d)throw r.splice(0,h(r,c)),new Error("Cyclic dependency: "+r.join(" -> "));if(s[c]=d,I(a))q.push(c,[function(){return b.get(a)}],j);else{var e=b.annotate(a);L(e,function(a){a!==c&&i.hasOwnProperty(a)&&n(i[a],a)}),q.push(c,a,e)}r.pop(),s[c]=f}}function o(a){return J(a)&&a.then&&a.$$promises}if(!J(i))throw new Error("'invocables' must be an object");var p=g(i||{}),q=[],r=[],s={};return L(i,n),i=r=s=null,function(d,f,g){function h(){--u||(v||e(t,f.$$values),r.$$values=t,r.$$promises=r.$$promises||!0,delete r.$$inheritedValues,n.resolve(t))}function i(a){r.$$failure=a,n.reject(a)}function j(c,e,f){function j(a){l.reject(a),i(a)}function k(){if(!G(r.$$failure))try{l.resolve(b.invoke(e,g,t)),l.promise.then(function(a){t[c]=a,h()},j)}catch(a){j(a)}}var l=a.defer(),m=0;L(f,function(a){s.hasOwnProperty(a)&&!d.hasOwnProperty(a)&&(m++,s[a].then(function(b){t[a]=b,--m||k()},j))}),m||k(),s[c]=l.promise}if(o(d)&&g===c&&(g=f,f=d,d=null),d){if(!J(d))throw new Error("'locals' must be an object")}else d=k;if(f){if(!o(f))throw new Error("'parent' must be a promise returned by $resolve.resolve()")}else f=m;var n=a.defer(),r=n.promise,s=r.$$promises={},t=M({},d),u=1+q.length/3,v=!1;if(G(f.$$failure))return i(f.$$failure),r;f.$$inheritedValues&&e(t,l(f.$$inheritedValues,p)),M(s,f.$$promises),f.$$values?(v=e(t,l(f.$$values,p)),r.$$inheritedValues=l(f.$$values,p),h()):(f.$$inheritedValues&&(r.$$inheritedValues=l(f.$$inheritedValues,p)),f.then(h,i));for(var w=0,x=q.length;x>w;w+=3)d.hasOwnProperty(q[w])?h():j(q[w],q[w+1],q[w+2]);return r}},this.resolve=function(a,b,c,d){return this.study(a)(b,c,d)}}function p(a,b,c){this.fromConfig=function(a,b,c){return G(a.template)?this.fromString(a.template,b):G(a.templateUrl)?this.fromUrl(a.templateUrl,b):G(a.templateProvider)?this.fromProvider(a.templateProvider,b,c):null},this.fromString=function(a,b){return H(a)?a(b):a},this.fromUrl=function(c,d){return H(c)&&(c=c(d)),null==c?null:a.get(c,{cache:b,headers:{Accept:"text/html"}}).then(function(a){return a.data})},this.fromProvider=function(a,b,d){return c.invoke(a,null,d||{params:b})}}function q(a,b,e){function f(b,c,d,e){if(q.push(b),o[b])return o[b];if(!/^\w+(-+\w+)*(?:\[\])?$/.test(b))throw new Error("Invalid parameter name '"+b+"' in pattern '"+a+"'");if(p[b])throw new Error("Duplicate parameter name '"+b+"' in pattern '"+a+"'");return p[b]=new O.Param(b,c,d,e),p[b]}function g(a,b,c){var d=["",""],e=a.replace(/[\\\[\]\^$*+?.()|{}]/g,"\\$&");if(!b)return e;switch(c){case!1:d=["(",")"];break;case!0:d=["?(",")?"];break;default:d=["("+c+"|",")?"]}return e+d[0]+b+d[1]}function h(c,e){var f,g,h,i,j;return f=c[2]||c[3],j=b.params[f],h=a.substring(m,c.index),g=e?c[4]:c[4]||("*"==c[1]?".*":null),i=O.type(g||"string")||d(O.type("string"),{pattern:new RegExp(g)}),{id:f,regexp:g,segment:h,type:i,cfg:j}}b=M({params:{}},J(b)?b:{});var i,j=/([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,k=/([:]?)([\w\[\]-]+)|\{([\w\[\]-]+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,l="^",m=0,n=this.segments=[],o=e?e.params:{},p=this.params=e?e.params.$$new():new O.ParamSet,q=[];this.source=a;for(var r,s,t;(i=j.exec(a))&&(r=h(i,!1),!(r.segment.indexOf("?")>=0));)s=f(r.id,r.type,r.cfg,"path"),l+=g(r.segment,s.type.pattern.source,s.squash),n.push(r.segment),m=j.lastIndex;t=a.substring(m);var u=t.indexOf("?");if(u>=0){var v=this.sourceSearch=t.substring(u);if(t=t.substring(0,u),this.sourcePath=a.substring(0,m+u),v.length>0)for(m=0;i=k.exec(v);)r=h(i,!0),s=f(r.id,r.type,r.cfg,"search"),m=j.lastIndex}else this.sourcePath=a,this.sourceSearch="";l+=g(t)+(b.strict===!1?"/?":"")+"$",n.push(t),this.regexp=new RegExp(l,b.caseInsensitive?"i":c),this.prefix=n[0],this.$$paramNames=q}function r(a){M(this,a)}function s(){function a(a){return null!=a?a.toString().replace(/\//g,"%2F"):a}function e(a){return null!=a?a.toString().replace(/%2F/g,"/"):a}function f(a){return this.pattern.test(a)}function i(){return{strict:t,caseInsensitive:p}}function j(a){return H(a)||K(a)&&H(a[a.length-1])}function k(){for(;x.length;){var a=x.shift();if(a.pattern)throw new Error("You cannot override a type's .pattern at runtime.");b.extend(v[a.name],o.invoke(a.def))}}function l(a){M(this,a||{})}O=this;var o,p=!1,t=!0,u=!1,v={},w=!0,x=[],y={string:{encode:a,decode:e,is:f,pattern:/[^/]*/},"int":{encode:a,decode:function(a){return parseInt(a,10)},is:function(a){return G(a)&&this.decode(a.toString())===a},pattern:/\d+/},bool:{encode:function(a){return a?1:0},decode:function(a){return 0!==parseInt(a,10)},is:function(a){return a===!0||a===!1},pattern:/0|1/},date:{encode:function(a){return this.is(a)?[a.getFullYear(),("0"+(a.getMonth()+1)).slice(-2),("0"+a.getDate()).slice(-2)].join("-"):c},decode:function(a){if(this.is(a))return a;var b=this.capture.exec(a);return b?new Date(b[1],b[2]-1,b[3]):c},is:function(a){return a instanceof Date&&!isNaN(a.valueOf())},equals:function(a,b){return this.is(a)&&this.is(b)&&a.toISOString()===b.toISOString()},pattern:/[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,capture:/([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/},json:{encode:b.toJson,decode:b.fromJson,is:b.isObject,equals:b.equals,pattern:/[^/]*/},any:{encode:b.identity,decode:b.identity,is:b.identity,equals:b.equals,pattern:/.*/}};s.$$getDefaultValue=function(a){if(!j(a.value))return a.value;if(!o)throw new Error("Injectable functions cannot be called at configuration time");return o.invoke(a.value)},this.caseInsensitive=function(a){return G(a)&&(p=a),p},this.strictMode=function(a){return G(a)&&(t=a),t},this.defaultSquashPolicy=function(a){if(!G(a))return u;if(a!==!0&&a!==!1&&!I(a))throw new Error("Invalid squash policy: "+a+". Valid policies: false, true, arbitrary-string");return u=a,a},this.compile=function(a,b){return new q(a,M(i(),b))},this.isMatcher=function(a){if(!J(a))return!1;var b=!0;return L(q.prototype,function(c,d){H(c)&&(b=b&&G(a[d])&&H(a[d]))}),b},this.type=function(a,b,c){if(!G(b))return v[a];if(v.hasOwnProperty(a))throw new Error("A type named '"+a+"' has already been defined.");return v[a]=new r(M({name:a},b)),c&&(x.push({name:a,def:c}),w||k()),this},L(y,function(a,b){v[b]=new r(M({name:b},a))}),v=d(v,{}),this.$get=["$injector",function(a){return o=a,w=!1,k(),L(y,function(a,b){v[b]||(v[b]=new r(a))}),this}],this.Param=function(a,b,d,e){function f(a){var b=J(a)?g(a):[],c=-1===h(b,"value")&&-1===h(b,"type")&&-1===h(b,"squash")&&-1===h(b,"array");return c&&(a={value:a}),a.$$fn=j(a.value)?a.value:function(){return a.value},a}function i(b,c,d){if(b.type&&c)throw new Error("Param '"+a+"' has two type configurations.");return c?c:b.type?b.type instanceof r?b.type:new r(b.type):"config"===d?v.any:v.string}function k(){var b={array:"search"===e?"auto":!1},c=a.match(/\[\]$/)?{array:!0}:{};return M(b,c,d).array}function l(a,b){var c=a.squash;if(!b||c===!1)return!1;if(!G(c)||null==c)return u;if(c===!0||I(c))return c;throw new Error("Invalid squash policy: '"+c+"'. Valid policies: false, true, or arbitrary string")}function p(a,b,d,e){var f,g,i=[{from:"",to:d||b?c:""},{from:null,to:d||b?c:""}];return f=K(a.replace)?a.replace:[],I(e)&&f.push({from:e,to:c}),g=n(f,function(a){return a.from}),m(i,function(a){return-1===h(g,a.from)}).concat(f)}function q(){if(!o)throw new Error("Injectable functions cannot be called at configuration time");return o.invoke(d.$$fn)}function s(a){function b(a){return function(b){return b.from===a}}function c(a){var c=n(m(w.replace,b(a)),function(a){return a.to});return c.length?c[0]:a}return a=c(a),G(a)?w.type.decode(a):q()}function t(){return"{Param:"+a+" "+b+" squash: '"+z+"' optional: "+y+"}"}var w=this;d=f(d),b=i(d,b,e);var x=k();b=x?b.$asArray(x,"search"===e):b,"string"!==b.name||x||"path"!==e||d.value!==c||(d.value="");var y=d.value!==c,z=l(d,y),A=p(d,x,y,z);M(this,{id:a,type:b,location:e,array:x,squash:z,replace:A,isOptional:y,value:s,dynamic:c,config:d,toString:t})},l.prototype={$$new:function(){return d(this,M(new l,{$$parent:this}))},$$keys:function(){for(var a=[],b=[],c=this,d=g(l.prototype);c;)b.push(c),c=c.$$parent;return b.reverse(),L(b,function(b){L(g(b),function(b){-1===h(a,b)&&-1===h(d,b)&&a.push(b)})}),a},$$values:function(a){var b={},c=this;return L(c.$$keys(),function(d){b[d]=c[d].value(a&&a[d])}),b},$$equals:function(a,b){var c=!0,d=this;return L(d.$$keys(),function(e){var f=a&&a[e],g=b&&b[e];d[e].type.equals(f,g)||(c=!1)}),c},$$validates:function(a){var b,c,d,e=!0,f=this;return L(this.$$keys(),function(g){d=f[g],c=a[g],b=!c&&d.isOptional,e=e&&(b||!!d.type.is(c))}),e},$$parent:c},this.ParamSet=l}function t(a,d){function e(a){var b=/^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(a.source);return null!=b?b[1].replace(/\\(.)/g,"$1"):""}function f(a,b){return a.replace(/\$(\$|\d{1,2})/,function(a,c){return b["$"===c?0:Number(c)]})}function g(a,b,c){if(!c)return!1;var d=a.invoke(b,b,{$match:c});return G(d)?d:!0}function h(d,e,f,g){function h(a,b,c){return"/"===p?a:b?p.slice(0,-1)+a:c?p.slice(1)+a:a}function m(a){function b(a){var b=a(f,d);return b?(I(b)&&d.replace().url(b),!0):!1}if(!a||!a.defaultPrevented){var e=o&&d.url()===o;if(o=c,e)return!0;var g,h=j.length;for(g=0;h>g;g++)if(b(j[g]))return;k&&b(k)}}function n(){return i=i||e.$on("$locationChangeSuccess",m)}var o,p=g.baseHref(),q=d.url();return l||n(),{sync:function(){m()},listen:function(){return n()},update:function(a){return a?void(q=d.url()):void(d.url()!==q&&(d.url(q),d.replace()))},push:function(a,b,e){d.url(a.format(b||{})),o=e&&e.$$avoidResync?d.url():c,e&&e.replace&&d.replace()},href:function(c,e,f){if(!c.validates(e))return null;var g=a.html5Mode();b.isObject(g)&&(g=g.enabled);var i=c.format(e);if(f=f||{},g||null===i||(i="#"+a.hashPrefix()+i),i=h(i,g,f.absolute),!f.absolute||!i)return i;var j=!g&&i?"/":"",k=d.port();return k=80===k||443===k?"":":"+k,[d.protocol(),"://",d.host(),k,j,i].join("")}}}var i,j=[],k=null,l=!1;this.rule=function(a){if(!H(a))throw new Error("'rule' must be a function");return j.push(a),this},this.otherwise=function(a){if(I(a)){var b=a;a=function(){return b}}else if(!H(a))throw new Error("'rule' must be a function");return k=a,this},this.when=function(a,b){var c,h=I(b);if(I(a)&&(a=d.compile(a)),!h&&!H(b)&&!K(b))throw new Error("invalid 'handler' in when()");var i={matcher:function(a,b){return h&&(c=d.compile(b),b=["$match",function(a){return c.format(a)}]),M(function(c,d){return g(c,b,a.exec(d.path(),d.search()))},{prefix:I(a.prefix)?a.prefix:""})},regex:function(a,b){if(a.global||a.sticky)throw new Error("when() RegExp must not be global or sticky");return h&&(c=b,b=["$match",function(a){return f(c,a)}]),M(function(c,d){return g(c,b,a.exec(d.path()))},{prefix:e(a)})}},j={matcher:d.isMatcher(a),regex:a instanceof RegExp};for(var k in j)if(j[k])return this.rule(i[k](a,b));throw new Error("invalid 'what' in when()")},this.deferIntercept=function(a){a===c&&(a=!0),l=a},this.$get=h,h.$inject=["$location","$rootScope","$injector","$browser"]}function u(a,e){function f(a){return 0===a.indexOf(".")||0===a.indexOf("^")}function l(a,b){if(!a)return c;var d=I(a),e=d?a:a.name,g=f(e);if(g){if(!b)throw new Error("No reference point given for path '"+e+"'");b=l(b);for(var h=e.split("."),i=0,j=h.length,k=b;j>i;i++)if(""!==h[i]||0!==i){if("^"!==h[i])break;if(!k.parent)throw new Error("Path '"+e+"' not valid for state '"+b.name+"'");k=k.parent}else k=b;h=h.slice(i).join("."),e=k.name+(k.name&&h?".":"")+h}var m=y[e];return!m||!d&&(d||m!==a&&m.self!==a)?c:m}function m(a,b){z[a]||(z[a]=[]),z[a].push(b)}function o(a){for(var b=z[a]||[];b.length;)p(b.shift())}function p(b){b=d(b,{self:b,resolve:b.resolve||{},toString:function(){return this.name}});var c=b.name;if(!I(c)||c.indexOf("@")>=0)throw new Error("State must have a valid name");if(y.hasOwnProperty(c))throw new Error("State '"+c+"'' is already defined");var e=-1!==c.indexOf(".")?c.substring(0,c.lastIndexOf(".")):I(b.parent)?b.parent:J(b.parent)&&I(b.parent.name)?b.parent.name:"";if(e&&!y[e])return m(e,b.self);for(var f in B)H(B[f])&&(b[f]=B[f](b,B.$delegates[f]));return y[c]=b,!b[A]&&b.url&&a.when(b.url,["$match","$stateParams",function(a,c){x.$current.navigable==b&&j(a,c)||x.transitionTo(b,a,{inherit:!0,location:!1})}]),o(c),b}function q(a){return a.indexOf("*")>-1}function r(a){var b=a.split("."),c=x.$current.name.split(".");if("**"===b[0]&&(c=c.slice(h(c,b[1])),c.unshift("**")),"**"===b[b.length-1]&&(c.splice(h(c,b[b.length-2])+1,Number.MAX_VALUE),c.push("**")),b.length!=c.length)return!1;for(var d=0,e=b.length;e>d;d++)"*"===b[d]&&(c[d]="*");return c.join("")===b.join("")}function s(a,b){return I(a)&&!G(b)?B[a]:H(b)&&I(a)?(B[a]&&!B.$delegates[a]&&(B.$delegates[a]=B[a]),B[a]=b,this):this}function t(a,b){return J(a)?b=a:b.name=a,p(b),this}function u(a,e,f,h,m,o,p){function s(b,c,d,f){var g=a.$broadcast("$stateNotFound",b,c,d);if(g.defaultPrevented)return p.update(),B;if(!g.retry)return null;if(f.$retry)return p.update(),C;var h=x.transition=e.when(g.retry);return h.then(function(){return h!==x.transition?u:(b.options.$retry=!0,x.transitionTo(b.to,b.toParams,b.options))},function(){return B}),p.update(),h}function t(a,c,d,g,i,j){var l=d?c:k(a.params.$$keys(),c),n={$stateParams:l};i.resolve=m.resolve(a.resolve,n,i.resolve,a);var o=[i.resolve.then(function(a){i.globals=a})];return g&&o.push(g),L(a.views,function(c,d){var e=c.resolve&&c.resolve!==a.resolve?c.resolve:{};e.$template=[function(){return f.load(d,{view:c,locals:n,params:l,notify:j.notify})||""}],o.push(m.resolve(e,n,i.resolve,a).then(function(f){if(H(c.controllerProvider)||K(c.controllerProvider)){var g=b.extend({},e,n);f.$$controller=h.invoke(c.controllerProvider,null,g)}else f.$$controller=c.controller;f.$$state=a,f.$$controllerAs=c.controllerAs,i[d]=f}))}),e.all(o).then(function(){return i})}var u=e.reject(new Error("transition superseded")),z=e.reject(new Error("transition prevented")),B=e.reject(new Error("transition aborted")),C=e.reject(new Error("transition failed"));return w.locals={resolve:null,globals:{$stateParams:{}}},x={params:{},current:w.self,$current:w,transition:null},x.reload=function(){return x.transitionTo(x.current,o,{reload:!0,inherit:!1,notify:!0})},x.go=function(a,b,c){return x.transitionTo(a,b,M({inherit:!0,relative:x.$current},c))},x.transitionTo=function(b,c,f){c=c||{},f=M({location:!0,inherit:!1,relative:null,notify:!0,reload:!1,$retry:!1},f||{});var g,j=x.$current,m=x.params,n=j.path,q=l(b,f.relative);if(!G(q)){var r={to:b,toParams:c,options:f},y=s(r,j.self,m,f);if(y)return y;if(b=r.to,c=r.toParams,f=r.options,q=l(b,f.relative),!G(q)){if(!f.relative)throw new Error("No such state '"+b+"'");throw new Error("Could not resolve '"+b+"' from state '"+f.relative+"'")}}if(q[A])throw new Error("Cannot transition to abstract state '"+b+"'");if(f.inherit&&(c=i(o,c||{},x.$current,q)),!q.params.$$validates(c))return C;c=q.params.$$values(c),b=q;var B=b.path,D=0,E=B[D],F=w.locals,H=[];if(!f.reload)for(;E&&E===n[D]&&E.ownParams.$$equals(c,m);)F=H[D]=E.locals,D++,E=B[D];if(v(b,j,F,f))return b.self.reloadOnSearch!==!1&&p.update(),x.transition=null,e.when(x.current);if(c=k(b.params.$$keys(),c||{}),f.notify&&a.$broadcast("$stateChangeStart",b.self,c,j.self,m).defaultPrevented)return p.update(),z;for(var I=e.when(F),J=D;J<B.length;J++,E=B[J])F=H[J]=d(F),I=t(E,c,E===b,I,F,f);var K=x.transition=I.then(function(){var d,e,g;if(x.transition!==K)return u;for(d=n.length-1;d>=D;d--)g=n[d],g.self.onExit&&h.invoke(g.self.onExit,g.self,g.locals.globals),g.locals=null;for(d=D;d<B.length;d++)e=B[d],e.locals=H[d],e.self.onEnter&&h.invoke(e.self.onEnter,e.self,e.locals.globals);return x.transition!==K?u:(x.$current=b,x.current=b.self,x.params=c,N(x.params,o),x.transition=null,f.location&&b.navigable&&p.push(b.navigable.url,b.navigable.locals.globals.$stateParams,{$$avoidResync:!0,replace:"replace"===f.location}),f.notify&&a.$broadcast("$stateChangeSuccess",b.self,c,j.self,m),p.update(!0),x.current)},function(d){return x.transition!==K?u:(x.transition=null,g=a.$broadcast("$stateChangeError",b.self,c,j.self,m,d),g.defaultPrevented||p.update(),e.reject(d))});return K},x.is=function(a,b,d){d=M({relative:x.$current},d||{});var e=l(a,d.relative);return G(e)?x.$current!==e?!1:b?j(e.params.$$values(b),o):!0:c},x.includes=function(a,b,d){if(d=M({relative:x.$current},d||{}),I(a)&&q(a)){if(!r(a))return!1;a=x.$current.name}var e=l(a,d.relative);return G(e)?G(x.$current.includes[e.name])?b?j(e.params.$$values(b),o,g(b)):!0:!1:c},x.href=function(a,b,d){d=M({lossy:!0,inherit:!0,absolute:!1,relative:x.$current},d||{});var e=l(a,d.relative);if(!G(e))return null;d.inherit&&(b=i(o,b||{},x.$current,e));var f=e&&d.lossy?e.navigable:e;return f&&f.url!==c&&null!==f.url?p.href(f.url,k(e.params.$$keys(),b||{}),{absolute:d.absolute}):null},x.get=function(a,b){if(0===arguments.length)return n(g(y),function(a){return y[a].self});var c=l(a,b||x.$current);return c&&c.self?c.self:null},x}function v(a,b,c,d){return a!==b||(c!==b.locals||d.reload)&&a.self.reloadOnSearch!==!1?void 0:!0}var w,x,y={},z={},A="abstract",B={parent:function(a){if(G(a.parent)&&a.parent)return l(a.parent);var b=/^(.+)\.[^.]+$/.exec(a.name);return b?l(b[1]):w},data:function(a){return a.parent&&a.parent.data&&(a.data=a.self.data=M({},a.parent.data,a.data)),a.data},url:function(a){var b=a.url,c={params:a.params||{}};if(I(b))return"^"==b.charAt(0)?e.compile(b.substring(1),c):(a.parent.navigable||w).url.concat(b,c);if(!b||e.isMatcher(b))return b;throw new Error("Invalid url '"+b+"' in state '"+a+"'")},navigable:function(a){return a.url?a:a.parent?a.parent.navigable:null},ownParams:function(a){var b=a.url&&a.url.params||new O.ParamSet;return L(a.params||{},function(a,c){b[c]||(b[c]=new O.Param(c,null,a,"config"))}),b},params:function(a){return a.parent&&a.parent.params?M(a.parent.params.$$new(),a.ownParams):new O.ParamSet},views:function(a){var b={};return L(G(a.views)?a.views:{"":a},function(c,d){d.indexOf("@")<0&&(d+="@"+a.parent.name),b[d]=c}),b},path:function(a){return a.parent?a.parent.path.concat(a):[]},includes:function(a){var b=a.parent?M({},a.parent.includes):{};return b[a.name]=!0,b},$delegates:{}};w=p({name:"",url:"^",views:null,"abstract":!0}),w.navigable=null,this.decorator=s,this.state=t,this.$get=u,u.$inject=["$rootScope","$q","$view","$injector","$resolve","$stateParams","$urlRouter","$location","$urlMatcherFactory"]}function v(){function a(a,b){return{load:function(c,d){var e,f={template:null,controller:null,view:null,locals:null,notify:!0,async:!0,params:{}};return d=M(f,d),d.view&&(e=b.fromConfig(d.view,d.params,d.locals)),e&&d.notify&&a.$broadcast("$viewContentLoading",d),e}}}this.$get=a,a.$inject=["$rootScope","$templateFactory"]}function w(){var a=!1;this.useAnchorScroll=function(){a=!0},this.$get=["$anchorScroll","$timeout",function(b,c){return a?b:function(a){c(function(){a[0].scrollIntoView()},0,!1)}}]}function x(a,c,d,e){function f(){return c.has?function(a){return c.has(a)?c.get(a):null}:function(a){try{return c.get(a)}catch(b){return null}}}function g(a,b){var c=function(){return{enter:function(a,b,c){b.after(a),c()},leave:function(a,b){a.remove(),b()}}};if(j)return{enter:function(a,b,c){var d=j.enter(a,null,b,c);d&&d.then&&d.then(c)},leave:function(a,b){var c=j.leave(a,b);c&&c.then&&c.then(b)}};if(i){var d=i&&i(b,a);return{enter:function(a,b,c){d.enter(a,null,b),c()},leave:function(a,b){d.leave(a),b()}}}return c()}var h=f(),i=h("$animator"),j=h("$animate"),k={restrict:"ECA",terminal:!0,priority:400,transclude:"element",compile:function(c,f,h){return function(c,f,i){function j(){l&&(l.remove(),l=null),n&&(n.$destroy(),n=null),m&&(r.leave(m,function(){l=null}),l=m,m=null)}function k(g){var k,l=z(c,i,f,e),s=l&&a.$current&&a.$current.locals[l];if(g||s!==o){k=c.$new(),o=a.$current.locals[l];var t=h(k,function(a){r.enter(a,f,function(){n&&n.$emit("$viewContentAnimationEnded"),(b.isDefined(q)&&!q||c.$eval(q))&&d(a)}),j()});m=t,n=k,n.$emit("$viewContentLoaded"),n.$eval(p)}}var l,m,n,o,p=i.onload||"",q=i.autoscroll,r=g(i,c);c.$on("$stateChangeSuccess",function(){k(!1)}),c.$on("$viewContentLoading",function(){k(!1)}),k(!0)}}};return k}function y(a,b,c,d){return{restrict:"ECA",priority:-400,compile:function(e){var f=e.html();return function(e,g,h){var i=c.$current,j=z(e,h,g,d),k=i&&i.locals[j];if(k){g.data("$uiView",{name:j,state:k.$$state}),g.html(k.$template?k.$template:f);var l=a(g.contents());if(k.$$controller){k.$scope=e;var m=b(k.$$controller,k);k.$$controllerAs&&(e[k.$$controllerAs]=m),g.data("$ngControllerController",m),g.children().data("$ngControllerController",m)}l(e)}}}}}function z(a,b,c,d){var e=d(b.uiView||b.name||"")(a),f=c.inheritedData("$uiView");return e.indexOf("@")>=0?e:e+"@"+(f?f.state.name:"")}function A(a,b){var c,d=a.match(/^\s*({[^}]*})\s*$/);if(d&&(a=b+"("+d[1]+")"),c=a.replace(/\n/g," ").match(/^([^(]+?)\s*(\((.*)\))?$/),!c||4!==c.length)throw new Error("Invalid state ref '"+a+"'");return{state:c[1],paramExpr:c[3]||null}}function B(a){var b=a.parent().inheritedData("$uiView");return b&&b.state&&b.state.name?b.state:void 0}function C(a,c){var d=["location","inherit","reload"];return{restrict:"A",require:["?^uiSrefActive","?^uiSrefActiveEq"],link:function(e,f,g,h){var i=A(g.uiSref,a.current.name),j=null,k=B(f)||a.$current,l=null,m="A"===f.prop("tagName"),n="FORM"===f[0].nodeName,o=n?"action":"href",p=!0,q={relative:k,inherit:!0},r=e.$eval(g.uiSrefOpts)||{};b.forEach(d,function(a){a in r&&(q[a]=r[a])});var s=function(c){if(c&&(j=b.copy(c)),p){l=a.href(i.state,j,q);var d=h[1]||h[0];return d&&d.$$setStateInfo(i.state,j),null===l?(p=!1,!1):void g.$set(o,l)}};i.paramExpr&&(e.$watch(i.paramExpr,function(a){a!==j&&s(a)},!0),j=b.copy(e.$eval(i.paramExpr))),s(),n||f.bind("click",function(b){var d=b.which||b.button;if(!(d>1||b.ctrlKey||b.metaKey||b.shiftKey||f.attr("target"))){var e=c(function(){a.go(i.state,j,q)});b.preventDefault();var g=m&&!l?1:0;b.preventDefault=function(){g--<=0&&c.cancel(e)}}})}}}function D(a,b,c){return{restrict:"A",controller:["$scope","$element","$attrs",function(b,d,e){function f(){g()?d.addClass(j):d.removeClass(j)}function g(){return"undefined"!=typeof e.uiSrefActiveEq?h&&a.is(h.name,i):h&&a.includes(h.name,i)}var h,i,j;j=c(e.uiSrefActiveEq||e.uiSrefActive||"",!1)(b),this.$$setStateInfo=function(b,c){h=a.get(b,B(d)),i=c,f()},b.$on("$stateChangeSuccess",f)}]}}function E(a){var b=function(b){return a.is(b)};return b.$stateful=!0,b}function F(a){var b=function(b){return a.includes(b)};return b.$stateful=!0,b}var G=b.isDefined,H=b.isFunction,I=b.isString,J=b.isObject,K=b.isArray,L=b.forEach,M=b.extend,N=b.copy;b.module("ui.router.util",["ng"]),b.module("ui.router.router",["ui.router.util"]),b.module("ui.router.state",["ui.router.router","ui.router.util"]),b.module("ui.router",["ui.router.state"]),b.module("ui.router.compat",["ui.router"]),o.$inject=["$q","$injector"],b.module("ui.router.util").service("$resolve",o),p.$inject=["$http","$templateCache","$injector"],b.module("ui.router.util").service("$templateFactory",p);var O;q.prototype.concat=function(a,b){var c={caseInsensitive:O.caseInsensitive(),strict:O.strictMode(),squash:O.defaultSquashPolicy()};return new q(this.sourcePath+a+this.sourceSearch,M(c,b),this)},q.prototype.toString=function(){return this.source},q.prototype.exec=function(a,b){function c(a){function b(a){return a.split("").reverse().join("")}function c(a){return a.replace(/\\-/,"-")}var d=b(a).split(/-(?!\\)/),e=n(d,b);return n(e,c).reverse()}var d=this.regexp.exec(a);if(!d)return null;b=b||{};var e,f,g,h=this.parameters(),i=h.length,j=this.segments.length-1,k={};if(j!==d.length-1)throw new Error("Unbalanced capture group in route '"+this.source+"'");for(e=0;j>e;e++){g=h[e];var l=this.params[g],m=d[e+1];for(f=0;f<l.replace;f++)l.replace[f].from===m&&(m=l.replace[f].to);m&&l.array===!0&&(m=c(m)),k[g]=l.value(m)}for(;i>e;e++)g=h[e],k[g]=this.params[g].value(b[g]);return k},q.prototype.parameters=function(a){return G(a)?this.params[a]||null:this.$$paramNames},q.prototype.validates=function(a){return this.params.$$validates(a)},q.prototype.format=function(a){function b(a){return encodeURIComponent(a).replace(/-/g,function(a){return"%5C%"+a.charCodeAt(0).toString(16).toUpperCase()})}a=a||{};var c=this.segments,d=this.parameters(),e=this.params;if(!this.validates(a))return null;var f,g=!1,h=c.length-1,i=d.length,j=c[0];for(f=0;i>f;f++){var k=h>f,l=d[f],m=e[l],o=m.value(a[l]),p=m.isOptional&&m.type.equals(m.value(),o),q=p?m.squash:!1,r=m.type.encode(o);if(k){var s=c[f+1];if(q===!1)null!=r&&(j+=K(r)?n(r,b).join("-"):encodeURIComponent(r)),j+=s;else if(q===!0){var t=j.match(/\/$/)?/\/?(.*)/:/(.*)/;j+=s.match(t)[1]}else I(q)&&(j+=q+s)}else{if(null==r||p&&q!==!1)continue;K(r)||(r=[r]),r=n(r,encodeURIComponent).join("&"+l+"="),j+=(g?"&":"?")+(l+"="+r),g=!0}}return j},r.prototype.is=function(){return!0},r.prototype.encode=function(a){return a},r.prototype.decode=function(a){return a},r.prototype.equals=function(a,b){return a==b},r.prototype.$subPattern=function(){var a=this.pattern.toString();return a.substr(1,a.length-2)},r.prototype.pattern=/.*/,r.prototype.toString=function(){return"{Type:"+this.name+"}"},r.prototype.$asArray=function(a,b){function d(a,b){function d(a,b){return function(){return a[b].apply(a,arguments)}}function e(a){return K(a)?a:G(a)?[a]:[]}function f(a){switch(a.length){case 0:return c;case 1:return"auto"===b?a[0]:a;default:return a}}function g(a){return!a}function h(a,b){return function(c){c=e(c);var d=n(c,a);return b===!0?0===m(d,g).length:f(d)}}function i(a){return function(b,c){var d=e(b),f=e(c);if(d.length!==f.length)return!1;for(var g=0;g<d.length;g++)if(!a(d[g],f[g]))return!1;return!0}}this.encode=h(d(a,"encode")),this.decode=h(d(a,"decode")),this.is=h(d(a,"is"),!0),this.equals=i(d(a,"equals")),this.pattern=a.pattern,this.$arrayMode=b}if(!a)return this;if("auto"===a&&!b)throw new Error("'auto' array mode is for query parameters only");return new d(this,a)},b.module("ui.router.util").provider("$urlMatcherFactory",s),b.module("ui.router.util").run(["$urlMatcherFactory",function(){}]),t.$inject=["$locationProvider","$urlMatcherFactoryProvider"],b.module("ui.router.router").provider("$urlRouter",t),u.$inject=["$urlRouterProvider","$urlMatcherFactoryProvider"],b.module("ui.router.state").value("$stateParams",{}).provider("$state",u),v.$inject=[],b.module("ui.router.state").provider("$view",v),b.module("ui.router.state").provider("$uiViewScroll",w),x.$inject=["$state","$injector","$uiViewScroll","$interpolate"],y.$inject=["$compile","$controller","$state","$interpolate"],b.module("ui.router.state").directive("uiView",x),b.module("ui.router.state").directive("uiView",y),C.$inject=["$state","$timeout"],D.$inject=["$state","$stateParams","$interpolate"],b.module("ui.router.state").directive("uiSref",C).directive("uiSrefActive",D).directive("uiSrefActiveEq",D),E.$inject=["$state"],F.$inject=["$state"],b.module("ui.router.state").filter("isState",E).filter("includedByState",F)}(window,window.angular);
/**
 * @license AngularJS v1.2.29-build.592+sha.b041b66
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* jshint maxlen: false */

/**
 * @ngdoc module
 * @name ngAnimate
 * @description
 *
 * # ngAnimate
 *
 * The `ngAnimate` module provides support for JavaScript, CSS3 transition and CSS3 keyframe animation hooks within existing core and custom directives.
 *
 *
 * <div doc-module-components="ngAnimate"></div>
 *
 * # Usage
 *
 * To see animations in action, all that is required is to define the appropriate CSS classes
 * or to register a JavaScript animation via the myModule.animation() function. The directives that support animation automatically are:
 * `ngRepeat`, `ngInclude`, `ngIf`, `ngSwitch`, `ngShow`, `ngHide`, `ngView` and `ngClass`. Custom directives can take advantage of animation
 * by using the `$animate` service.
 *
 * Below is a more detailed breakdown of the supported animation events provided by pre-existing ng directives:
 *
 * | Directive                                                 | Supported Animations                               |
 * |---------------------------------------------------------- |----------------------------------------------------|
 * | {@link ng.directive:ngRepeat#usage_animations ngRepeat}         | enter, leave and move                              |
 * | {@link ngRoute.directive:ngView#usage_animations ngView}        | enter and leave                                    |
 * | {@link ng.directive:ngInclude#usage_animations ngInclude}       | enter and leave                                    |
 * | {@link ng.directive:ngSwitch#usage_animations ngSwitch}         | enter and leave                                    |
 * | {@link ng.directive:ngIf#usage_animations ngIf}                 | enter and leave                                    |
 * | {@link ng.directive:ngClass#usage_animations ngClass}           | add and remove                                     |
 * | {@link ng.directive:ngShow#usage_animations ngShow & ngHide}    | add and remove (the ng-hide class value)           |
 * | {@link ng.directive:form#usage_animations form}                 | add and remove (dirty, pristine, valid, invalid & all other validations)                |
 * | {@link ng.directive:ngModel#usage_animations ngModel}           | add and remove (dirty, pristine, valid, invalid & all other validations)                |
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of how to apply animations to a directive that supports animation hooks:
 *
 * ```html
 * <style type="text/css">
 * .slide.ng-enter, .slide.ng-leave {
 *   -webkit-transition:0.5s linear all;
 *   transition:0.5s linear all;
 * }
 *
 * .slide.ng-enter { }        /&#42; starting animations for enter &#42;/
 * .slide.ng-enter.ng-enter-active { } /&#42; terminal animations for enter &#42;/
 * .slide.ng-leave { }        /&#42; starting animations for leave &#42;/
 * .slide.ng-leave.ng-leave-active { } /&#42; terminal animations for leave &#42;/
 * </style>
 *
 * <!--
 * the animate service will automatically add .ng-enter and .ng-leave to the element
 * to trigger the CSS transition/animations
 * -->
 * <ANY class="slide" ng-include="..."></ANY>
 * ```
 *
 * Keep in mind that, by default, if an animation is running, any child elements cannot be animated
 * until the parent element's animation has completed. This blocking feature can be overridden by
 * placing the `ng-animate-children` attribute on a parent container tag.
 *
 * ```html
 * <div class="slide-animation" ng-if="on" ng-animate-children>
 *   <div class="fade-animation" ng-if="on">
 *     <div class="explode-animation" ng-if="on">
 *        ...
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * When the `on` expression value changes and an animation is triggered then each of the elements within
 * will all animate without the block being applied to child elements.
 *
 * <h2>CSS-defined Animations</h2>
 * The animate service will automatically apply two CSS classes to the animated element and these two CSS classes
 * are designed to contain the start and end CSS styling. Both CSS transitions and keyframe animations are supported
 * and can be used to play along with this naming structure.
 *
 * The following code below demonstrates how to perform animations using **CSS transitions** with Angular:
 *
 * ```html
 * <style type="text/css">
 * /&#42;
 *  The animate class is apart of the element and the ng-enter class
 *  is attached to the element once the enter animation event is triggered
 * &#42;/
 * .reveal-animation.ng-enter {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  transition: 1s linear all; /&#42; All other modern browsers and IE10+ &#42;/
 *
 *  /&#42; The animation preparation code &#42;/
 *  opacity: 0;
 * }
 *
 * /&#42;
 *  Keep in mind that you want to combine both CSS
 *  classes together to avoid any CSS-specificity
 *  conflicts
 * &#42;/
 * .reveal-animation.ng-enter.ng-enter-active {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * ```
 *
 * The following code below demonstrates how to perform animations using **CSS animations** with Angular:
 *
 * ```html
 * <style type="text/css">
 * .reveal-animation.ng-enter {
 *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
 * }
 * @-webkit-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * @keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * ```
 *
 * Both CSS3 animations and transitions can be used together and the animate service will figure out the correct duration and delay timing.
 *
 * Upon DOM mutation, the event class is added first (something like `ng-enter`), then the browser prepares itself to add
 * the active class (in this case `ng-enter-active`) which then triggers the animation. The animation module will automatically
 * detect the CSS code to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
 * immediately resulting in a DOM element that is at its final state. This final state is when the DOM element
 * has no CSS transition/animation classes applied to it.
 *
 * <h3>CSS Staggering Animations</h3>
 * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
 * curtain-like effect. The ngAnimate module, as of 1.2.0, supports staggering animations and the stagger effect can be
 * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
 * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
 * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
 *
 * ```css
 * .my-animation.ng-enter {
 *   /&#42; standard transition code &#42;/
 *   -webkit-transition: 1s linear all;
 *   transition: 1s linear all;
 *   opacity:0;
 * }
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   -webkit-transition-delay: 0.1s;
 *   transition-delay: 0.1s;
 *
 *   /&#42; in case the stagger doesn't work then these two values
 *    must be set to 0 to avoid an accidental CSS inheritance &#42;/
 *   -webkit-transition-duration: 0s;
 *   transition-duration: 0s;
 * }
 * .my-animation.ng-enter.ng-enter-active {
 *   /&#42; standard transition styles &#42;/
 *   opacity:1;
 * }
 * ```
 *
 * Staggering animations work by default in ngRepeat (so long as the CSS class is defined). Outside of ngRepeat, to use staggering animations
 * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
 * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
 * will also be reset if more than 10ms has passed after the last animation has been fired.
 *
 * The following code will issue the **ng-leave-stagger** event on the element provided:
 *
 * ```js
 * var kids = parent.children();
 *
 * $animate.leave(kids[0]); //stagger index=0
 * $animate.leave(kids[1]); //stagger index=1
 * $animate.leave(kids[2]); //stagger index=2
 * $animate.leave(kids[3]); //stagger index=3
 * $animate.leave(kids[4]); //stagger index=4
 *
 * $timeout(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 * }, 100, false);
 * ```
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
 * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
 *
 * ```js
 * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
 * var ngModule = angular.module('YourApp', ['ngAnimate']);
 * ngModule.animation('.my-crazy-animation', function() {
 *   return {
 *     enter: function(element, done) {
 *       //run the animation here and call done when the animation is complete
 *       return function(cancelled) {
 *         //this (optional) function will be called when the animation
 *         //completes or when the animation is cancelled (the cancelled
 *         //flag will be set to true if cancelled).
 *       };
 *     },
 *     leave: function(element, done) { },
 *     move: function(element, done) { },
 *
 *     //animation that can be triggered before the class is added
 *     beforeAddClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is added
 *     addClass: function(element, className, done) { },
 *
 *     //animation that can be triggered before the class is removed
 *     beforeRemoveClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is removed
 *     removeClass: function(element, className, done) { }
 *   };
 * });
 * ```
 *
 * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
 * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
 * the element's CSS class attribute value and then run the matching animation event function (if found).
 * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function will
 * be executed. It should be also noted that only simple, single class selectors are allowed (compound class selectors are not supported).
 *
 * Within a JavaScript animation, an object containing various event callback animation functions is expected to be returned.
 * As explained above, these callbacks are triggered based on the animation event. Therefore if an enter animation is run,
 * and the JavaScript animation is found, then the enter callback will handle that animation (in addition to the CSS keyframe animation
 * or transition code that is defined via a stylesheet).
 *
 */

angular.module('ngAnimate', ['ng'])

  /**
   * @ngdoc provider
   * @name $animateProvider
   * @description
   *
   * The `$animateProvider` allows developers to register JavaScript animation event handlers directly inside of a module.
   * When an animation is triggered, the $animate service will query the $animate service to find any animations that match
   * the provided name value.
   *
   * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
   *
   * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
   *
   */
  .directive('ngAnimateChildren', function() {
    var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
    return function(scope, element, attrs) {
      var val = attrs.ngAnimateChildren;
      if(angular.isString(val) && val.length === 0) { //empty attribute
        element.data(NG_ANIMATE_CHILDREN, true);
      } else {
        scope.$watch(val, function(value) {
          element.data(NG_ANIMATE_CHILDREN, !!value);
        });
      }
    };
  })

  //this private service is only used within CSS-enabled animations
  //IE8 + IE9 do not support rAF natively, but that is fine since they
  //also don't support transitions and keyframes which means that the code
  //below will never be used by the two browsers.
  .factory('$$animateReflow', ['$$rAF', '$document', function($$rAF, $document) {
    var bod = $document[0].body;
    return function(fn) {
      //the returned function acts as the cancellation function
      return $$rAF(function() {
        //the line below will force the browser to perform a repaint
        //so that all the animated elements within the animation frame
        //will be properly updated and drawn on screen. This is
        //required to perform multi-class CSS based animations with
        //Firefox. DO NOT REMOVE THIS LINE. DO NOT OPTIMIZE THIS LINE.
        //THE MINIFIER WILL REMOVE IT OTHERWISE WHICH WILL RESULT IN AN
        //UNPREDICTABLE BUG THAT IS VERY HARD TO TRACK DOWN AND WILL
        //TAKE YEARS AWAY FROM YOUR LIFE!
        fn(bod.offsetWidth);
      });
    };
  }])

  .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
    var noop = angular.noop;
    var forEach = angular.forEach;
    var selectors = $animateProvider.$$selectors;

    var ELEMENT_NODE = 1;
    var NG_ANIMATE_STATE = '$$ngAnimateState';
    var NG_ANIMATE_CHILDREN = '$$ngAnimateChildren';
    var NG_ANIMATE_CLASS_NAME = 'ng-animate';
    var rootAnimateState = {running: true};

    function extractElementNode(element) {
      for(var i = 0; i < element.length; i++) {
        var elm = element[i];
        if(elm.nodeType == ELEMENT_NODE) {
          return elm;
        }
      }
    }

    function prepareElement(element) {
      return element && angular.element(element);
    }

    function stripCommentsFromElement(element) {
      return angular.element(extractElementNode(element));
    }

    function isMatchingElement(elm1, elm2) {
      return extractElementNode(elm1) == extractElementNode(elm2);
    }

    $provide.decorator('$animate', ['$delegate', '$injector', '$sniffer', '$rootElement', '$$asyncCallback', '$rootScope', '$document',
                            function($delegate,   $injector,   $sniffer,   $rootElement,   $$asyncCallback,    $rootScope,   $document) {

      var globalAnimationCounter = 0;
      $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

      // disable animations during bootstrap, but once we bootstrapped, wait again
      // for another digest until enabling animations. The reason why we digest twice
      // is because all structural animations (enter, leave and move) all perform a
      // post digest operation before animating. If we only wait for a single digest
      // to pass then the structural animation would render its animation on page load.
      // (which is what we're trying to avoid when the application first boots up.)
      $rootScope.$$postDigest(function() {
        $rootScope.$$postDigest(function() {
          rootAnimateState.running = false;
        });
      });

      var classNameFilter = $animateProvider.classNameFilter();
      var isAnimatableClassName = !classNameFilter
              ? function() { return true; }
              : function(className) {
                return classNameFilter.test(className);
              };

      function blockElementAnimations(element) {
        var data = element.data(NG_ANIMATE_STATE) || {};
        data.running = true;
        element.data(NG_ANIMATE_STATE, data);
      }

      function lookup(name) {
        if (name) {
          var matches = [],
              flagMap = {},
              classes = name.substr(1).split('.');

          //the empty string value is the default animation
          //operation which performs CSS transition and keyframe
          //animations sniffing. This is always included for each
          //element animation procedure if the browser supports
          //transitions and/or keyframe animations. The default
          //animation is added to the top of the list to prevent
          //any previous animations from affecting the element styling
          //prior to the element being animated.
          if ($sniffer.transitions || $sniffer.animations) {
            matches.push($injector.get(selectors['']));
          }

          for(var i=0; i < classes.length; i++) {
            var klass = classes[i],
                selectorFactoryName = selectors[klass];
            if(selectorFactoryName && !flagMap[klass]) {
              matches.push($injector.get(selectorFactoryName));
              flagMap[klass] = true;
            }
          }
          return matches;
        }
      }

      function animationRunner(element, animationEvent, className) {
        //transcluded directives may sometimes fire an animation using only comment nodes
        //best to catch this early on to prevent any animation operations from occurring
        var node = element[0];
        if(!node) {
          return;
        }

        var isSetClassOperation = animationEvent == 'setClass';
        var isClassBased = isSetClassOperation ||
                           animationEvent == 'addClass' ||
                           animationEvent == 'removeClass';

        var classNameAdd, classNameRemove;
        if(angular.isArray(className)) {
          classNameAdd = className[0];
          classNameRemove = className[1];
          className = classNameAdd + ' ' + classNameRemove;
        }

        var currentClassName = element.attr('class');
        var classes = currentClassName + ' ' + className;
        if(!isAnimatableClassName(classes)) {
          return;
        }

        var beforeComplete = noop,
            beforeCancel = [],
            before = [],
            afterComplete = noop,
            afterCancel = [],
            after = [];

        var animationLookup = (' ' + classes).replace(/\s+/g,'.');
        forEach(lookup(animationLookup), function(animationFactory) {
          var created = registerAnimation(animationFactory, animationEvent);
          if(!created && isSetClassOperation) {
            registerAnimation(animationFactory, 'addClass');
            registerAnimation(animationFactory, 'removeClass');
          }
        });

        function registerAnimation(animationFactory, event) {
          var afterFn = animationFactory[event];
          var beforeFn = animationFactory['before' + event.charAt(0).toUpperCase() + event.substr(1)];
          if(afterFn || beforeFn) {
            if(event == 'leave') {
              beforeFn = afterFn;
              //when set as null then animation knows to skip this phase
              afterFn = null;
            }
            after.push({
              event : event, fn : afterFn
            });
            before.push({
              event : event, fn : beforeFn
            });
            return true;
          }
        }

        function run(fns, cancellations, allCompleteFn) {
          var animations = [];
          forEach(fns, function(animation) {
            animation.fn && animations.push(animation);
          });

          var count = 0;
          function afterAnimationComplete(index) {
            if(cancellations) {
              (cancellations[index] || noop)();
              if(++count < animations.length) return;
              cancellations = null;
            }
            allCompleteFn();
          }

          //The code below adds directly to the array in order to work with
          //both sync and async animations. Sync animations are when the done()
          //operation is called right away. DO NOT REFACTOR!
          forEach(animations, function(animation, index) {
            var progress = function() {
              afterAnimationComplete(index);
            };
            switch(animation.event) {
              case 'setClass':
                cancellations.push(animation.fn(element, classNameAdd, classNameRemove, progress));
                break;
              case 'addClass':
                cancellations.push(animation.fn(element, classNameAdd || className,     progress));
                break;
              case 'removeClass':
                cancellations.push(animation.fn(element, classNameRemove || className,  progress));
                break;
              default:
                cancellations.push(animation.fn(element, progress));
                break;
            }
          });

          if(cancellations && cancellations.length === 0) {
            allCompleteFn();
          }
        }

        return {
          node : node,
          event : animationEvent,
          className : className,
          isClassBased : isClassBased,
          isSetClassOperation : isSetClassOperation,
          before : function(allCompleteFn) {
            beforeComplete = allCompleteFn;
            run(before, beforeCancel, function() {
              beforeComplete = noop;
              allCompleteFn();
            });
          },
          after : function(allCompleteFn) {
            afterComplete = allCompleteFn;
            run(after, afterCancel, function() {
              afterComplete = noop;
              allCompleteFn();
            });
          },
          cancel : function() {
            if(beforeCancel) {
              forEach(beforeCancel, function(cancelFn) {
                (cancelFn || noop)(true);
              });
              beforeComplete(true);
            }
            if(afterCancel) {
              forEach(afterCancel, function(cancelFn) {
                (cancelFn || noop)(true);
              });
              afterComplete(true);
            }
          }
        };
      }

      /**
       * @ngdoc service
       * @name $animate
       * @kind function
       *
       * @description
       * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move) as well as during addClass and removeClass operations.
       * When any of these operations are run, the $animate service
       * will examine any JavaScript-defined animations (which are defined by using the $animateProvider provider object)
       * as well as any CSS-defined animations against the CSS classes present on the element once the DOM operation is run.
       *
       * The `$animate` service is used behind the scenes with pre-existing directives and animation with these directives
       * will work out of the box without any extra configuration.
       *
       * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
       *
       * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
       *
       */
      return {
        /**
         * @ngdoc method
         * @name $animate#enter
         * @kind function
         *
         * @description
         * Appends the element to the parentElement element that resides in the document and then runs the enter animation. Once
         * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.enter(...) is called                                                             | class="my-animation"                        |
         * | 2. element is inserted into the parentElement element or beside the afterElement element     | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-enter class is added to the element                                               | class="my-animation ng-animate ng-enter"    |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-enter"    |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-enter"    |
         * | 7. the .ng-enter-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {DOMElement} element the element that will be the focus of the enter animation
         * @param {DOMElement} parentElement the parent element of the element that will be the focus of the enter animation
         * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the enter animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        enter : function(element, parentElement, afterElement, doneCallback) {
          element = angular.element(element);
          parentElement = prepareElement(parentElement);
          afterElement = prepareElement(afterElement);

          blockElementAnimations(element);
          $delegate.enter(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            element = stripCommentsFromElement(element);
            performAnimation('enter', 'ng-enter', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#leave
         * @kind function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during leave animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.leave(...) is called                                                             | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 3. the .ng-leave class is added to the element                                               | class="my-animation ng-animate ng-leave"    |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-leave"    |
         * | 5. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-leave"    |
         * | 6. the .ng-leave-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 8. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 9. The element is removed from the DOM                                                       | ...                                         |
         * | 10. The doneCallback() callback is fired (if provided)                                       | ...                                         |
         *
         * @param {DOMElement} element the element that will be the focus of the leave animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        leave : function(element, doneCallback) {
          element = angular.element(element);
          cancelChildAnimations(element);
          blockElementAnimations(element);
          $rootScope.$$postDigest(function() {
            performAnimation('leave', 'ng-leave', stripCommentsFromElement(element), null, null, function() {
              $delegate.leave(element);
            }, doneCallback);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#move
         * @kind function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parentElement container or
         * add the element directly after the afterElement element if present. Then the move animation will be run. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during move animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.move(...) is called                                                              | class="my-animation"                        |
         * | 2. element is moved into the parentElement element or beside the afterElement element        | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-move class is added to the element                                                | class="my-animation ng-animate ng-move"     |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-move"     |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-move"     |
         * | 7. the .ng-move-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {DOMElement} element the element that will be the focus of the move animation
         * @param {DOMElement} parentElement the parentElement element of the element that will be the focus of the move animation
         * @param {DOMElement} afterElement the sibling element (which is the previous element) of the element that will be the focus of the move animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        move : function(element, parentElement, afterElement, doneCallback) {
          element = angular.element(element);
          parentElement = prepareElement(parentElement);
          afterElement = prepareElement(afterElement);

          cancelChildAnimations(element);
          blockElementAnimations(element);
          $delegate.move(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            element = stripCommentsFromElement(element);
            performAnimation('move', 'ng-move', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc method
         * @name $animate#addClass
         *
         * @description
         * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
         * Unlike the other animation methods, the animate service will suffix the className value with {@type -add} in order to provide
         * the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if no CSS transitions
         * or keyframes are defined on the -add or base CSS class).
         *
         * Below is a breakdown of each step that occurs during addClass animation:
         *
         * | Animation Step                                                                                 | What the element class attribute looks like |
         * |------------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.addClass(element, 'super') is called                                               | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                              | class="my-animation ng-animate"             |
         * | 3. the .super-add class are added to the element                                               | class="my-animation ng-animate super-add"   |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay    | class="my-animation ng-animate super-add"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                            | class="my-animation ng-animate super-add"   |
         * | 6. the .super, .super-add-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super super-add super-add-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                             | class="my-animation super super-add super-add-active"  |
         * | 8. The animation ends and all generated CSS classes are removed from the element               | class="my-animation super"                  |
         * | 9. The super class is kept on the element                                                      | class="my-animation super"                  |
         * | 10. The doneCallback() callback is fired (if provided)                                         | class="my-animation super"                  |
         *
         * @param {DOMElement} element the element that will be animated
         * @param {string} className the CSS class that will be added to the element and then animated
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        addClass : function(element, className, doneCallback) {
          element = angular.element(element);
          element = stripCommentsFromElement(element);
          performAnimation('addClass', className, element, null, null, function() {
            $delegate.addClass(element, className);
          }, doneCallback);
        },

        /**
         * @ngdoc method
         * @name $animate#removeClass
         *
         * @description
         * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
         * from the element. Unlike the other animation methods, the animate service will suffix the className value with {@type -remove} in
         * order to provide the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if
         * no CSS transitions or keyframes are defined on the -remove or base CSS classes).
         *
         * Below is a breakdown of each step that occurs during removeClass animation:
         *
         * | Animation Step                                                                                | What the element class attribute looks like     |
         * |-----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.removeClass(element, 'super') is called                                           | class="my-animation super"                  |
         * | 2. $animate runs any JavaScript-defined animations on the element                             | class="my-animation super ng-animate"       |
         * | 3. the .super-remove class are added to the element                                           | class="my-animation super ng-animate super-remove"|
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay   | class="my-animation super ng-animate super-remove"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                           | class="my-animation super ng-animate super-remove"   |
         * | 6. the .super-remove-active and .ng-animate-active classes are added and .super is removed (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                            | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"   |
         * | 8. The animation ends and all generated CSS classes are removed from the element              | class="my-animation"                        |
         * | 9. The doneCallback() callback is fired (if provided)                                         | class="my-animation"                        |
         *
         *
         * @param {DOMElement} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        removeClass : function(element, className, doneCallback) {
          element = angular.element(element);
          element = stripCommentsFromElement(element);
          performAnimation('removeClass', className, element, null, null, function() {
            $delegate.removeClass(element, className);
          }, doneCallback);
        },

          /**
           *
           * @ngdoc function
           * @name $animate#setClass
           * @function
           * @description Adds and/or removes the given CSS classes to and from the element.
           * Once complete, the done() callback will be fired (if provided).
           * @param {DOMElement} element the element which will its CSS classes changed
           *   removed from it
           * @param {string} add the CSS classes which will be added to the element
           * @param {string} remove the CSS class which will be removed from the element
           * @param {Function=} done the callback function (if provided) that will be fired after the
           *   CSS classes have been set on the element
           */
        setClass : function(element, add, remove, doneCallback) {
          element = angular.element(element);
          element = stripCommentsFromElement(element);
          performAnimation('setClass', [add, remove], element, null, null, function() {
            $delegate.setClass(element, add, remove);
          }, doneCallback);
        },

        /**
         * @ngdoc method
         * @name $animate#enabled
         * @kind function
         *
         * @param {boolean=} value If provided then set the animation on or off.
         * @param {DOMElement=} element If provided then the element will be used to represent the enable/disable operation
         * @return {boolean} Current animation state.
         *
         * @description
         * Globally enables/disables animations.
         *
        */
        enabled : function(value, element) {
          switch(arguments.length) {
            case 2:
              if(value) {
                cleanup(element);
              } else {
                var data = element.data(NG_ANIMATE_STATE) || {};
                data.disabled = true;
                element.data(NG_ANIMATE_STATE, data);
              }
            break;

            case 1:
              rootAnimateState.disabled = !value;
            break;

            default:
              value = !rootAnimateState.disabled;
            break;
          }
          return !!value;
         }
      };

      /*
        all animations call this shared animation triggering function internally.
        The animationEvent variable refers to the JavaScript animation event that will be triggered
        and the className value is the name of the animation that will be applied within the
        CSS code. Element, parentElement and afterElement are provided DOM elements for the animation
        and the onComplete callback will be fired once the animation is fully complete.
      */
      function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, doneCallback) {

        var runner = animationRunner(element, animationEvent, className);
        if(!runner) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return;
        }

        className = runner.className;
        var elementEvents = angular.element._data(runner.node);
        elementEvents = elementEvents && elementEvents.events;

        if (!parentElement) {
          parentElement = afterElement ? afterElement.parent() : element.parent();
        }

        var ngAnimateState  = element.data(NG_ANIMATE_STATE) || {};
        var runningAnimations     = ngAnimateState.active || {};
        var totalActiveAnimations = ngAnimateState.totalActive || 0;
        var lastAnimation         = ngAnimateState.last;

        //only allow animations if the currently running animation is not structural
        //or if there is no animation running at all
        var skipAnimations;
        if (runner.isClassBased) {
          skipAnimations = ngAnimateState.running ||
                           ngAnimateState.disabled ||
                           (lastAnimation && !lastAnimation.isClassBased);
        }

        //skip the animation if animations are disabled, a parent is already being animated,
        //the element is not currently attached to the document body or then completely close
        //the animation if any matching animations are not found at all.
        //NOTE: IE8 + IE9 should close properly (run closeAnimation()) in case an animation was found.
        if (skipAnimations || animationsDisabled(element, parentElement)) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          closeAnimation();
          return;
        }

        var skipAnimation = false;
        if(totalActiveAnimations > 0) {
          var animationsToCancel = [];
          if(!runner.isClassBased) {
            if(animationEvent == 'leave' && runningAnimations['ng-leave']) {
              skipAnimation = true;
            } else {
              //cancel all animations when a structural animation takes place
              for(var klass in runningAnimations) {
                animationsToCancel.push(runningAnimations[klass]);
                cleanup(element, klass);
              }
              runningAnimations = {};
              totalActiveAnimations = 0;
            }
          } else if(lastAnimation.event == 'setClass') {
            animationsToCancel.push(lastAnimation);
            cleanup(element, className);
          }
          else if(runningAnimations[className]) {
            var current = runningAnimations[className];
            if(current.event == animationEvent) {
              skipAnimation = true;
            } else {
              animationsToCancel.push(current);
              cleanup(element, className);
            }
          }

          if(animationsToCancel.length > 0) {
            forEach(animationsToCancel, function(operation) {
              operation.cancel();
            });
          }
        }

        if(runner.isClassBased && !runner.isSetClassOperation && !skipAnimation) {
          skipAnimation = (animationEvent == 'addClass') == element.hasClass(className); //opposite of XOR
        }

        if(skipAnimation) {
          fireDOMOperation();
          fireBeforeCallbackAsync();
          fireAfterCallbackAsync();
          fireDoneCallbackAsync();
          return;
        }

        if(animationEvent == 'leave') {
          //there's no need to ever remove the listener since the element
          //will be removed (destroyed) after the leave animation ends or
          //is cancelled midway
          element.one('$destroy', function(e) {
            var element = angular.element(this);
            var state = element.data(NG_ANIMATE_STATE);
            if(state) {
              var activeLeaveAnimation = state.active['ng-leave'];
              if(activeLeaveAnimation) {
                activeLeaveAnimation.cancel();
                cleanup(element, 'ng-leave');
              }
            }
          });
        }

        //the ng-animate class does nothing, but it's here to allow for
        //parent animations to find and cancel child animations when needed
        element.addClass(NG_ANIMATE_CLASS_NAME);

        var localAnimationCount = globalAnimationCounter++;
        totalActiveAnimations++;
        runningAnimations[className] = runner;

        element.data(NG_ANIMATE_STATE, {
          last : runner,
          active : runningAnimations,
          index : localAnimationCount,
          totalActive : totalActiveAnimations
        });

        //first we run the before animations and when all of those are complete
        //then we perform the DOM operation and run the next set of animations
        fireBeforeCallbackAsync();
        runner.before(function(cancelled) {
          var data = element.data(NG_ANIMATE_STATE);
          cancelled = cancelled ||
                        !data || !data.active[className] ||
                        (runner.isClassBased && data.active[className].event != animationEvent);

          fireDOMOperation();
          if(cancelled === true) {
            closeAnimation();
          } else {
            fireAfterCallbackAsync();
            runner.after(closeAnimation);
          }
        });

        function fireDOMCallback(animationPhase) {
          var eventName = '$animate:' + animationPhase;
          if(elementEvents && elementEvents[eventName] && elementEvents[eventName].length > 0) {
            $$asyncCallback(function() {
              element.triggerHandler(eventName, {
                event : animationEvent,
                className : className
              });
            });
          }
        }

        function fireBeforeCallbackAsync() {
          fireDOMCallback('before');
        }

        function fireAfterCallbackAsync() {
          fireDOMCallback('after');
        }

        function fireDoneCallbackAsync() {
          fireDOMCallback('close');
          if(doneCallback) {
            $$asyncCallback(function() {
              doneCallback();
            });
          }
        }

        //it is less complicated to use a flag than managing and canceling
        //timeouts containing multiple callbacks.
        function fireDOMOperation() {
          if(!fireDOMOperation.hasBeenRun) {
            fireDOMOperation.hasBeenRun = true;
            domOperation();
          }
        }

        function closeAnimation() {
          if(!closeAnimation.hasBeenRun) {
            closeAnimation.hasBeenRun = true;
            var data = element.data(NG_ANIMATE_STATE);
            if(data) {
              /* only structural animations wait for reflow before removing an
                 animation, but class-based animations don't. An example of this
                 failing would be when a parent HTML tag has a ng-class attribute
                 causing ALL directives below to skip animations during the digest */
              if(runner && runner.isClassBased) {
                cleanup(element, className);
              } else {
                $$asyncCallback(function() {
                  var data = element.data(NG_ANIMATE_STATE) || {};
                  if(localAnimationCount == data.index) {
                    cleanup(element, className, animationEvent);
                  }
                });
                element.data(NG_ANIMATE_STATE, data);
              }
            }
            fireDoneCallbackAsync();
          }
        }
      }

      function cancelChildAnimations(element) {
        var node = extractElementNode(element);
        if (node) {
          var nodes = angular.isFunction(node.getElementsByClassName) ?
            node.getElementsByClassName(NG_ANIMATE_CLASS_NAME) :
            node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME);
          forEach(nodes, function(element) {
            element = angular.element(element);
            var data = element.data(NG_ANIMATE_STATE);
            if(data && data.active) {
              forEach(data.active, function(runner) {
                runner.cancel();
              });
            }
          });
        }
      }

      function cleanup(element, className) {
        if(isMatchingElement(element, $rootElement)) {
          if(!rootAnimateState.disabled) {
            rootAnimateState.running = false;
            rootAnimateState.structural = false;
          }
        } else if(className) {
          var data = element.data(NG_ANIMATE_STATE) || {};

          var removeAnimations = className === true;
          if(!removeAnimations && data.active && data.active[className]) {
            data.totalActive--;
            delete data.active[className];
          }

          if(removeAnimations || !data.totalActive) {
            element.removeClass(NG_ANIMATE_CLASS_NAME);
            element.removeData(NG_ANIMATE_STATE);
          }
        }
      }

      function animationsDisabled(element, parentElement) {
        if (rootAnimateState.disabled) {
          return true;
        }

        if (isMatchingElement(element, $rootElement)) {
          return rootAnimateState.running;
        }

        var allowChildAnimations, parentRunningAnimation, hasParent;
        do {
          //the element did not reach the root element which means that it
          //is not apart of the DOM. Therefore there is no reason to do
          //any animations on it
          if (parentElement.length === 0) break;

          var isRoot = isMatchingElement(parentElement, $rootElement);
          var state = isRoot ? rootAnimateState : (parentElement.data(NG_ANIMATE_STATE) || {});
          if (state.disabled) {
            return true;
          }

          //no matter what, for an animation to work it must reach the root element
          //this implies that the element is attached to the DOM when the animation is run
          if (isRoot) {
            hasParent = true;
          }

          //once a flag is found that is strictly false then everything before
          //it will be discarded and all child animations will be restricted
          if (allowChildAnimations !== false) {
            var animateChildrenFlag = parentElement.data(NG_ANIMATE_CHILDREN);
            if(angular.isDefined(animateChildrenFlag)) {
              allowChildAnimations = animateChildrenFlag;
            }
          }

          parentRunningAnimation = parentRunningAnimation ||
                                   state.running ||
                                   (state.last && !state.last.isClassBased);
        }
        while(parentElement = parentElement.parent());

        return !hasParent || (!allowChildAnimations && parentRunningAnimation);
      }
    }]);

    $animateProvider.register('', ['$window', '$sniffer', '$timeout', '$$animateReflow',
                           function($window,   $sniffer,   $timeout,   $$animateReflow) {
      // Detect proper transitionend/animationend event names.
      var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

      // If unprefixed events are not supported but webkit-prefixed are, use the latter.
      // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
      // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
      // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
      // Register both events in case `window.onanimationend` is not supported because of that,
      // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
      // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
      // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        CSS_PREFIX = '-webkit-';
        TRANSITION_PROP = 'WebkitTransition';
        TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
      } else {
        TRANSITION_PROP = 'transition';
        TRANSITIONEND_EVENT = 'transitionend';
      }

      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        CSS_PREFIX = '-webkit-';
        ANIMATION_PROP = 'WebkitAnimation';
        ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
      } else {
        ANIMATION_PROP = 'animation';
        ANIMATIONEND_EVENT = 'animationend';
      }

      var DURATION_KEY = 'Duration';
      var PROPERTY_KEY = 'Property';
      var DELAY_KEY = 'Delay';
      var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
      var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
      var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
      var NG_ANIMATE_BLOCK_CLASS_NAME = 'ng-animate-block-transitions';
      var ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
      var CLOSING_TIME_BUFFER = 1.5;
      var ONE_SECOND = 1000;

      var lookupCache = {};
      var parentCounter = 0;
      var animationReflowQueue = [];
      var cancelAnimationReflow;
      function clearCacheAfterReflow() {
        if (!cancelAnimationReflow) {
          cancelAnimationReflow = $$animateReflow(function() {
            animationReflowQueue = [];
            cancelAnimationReflow = null;
            lookupCache = {};
          });
        }
      }

      function afterReflow(element, callback) {
        if(cancelAnimationReflow) {
          cancelAnimationReflow();
        }
        animationReflowQueue.push(callback);
        cancelAnimationReflow = $$animateReflow(function() {
          forEach(animationReflowQueue, function(fn) {
            fn();
          });

          animationReflowQueue = [];
          cancelAnimationReflow = null;
          lookupCache = {};
        });
      }

      var closingTimer = null;
      var closingTimestamp = 0;
      var animationElementQueue = [];
      function animationCloseHandler(element, totalTime) {
        var node = extractElementNode(element);
        element = angular.element(node);

        //this item will be garbage collected by the closing
        //animation timeout
        animationElementQueue.push(element);

        //but it may not need to cancel out the existing timeout
        //if the timestamp is less than the previous one
        var futureTimestamp = Date.now() + totalTime;
        if(futureTimestamp <= closingTimestamp) {
          return;
        }

        $timeout.cancel(closingTimer);

        closingTimestamp = futureTimestamp;
        closingTimer = $timeout(function() {
          closeAllAnimations(animationElementQueue);
          animationElementQueue = [];
        }, totalTime, false);
      }

      function closeAllAnimations(elements) {
        forEach(elements, function(element) {
          var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
          if(elementData) {
            (elementData.closeAnimationFn || noop)();
          }
        });
      }

      function getElementAnimationDetails(element, cacheKey) {
        var data = cacheKey ? lookupCache[cacheKey] : null;
        if(!data) {
          var transitionDuration = 0;
          var transitionDelay = 0;
          var animationDuration = 0;
          var animationDelay = 0;
          var transitionDelayStyle;
          var animationDelayStyle;
          var transitionDurationStyle;
          var transitionPropertyStyle;

          //we want all the styles defined before and after
          forEach(element, function(element) {
            if (element.nodeType == ELEMENT_NODE) {
              var elementStyles = $window.getComputedStyle(element) || {};

              transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];

              transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);

              transitionPropertyStyle = elementStyles[TRANSITION_PROP + PROPERTY_KEY];

              transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];

              transitionDelay  = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);

              animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];

              animationDelay   = Math.max(parseMaxTime(animationDelayStyle), animationDelay);

              var aDuration  = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);

              if(aDuration > 0) {
                aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
              }

              animationDuration = Math.max(aDuration, animationDuration);
            }
          });
          data = {
            total : 0,
            transitionPropertyStyle: transitionPropertyStyle,
            transitionDurationStyle: transitionDurationStyle,
            transitionDelayStyle: transitionDelayStyle,
            transitionDelay: transitionDelay,
            transitionDuration: transitionDuration,
            animationDelayStyle: animationDelayStyle,
            animationDelay: animationDelay,
            animationDuration: animationDuration
          };
          if(cacheKey) {
            lookupCache[cacheKey] = data;
          }
        }
        return data;
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = angular.isString(str) ?
          str.split(/\s*,\s*/) :
          [];
        forEach(values, function(value) {
          maxValue = Math.max(parseFloat(value) || 0, maxValue);
        });
        return maxValue;
      }

      function getCacheKey(element) {
        var parentElement = element.parent();
        var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
        if(!parentID) {
          parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
          parentID = parentCounter;
        }
        return parentID + '-' + extractElementNode(element).getAttribute('class');
      }

      function animateSetup(animationEvent, element, className, calculationDecorator) {
        var cacheKey = getCacheKey(element);
        var eventCacheKey = cacheKey + ' ' + className;
        var itemIndex = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;

        var stagger = {};
        if(itemIndex > 0) {
          var staggerClassName = className + '-stagger';
          var staggerCacheKey = cacheKey + ' ' + staggerClassName;
          var applyClasses = !lookupCache[staggerCacheKey];

          applyClasses && element.addClass(staggerClassName);

          stagger = getElementAnimationDetails(element, staggerCacheKey);

          applyClasses && element.removeClass(staggerClassName);
        }

        /* the animation itself may need to add/remove special CSS classes
         * before calculating the anmation styles */
        calculationDecorator = calculationDecorator ||
                               function(fn) { return fn(); };

        element.addClass(className);

        var formerData = element.data(NG_ANIMATE_CSS_DATA_KEY) || {};

        var timings = calculationDecorator(function() {
          return getElementAnimationDetails(element, eventCacheKey);
        });

        var transitionDuration = timings.transitionDuration;
        var animationDuration = timings.animationDuration;
        if(transitionDuration === 0 && animationDuration === 0) {
          element.removeClass(className);
          return false;
        }

        element.data(NG_ANIMATE_CSS_DATA_KEY, {
          running : formerData.running || 0,
          itemIndex : itemIndex,
          stagger : stagger,
          timings : timings,
          closeAnimationFn : noop
        });

        //temporarily disable the transition so that the enter styles
        //don't animate twice (this is here to avoid a bug in Chrome/FF).
        var isCurrentlyAnimating = formerData.running > 0 || animationEvent == 'setClass';
        if(transitionDuration > 0) {
          blockTransitions(element, className, isCurrentlyAnimating);
        }

        //staggering keyframe animations work by adjusting the `animation-delay` CSS property
        //on the given element, however, the delay value can only calculated after the reflow
        //since by that time $animate knows how many elements are being animated. Therefore,
        //until the reflow occurs the element needs to be blocked (where the keyframe animation
        //is set to `none 0s`). This blocking mechanism should only be set for when a stagger
        //animation is detected and when the element item index is greater than 0.
        if(animationDuration > 0 && stagger.animationDelay > 0 && stagger.animationDuration === 0) {
          blockKeyframeAnimations(element);
        }

        return true;
      }

      function isStructuralAnimation(className) {
        return className == 'ng-enter' || className == 'ng-move' || className == 'ng-leave';
      }

      function blockTransitions(element, className, isAnimating) {
        if(isStructuralAnimation(className) || !isAnimating) {
          extractElementNode(element).style[TRANSITION_PROP + PROPERTY_KEY] = 'none';
        } else {
          element.addClass(NG_ANIMATE_BLOCK_CLASS_NAME);
        }
      }

      function blockKeyframeAnimations(element) {
        extractElementNode(element).style[ANIMATION_PROP] = 'none 0s';
      }

      function unblockTransitions(element, className) {
        var prop = TRANSITION_PROP + PROPERTY_KEY;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
        element.removeClass(NG_ANIMATE_BLOCK_CLASS_NAME);
      }

      function unblockKeyframeAnimations(element) {
        var prop = ANIMATION_PROP;
        var node = extractElementNode(element);
        if(node.style[prop] && node.style[prop].length > 0) {
          node.style[prop] = '';
        }
      }

      function animateRun(animationEvent, element, className, activeAnimationComplete) {
        var node = extractElementNode(element);
        var elementData = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(node.getAttribute('class').indexOf(className) == -1 || !elementData) {
          activeAnimationComplete();
          return;
        }

        var activeClassName = '';
        forEach(className.split(' '), function(klass, i) {
          activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
        });

        var stagger = elementData.stagger;
        var timings = elementData.timings;
        var itemIndex = elementData.itemIndex;
        var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
        var maxDelay = Math.max(timings.transitionDelay, timings.animationDelay);
        var maxDelayTime = maxDelay * ONE_SECOND;

        var startTime = Date.now();
        var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;

        var style = '', appliedStyles = [];
        if(timings.transitionDuration > 0) {
          var propertyStyle = timings.transitionPropertyStyle;
          if(propertyStyle.indexOf('all') == -1) {
            style += CSS_PREFIX + 'transition-property: ' + propertyStyle + ';';
            style += CSS_PREFIX + 'transition-duration: ' + timings.transitionDurationStyle + ';';
            appliedStyles.push(CSS_PREFIX + 'transition-property');
            appliedStyles.push(CSS_PREFIX + 'transition-duration');
          }
        }

        if(itemIndex > 0) {
          if(stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
            var delayStyle = timings.transitionDelayStyle;
            style += CSS_PREFIX + 'transition-delay: ' +
                     prepareStaggerDelay(delayStyle, stagger.transitionDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'transition-delay');
          }

          if(stagger.animationDelay > 0 && stagger.animationDuration === 0) {
            style += CSS_PREFIX + 'animation-delay: ' +
                     prepareStaggerDelay(timings.animationDelayStyle, stagger.animationDelay, itemIndex) + '; ';
            appliedStyles.push(CSS_PREFIX + 'animation-delay');
          }
        }

        if(appliedStyles.length > 0) {
          //the element being animated may sometimes contain comment nodes in
          //the jqLite object, so we're safe to use a single variable to house
          //the styles since there is always only one element being animated
          var oldStyle = node.getAttribute('style') || '';
          node.setAttribute('style', oldStyle + '; ' + style);
        }

        element.on(css3AnimationEvents, onAnimationProgress);
        element.addClass(activeClassName);
        elementData.closeAnimationFn = function() {
          onEnd();
          activeAnimationComplete();
        };

        var staggerTime       = itemIndex * (Math.max(stagger.animationDelay, stagger.transitionDelay) || 0);
        var animationTime     = (maxDelay + maxDuration) * CLOSING_TIME_BUFFER;
        var totalTime         = (staggerTime + animationTime) * ONE_SECOND;

        elementData.running++;
        animationCloseHandler(element, totalTime);
        return onEnd;

        // This will automatically be called by $animate so
        // there is no need to attach this internally to the
        // timeout done method.
        function onEnd(cancelled) {
          element.off(css3AnimationEvents, onAnimationProgress);
          element.removeClass(activeClassName);
          animateClose(element, className);
          var node = extractElementNode(element);
          for (var i in appliedStyles) {
            node.style.removeProperty(appliedStyles[i]);
          }
        }

        function onAnimationProgress(event) {
          event.stopPropagation();
          var ev = event.originalEvent || event;
          var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();

          /* Firefox (or possibly just Gecko) likes to not round values up
           * when a ms measurement is used for the animation */
          var elapsedTime = parseFloat(ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES));

          /* $manualTimeStamp is a mocked timeStamp value which is set
           * within browserTrigger(). This is only here so that tests can
           * mock animations properly. Real events fallback to event.timeStamp,
           * or, if they don't, then a timeStamp is automatically created for them.
           * We're checking to see if the timeStamp surpasses the expected delay,
           * but we're using elapsedTime instead of the timeStamp on the 2nd
           * pre-condition since animations sometimes close off early */
          if(Math.max(timeStamp - startTime, 0) >= maxDelayTime && elapsedTime >= maxDuration) {
            activeAnimationComplete();
          }
        }
      }

      function prepareStaggerDelay(delayStyle, staggerDelay, index) {
        var style = '';
        forEach(delayStyle.split(','), function(val, i) {
          style += (i > 0 ? ',' : '') +
                   (index * staggerDelay + parseInt(val, 10)) + 's';
        });
        return style;
      }

      function animateBefore(animationEvent, element, className, calculationDecorator) {
        if(animateSetup(animationEvent, element, className, calculationDecorator)) {
          return function(cancelled) {
            cancelled && animateClose(element, className);
          };
        }
      }

      function animateAfter(animationEvent, element, className, afterAnimationComplete) {
        if(element.data(NG_ANIMATE_CSS_DATA_KEY)) {
          return animateRun(animationEvent, element, className, afterAnimationComplete);
        } else {
          animateClose(element, className);
          afterAnimationComplete();
        }
      }

      function animate(animationEvent, element, className, animationComplete) {
        //If the animateSetup function doesn't bother returning a
        //cancellation function then it means that there is no animation
        //to perform at all
        var preReflowCancellation = animateBefore(animationEvent, element, className);
        if (!preReflowCancellation) {
          clearCacheAfterReflow();
          animationComplete();
          return;
        }

        //There are two cancellation functions: one is before the first
        //reflow animation and the second is during the active state
        //animation. The first function will take care of removing the
        //data from the element which will not make the 2nd animation
        //happen in the first place
        var cancel = preReflowCancellation;
        afterReflow(element, function() {
          unblockTransitions(element, className);
          unblockKeyframeAnimations(element);
          //once the reflow is complete then we point cancel to
          //the new cancellation function which will remove all of the
          //animation properties from the active animation
          cancel = animateAfter(animationEvent, element, className, animationComplete);
        });

        return function(cancelled) {
          (cancel || noop)(cancelled);
        };
      }

      function animateClose(element, className) {
        element.removeClass(className);
        var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(data) {
          if(data.running) {
            data.running--;
          }
          if(!data.running || data.running === 0) {
            element.removeData(NG_ANIMATE_CSS_DATA_KEY);
          }
        }
      }

      return {
        enter : function(element, animationCompleted) {
          return animate('enter', element, 'ng-enter', animationCompleted);
        },

        leave : function(element, animationCompleted) {
          return animate('leave', element, 'ng-leave', animationCompleted);
        },

        move : function(element, animationCompleted) {
          return animate('move', element, 'ng-move', animationCompleted);
        },

        beforeSetClass : function(element, add, remove, animationCompleted) {
          var className = suffixClasses(remove, '-remove') + ' ' +
                          suffixClasses(add, '-add');
          var cancellationMethod = animateBefore('setClass', element, className, function(fn) {
            /* when classes are removed from an element then the transition style
             * that is applied is the transition defined on the element without the
             * CSS class being there. This is how CSS3 functions outside of ngAnimate.
             * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
            var klass = element.attr('class');
            element.removeClass(remove);
            element.addClass(add);
            var timings = fn();
            element.attr('class', klass);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          clearCacheAfterReflow();
          animationCompleted();
        },

        beforeAddClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore('addClass', element, suffixClasses(className, '-add'), function(fn) {

            /* when a CSS class is added to an element then the transition style that
             * is applied is the transition defined on the element when the CSS class
             * is added at the time of the animation. This is how CSS3 functions
             * outside of ngAnimate. */
            element.addClass(className);
            var timings = fn();
            element.removeClass(className);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          clearCacheAfterReflow();
          animationCompleted();
        },

        setClass : function(element, add, remove, animationCompleted) {
          remove = suffixClasses(remove, '-remove');
          add = suffixClasses(add, '-add');
          var className = remove + ' ' + add;
          return animateAfter('setClass', element, className, animationCompleted);
        },

        addClass : function(element, className, animationCompleted) {
          return animateAfter('addClass', element, suffixClasses(className, '-add'), animationCompleted);
        },

        beforeRemoveClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore('removeClass', element, suffixClasses(className, '-remove'), function(fn) {
            /* when classes are removed from an element then the transition style
             * that is applied is the transition defined on the element without the
             * CSS class being there. This is how CSS3 functions outside of ngAnimate.
             * http://plnkr.co/edit/j8OzgTNxHTb4n3zLyjGW?p=preview */
            var klass = element.attr('class');
            element.removeClass(className);
            var timings = fn();
            element.attr('class', klass);
            return timings;
          });

          if(cancellationMethod) {
            afterReflow(element, function() {
              unblockTransitions(element, className);
              unblockKeyframeAnimations(element);
              animationCompleted();
            });
            return cancellationMethod;
          }
          animationCompleted();
        },

        removeClass : function(element, className, animationCompleted) {
          return animateAfter('removeClass', element, suffixClasses(className, '-remove'), animationCompleted);
        }
      };

      function suffixClasses(classes, suffix) {
        var className = '';
        classes = angular.isArray(classes) ? classes : classes.split(/\s+/);
        forEach(classes, function(klass, i) {
          if(klass && klass.length > 0) {
            className += (i > 0 ? ' ' : '') + klass + suffix;
          }
        });
        return className;
      }
    }]);
  }]);


})(window, window.angular);

/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) lodash.com/license | Underscore.js 1.5.2 underscorejs.org/LICENSE
 * Build: `lodash modern -o ./dist/lodash.js`
 */
;(function(){function n(n,t,e){e=(e||0)-1;for(var r=n?n.length:0;++e<r;)if(n[e]===t)return e;return-1}function t(t,e){var r=typeof e;if(t=t.l,"boolean"==r||null==e)return t[e]?0:-1;"number"!=r&&"string"!=r&&(r="object");var u="number"==r?e:m+e;return t=(t=t[r])&&t[u],"object"==r?t&&-1<n(t,e)?0:-1:t?0:-1}function e(n){var t=this.l,e=typeof n;if("boolean"==e||null==n)t[n]=true;else{"number"!=e&&"string"!=e&&(e="object");var r="number"==e?n:m+n,t=t[e]||(t[e]={});"object"==e?(t[r]||(t[r]=[])).push(n):t[r]=true
}}function r(n){return n.charCodeAt(0)}function u(n,t){for(var e=n.m,r=t.m,u=-1,o=e.length;++u<o;){var i=e[u],a=r[u];if(i!==a){if(i>a||typeof i=="undefined")return 1;if(i<a||typeof a=="undefined")return-1}}return n.n-t.n}function o(n){var t=-1,r=n.length,u=n[0],o=n[r/2|0],i=n[r-1];if(u&&typeof u=="object"&&o&&typeof o=="object"&&i&&typeof i=="object")return false;for(u=f(),u["false"]=u["null"]=u["true"]=u.undefined=false,o=f(),o.k=n,o.l=u,o.push=e;++t<r;)o.push(n[t]);return o}function i(n){return"\\"+U[n]
}function a(){return h.pop()||[]}function f(){return g.pop()||{k:null,l:null,m:null,"false":false,n:0,"null":false,number:null,object:null,push:null,string:null,"true":false,undefined:false,o:null}}function l(n){n.length=0,h.length<_&&h.push(n)}function c(n){var t=n.l;t&&c(t),n.k=n.l=n.m=n.object=n.number=n.string=n.o=null,g.length<_&&g.push(n)}function p(n,t,e){t||(t=0),typeof e=="undefined"&&(e=n?n.length:0);var r=-1;e=e-t||0;for(var u=Array(0>e?0:e);++r<e;)u[r]=n[t+r];return u}function s(e){function h(n,t,e){if(!n||!V[typeof n])return n;
t=t&&typeof e=="undefined"?t:tt(t,e,3);for(var r=-1,u=V[typeof n]&&Fe(n),o=u?u.length:0;++r<o&&(e=u[r],false!==t(n[e],e,n)););return n}function g(n,t,e){var r;if(!n||!V[typeof n])return n;t=t&&typeof e=="undefined"?t:tt(t,e,3);for(r in n)if(false===t(n[r],r,n))break;return n}function _(n,t,e){var r,u=n,o=u;if(!u)return o;for(var i=arguments,a=0,f=typeof e=="number"?2:i.length;++a<f;)if((u=i[a])&&V[typeof u])for(var l=-1,c=V[typeof u]&&Fe(u),p=c?c.length:0;++l<p;)r=c[l],"undefined"==typeof o[r]&&(o[r]=u[r]);
return o}function U(n,t,e){var r,u=n,o=u;if(!u)return o;var i=arguments,a=0,f=typeof e=="number"?2:i.length;if(3<f&&"function"==typeof i[f-2])var l=tt(i[--f-1],i[f--],2);else 2<f&&"function"==typeof i[f-1]&&(l=i[--f]);for(;++a<f;)if((u=i[a])&&V[typeof u])for(var c=-1,p=V[typeof u]&&Fe(u),s=p?p.length:0;++c<s;)r=p[c],o[r]=l?l(o[r],u[r]):u[r];return o}function H(n){var t,e=[];if(!n||!V[typeof n])return e;for(t in n)me.call(n,t)&&e.push(t);return e}function J(n){return n&&typeof n=="object"&&!Te(n)&&me.call(n,"__wrapped__")?n:new Q(n)
}function Q(n,t){this.__chain__=!!t,this.__wrapped__=n}function X(n){function t(){if(r){var n=p(r);be.apply(n,arguments)}if(this instanceof t){var o=nt(e.prototype),n=e.apply(o,n||arguments);return wt(n)?n:o}return e.apply(u,n||arguments)}var e=n[0],r=n[2],u=n[4];return $e(t,n),t}function Z(n,t,e,r,u){if(e){var o=e(n);if(typeof o!="undefined")return o}if(!wt(n))return n;var i=ce.call(n);if(!K[i])return n;var f=Ae[i];switch(i){case T:case F:return new f(+n);case W:case P:return new f(n);case z:return o=f(n.source,C.exec(n)),o.lastIndex=n.lastIndex,o
}if(i=Te(n),t){var c=!r;r||(r=a()),u||(u=a());for(var s=r.length;s--;)if(r[s]==n)return u[s];o=i?f(n.length):{}}else o=i?p(n):U({},n);return i&&(me.call(n,"index")&&(o.index=n.index),me.call(n,"input")&&(o.input=n.input)),t?(r.push(n),u.push(o),(i?St:h)(n,function(n,i){o[i]=Z(n,t,e,r,u)}),c&&(l(r),l(u)),o):o}function nt(n){return wt(n)?ke(n):{}}function tt(n,t,e){if(typeof n!="function")return Ut;if(typeof t=="undefined"||!("prototype"in n))return n;var r=n.__bindData__;if(typeof r=="undefined"&&(De.funcNames&&(r=!n.name),r=r||!De.funcDecomp,!r)){var u=ge.call(n);
De.funcNames||(r=!O.test(u)),r||(r=E.test(u),$e(n,r))}if(false===r||true!==r&&1&r[1])return n;switch(e){case 1:return function(e){return n.call(t,e)};case 2:return function(e,r){return n.call(t,e,r)};case 3:return function(e,r,u){return n.call(t,e,r,u)};case 4:return function(e,r,u,o){return n.call(t,e,r,u,o)}}return Mt(n,t)}function et(n){function t(){var n=f?i:this;if(u){var h=p(u);be.apply(h,arguments)}return(o||c)&&(h||(h=p(arguments)),o&&be.apply(h,o),c&&h.length<a)?(r|=16,et([e,s?r:-4&r,h,null,i,a])):(h||(h=arguments),l&&(e=n[v]),this instanceof t?(n=nt(e.prototype),h=e.apply(n,h),wt(h)?h:n):e.apply(n,h))
}var e=n[0],r=n[1],u=n[2],o=n[3],i=n[4],a=n[5],f=1&r,l=2&r,c=4&r,s=8&r,v=e;return $e(t,n),t}function rt(e,r){var u=-1,i=st(),a=e?e.length:0,f=a>=b&&i===n,l=[];if(f){var p=o(r);p?(i=t,r=p):f=false}for(;++u<a;)p=e[u],0>i(r,p)&&l.push(p);return f&&c(r),l}function ut(n,t,e,r){r=(r||0)-1;for(var u=n?n.length:0,o=[];++r<u;){var i=n[r];if(i&&typeof i=="object"&&typeof i.length=="number"&&(Te(i)||yt(i))){t||(i=ut(i,t,e));var a=-1,f=i.length,l=o.length;for(o.length+=f;++a<f;)o[l++]=i[a]}else e||o.push(i)}return o
}function ot(n,t,e,r,u,o){if(e){var i=e(n,t);if(typeof i!="undefined")return!!i}if(n===t)return 0!==n||1/n==1/t;if(n===n&&!(n&&V[typeof n]||t&&V[typeof t]))return false;if(null==n||null==t)return n===t;var f=ce.call(n),c=ce.call(t);if(f==D&&(f=q),c==D&&(c=q),f!=c)return false;switch(f){case T:case F:return+n==+t;case W:return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case z:case P:return n==oe(t)}if(c=f==$,!c){var p=me.call(n,"__wrapped__"),s=me.call(t,"__wrapped__");if(p||s)return ot(p?n.__wrapped__:n,s?t.__wrapped__:t,e,r,u,o);
if(f!=q)return false;if(f=n.constructor,p=t.constructor,f!=p&&!(dt(f)&&f instanceof f&&dt(p)&&p instanceof p)&&"constructor"in n&&"constructor"in t)return false}for(f=!u,u||(u=a()),o||(o=a()),p=u.length;p--;)if(u[p]==n)return o[p]==t;var v=0,i=true;if(u.push(n),o.push(t),c){if(p=n.length,v=t.length,(i=v==p)||r)for(;v--;)if(c=p,s=t[v],r)for(;c--&&!(i=ot(n[c],s,e,r,u,o)););else if(!(i=ot(n[v],s,e,r,u,o)))break}else g(t,function(t,a,f){return me.call(f,a)?(v++,i=me.call(n,a)&&ot(n[a],t,e,r,u,o)):void 0}),i&&!r&&g(n,function(n,t,e){return me.call(e,t)?i=-1<--v:void 0
});return u.pop(),o.pop(),f&&(l(u),l(o)),i}function it(n,t,e,r,u){(Te(t)?St:h)(t,function(t,o){var i,a,f=t,l=n[o];if(t&&((a=Te(t))||Pe(t))){for(f=r.length;f--;)if(i=r[f]==t){l=u[f];break}if(!i){var c;e&&(f=e(l,t),c=typeof f!="undefined")&&(l=f),c||(l=a?Te(l)?l:[]:Pe(l)?l:{}),r.push(t),u.push(l),c||it(l,t,e,r,u)}}else e&&(f=e(l,t),typeof f=="undefined"&&(f=t)),typeof f!="undefined"&&(l=f);n[o]=l})}function at(n,t){return n+he(Re()*(t-n+1))}function ft(e,r,u){var i=-1,f=st(),p=e?e.length:0,s=[],v=!r&&p>=b&&f===n,h=u||v?a():s;
for(v&&(h=o(h),f=t);++i<p;){var g=e[i],y=u?u(g,i,e):g;(r?!i||h[h.length-1]!==y:0>f(h,y))&&((u||v)&&h.push(y),s.push(g))}return v?(l(h.k),c(h)):u&&l(h),s}function lt(n){return function(t,e,r){var u={};e=J.createCallback(e,r,3),r=-1;var o=t?t.length:0;if(typeof o=="number")for(;++r<o;){var i=t[r];n(u,i,e(i,r,t),t)}else h(t,function(t,r,o){n(u,t,e(t,r,o),o)});return u}}function ct(n,t,e,r,u,o){var i=1&t,a=4&t,f=16&t,l=32&t;if(!(2&t||dt(n)))throw new ie;f&&!e.length&&(t&=-17,f=e=false),l&&!r.length&&(t&=-33,l=r=false);
var c=n&&n.__bindData__;return c&&true!==c?(c=p(c),c[2]&&(c[2]=p(c[2])),c[3]&&(c[3]=p(c[3])),!i||1&c[1]||(c[4]=u),!i&&1&c[1]&&(t|=8),!a||4&c[1]||(c[5]=o),f&&be.apply(c[2]||(c[2]=[]),e),l&&we.apply(c[3]||(c[3]=[]),r),c[1]|=t,ct.apply(null,c)):(1==t||17===t?X:et)([n,t,e,r,u,o])}function pt(n){return Be[n]}function st(){var t=(t=J.indexOf)===Wt?n:t;return t}function vt(n){return typeof n=="function"&&pe.test(n)}function ht(n){var t,e;return n&&ce.call(n)==q&&(t=n.constructor,!dt(t)||t instanceof t)?(g(n,function(n,t){e=t
}),typeof e=="undefined"||me.call(n,e)):false}function gt(n){return We[n]}function yt(n){return n&&typeof n=="object"&&typeof n.length=="number"&&ce.call(n)==D||false}function mt(n,t,e){var r=Fe(n),u=r.length;for(t=tt(t,e,3);u--&&(e=r[u],false!==t(n[e],e,n)););return n}function bt(n){var t=[];return g(n,function(n,e){dt(n)&&t.push(e)}),t.sort()}function _t(n){for(var t=-1,e=Fe(n),r=e.length,u={};++t<r;){var o=e[t];u[n[o]]=o}return u}function dt(n){return typeof n=="function"}function wt(n){return!(!n||!V[typeof n])
}function jt(n){return typeof n=="number"||n&&typeof n=="object"&&ce.call(n)==W||false}function kt(n){return typeof n=="string"||n&&typeof n=="object"&&ce.call(n)==P||false}function xt(n){for(var t=-1,e=Fe(n),r=e.length,u=Xt(r);++t<r;)u[t]=n[e[t]];return u}function Ct(n,t,e){var r=-1,u=st(),o=n?n.length:0,i=false;return e=(0>e?Ie(0,o+e):e)||0,Te(n)?i=-1<u(n,t,e):typeof o=="number"?i=-1<(kt(n)?n.indexOf(t,e):u(n,t,e)):h(n,function(n){return++r<e?void 0:!(i=n===t)}),i}function Ot(n,t,e){var r=true;t=J.createCallback(t,e,3),e=-1;
var u=n?n.length:0;if(typeof u=="number")for(;++e<u&&(r=!!t(n[e],e,n)););else h(n,function(n,e,u){return r=!!t(n,e,u)});return r}function Nt(n,t,e){var r=[];t=J.createCallback(t,e,3),e=-1;var u=n?n.length:0;if(typeof u=="number")for(;++e<u;){var o=n[e];t(o,e,n)&&r.push(o)}else h(n,function(n,e,u){t(n,e,u)&&r.push(n)});return r}function It(n,t,e){t=J.createCallback(t,e,3),e=-1;var r=n?n.length:0;if(typeof r!="number"){var u;return h(n,function(n,e,r){return t(n,e,r)?(u=n,false):void 0}),u}for(;++e<r;){var o=n[e];
if(t(o,e,n))return o}}function St(n,t,e){var r=-1,u=n?n.length:0;if(t=t&&typeof e=="undefined"?t:tt(t,e,3),typeof u=="number")for(;++r<u&&false!==t(n[r],r,n););else h(n,t);return n}function Et(n,t,e){var r=n?n.length:0;if(t=t&&typeof e=="undefined"?t:tt(t,e,3),typeof r=="number")for(;r--&&false!==t(n[r],r,n););else{var u=Fe(n),r=u.length;h(n,function(n,e,o){return e=u?u[--r]:--r,t(o[e],e,o)})}return n}function Rt(n,t,e){var r=-1,u=n?n.length:0;if(t=J.createCallback(t,e,3),typeof u=="number")for(var o=Xt(u);++r<u;)o[r]=t(n[r],r,n);
else o=[],h(n,function(n,e,u){o[++r]=t(n,e,u)});return o}function At(n,t,e){var u=-1/0,o=u;if(typeof t!="function"&&e&&e[t]===n&&(t=null),null==t&&Te(n)){e=-1;for(var i=n.length;++e<i;){var a=n[e];a>o&&(o=a)}}else t=null==t&&kt(n)?r:J.createCallback(t,e,3),St(n,function(n,e,r){e=t(n,e,r),e>u&&(u=e,o=n)});return o}function Dt(n,t,e,r){if(!n)return e;var u=3>arguments.length;t=J.createCallback(t,r,4);var o=-1,i=n.length;if(typeof i=="number")for(u&&(e=n[++o]);++o<i;)e=t(e,n[o],o,n);else h(n,function(n,r,o){e=u?(u=false,n):t(e,n,r,o)
});return e}function $t(n,t,e,r){var u=3>arguments.length;return t=J.createCallback(t,r,4),Et(n,function(n,r,o){e=u?(u=false,n):t(e,n,r,o)}),e}function Tt(n){var t=-1,e=n?n.length:0,r=Xt(typeof e=="number"?e:0);return St(n,function(n){var e=at(0,++t);r[t]=r[e],r[e]=n}),r}function Ft(n,t,e){var r;t=J.createCallback(t,e,3),e=-1;var u=n?n.length:0;if(typeof u=="number")for(;++e<u&&!(r=t(n[e],e,n)););else h(n,function(n,e,u){return!(r=t(n,e,u))});return!!r}function Bt(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=-1;
for(t=J.createCallback(t,e,3);++o<u&&t(n[o],o,n);)r++}else if(r=t,null==r||e)return n?n[0]:v;return p(n,0,Se(Ie(0,r),u))}function Wt(t,e,r){if(typeof r=="number"){var u=t?t.length:0;r=0>r?Ie(0,u+r):r||0}else if(r)return r=zt(t,e),t[r]===e?r:-1;return n(t,e,r)}function qt(n,t,e){if(typeof t!="number"&&null!=t){var r=0,u=-1,o=n?n.length:0;for(t=J.createCallback(t,e,3);++u<o&&t(n[u],u,n);)r++}else r=null==t||e?1:Ie(0,t);return p(n,r)}function zt(n,t,e,r){var u=0,o=n?n.length:u;for(e=e?J.createCallback(e,r,1):Ut,t=e(t);u<o;)r=u+o>>>1,e(n[r])<t?u=r+1:o=r;
return u}function Pt(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=typeof t!="function"&&r&&r[t]===n?null:t,t=false),null!=e&&(e=J.createCallback(e,r,3)),ft(n,t,e)}function Kt(){for(var n=1<arguments.length?arguments:arguments[0],t=-1,e=n?At(Ve(n,"length")):0,r=Xt(0>e?0:e);++t<e;)r[t]=Ve(n,t);return r}function Lt(n,t){var e=-1,r=n?n.length:0,u={};for(t||!r||Te(n[0])||(t=[]);++e<r;){var o=n[e];t?u[o]=t[e]:o&&(u[o[0]]=o[1])}return u}function Mt(n,t){return 2<arguments.length?ct(n,17,p(arguments,2),null,t):ct(n,1,null,null,t)
}function Vt(n,t,e){function r(){c&&ve(c),i=c=p=v,(g||h!==t)&&(s=Ue(),a=n.apply(l,o),c||i||(o=l=null))}function u(){var e=t-(Ue()-f);0<e?c=_e(u,e):(i&&ve(i),e=p,i=c=p=v,e&&(s=Ue(),a=n.apply(l,o),c||i||(o=l=null)))}var o,i,a,f,l,c,p,s=0,h=false,g=true;if(!dt(n))throw new ie;if(t=Ie(0,t)||0,true===e)var y=true,g=false;else wt(e)&&(y=e.leading,h="maxWait"in e&&(Ie(t,e.maxWait)||0),g="trailing"in e?e.trailing:g);return function(){if(o=arguments,f=Ue(),l=this,p=g&&(c||!y),false===h)var e=y&&!c;else{i||y||(s=f);var v=h-(f-s),m=0>=v;
m?(i&&(i=ve(i)),s=f,a=n.apply(l,o)):i||(i=_e(r,v))}return m&&c?c=ve(c):c||t===h||(c=_e(u,t)),e&&(m=true,a=n.apply(l,o)),!m||c||i||(o=l=null),a}}function Ut(n){return n}function Gt(n,t,e){var r=true,u=t&&bt(t);t&&(e||u.length)||(null==e&&(e=t),o=Q,t=n,n=J,u=bt(t)),false===e?r=false:wt(e)&&"chain"in e&&(r=e.chain);var o=n,i=dt(o);St(u,function(e){var u=n[e]=t[e];i&&(o.prototype[e]=function(){var t=this.__chain__,e=this.__wrapped__,i=[e];if(be.apply(i,arguments),i=u.apply(n,i),r||t){if(e===i&&wt(i))return this;
i=new o(i),i.__chain__=t}return i})})}function Ht(){}function Jt(n){return function(t){return t[n]}}function Qt(){return this.__wrapped__}e=e?Y.defaults(G.Object(),e,Y.pick(G,A)):G;var Xt=e.Array,Yt=e.Boolean,Zt=e.Date,ne=e.Function,te=e.Math,ee=e.Number,re=e.Object,ue=e.RegExp,oe=e.String,ie=e.TypeError,ae=[],fe=re.prototype,le=e._,ce=fe.toString,pe=ue("^"+oe(ce).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$"),se=te.ceil,ve=e.clearTimeout,he=te.floor,ge=ne.prototype.toString,ye=vt(ye=re.getPrototypeOf)&&ye,me=fe.hasOwnProperty,be=ae.push,_e=e.setTimeout,de=ae.splice,we=ae.unshift,je=function(){try{var n={},t=vt(t=re.defineProperty)&&t,e=t(n,n,n)&&t
}catch(r){}return e}(),ke=vt(ke=re.create)&&ke,xe=vt(xe=Xt.isArray)&&xe,Ce=e.isFinite,Oe=e.isNaN,Ne=vt(Ne=re.keys)&&Ne,Ie=te.max,Se=te.min,Ee=e.parseInt,Re=te.random,Ae={};Ae[$]=Xt,Ae[T]=Yt,Ae[F]=Zt,Ae[B]=ne,Ae[q]=re,Ae[W]=ee,Ae[z]=ue,Ae[P]=oe,Q.prototype=J.prototype;var De=J.support={};De.funcDecomp=!vt(e.a)&&E.test(s),De.funcNames=typeof ne.name=="string",J.templateSettings={escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:N,variable:"",imports:{_:J}},ke||(nt=function(){function n(){}return function(t){if(wt(t)){n.prototype=t;
var r=new n;n.prototype=null}return r||e.Object()}}());var $e=je?function(n,t){M.value=t,je(n,"__bindData__",M)}:Ht,Te=xe||function(n){return n&&typeof n=="object"&&typeof n.length=="number"&&ce.call(n)==$||false},Fe=Ne?function(n){return wt(n)?Ne(n):[]}:H,Be={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},We=_t(Be),qe=ue("("+Fe(We).join("|")+")","g"),ze=ue("["+Fe(Be).join("")+"]","g"),Pe=ye?function(n){if(!n||ce.call(n)!=q)return false;var t=n.valueOf,e=vt(t)&&(e=ye(t))&&ye(e);return e?n==e||ye(n)==e:ht(n)
}:ht,Ke=lt(function(n,t,e){me.call(n,e)?n[e]++:n[e]=1}),Le=lt(function(n,t,e){(me.call(n,e)?n[e]:n[e]=[]).push(t)}),Me=lt(function(n,t,e){n[e]=t}),Ve=Rt,Ue=vt(Ue=Zt.now)&&Ue||function(){return(new Zt).getTime()},Ge=8==Ee(d+"08")?Ee:function(n,t){return Ee(kt(n)?n.replace(I,""):n,t||0)};return J.after=function(n,t){if(!dt(t))throw new ie;return function(){return 1>--n?t.apply(this,arguments):void 0}},J.assign=U,J.at=function(n){for(var t=arguments,e=-1,r=ut(t,true,false,1),t=t[2]&&t[2][t[1]]===n?1:r.length,u=Xt(t);++e<t;)u[e]=n[r[e]];
return u},J.bind=Mt,J.bindAll=function(n){for(var t=1<arguments.length?ut(arguments,true,false,1):bt(n),e=-1,r=t.length;++e<r;){var u=t[e];n[u]=ct(n[u],1,null,null,n)}return n},J.bindKey=function(n,t){return 2<arguments.length?ct(t,19,p(arguments,2),null,n):ct(t,3,null,null,n)},J.chain=function(n){return n=new Q(n),n.__chain__=true,n},J.compact=function(n){for(var t=-1,e=n?n.length:0,r=[];++t<e;){var u=n[t];u&&r.push(u)}return r},J.compose=function(){for(var n=arguments,t=n.length;t--;)if(!dt(n[t]))throw new ie;
return function(){for(var t=arguments,e=n.length;e--;)t=[n[e].apply(this,t)];return t[0]}},J.constant=function(n){return function(){return n}},J.countBy=Ke,J.create=function(n,t){var e=nt(n);return t?U(e,t):e},J.createCallback=function(n,t,e){var r=typeof n;if(null==n||"function"==r)return tt(n,t,e);if("object"!=r)return Jt(n);var u=Fe(n),o=u[0],i=n[o];return 1!=u.length||i!==i||wt(i)?function(t){for(var e=u.length,r=false;e--&&(r=ot(t[u[e]],n[u[e]],null,true)););return r}:function(n){return n=n[o],i===n&&(0!==i||1/i==1/n)
}},J.curry=function(n,t){return t=typeof t=="number"?t:+t||n.length,ct(n,4,null,null,null,t)},J.debounce=Vt,J.defaults=_,J.defer=function(n){if(!dt(n))throw new ie;var t=p(arguments,1);return _e(function(){n.apply(v,t)},1)},J.delay=function(n,t){if(!dt(n))throw new ie;var e=p(arguments,2);return _e(function(){n.apply(v,e)},t)},J.difference=function(n){return rt(n,ut(arguments,true,true,1))},J.filter=Nt,J.flatten=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=typeof t!="function"&&r&&r[t]===n?null:t,t=false),null!=e&&(n=Rt(n,e,r)),ut(n,t)
},J.forEach=St,J.forEachRight=Et,J.forIn=g,J.forInRight=function(n,t,e){var r=[];g(n,function(n,t){r.push(t,n)});var u=r.length;for(t=tt(t,e,3);u--&&false!==t(r[u--],r[u],n););return n},J.forOwn=h,J.forOwnRight=mt,J.functions=bt,J.groupBy=Le,J.indexBy=Me,J.initial=function(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=u;for(t=J.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else r=null==t||e?1:t||r;return p(n,0,Se(Ie(0,u-r),u))},J.intersection=function(){for(var e=[],r=-1,u=arguments.length,i=a(),f=st(),p=f===n,s=a();++r<u;){var v=arguments[r];
(Te(v)||yt(v))&&(e.push(v),i.push(p&&v.length>=b&&o(r?e[r]:s)))}var p=e[0],h=-1,g=p?p.length:0,y=[];n:for(;++h<g;){var m=i[0],v=p[h];if(0>(m?t(m,v):f(s,v))){for(r=u,(m||s).push(v);--r;)if(m=i[r],0>(m?t(m,v):f(e[r],v)))continue n;y.push(v)}}for(;u--;)(m=i[u])&&c(m);return l(i),l(s),y},J.invert=_t,J.invoke=function(n,t){var e=p(arguments,2),r=-1,u=typeof t=="function",o=n?n.length:0,i=Xt(typeof o=="number"?o:0);return St(n,function(n){i[++r]=(u?t:n[t]).apply(n,e)}),i},J.keys=Fe,J.map=Rt,J.mapValues=function(n,t,e){var r={};
return t=J.createCallback(t,e,3),h(n,function(n,e,u){r[e]=t(n,e,u)}),r},J.max=At,J.memoize=function(n,t){function e(){var r=e.cache,u=t?t.apply(this,arguments):m+arguments[0];return me.call(r,u)?r[u]:r[u]=n.apply(this,arguments)}if(!dt(n))throw new ie;return e.cache={},e},J.merge=function(n){var t=arguments,e=2;if(!wt(n))return n;if("number"!=typeof t[2]&&(e=t.length),3<e&&"function"==typeof t[e-2])var r=tt(t[--e-1],t[e--],2);else 2<e&&"function"==typeof t[e-1]&&(r=t[--e]);for(var t=p(arguments,1,e),u=-1,o=a(),i=a();++u<e;)it(n,t[u],r,o,i);
return l(o),l(i),n},J.min=function(n,t,e){var u=1/0,o=u;if(typeof t!="function"&&e&&e[t]===n&&(t=null),null==t&&Te(n)){e=-1;for(var i=n.length;++e<i;){var a=n[e];a<o&&(o=a)}}else t=null==t&&kt(n)?r:J.createCallback(t,e,3),St(n,function(n,e,r){e=t(n,e,r),e<u&&(u=e,o=n)});return o},J.omit=function(n,t,e){var r={};if(typeof t!="function"){var u=[];g(n,function(n,t){u.push(t)});for(var u=rt(u,ut(arguments,true,false,1)),o=-1,i=u.length;++o<i;){var a=u[o];r[a]=n[a]}}else t=J.createCallback(t,e,3),g(n,function(n,e,u){t(n,e,u)||(r[e]=n)
});return r},J.once=function(n){var t,e;if(!dt(n))throw new ie;return function(){return t?e:(t=true,e=n.apply(this,arguments),n=null,e)}},J.pairs=function(n){for(var t=-1,e=Fe(n),r=e.length,u=Xt(r);++t<r;){var o=e[t];u[t]=[o,n[o]]}return u},J.partial=function(n){return ct(n,16,p(arguments,1))},J.partialRight=function(n){return ct(n,32,null,p(arguments,1))},J.pick=function(n,t,e){var r={};if(typeof t!="function")for(var u=-1,o=ut(arguments,true,false,1),i=wt(n)?o.length:0;++u<i;){var a=o[u];a in n&&(r[a]=n[a])
}else t=J.createCallback(t,e,3),g(n,function(n,e,u){t(n,e,u)&&(r[e]=n)});return r},J.pluck=Ve,J.property=Jt,J.pull=function(n){for(var t=arguments,e=0,r=t.length,u=n?n.length:0;++e<r;)for(var o=-1,i=t[e];++o<u;)n[o]===i&&(de.call(n,o--,1),u--);return n},J.range=function(n,t,e){n=+n||0,e=typeof e=="number"?e:+e||1,null==t&&(t=n,n=0);var r=-1;t=Ie(0,se((t-n)/(e||1)));for(var u=Xt(t);++r<t;)u[r]=n,n+=e;return u},J.reject=function(n,t,e){return t=J.createCallback(t,e,3),Nt(n,function(n,e,r){return!t(n,e,r)
})},J.remove=function(n,t,e){var r=-1,u=n?n.length:0,o=[];for(t=J.createCallback(t,e,3);++r<u;)e=n[r],t(e,r,n)&&(o.push(e),de.call(n,r--,1),u--);return o},J.rest=qt,J.shuffle=Tt,J.sortBy=function(n,t,e){var r=-1,o=Te(t),i=n?n.length:0,p=Xt(typeof i=="number"?i:0);for(o||(t=J.createCallback(t,e,3)),St(n,function(n,e,u){var i=p[++r]=f();o?i.m=Rt(t,function(t){return n[t]}):(i.m=a())[0]=t(n,e,u),i.n=r,i.o=n}),i=p.length,p.sort(u);i--;)n=p[i],p[i]=n.o,o||l(n.m),c(n);return p},J.tap=function(n,t){return t(n),n
},J.throttle=function(n,t,e){var r=true,u=true;if(!dt(n))throw new ie;return false===e?r=false:wt(e)&&(r="leading"in e?e.leading:r,u="trailing"in e?e.trailing:u),L.leading=r,L.maxWait=t,L.trailing=u,Vt(n,t,L)},J.times=function(n,t,e){n=-1<(n=+n)?n:0;var r=-1,u=Xt(n);for(t=tt(t,e,1);++r<n;)u[r]=t(r);return u},J.toArray=function(n){return n&&typeof n.length=="number"?p(n):xt(n)},J.transform=function(n,t,e,r){var u=Te(n);if(null==e)if(u)e=[];else{var o=n&&n.constructor;e=nt(o&&o.prototype)}return t&&(t=J.createCallback(t,r,4),(u?St:h)(n,function(n,r,u){return t(e,n,r,u)
})),e},J.union=function(){return ft(ut(arguments,true,true))},J.uniq=Pt,J.values=xt,J.where=Nt,J.without=function(n){return rt(n,p(arguments,1))},J.wrap=function(n,t){return ct(t,16,[n])},J.xor=function(){for(var n=-1,t=arguments.length;++n<t;){var e=arguments[n];if(Te(e)||yt(e))var r=r?ft(rt(r,e).concat(rt(e,r))):e}return r||[]},J.zip=Kt,J.zipObject=Lt,J.collect=Rt,J.drop=qt,J.each=St,J.eachRight=Et,J.extend=U,J.methods=bt,J.object=Lt,J.select=Nt,J.tail=qt,J.unique=Pt,J.unzip=Kt,Gt(J),J.clone=function(n,t,e,r){return typeof t!="boolean"&&null!=t&&(r=e,e=t,t=false),Z(n,t,typeof e=="function"&&tt(e,r,1))
},J.cloneDeep=function(n,t,e){return Z(n,true,typeof t=="function"&&tt(t,e,1))},J.contains=Ct,J.escape=function(n){return null==n?"":oe(n).replace(ze,pt)},J.every=Ot,J.find=It,J.findIndex=function(n,t,e){var r=-1,u=n?n.length:0;for(t=J.createCallback(t,e,3);++r<u;)if(t(n[r],r,n))return r;return-1},J.findKey=function(n,t,e){var r;return t=J.createCallback(t,e,3),h(n,function(n,e,u){return t(n,e,u)?(r=e,false):void 0}),r},J.findLast=function(n,t,e){var r;return t=J.createCallback(t,e,3),Et(n,function(n,e,u){return t(n,e,u)?(r=n,false):void 0
}),r},J.findLastIndex=function(n,t,e){var r=n?n.length:0;for(t=J.createCallback(t,e,3);r--;)if(t(n[r],r,n))return r;return-1},J.findLastKey=function(n,t,e){var r;return t=J.createCallback(t,e,3),mt(n,function(n,e,u){return t(n,e,u)?(r=e,false):void 0}),r},J.has=function(n,t){return n?me.call(n,t):false},J.identity=Ut,J.indexOf=Wt,J.isArguments=yt,J.isArray=Te,J.isBoolean=function(n){return true===n||false===n||n&&typeof n=="object"&&ce.call(n)==T||false},J.isDate=function(n){return n&&typeof n=="object"&&ce.call(n)==F||false
},J.isElement=function(n){return n&&1===n.nodeType||false},J.isEmpty=function(n){var t=true;if(!n)return t;var e=ce.call(n),r=n.length;return e==$||e==P||e==D||e==q&&typeof r=="number"&&dt(n.splice)?!r:(h(n,function(){return t=false}),t)},J.isEqual=function(n,t,e,r){return ot(n,t,typeof e=="function"&&tt(e,r,2))},J.isFinite=function(n){return Ce(n)&&!Oe(parseFloat(n))},J.isFunction=dt,J.isNaN=function(n){return jt(n)&&n!=+n},J.isNull=function(n){return null===n},J.isNumber=jt,J.isObject=wt,J.isPlainObject=Pe,J.isRegExp=function(n){return n&&typeof n=="object"&&ce.call(n)==z||false
},J.isString=kt,J.isUndefined=function(n){return typeof n=="undefined"},J.lastIndexOf=function(n,t,e){var r=n?n.length:0;for(typeof e=="number"&&(r=(0>e?Ie(0,r+e):Se(e,r-1))+1);r--;)if(n[r]===t)return r;return-1},J.mixin=Gt,J.noConflict=function(){return e._=le,this},J.noop=Ht,J.now=Ue,J.parseInt=Ge,J.random=function(n,t,e){var r=null==n,u=null==t;return null==e&&(typeof n=="boolean"&&u?(e=n,n=1):u||typeof t!="boolean"||(e=t,u=true)),r&&u&&(t=1),n=+n||0,u?(t=n,n=0):t=+t||0,e||n%1||t%1?(e=Re(),Se(n+e*(t-n+parseFloat("1e-"+((e+"").length-1))),t)):at(n,t)
},J.reduce=Dt,J.reduceRight=$t,J.result=function(n,t){if(n){var e=n[t];return dt(e)?n[t]():e}},J.runInContext=s,J.size=function(n){var t=n?n.length:0;return typeof t=="number"?t:Fe(n).length},J.some=Ft,J.sortedIndex=zt,J.template=function(n,t,e){var r=J.templateSettings;n=oe(n||""),e=_({},e,r);var u,o=_({},e.imports,r.imports),r=Fe(o),o=xt(o),a=0,f=e.interpolate||S,l="__p+='",f=ue((e.escape||S).source+"|"+f.source+"|"+(f===N?x:S).source+"|"+(e.evaluate||S).source+"|$","g");n.replace(f,function(t,e,r,o,f,c){return r||(r=o),l+=n.slice(a,c).replace(R,i),e&&(l+="'+__e("+e+")+'"),f&&(u=true,l+="';"+f+";\n__p+='"),r&&(l+="'+((__t=("+r+"))==null?'':__t)+'"),a=c+t.length,t
}),l+="';",f=e=e.variable,f||(e="obj",l="with("+e+"){"+l+"}"),l=(u?l.replace(w,""):l).replace(j,"$1").replace(k,"$1;"),l="function("+e+"){"+(f?"":e+"||("+e+"={});")+"var __t,__p='',__e=_.escape"+(u?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":";")+l+"return __p}";try{var c=ne(r,"return "+l).apply(v,o)}catch(p){throw p.source=l,p}return t?c(t):(c.source=l,c)},J.unescape=function(n){return null==n?"":oe(n).replace(qe,gt)},J.uniqueId=function(n){var t=++y;return oe(null==n?"":n)+t
},J.all=Ot,J.any=Ft,J.detect=It,J.findWhere=It,J.foldl=Dt,J.foldr=$t,J.include=Ct,J.inject=Dt,Gt(function(){var n={};return h(J,function(t,e){J.prototype[e]||(n[e]=t)}),n}(),false),J.first=Bt,J.last=function(n,t,e){var r=0,u=n?n.length:0;if(typeof t!="number"&&null!=t){var o=u;for(t=J.createCallback(t,e,3);o--&&t(n[o],o,n);)r++}else if(r=t,null==r||e)return n?n[u-1]:v;return p(n,Ie(0,u-r))},J.sample=function(n,t,e){return n&&typeof n.length!="number"&&(n=xt(n)),null==t||e?n?n[at(0,n.length-1)]:v:(n=Tt(n),n.length=Se(Ie(0,t),n.length),n)
},J.take=Bt,J.head=Bt,h(J,function(n,t){var e="sample"!==t;J.prototype[t]||(J.prototype[t]=function(t,r){var u=this.__chain__,o=n(this.__wrapped__,t,r);return u||null!=t&&(!r||e&&typeof t=="function")?new Q(o,u):o})}),J.VERSION="2.4.1",J.prototype.chain=function(){return this.__chain__=true,this},J.prototype.toString=function(){return oe(this.__wrapped__)},J.prototype.value=Qt,J.prototype.valueOf=Qt,St(["join","pop","shift"],function(n){var t=ae[n];J.prototype[n]=function(){var n=this.__chain__,e=t.apply(this.__wrapped__,arguments);
return n?new Q(e,n):e}}),St(["push","reverse","sort","unshift"],function(n){var t=ae[n];J.prototype[n]=function(){return t.apply(this.__wrapped__,arguments),this}}),St(["concat","slice","splice"],function(n){var t=ae[n];J.prototype[n]=function(){return new Q(t.apply(this.__wrapped__,arguments),this.__chain__)}}),J}var v,h=[],g=[],y=0,m=+new Date+"",b=75,_=40,d=" \t\x0B\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000",w=/\b__p\+='';/g,j=/\b(__p\+=)''\+/g,k=/(__e\(.*?\)|\b__t\))\+'';/g,x=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,C=/\w*$/,O=/^\s*function[ \n\r\t]+\w/,N=/<%=([\s\S]+?)%>/g,I=RegExp("^["+d+"]*0+(?=.$)"),S=/($^)/,E=/\bthis\b/,R=/['\n\r\t\u2028\u2029\\]/g,A="Array Boolean Date Function Math Number Object RegExp String _ attachEvent clearTimeout isFinite isNaN parseInt setTimeout".split(" "),D="[object Arguments]",$="[object Array]",T="[object Boolean]",F="[object Date]",B="[object Function]",W="[object Number]",q="[object Object]",z="[object RegExp]",P="[object String]",K={};
K[B]=false,K[D]=K[$]=K[T]=K[F]=K[W]=K[q]=K[z]=K[P]=true;var L={leading:false,maxWait:0,trailing:false},M={configurable:false,enumerable:false,value:null,writable:false},V={"boolean":false,"function":true,object:true,number:false,string:false,undefined:false},U={"\\":"\\","'":"'","\n":"n","\r":"r","\t":"t","\u2028":"u2028","\u2029":"u2029"},G=V[typeof window]&&window||this,H=V[typeof exports]&&exports&&!exports.nodeType&&exports,J=V[typeof module]&&module&&!module.nodeType&&module,Q=J&&J.exports===H&&H,X=V[typeof global]&&global;!X||X.global!==X&&X.window!==X||(G=X);
var Y=s();typeof define=="function"&&typeof define.amd=="object"&&define.amd?(G._=Y, define(function(){return Y})):H&&J?Q?(J.exports=Y)._=Y:H._=Y:G._=Y}).call(this);
/*
 * angular-mm-foundation
 * http://pineconellc.github.io/angular-foundation/

 * Version: 0.3.1 - 2014-08-19
 * License: MIT
 * (c) Pinecone, LLC
 */
angular.module("mm.foundation",["mm.foundation.accordion","mm.foundation.alert","mm.foundation.bindHtml","mm.foundation.buttons","mm.foundation.position","mm.foundation.dropdownToggle","mm.foundation.interchange","mm.foundation.transition","mm.foundation.modal","mm.foundation.offcanvas","mm.foundation.pagination","mm.foundation.tooltip","mm.foundation.popover","mm.foundation.progressbar","mm.foundation.rating","mm.foundation.tabs","mm.foundation.topbar","mm.foundation.tour","mm.foundation.typeahead"]),angular.module("mm.foundation.accordion",[]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(a,b,c){this.groups=[],this.closeOthers=function(d){var e=angular.isDefined(b.closeOthers)?a.$eval(b.closeOthers):c.closeOthers;e&&angular.forEach(this.groups,function(a){a!==d&&(a.isOpen=!1)})},this.addGroup=function(a){var b=this;this.groups.push(a),a.$on("$destroy",function(){b.removeGroup(a)})},this.removeGroup=function(a){var b=this.groups.indexOf(a);-1!==b&&this.groups.splice(this.groups.indexOf(a),1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",["$parse",function(a){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@"},controller:function(){this.setHeading=function(a){this.heading=a}},link:function(b,c,d,e){var f,g;e.addGroup(b),b.isOpen=!1,d.isOpen&&(f=a(d.isOpen),g=f.assign,b.$parent.$watch(f,function(a){b.isOpen=!!a})),b.$watch("isOpen",function(a){a&&e.closeOthers(b),g&&g(b.$parent,a)})}}}]).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",compile:function(a,b,c){return function(a,b,d,e){e.setHeading(c(a,function(){}))}}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(a,b,c,d){a.$watch(function(){return d[c.accordionTransclude]},function(a){a&&(b.html(""),b.append(a))})}}}),angular.module("mm.foundation.alert",[]).controller("AlertController",["$scope","$attrs",function(a,b){a.closeable="close"in b}]).directive("alert",function(){return{restrict:"EA",controller:"AlertController",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"=",close:"&"}}}),angular.module("mm.foundation.bindHtml",[]).directive("bindHtmlUnsafe",function(){return function(a,b,c){b.addClass("ng-binding").data("$binding",c.bindHtmlUnsafe),a.$watch(c.bindHtmlUnsafe,function(a){b.html(a||"")})}}),angular.module("mm.foundation.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(a){this.activeClass=a.activeClass,this.toggleEvent=a.toggleEvent}]).directive("btnRadio",function(){return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){var e=d[0],f=d[1];f.$render=function(){b.toggleClass(e.activeClass,angular.equals(f.$modelValue,a.$eval(c.btnRadio)))},b.bind(e.toggleEvent,function(){b.hasClass(e.activeClass)||a.$apply(function(){f.$setViewValue(a.$eval(c.btnRadio)),f.$render()})})}}}).directive("btnCheckbox",function(){return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){function e(){return g(c.btnCheckboxTrue,!0)}function f(){return g(c.btnCheckboxFalse,!1)}function g(b,c){var d=a.$eval(b);return angular.isDefined(d)?d:c}var h=d[0],i=d[1];i.$render=function(){b.toggleClass(h.activeClass,angular.equals(i.$modelValue,e()))},b.bind(h.toggleEvent,function(){a.$apply(function(){i.$setViewValue(b.hasClass(h.activeClass)?f():e()),i.$render()})})}}}),angular.module("mm.foundation.position",[]).factory("$position",["$document","$window",function(a,b){function c(a,c){return a.currentStyle?a.currentStyle[c]:b.getComputedStyle?b.getComputedStyle(a)[c]:a.style[c]}function d(a){return"static"===(c(a,"position")||"static")}var e=function(b){for(var c=a[0],e=b.offsetParent||c;e&&e!==c&&d(e);)e=e.offsetParent;return e||c};return{position:function(b){var c=this.offset(b),d={top:0,left:0},f=e(b[0]);f!=a[0]&&(d=this.offset(angular.element(f)),d.top+=f.clientTop-f.scrollTop,d.left+=f.clientLeft-f.scrollLeft);var g=b[0].getBoundingClientRect();return{width:g.width||b.prop("offsetWidth"),height:g.height||b.prop("offsetHeight"),top:c.top-d.top,left:c.left-d.left}},offset:function(c){var d=c[0].getBoundingClientRect();return{width:d.width||c.prop("offsetWidth"),height:d.height||c.prop("offsetHeight"),top:d.top+(b.pageYOffset||a[0].body.scrollTop||a[0].documentElement.scrollTop),left:d.left+(b.pageXOffset||a[0].body.scrollLeft||a[0].documentElement.scrollLeft)}}}}]),angular.module("mm.foundation.dropdownToggle",["mm.foundation.position"]).directive("dropdownToggle",["$document","$location","$position",function(a,b,c){var d=null,e=angular.noop;return{restrict:"CA",scope:{dropdownToggle:"@"},link:function(b,f){var g=angular.element(a[0].querySelector(b.dropdownToggle));b.$watch("$location.path",function(){e()}),f.bind("click",function(h){g=angular.element(a[0].querySelector(b.dropdownToggle));var i=f===d;if(h.preventDefault(),h.stopPropagation(),d&&e(),!i&&!f.hasClass("disabled")&&!f.prop("disabled")){g.css("display","block");var j=c.offset(f),k=c.offset(angular.element(g[0].offsetParent));g.css({left:j.left-k.left+"px",top:j.top-k.top+j.height+"px"}),d=f,e=function(){a.unbind("click",e),g.css("display","none"),e=angular.noop,d=null},a.bind("click",e)}}),g&&g.css("display","none")}}}]),angular.module("mm.foundation.interchange",[]).factory("interchangeQueries",["$document",function(a){for(var b,c,d={"default":"only screen",landscape:"only screen and (orientation: landscape)",portrait:"only screen and (orientation: portrait)",retina:"only screen and (-webkit-min-device-pixel-ratio: 2),only screen and (min--moz-device-pixel-ratio: 2),only screen and (-o-min-device-pixel-ratio: 2/1),only screen and (min-device-pixel-ratio: 2),only screen and (min-resolution: 192dpi),only screen and (min-resolution: 2dppx)"},e="foundation-mq-",f=["small","medium","large","xlarge","xxlarge"],g=angular.element(a[0].querySelector("head")),h=0;h<f.length;h++)g.append('<meta class="'+e+f[h]+'" />'),b=getComputedStyle(g[0].querySelector("meta."+e+f[h])),c=b.fontFamily.replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g,""),d[f[h]]=c;return d}]).factory("interchangeQueriesManager",["interchangeQueries",function(a){return{add:function(b,c){return b&&c&&angular.isString(b)&&angular.isString(c)&&!a[b]?(a[b]=c,!0):!1}}}]).factory("interchangeTools",["$window","interchangeQueries",function(a,b){var c=function(a){for(var b,c=a.split(/\[(.*?)\]/),d=c.length,e=/^(.+)\,\ \((.+)\)$/,f={};d--;)c[d].replace(/[\W\d]+/,"").length>4&&(b=e.exec(c[d]),b&&3===b.length&&(f[b[2]]=b[1]));return f},d=function(c){var d,e,f;for(d in c)if(e=b[d]||d,f=a.matchMedia(e),f.matches)return c[d]};return{parseAttribute:c,findCurrentMediaFile:d}}]).directive("interchange",["$window","$rootScope","interchangeTools",function(a,b,c){var d=/[A-Za-z0-9-_]+\.(jpg|jpeg|png|gif|bmp|tiff)\ *,/i;return{restrict:"A",scope:!0,priority:450,compile:function(e,f){return"DIV"!==e[0].nodeName||d.test(f.interchange)||e.html('<ng-include src="currentFile"></ng-include>'),{pre:function(){},post:function(d,e,f){var g,h;switch(h=e&&e[0]&&e[0].nodeName,d.fileMap=c.parseAttribute(f.interchange),h){case"DIV":g=c.findCurrentMediaFile(d.fileMap),d.type=/[A-Za-z0-9-_]+\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(g)?"background":"include";break;case"IMG":d.type="image";break;default:return}var i=function(a){var f=c.findCurrentMediaFile(d.fileMap);if(!d.currentFile||d.currentFile!==f){switch(d.currentFile=f,d.type){case"image":e.attr("src",d.currentFile);break;case"background":e.css("background-image","url("+d.currentFile+")")}b.$emit("replace",e,d),a&&d.$apply()}};i(),a.addEventListener("resize",i),d.$on("$destroy",function(){a.removeEventListener("resize",i)})}}}}}]),angular.module("mm.foundation.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(a,b,c){function d(a){for(var b in a)if(void 0!==f.style[b])return a[b]}var e=function(d,f,g){g=g||{};var h=a.defer(),i=e[g.animation?"animationEndEventName":"transitionEndEventName"],j=function(){c.$apply(function(){d.unbind(i,j),h.resolve(d)})};return i&&d.bind(i,j),b(function(){angular.isString(f)?d.addClass(f):angular.isFunction(f)?f(d):angular.isObject(f)&&d.css(f),i||h.resolve(d)}),h.promise.cancel=function(){i&&d.unbind(i,j),h.reject("Transition cancelled")},h.promise},f=document.createElement("trans"),g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},h={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=d(g),e.animationEndEventName=d(h),e}]),angular.module("mm.foundation.modal",["mm.foundation.transition"]).factory("$$stackedMap",function(){return{createNew:function(){var a=[];return{add:function(b,c){a.push({key:b,value:c})},get:function(b){for(var c=0;c<a.length;c++)if(b==a[c].key)return a[c]},keys:function(){for(var b=[],c=0;c<a.length;c++)b.push(a[c].key);return b},top:function(){return a[a.length-1]},remove:function(b){for(var c=-1,d=0;d<a.length;d++)if(b==a[d].key){c=d;break}return a.splice(c,1)[0]},removeTop:function(){return a.splice(a.length-1,1)[0]},length:function(){return a.length}}}}}).directive("modalBackdrop",["$modalStack","$timeout",function(a,b){return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",link:function(c){c.animate=!1,b(function(){c.animate=!0}),c.close=function(b){var c=a.getTop();c&&c.value.backdrop&&"static"!=c.value.backdrop&&b.target===b.currentTarget&&(b.preventDefault(),b.stopPropagation(),a.dismiss(c.key,"backdrop click"))}}}}]).directive("modalWindow",["$modalStack","$timeout",function(a,b){return{restrict:"EA",scope:{index:"@",animate:"="},replace:!0,transclude:!0,templateUrl:"template/modal/window.html",link:function(a,c,d){a.windowClass=d.windowClass||"",b(function(){a.animate=!0,c[0].querySelectorAll("[autofocus]").length>0?c[0].querySelectorAll("[autofocus]")[0].focus():c[0].focus()})}}}]).factory("$modalStack",["$transition","$timeout","$document","$compile","$rootScope","$$stackedMap",function(a,b,c,d,e,f){function g(){for(var a=-1,b=n.keys(),c=0;c<b.length;c++)n.get(b[c]).value.backdrop&&(a=c);return a}function h(a){var b=c.find("body").eq(0),d=n.get(a).value;n.remove(a),j(d.modalDomEl,d.modalScope,300,i),b.toggleClass(m,n.length()>0)}function i(){if(k&&-1==g()){var a=l;j(k,l,150,function(){a.$destroy(),a=null}),k=void 0,l=void 0}}function j(c,d,e,f){function g(){g.done||(g.done=!0,c.remove(),f&&f())}d.animate=!1;var h=a.transitionEndEventName;if(h){var i=b(g,e);c.bind(h,function(){b.cancel(i),g(),d.$apply()})}else b(g,0)}var k,l,m="modal-open",n=f.createNew(),o={};return e.$watch(g,function(a){l&&(l.index=a)}),c.bind("keydown",function(a){var b;27===a.which&&(b=n.top(),b&&b.value.keyboard&&e.$apply(function(){o.dismiss(b.key)}))}),o.open=function(a,b){n.add(a,{deferred:b.deferred,modalScope:b.scope,backdrop:b.backdrop,keyboard:b.keyboard});var f=c.find("body").eq(0),h=g();h>=0&&!k&&(l=e.$new(!0),l.index=h,k=d("<div modal-backdrop></div>")(l),f.append(k));var i=angular.element("<div modal-window></div>");i.attr("window-class",b.windowClass),i.attr("index",n.length()-1),i.attr("animate","animate"),i.html(b.content);var j=d(i)(b.scope);n.top().value.modalDomEl=j,f.append(j),f.addClass(m)},o.close=function(a,b){var c=n.get(a).value;c&&(c.deferred.resolve(b),h(a))},o.dismiss=function(a,b){var c=n.get(a).value;c&&(c.deferred.reject(b),h(a))},o.dismissAll=function(a){for(var b=this.getTop();b;)this.dismiss(b.key,a),b=this.getTop()},o.getTop=function(){return n.top()},o}]).provider("$modal",function(){var a={options:{backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$http","$templateCache","$controller","$modalStack",function(b,c,d,e,f,g,h){function i(a){return a.template?d.when(a.template):e.get(a.templateUrl,{cache:f}).then(function(a){return a.data})}function j(a){var c=[];return angular.forEach(a,function(a){(angular.isFunction(a)||angular.isArray(a))&&c.push(d.when(b.invoke(a)))}),c}var k={};return k.open=function(b){var e=d.defer(),f=d.defer(),k={result:e.promise,opened:f.promise,close:function(a){h.close(k,a)},dismiss:function(a){h.dismiss(k,a)}};if(b=angular.extend({},a.options,b),b.resolve=b.resolve||{},!b.template&&!b.templateUrl)throw new Error("One of template or templateUrl options is required.");var l=d.all([i(b)].concat(j(b.resolve)));return l.then(function(a){var d=(b.scope||c).$new();d.$close=k.close,d.$dismiss=k.dismiss;var f,i={},j=1;b.controller&&(i.$scope=d,i.$modalInstance=k,angular.forEach(b.resolve,function(b,c){i[c]=a[j++]}),f=g(b.controller,i)),h.open(k,{scope:d,deferred:e,content:a[0],backdrop:b.backdrop,keyboard:b.keyboard,windowClass:b.windowClass})},function(a){e.reject(a)}),l.then(function(){f.resolve(!0)},function(){f.reject(!1)}),k},k}]};return a}),angular.module("mm.foundation.offcanvas",[]).directive("offCanvasWrap",["$window",function(a){return{scope:{},restrict:"C",link:function(b,c){var d=angular.element(a),e=b.sidebar=c;b.hide=function(){e.removeClass("move-left"),e.removeClass("move-right")},d.bind("resize.body",b.hide),b.$on("$destroy",function(){d.unbind("resize.body",b.hide)})},controller:["$scope",function(a){this.leftToggle=function(){a.sidebar.toggleClass("move-right")},this.rightToggle=function(){a.sidebar.toggleClass("move-left")},this.hide=function(){a.hide()}}]}}]).directive("leftOffCanvasToggle",[function(){return{require:"^offCanvasWrap",restrict:"C",link:function(a,b,c,d){b.on("click",function(){d.leftToggle()})}}}]).directive("rightOffCanvasToggle",[function(){return{require:"^offCanvasWrap",restrict:"C",link:function(a,b,c,d){b.on("click",function(){d.rightToggle()})}}}]).directive("exitOffCanvas",[function(){return{require:"^offCanvasWrap",restrict:"C",link:function(a,b,c,d){b.on("click",function(){d.hide()})}}}]).directive("offCanvasList",[function(){return{require:"^offCanvasWrap",restrict:"C",link:function(a,b,c,d){b.on("click",function(){d.hide()})}}}]),angular.module("mm.foundation.pagination",[]).controller("PaginationController",["$scope","$attrs","$parse","$interpolate",function(a,b,c,d){var e=this,f=b.numPages?c(b.numPages).assign:angular.noop;this.init=function(d){b.itemsPerPage?a.$parent.$watch(c(b.itemsPerPage),function(b){e.itemsPerPage=parseInt(b,10),a.totalPages=e.calculateTotalPages()}):this.itemsPerPage=d},this.noPrevious=function(){return 1===this.page},this.noNext=function(){return this.page===a.totalPages},this.isActive=function(a){return this.page===a},this.calculateTotalPages=function(){var b=this.itemsPerPage<1?1:Math.ceil(a.totalItems/this.itemsPerPage);return Math.max(b||0,1)},this.getAttributeValue=function(b,c,e){return angular.isDefined(b)?e?d(b)(a.$parent):a.$parent.$eval(b):c},this.render=function(){this.page=parseInt(a.page,10)||1,this.page>0&&this.page<=a.totalPages&&(a.pages=this.getPages(this.page,a.totalPages))},a.selectPage=function(b){!e.isActive(b)&&b>0&&b<=a.totalPages&&(a.page=b,a.onSelectPage({page:b}))},a.$watch("page",function(){e.render()}),a.$watch("totalItems",function(){a.totalPages=e.calculateTotalPages()}),a.$watch("totalPages",function(b){f(a.$parent,b),e.page>b?a.selectPage(b):e.render()})}]).constant("paginationConfig",{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["$parse","paginationConfig",function(a,b){return{restrict:"EA",scope:{page:"=",totalItems:"=",onSelectPage:" &"},controller:"PaginationController",templateUrl:"template/pagination/pagination.html",replace:!0,link:function(c,d,e,f){function g(a,b,c,d){return{number:a,text:b,active:c,disabled:d}}var h,i=f.getAttributeValue(e.boundaryLinks,b.boundaryLinks),j=f.getAttributeValue(e.directionLinks,b.directionLinks),k=f.getAttributeValue(e.firstText,b.firstText,!0),l=f.getAttributeValue(e.previousText,b.previousText,!0),m=f.getAttributeValue(e.nextText,b.nextText,!0),n=f.getAttributeValue(e.lastText,b.lastText,!0),o=f.getAttributeValue(e.rotate,b.rotate);f.init(b.itemsPerPage),e.maxSize&&c.$parent.$watch(a(e.maxSize),function(a){h=parseInt(a,10),f.render()}),f.getPages=function(a,b){var c=[],d=1,e=b,p=angular.isDefined(h)&&b>h;p&&(o?(d=Math.max(a-Math.floor(h/2),1),e=d+h-1,e>b&&(e=b,d=e-h+1)):(d=(Math.ceil(a/h)-1)*h+1,e=Math.min(d+h-1,b)));for(var q=d;e>=q;q++){var r=g(q,q,f.isActive(q),!1);c.push(r)}if(p&&!o){if(d>1){var s=g(d-1,"...",!1,!1);c.unshift(s)}if(b>e){var t=g(e+1,"...",!1,!1);c.push(t)}}if(j){var u=g(a-1,l,!1,f.noPrevious());c.unshift(u);var v=g(a+1,m,!1,f.noNext());c.push(v)}if(i){var w=g(1,k,!1,f.noPrevious());c.unshift(w);var x=g(b,n,!1,f.noNext());c.push(x)}return c}}}}]).constant("pagerConfig",{itemsPerPage:10,previousText:"« Previous",nextText:"Next »",align:!0}).directive("pager",["pagerConfig",function(a){return{restrict:"EA",scope:{page:"=",totalItems:"=",onSelectPage:" &"},controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(b,c,d,e){function f(a,b,c,d,e){return{number:a,text:b,disabled:c,previous:i&&d,next:i&&e}}var g=e.getAttributeValue(d.previousText,a.previousText,!0),h=e.getAttributeValue(d.nextText,a.nextText,!0),i=e.getAttributeValue(d.align,a.align);e.init(a.itemsPerPage),e.getPages=function(a){return[f(a-1,g,e.noPrevious(),!0,!1),f(a+1,h,e.noNext(),!1,!0)]}}}}]),angular.module("mm.foundation.tooltip",["mm.foundation.position","mm.foundation.bindHtml"]).provider("$tooltip",function(){function a(a){var b=/[A-Z]/g,c="-";return a.replace(b,function(a,b){return(b?c:"")+a.toLowerCase()})}var b={placement:"top",animation:!0,popupDelay:0},c={mouseenter:"mouseleave",click:"click",focus:"blur"},d={};this.options=function(a){angular.extend(d,a)},this.setTriggers=function(a){angular.extend(c,a)},this.$get=["$window","$compile","$timeout","$parse","$document","$position","$interpolate",function(e,f,g,h,i,j,k){return function(e,l,m){function n(a){var b=a||o.trigger||m,d=c[b]||b;return{show:b,hide:d}}var o=angular.extend({},b,d),p=a(e),q=k.startSymbol(),r=k.endSymbol(),s="<div "+p+'-popup title="'+q+"tt_title"+r+'" content="'+q+"tt_content"+r+'" placement="'+q+"tt_placement"+r+'" animation="tt_animation" is-open="tt_isOpen"></div>';return{restrict:"EA",scope:!0,compile:function(){var a=f(s);return function(b,c,d){function f(){b.tt_isOpen?m():k()}function k(){(!z||b.$eval(d[l+"Enable"]))&&(b.tt_popupDelay?(v=g(p,b.tt_popupDelay,!1),v.then(function(a){a()})):p()())}function m(){b.$apply(function(){q()})}function p(){return b.tt_content?(r(),u&&g.cancel(u),t.css({top:0,left:0,display:"block"}),w?i.find("body").append(t):c.after(t),A(),b.tt_isOpen=!0,b.$digest(),A):angular.noop}function q(){b.tt_isOpen=!1,g.cancel(v),b.tt_animation?u=g(s,500):s()}function r(){t&&s(),t=a(b,function(){}),b.$digest()}function s(){t&&(t.remove(),t=null)}var t,u,v,w=angular.isDefined(o.appendToBody)?o.appendToBody:!1,x=n(void 0),y=!1,z=angular.isDefined(d[l+"Enable"]),A=function(){var a,d,e,f;switch(a=w?j.offset(c):j.position(c),d=t.prop("offsetWidth"),e=t.prop("offsetHeight"),b.tt_placement){case"right":f={top:a.top+a.height/2-e/2,left:a.left+a.width+10};break;case"bottom":f={top:a.top+a.height+10,left:a.left};break;case"left":f={top:a.top+a.height/2-e/2,left:a.left-d-10};break;default:f={top:a.top-e-10,left:a.left}}f.top+="px",f.left+="px",t.css(f)};b.tt_isOpen=!1,d.$observe(e,function(a){b.tt_content=a,!a&&b.tt_isOpen&&q()}),d.$observe(l+"Title",function(a){b.tt_title=a}),d.$observe(l+"Placement",function(a){b.tt_placement=angular.isDefined(a)?a:o.placement}),d.$observe(l+"PopupDelay",function(a){var c=parseInt(a,10);b.tt_popupDelay=isNaN(c)?o.popupDelay:c});var B=function(){y&&(c.unbind(x.show,k),c.unbind(x.hide,m))},C=function(){};d.$observe(l+"Trigger",function(a){B(),C(),x=n(a),angular.isFunction(x.show)?C=b.$watch(function(){return x.show(b,c,d)},function(a){return g(a?p:q)}):x.show===x.hide?c.bind(x.show,f):(c.bind(x.show,k),c.bind(x.hide,m)),y=!0});var D=b.$eval(d[l+"Animation"]);b.tt_animation=angular.isDefined(D)?!!D:o.animation,d.$observe(l+"AppendToBody",function(a){w=angular.isDefined(a)?h(a)(b):w}),w&&b.$on("$locationChangeSuccess",function(){b.tt_isOpen&&q()}),b.$on("$destroy",function(){g.cancel(u),g.cancel(v),B(),C(),s()})}}}}}]}).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(a){return a("tooltip","tooltip","mouseenter")}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).directive("tooltipHtmlUnsafe",["$tooltip",function(a){return a("tooltipHtmlUnsafe","tooltip","mouseenter")}]),angular.module("mm.foundation.popover",["mm.foundation.tooltip"]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$tooltip",function(a){return a("popover","popover","click")}]),angular.module("mm.foundation.progressbar",["mm.foundation.transition"]).constant("progressConfig",{animate:!0,max:100}).controller("ProgressController",["$scope","$attrs","progressConfig","$transition",function(a,b,c,d){var e=this,f=[],g=angular.isDefined(b.max)?a.$parent.$eval(b.max):c.max,h=angular.isDefined(b.animate)?a.$parent.$eval(b.animate):c.animate;this.addBar=function(a,b){var c=0,d=a.$parent.$index;angular.isDefined(d)&&f[d]&&(c=f[d].value),f.push(a),this.update(b,a.value,c),a.$watch("value",function(a,c){a!==c&&e.update(b,a,c)}),a.$on("$destroy",function(){e.removeBar(a)})},this.update=function(a,b,c){var e=this.getPercentage(b);h?(a.css("width",this.getPercentage(c)+"%"),d(a,{width:e+"%"})):a.css({transition:"none",width:e+"%"})},this.removeBar=function(a){f.splice(f.indexOf(a),1)},this.getPercentage=function(a){return Math.round(100*a/g)}}]).directive("progress",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",require:"progress",scope:{},template:'<div class="progress" ng-transclude></div>'}}).directive("bar",function(){return{restrict:"EA",replace:!0,transclude:!0,require:"^progress",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/bar.html",link:function(a,b,c,d){d.addBar(a,b)}}}).directive("progressbar",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/progressbar.html",link:function(a,b,c,d){d.addBar(a,angular.element(b.children()[0]))}}}),angular.module("mm.foundation.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","$parse","ratingConfig",function(a,b,c,d){this.maxRange=angular.isDefined(b.max)?a.$parent.$eval(b.max):d.max,this.stateOn=angular.isDefined(b.stateOn)?a.$parent.$eval(b.stateOn):d.stateOn,this.stateOff=angular.isDefined(b.stateOff)?a.$parent.$eval(b.stateOff):d.stateOff,this.createRateObjects=function(a){for(var b={stateOn:this.stateOn,stateOff:this.stateOff},c=0,d=a.length;d>c;c++)a[c]=angular.extend({index:c},b,a[c]);return a},a.range=this.createRateObjects(angular.isDefined(b.ratingStates)?angular.copy(a.$parent.$eval(b.ratingStates)):new Array(this.maxRange)),a.rate=function(b){a.value===b||a.readonly||(a.value=b)},a.enter=function(b){a.readonly||(a.val=b),a.onHover({value:b})},a.reset=function(){a.val=angular.copy(a.value),a.onLeave()},a.$watch("value",function(b){a.val=b}),a.readonly=!1,b.readonly&&a.$parent.$watch(c(b.readonly),function(b){a.readonly=!!b})}]).directive("rating",function(){return{restrict:"EA",scope:{value:"=",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0}}),angular.module("mm.foundation.tabs",[]).controller("TabsetController",["$scope",function(a){var b=this,c=b.tabs=a.tabs=[];b.select=function(a){angular.forEach(c,function(a){a.active=!1}),a.active=!0},b.addTab=function(a){c.push(a),(1===c.length||a.active)&&b.select(a)},b.removeTab=function(a){var d=c.indexOf(a);if(a.active&&c.length>1){var e=d==c.length-1?d-1:d+1;b.select(c[e])}c.splice(d,1)}}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(a,b,c){a.vertical=angular.isDefined(c.vertical)?a.$parent.$eval(c.vertical):!1,a.justified=angular.isDefined(c.justified)?a.$parent.$eval(c.justified):!1,a.type=angular.isDefined(c.type)?a.$parent.$eval(c.type):"tabs"}}}).directive("tab",["$parse",function(a){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(b,c,d){return function(b,c,e,f){var g,h;e.active?(g=a(e.active),h=g.assign,b.$parent.$watch(g,function(a,c){a!==c&&(b.active=!!a)}),b.active=g(b.$parent)):h=g=angular.noop,b.$watch("active",function(a){h(b.$parent,a),a?(f.select(b),b.onSelect()):b.onDeselect()}),b.disabled=!1,e.disabled&&b.$parent.$watch(a(e.disabled),function(a){b.disabled=!!a}),b.select=function(){b.disabled||(b.active=!0)},f.addTab(b),b.$on("$destroy",function(){f.removeTab(b)}),b.$transcludeFn=d}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(a,b){a.$watch("headingElement",function(a){a&&(b.html(""),b.append(a))})}}}]).directive("tabContentTransclude",function(){function a(a){return a.tagName&&(a.hasAttribute("tab-heading")||a.hasAttribute("data-tab-heading")||"tab-heading"===a.tagName.toLowerCase()||"data-tab-heading"===a.tagName.toLowerCase())}return{restrict:"A",require:"^tabset",link:function(b,c,d){var e=b.$eval(d.tabContentTransclude);e.$transcludeFn(e.$parent,function(b){angular.forEach(b,function(b){a(b)?e.headingElement=b:c.append(b)})})}}}),angular.module("mm.foundation.topbar",[]).factory("mediaQueries",["$document","$window",function(a,b){var c=angular.element(a[0].querySelector("head"));c.append('<meta class="foundation-mq-topbar" />'),c.append('<meta class="foundation-mq-small" />'),c.append('<meta class="foundation-mq-medium" />'),c.append('<meta class="foundation-mq-large" />');var d=b.matchMedia||function(a){var b,c=a.documentElement,d=c.firstElementChild||c.firstChild,e=a.createElement("body"),f=a.createElement("div");return f.id="mq-test-1",f.style.cssText="position:absolute;top:-100em",e.style.background="none",e.appendChild(f),function(a){return f.innerHTML='&shy;<style media="'+a+'"> #mq-test-1 { width: 42px; }</style>',c.insertBefore(e,d),b=42===f.offsetWidth,c.removeChild(e),{matches:b,media:a}}}(a[0]),e=/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g,f={topbar:getComputedStyle(c[0].querySelector("meta.foundation-mq-topbar")).fontFamily.replace(e,""),small:getComputedStyle(c[0].querySelector("meta.foundation-mq-small")).fontFamily.replace(e,""),medium:getComputedStyle(c[0].querySelector("meta.foundation-mq-medium")).fontFamily.replace(e,""),large:getComputedStyle(c[0].querySelector("meta.foundation-mq-large")).fontFamily.replace(e,"")};return{topbarBreakpoint:function(){return!d(f.topbar).matches},small:function(){return d(f.small).matches},medium:function(){return d(f.medium).matches},large:function(){return d(f.large).matches}}}]).factory("closest",[function(){return function(a,b){for(var c=function(a,b){for(var c=(a.parentNode||a.document).querySelectorAll(b),d=-1;c[++d]&&c[d]!=a;);return!!c[d]},d=a[0];d;){if(c(d,b))return angular.element(d);d=d.parentElement}return!1}}]).directive("topBar",["$timeout","$compile","$window","$document","mediaQueries",function(a,b,c,d,e){return{scope:{stickyClass:"@",backText:"@",stickyOn:"=",customBackText:"=",isHover:"=",mobileShowParentLink:"=",scrolltop:"="},restrict:"EA",replace:!0,templateUrl:"template/topbar/top-bar.html",transclude:!0,link:function(a,b){var f=a.topbar=b,g=f.parent(),h=angular.element(d[0].querySelector("body")),i=a.isSticky=function(){var b=g.hasClass(a.settings.stickyClass);return b&&"all"===a.settings.stickyOn?!0:b&&e.small()&&"small"===a.settings.stickyOn?!0:b&&e.medium()&&"medium"===a.settings.stickyOn?!0:b&&e.large()&&"large"===a.settings.stickyOn?!0:!1},j=function(){if(a.stickyTopbar&&a.isSticky()){var b=angular.element(d[0].querySelector("."+a.settings.stickyClass)),e=k;c.scrollY>e&&!b.hasClass("fixed")?(b.addClass("fixed"),h.css("padding-top",a.originalHeight+"px")):c.scrollY<=e&&b.hasClass("fixed")&&(b.removeClass("fixed"),h.css("padding-top",""))}};if(a.toggle=function(b){if(!e.topbarBreakpoint())return!1;var d=void 0===b?!f.hasClass("expanded"):b;d?f.addClass("expanded"):f.removeClass("expanded"),a.settings.scrolltop?!d&&f.hasClass("fixed")?(f.parent().addClass("fixed"),f.removeClass("fixed"),h.css("padding-top",a.originalHeight+"px")):d&&f.parent().hasClass("fixed")&&(f.parent().removeClass("fixed"),f.addClass("fixed"),h.css("padding-top",""),c.scrollTo(0,0)):(i()&&f.parent().addClass("fixed"),f.parent().hasClass("fixed")&&(d?(f.addClass("fixed"),f.parent().addClass("expanded"),h.css("padding-top",a.originalHeight+"px")):(f.removeClass("fixed"),f.parent().removeClass("expanded"),j())))},g.hasClass("fixed")||i()){a.stickyTopbar=!0,a.height=g[0].offsetHeight;var k=g[0].getBoundingClientRect().top}else a.height=f[0].offsetHeight;a.originalHeight=a.height,a.$watch("height",function(a){a?f.css("height",a+"px"):f.css("height","")});var l=e.topbarBreakpoint();angular.element(c).bind("resize",function(){var b=e.topbarBreakpoint();if(l!==b){l=e.topbarBreakpoint(),f.removeClass("expanded"),f.parent().removeClass("expanded"),a.height="";var c=angular.element(f[0].querySelectorAll("section"));angular.forEach(c,function(a){angular.element(a.querySelectorAll("li.moved")).removeClass("moved")}),a.$apply()}}),angular.element(c).bind("scroll",function(){j(),a.$apply()}),a.$on("$destroy",function(){angular.element(c).unbind("scroll"),angular.element(c).unbind("resize")}),g.hasClass("fixed")&&h.css("padding-top",a.originalHeight+"px")},controller:["$window","$scope","closest",function(b,c,f){c.settings={},c.settings.stickyClass=c.stickyClass||"sticky",c.settings.backText=c.backText||"Back",c.settings.stickyOn=c.stickyOn||"all",c.settings.customBackText=void 0===c.customBackText?!0:c.customBackText,c.settings.isHover=void 0===c.isHover?!0:c.isHover,c.settings.mobileShowParentLink=void 0===c.mobileShowParentLink?!0:c.mobileShowParentLink,c.settings.scrolltop=void 0===c.scrolltop?!0:c.scrolltop,this.settings=c.settings,c.index=0;var g=function(a){var b=a.offsetHeight,c=a.currentStyle||getComputedStyle(a);return b+=parseInt(c.marginTop,10)+parseInt(c.marginBottom,10)},h=[];this.addSection=function(a){h.push(a)},this.removeSection=function(a){var b=h.indexOf(a);b>-1&&h.splice(b,1)};var i=/rtl/i.test(d.find("html").attr("dir"))?"right":"left";c.$watch("index",function(a){for(var b=0;b<h.length;b++)h[b].move(i,a)}),this.toggle=function(a){c.toggle(a);for(var b=0;b<h.length;b++)h[b].reset();c.index=0,c.height="",c.$apply()},this.back=function(b){if(!(c.index<1)&&e.topbarBreakpoint()){var d=angular.element(b.currentTarget),h=f(d,"li.moved"),i=h.parent();c.index=c.index-1,c.height=0===c.index?"":c.originalHeight+g(i[0]),a(function(){h.removeClass("moved")},300)}},this.forward=function(a){if(!e.topbarBreakpoint())return!1;var b=angular.element(a.currentTarget),d=f(b,"li");d.addClass("moved"),c.height=c.originalHeight+g(b.parent()[0].querySelector("ul")),c.index=c.index+1,c.$apply()}}]}}]).directive("toggleTopBar",["closest",function(a){return{scope:{},require:"^topBar",restrict:"A",replace:!0,templateUrl:"template/topbar/toggle-top-bar.html",transclude:!0,link:function(b,c,d,e){c.bind("click",function(b){var c=a(angular.element(b.currentTarget),"li");
c.hasClass("back")||c.hasClass("has-dropdown")||e.toggle()}),b.$on("$destroy",function(){c.unbind("click")})}}}]).directive("topBarSection",["$compile","closest",function(a,b){return{scope:{},require:"^topBar",restrict:"EA",replace:!0,templateUrl:"template/topbar/top-bar-section.html",transclude:!0,link:function(a,c,d,e){var f=c;a.reset=function(){angular.element(f[0].querySelectorAll("li.moved")).removeClass("moved")},a.move=function(a,b){f.css("left"===a?{left:-100*b+"%"}:{right:-100*b+"%"})},e.addSection(a),a.$on("$destroy",function(){e.removeSection(a)});var g=f[0].querySelectorAll("li>a");angular.forEach(g,function(c){var d=angular.element(c),f=b(d,"li");f.hasClass("has-dropdown")||f.hasClass("back")||f.hasClass("title")||(d.bind("click",function(){e.toggle(!1)}),a.$on("$destroy",function(){d.bind("click")}))})}}}]).directive("hasDropdown",["mediaQueries",function(a){return{scope:{},require:"^topBar",restrict:"A",templateUrl:"template/topbar/has-dropdown.html",replace:!0,transclude:!0,link:function(b,c,d,e){b.triggerLink=c.children("a")[0];var f=angular.element(b.triggerLink);f.bind("click",function(a){e.forward(a)}),b.$on("$destroy",function(){f.unbind("click")}),c.bind("mouseenter",function(){e.settings.isHover&&!a.topbarBreakpoint()&&c.addClass("not-click")}),c.bind("click",function(){e.settings.isHover||a.topbarBreakpoint()||c.toggleClass("not-click")}),c.bind("mouseleave",function(){c.removeClass("not-click")}),b.$on("$destroy",function(){c.unbind("click"),c.unbind("mouseenter"),c.unbind("mouseleave")})},controller:["$window","$scope",function(a,b){this.triggerLink=b.triggerLink}]}}]).directive("topBarDropdown",["$compile",function(a){return{scope:{},require:["^topBar","^hasDropdown"],restrict:"A",replace:!0,templateUrl:"template/topbar/top-bar-dropdown.html",transclude:!0,link:function(b,c,d,e){var f=e[0],g=e[1],h=angular.element(g.triggerLink),i=h.attr("href");b.linkText=h.text(),b.back=function(a){f.back(a)},b.backText=f.settings.customBackText?f.settings.backText:"&laquo; "+h.html();var j;j=angular.element(f.settings.mobileShowParentLink&&i&&i.length>1?'<li class="title back js-generated"><h5><a href="#" ng-click="back($event);">{{backText}}</a></h5></li><li><a class="parent-link js-generated" href="'+i+'">{{linkText}}</a></li>':'<li class="title back js-generated"><h5><a href="" ng-click="back($event);">{{backText}}</a></h5></li>'),a(j)(b),c.prepend(j)}}}]),angular.module("mm.foundation.tour",["mm.foundation.position","mm.foundation.tooltip"]).service("$tour",["$window",function(a){function b(){return parseInt(a.localStorage.getItem("mm.tour.step"),10)}function c(b){d=b,a.localStorage.setItem("mm.tour.step",b)}var d=b(),e={};this.add=function(a,b){e[a]=b},this.has=function(a){return!!e[a]},this.isActive=function(){return d>0},this.current=function(a){return a?void c(d):d},this.start=function(){c(1)},this.next=function(){c(d+1)},this.end=function(){c(0)}}]).directive("stepTextPopup",["$tour",function(a){return{restrict:"EA",replace:!0,scope:{title:"@",content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tour/tour.html",link:function(b,c){b.isLastStep=function(){return!a.has(a.current()+1)},b.endTour=function(){c.remove(),a.end()},b.nextStep=function(){c.remove(),a.next()}}}}]).directive("stepText",["$position","$tooltip","$tour","$window",function(a,b,c,d){function e(a){var b=a[0].getBoundingClientRect();return b.top>=0&&b.left>=0&&b.bottom<=d.innerHeight-80&&b.right<=d.innerWidth}function f(b,f,g){var h=parseInt(g.stepIndex,10);if(c.isActive()&&h&&(c.add(h,g),h===c.current())){if(!e(f)){var i=a.offset(f);d.scrollTo(0,i.top-d.innerHeight/2)}return!0}return!1}return b("stepText","step",f)}]),angular.module("mm.foundation.typeahead",["mm.foundation.position","mm.foundation.bindHtml"]).factory("typeaheadParser",["$parse",function(a){var b=/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;return{parse:function(c){var d=c.match(b);if(!d)throw new Error("Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_' but got '"+c+"'.");return{itemName:d[3],source:a(d[4]),viewMapper:a(d[2]||d[1]),modelMapper:a(d[1])}}}}]).directive("typeahead",["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(a,b,c,d,e,f,g){var h=[9,13,27,38,40];return{require:"ngModel",link:function(i,j,k,l){var m,n=i.$eval(k.typeaheadMinLength)||1,o=i.$eval(k.typeaheadWaitMs)||0,p=i.$eval(k.typeaheadEditable)!==!1,q=b(k.typeaheadLoading).assign||angular.noop,r=b(k.typeaheadOnSelect),s=k.typeaheadInputFormatter?b(k.typeaheadInputFormatter):void 0,t=k.typeaheadAppendToBody?b(k.typeaheadAppendToBody):!1,u=b(k.ngModel).assign,v=g.parse(k.typeahead),w=angular.element("<div typeahead-popup></div>");w.attr({matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"}),angular.isDefined(k.typeaheadTemplateUrl)&&w.attr("template-url",k.typeaheadTemplateUrl);var x=i.$new();i.$on("$destroy",function(){x.$destroy()});var y=function(){x.matches=[],x.activeIdx=-1},z=function(a){var b={$viewValue:a};q(i,!0),c.when(v.source(i,b)).then(function(c){if(a===l.$viewValue&&m){if(c.length>0){x.activeIdx=0,x.matches.length=0;for(var d=0;d<c.length;d++)b[v.itemName]=c[d],x.matches.push({label:v.viewMapper(x,b),model:c[d]});x.query=a,x.position=t?f.offset(j):f.position(j),x.position.top=x.position.top+j.prop("offsetHeight")}else y();q(i,!1)}},function(){y(),q(i,!1)})};y(),x.query=void 0;var A;l.$parsers.unshift(function(a){return a&&a.length>=n?o>0?(A&&d.cancel(A),A=d(function(){z(a)},o)):z(a):(q(i,!1),y()),p?a:a?void l.$setValidity("editable",!1):(l.$setValidity("editable",!0),a)}),l.$formatters.push(function(a){var b,c,d={};return s?(d.$model=a,s(i,d)):(d[v.itemName]=a,b=v.viewMapper(i,d),d[v.itemName]=void 0,c=v.viewMapper(i,d),b!==c?b:a)}),x.select=function(a){var b,c,d={};d[v.itemName]=c=x.matches[a].model,b=v.modelMapper(i,d),u(i,b),l.$setValidity("editable",!0),r(i,{$item:c,$model:b,$label:v.viewMapper(i,d)}),y(),j[0].focus()},j.bind("keydown",function(a){0!==x.matches.length&&-1!==h.indexOf(a.which)&&(a.preventDefault(),40===a.which?(x.activeIdx=(x.activeIdx+1)%x.matches.length,x.$digest()):38===a.which?(x.activeIdx=(x.activeIdx?x.activeIdx:x.matches.length)-1,x.$digest()):13===a.which||9===a.which?x.$apply(function(){x.select(x.activeIdx)}):27===a.which&&(a.stopPropagation(),y(),x.$digest()))}),j.bind("blur",function(){m=!1}),j.bind("focus",function(){m=!0});var B=function(a){j[0]!==a.target&&(y(),x.$digest())};e.bind("click",B),i.$on("$destroy",function(){e.unbind("click",B)});var C=a(w)(x);t?e.find("body").append(C):j.after(C)}}}]).directive("typeaheadPopup",function(){return{restrict:"EA",scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead-popup.html",link:function(a,b,c){a.templateUrl=c.templateUrl,a.isOpen=function(){return a.matches.length>0},a.isActive=function(b){return a.active==b},a.selectActive=function(b){a.active=b},a.selectMatch=function(b){a.select({activeIdx:b})}}}}).directive("typeaheadMatch",["$http","$templateCache","$compile","$parse",function(a,b,c,d){return{restrict:"EA",scope:{index:"=",match:"=",query:"="},link:function(e,f,g){var h=d(g.templateUrl)(e.$parent)||"template/typeahead/typeahead-match.html";a.get(h,{cache:b}).success(function(a){f.replaceWith(c(a.trim())(e))})}}}]).filter("typeaheadHighlight",function(){function a(a){return a.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}return function(b,c){return c?b.replace(new RegExp(a(c),"gi"),"<strong>$&</strong>"):b}});
/** 
* @license ng-slider - v2.2.6
* (c) 2013 Julien VALERY https://github.com/darul75/ng-slider
* License: MIT 
**/
!function(a){"use strict";a.module("ngSlider",[]).directive("slider",["$compile","$templateCache","$timeout","$window","slider",function(b,c,d,e,f){return{restrict:"AE",require:"?ngModel",scope:{options:"=",ngDisabled:"="},priority:1,link:function(g,h,i,j){function k(){a.element(e).bind("resize",function(){g.slider.onresize()})}if(j){if(!g.options)throw new Error('You must provide a value for "options" attribute.');a.isString(g.options)&&(g.options=a.toJson(g.options)),g.mainSliderClass="jslider",g.mainSliderClass+=g.options.skin?" jslider_"+g.options.skin:" ",g.mainSliderClass+=g.options.vertical?" vertical ":"",g.mainSliderClass+=g.options.css?" sliderCSS":"",h.after(b(c.get("ng-slider/slider-bar.tmpl.html"))(g,function(a,b){b.tmplElt=a}));var l=!1,m=function(){g.from=""+g.options.from,g.to=""+g.options.to,g.options.calculate&&"function"==typeof g.options.calculate&&(g.from=g.options.calculate(g.from),g.to=g.options.calculate(g.to));var b={from:g.options.from,to:g.options.to,step:g.options.step,smooth:g.options.smooth,limits:g.options.smooth,round:g.options.round||!1,value:j.$viewValue,dimension:"",scale:g.options.scale,modelLabels:g.options.modelLabels,vertical:g.options.vertical,css:g.options.css,realtime:g.options.realtime,cb:n,threshold:g.options.threshold};b.calculate=g.options.calculate||void 0,b.onstatechange=g.options.onstatechange||void 0,g.slider=g.slider?g.slider.init(h,g.tmplElt,b):p(h,g.tmplElt,b),l||k();var c=g.tmplElt.find("div")[7];a.element(c).html(g.slider.generateScale()),g.slider.drawScale(c),g.ngDisabled&&o(g.ngDisabled),l=!0};j.$render=function(){(j.$viewValue||0===j.$viewValue)&&("number"==typeof j.$viewValue&&(j.$viewValue=""+j.$viewValue),j.$viewValue.split(";")[1]||(g.mainSliderClass+=" jslider-single"),g.slider&&(g.slider.getPointers()[0].set(j.$viewValue.split(";")[0],!0),j.$viewValue.split(";")[1]&&g.slider.getPointers()[1].set(j.$viewValue.split(";")[1],!0)))};var n=function(a,b){g.disabled||(g.$apply(function(){j.$setViewValue(a)}),g.options.callback&&g.options.callback(a,b))};g.$watch("options",function(){d(function(){m()})},!0);var o=function(a){g.disabled=a,g.slider&&(g.tmplElt.toggleClass("disabled"),g.slider.disable(a))};g.$watch("ngDisabled",function(a){o(a)});var p=function(a,b,c){return new f(a,b,c)}}}}}]).config(function(){}).run(function(){})}(angular),function(a){"use strict";a.module("ngSlider").constant("sliderConstants",{SLIDER:{settings:{from:1,to:40,step:1,smooth:!0,limits:!1,round:!1,value:"3",dimension:"",vertical:!1,calculate:!1,onstatechange:!1,callback:!1,realtime:!1},className:"jslider",selector:".jslider-",css:{visible:{visibility:"visible"},hidden:{visibility:"hidden"}}},EVENTS:{}})}(angular),function(a){"use strict";a.module("ngSlider").factory("sliderUtils",["$window",function(a){return{offset:function(a){var b=a[0],c=0,d=0,e=document.documentElement||document.body,f=window.pageXOffset||e.scrollLeft,g=window.pageYOffset||e.scrollTop;return c=b.getBoundingClientRect().left+f,d=b.getBoundingClientRect().top+g,{left:c,top:d}},browser:function(){var b=a.navigator.userAgent,c={mozilla:/mozilla/i,chrome:/chrome/i,safari:/safari/i,firefox:/firefox/i,ie:/internet explorer/i};for(var d in c)if(c[d].test(b))return d;return"unknown"}}}])}(angular),function(a){"use strict";a.module("ngSlider").factory("sliderDraggable",["sliderUtils",function(b){function c(){this._init.apply(this,arguments)}return c.prototype.oninit=function(){},c.prototype.events=function(){},c.prototype.onmousedown=function(){this.ptr.css({position:"absolute"})},c.prototype.onmousemove=function(a,b,c){this.ptr.css({left:b,top:c})},c.prototype.onmouseup=function(){},c.prototype.isDefault={drag:!1,clicked:!1,toclick:!0,mouseup:!1},c.prototype._init=function(){if(arguments.length>0){if(this.ptr=arguments[0],this.parent=arguments[2],!this.ptr)return;this.is={},a.extend(this.is,this.isDefault);var c=b.offset(this.ptr);this.d={left:c.left,top:c.top,width:this.ptr[0].clientWidth,height:this.ptr[0].clientHeight},this.oninit.apply(this,arguments),this._events()}},c.prototype._getPageCoords=function(a){return a.targetTouches&&a.targetTouches[0]?{x:a.targetTouches[0].pageX,y:a.targetTouches[0].pageY}:{x:a.pageX,y:a.pageY}},c.prototype._bindEvent=function(a,b,c){this.supportTouches_?a[0].addEventListener(this.events_[b],c,!1):a.bind(this.events_[b],c)},c.prototype._events=function(){var b=this;this.supportTouches_="ontouchend"in document,this.events_={click:this.supportTouches_?"touchstart":"click",down:this.supportTouches_?"touchstart":"mousedown",move:this.supportTouches_?"touchmove":"mousemove",up:this.supportTouches_?"touchend":"mouseup",mousedown:(this.supportTouches_,"mousedown")};var c=a.element(window.document);this._bindEvent(c,"move",function(a){b.is.drag&&(a.stopPropagation(),a.preventDefault(),b.parent.disabled||b._mousemove(a))}),this._bindEvent(c,"down",function(a){b.is.drag&&(a.stopPropagation(),a.preventDefault())}),this._bindEvent(c,"up",function(a){b._mouseup(a)}),this._bindEvent(this.ptr,"down",function(a){return b._mousedown(a),!1}),this._bindEvent(this.ptr,"up",function(a){b._mouseup(a)}),this.events()},c.prototype._mousedown=function(b){this.is.drag=!0,this.is.clicked=!1,this.is.mouseup=!1;var c=this._getPageCoords(b);this.cx=c.x-this.ptr[0].offsetLeft,this.cy=c.y-this.ptr[0].offsetTop,a.extend(this.d,{left:c.x,top:c.y,width:this.ptr[0].clientWidth,height:this.ptr[0].clientHeight}),this.outer&&this.outer.get(0)&&this.outer.css({height:Math.max(this.outer.height(),$(document.body).height()),overflow:"hidden"}),this.onmousedown(b)},c.prototype._mousemove=function(a){this.is.toclick=!1;var b=this._getPageCoords(a);this.onmousemove(a,b.x-this.cx,b.y-this.cy)},c.prototype._mouseup=function(a){if(this.is.drag){this.is.drag=!1;var c=b.browser();this.outer&&this.outer.get(0)&&(this.outer.css("mozilla"===c?{overflow:"hidden"}:{overflow:"visible"}),this.outer.css({height:"auto"})),this.onmouseup(a)}},c}])}(angular),function(a){"use strict";a.module("ngSlider").factory("sliderPointer",["sliderDraggable","sliderUtils",function(b,c){function d(){b.apply(this,arguments)}return d.prototype=new b,d.prototype.oninit=function(b,c,d,e){this.uid=c,this.parent=e,this.value={},this.vertical=d,this.settings=a.copy(e.settings),this.normalOrder=this.parent.settings.from<this.parent.settings.to,this.threshold=this.parent.settings.threshold},d.prototype.onmousedown=function(){var a=c.offset(this.parent.domNode),b={left:a.left,top:a.top,width:this.parent.domNode[0].clientWidth,height:this.parent.domNode[0].clientHeight};this._parent={offset:b,width:b.width,height:b.height},this.ptr.addClass("jslider-pointer-hover")},d.prototype.onmousemove=function(b){var c=this._getPageCoords(b);this._set(this.calc(this.vertical?c.y:c.x)),this.settings.realtime&&this.settings.cb&&a.isFunction(this.settings.cb)&&this.allowed&&this.settings.cb.call(this.parent,this.parent.getValue(),!this.is.drag)},d.prototype.onmouseup=function(){this.settings.cb&&a.isFunction(this.settings.cb)&&this.allowed&&this.settings.cb.call(this.parent,this.parent.getValue(),!this.is.drag),this.is.drag||this.ptr.removeClass("jslider-pointer-hover")},d.prototype.limits=function(a){return this.parent.limits(a,this)},d.prototype.calc=function(a){return this.limits(this.vertical?100*(a-this._parent.offset.top)/this._parent.height:100*(a-this._parent.offset.left)/this._parent.width)},d.prototype.set=function(a,b){this.value.origin=this.parent.round(a),this._set(this.parent.valueToPrc(a,this),b)},d.prototype._set=function(a){if(this.allowed=!0,this.value.origin=this.parent.prcToValue(a),this.threshold&&this.parent.o.pointers[1]){var b=this.parent.o.pointers[0].value.origin,c=this.parent.o.pointers[1].value.origin;this.allowed=(this.normalOrder?c-b:b-c)>=this.threshold}if(!this.allowed){var d=this.parent.o.pointers[0===this.uid?1:0];return void(this.value.origin=0===this.uid?this.normalOrder?d.value.origin-this.threshold:d.value.origin+this.threshold:this.normalOrder?d.value.origin+this.threshold:d.value.origin-this.threshold)}this.value.prc=a,this.ptr.css(this.vertical?{top:a+"%",marginTop:-5}:{left:a+"%"}),this.parent.redraw(this)},d}])}(angular),function(a){"use strict";a.module("ngSlider").factory("slider",["sliderPointer","sliderConstants","sliderUtils",function(b,c,d){function e(){return this.init.apply(this,arguments)}return e.prototype.init=function(b,d,e){return this.settings=e,this.inputNode=b,this.inputNode.addClass("ng-hide"),this.settings.interval=this.settings.to-this.settings.from,this.settings.calculate&&a.isFunction(this.settings.calculate)&&(this.nice=this.settings.calculate),this.settings.onstatechange&&a.isFunction(this.settings.onstatechange)&&(this.onstatechange=this.settings.onstatechange),this.css=c.SLIDER.css,this.is={init:!1},this.o={},this.initValue={},this.isAsc=e.from<e.to,this.create(d),this},e.prototype.create=function(c){var e=this;this.domNode=c;var f=this.domNode.find("div"),g=this.domNode.find("i"),h=a.element,i=a.extend,j=a.forEach,k=h(f[1]),l=h(f[2]),m=h(f[5]),n=h(f[6]),o=h(g[0]),p=h(g[1]),q=h(g[2]),r=h(g[3]),s=h(g[4]),t=h(g[5]),u=h(g[6]),v=[k,l],w=d.offset(this.domNode),x={left:w.left,top:w.top,width:this.domNode[0].clientWidth,height:this.domNode[0].clientHeight},y=e.settings.value.split(";");this.sizes={domWidth:this.domNode[0].clientWidth,domHeight:this.domNode[0].clientHeight,domOffset:x},i(this.o,{pointers:{},labels:{0:{o:m},1:{o:n}},limits:{0:a.element(f[3]),1:a.element(f[4])},indicators:{0:r,1:s,2:t,3:u}}),i(this.o.labels[0],{value:this.o.labels[0].o.find("span")}),i(this.o.labels[1],{value:this.o.labels[1].o.find("span")}),this.settings.single=!e.settings.value.split(";")[1],j(v,function(c,f){e.settings=a.copy(e.settings);var g,h,i,j,k,l=y[f];l&&(e.o.pointers[f]=new b(c,f,e.settings.vertical,e),g=y[f-1],h=g?parseInt(g,10):void 0,l=e.settings.round?parseFloat(l):parseInt(l,10),(g&&e.isAsc?h>l:l>h)&&(l=g),i=e.isAsc?l>e.settings.to:l<e.settings.to,j=i?e.settings.to:l,e.o.pointers[f].set(j,!0),k=d.offset(e.o.pointers[f].ptr),e.o.pointers[f].d={left:k.left,top:k.top})}),e.domNode.bind("mousedown",e.clickHandler.apply(e)),this.o.value=h(this.domNode.find("i")[2]),this.is.init=!0,this.settings.css&&(o.css(this.settings.css.background?this.settings.css.background:{}),p.css(this.settings.css.background?this.settings.css.background:{}),this.o.pointers[1]||(r.css(this.settings.css.before?this.settings.css.before:{}),u.css(this.settings.css.after?this.settings.css.after:{})),s.css(this.settings.css["default"]?this.settings.css["default"]:{}),t.css(this.settings.css["default"]?this.settings.css["default"]:{}),q.css(this.settings.css.range?this.settings.css.range:{}),k.css(this.settings.css.pointer?this.settings.css.pointer:{}),l.css(this.settings.css.pointer?this.settings.css.pointer:{})),j(this.o.pointers,function(a){e.redraw(a)})},e.prototype.clickHandler=function(){var b=this,c=function(){var a=b.o.pointers[0].ptr,c=b.o.pointers[1].ptr,e=d.offset(a),f=d.offset(c);b.o.pointers[0].d={left:e.left,top:e.top,width:a[0].clientWidth,height:a[0].clientHeight},b.o.pointers[1].d={left:f.left,top:f.top,width:c[0].clientWidth,height:c[0].clientHeight}};return function(e){if(!b.disabled){var f,g,h,i=b.settings.vertical,j=0,k=d.offset(b.domNode),l=b.o.pointers[0],m=b.o.pointers[1]?b.o.pointers[1]:null,n=e.originalEvent?e.originalEvent:e,o=i?n.pageY:n.pageX,p=i?"top":"left";if(!b.isAsc&&m&&(f=m,m=l,l=f),h={left:k.left,top:k.top,width:b.domNode[0].clientWidth,height:b.domNode[0].clientHeight},g=b.o.pointers[j],m){m.d.width||c();var q=(m.d[p]-l.d[p])/2,r=l.d[p],s=o-r,t=s>q;t&&(g=b.isAsc?m:l)}g._parent={offset:h,width:h.width,height:h.height};var u=l._getPageCoords(e);return g.cx=u.x-g.d.left,g.cy=u.y-g.d.top,g.onmousemove(e,u.x,u.y),g.onmouseup(),a.extend(g.d,{left:u.x,top:u.y}),b.redraw(g),!1}}},e.prototype.disable=function(a){this.disabled=a},e.prototype.nice=function(a){return a},e.prototype.onstatechange=function(){},e.prototype.limits=function(a,b){if(!this.settings.smooth){var c=100*this.settings.step/this.settings.interval;a=Math.round(a/c)*c}var d=this.o.pointers[1-b.uid];return d&&b.uid&&a<d.value.prc&&(a=d.value.prc),d&&!b.uid&&a>d.value.prc&&(a=d.value.prc),0>a&&(a=0),a>100&&(a=100),Math.round(10*a)/10},e.prototype.getPointers=function(){return this.o.pointers},e.prototype.generateScale=function(){if(this.settings.scale&&this.settings.scale.length>0){for(var a="",b=this.settings.scale,c=(100/(b.length-1)).toFixed(2),d=this.settings.vertical?"top":"left",e=0;e<b.length;e++)a+='<span style="'+d+": "+e*c+'%">'+("|"!=b[e]?"<ins>"+b[e]+"</ins>":"")+"</span>";return a}return""},e.prototype.onresize=function(){var b=this;this.sizes={domWidth:this.domNode[0].clientWidth,domHeight:this.domNode[0].clientHeight,domOffset:{left:this.domNode[0].offsetLeft,top:this.domNode[0].offsetTop,width:this.domNode[0].clientWidth,height:this.domNode[0].clientHeight}},a.forEach(this.o.pointers,function(a){b.redraw(a)})},e.prototype.update=function(){this.onresize(),this.drawScale()},e.prototype.drawScale=function(b){a.forEach(a.element(b).find("ins"),function(a){a.style.marginLeft=-a.clientWidth/2})},e.prototype.redraw=function(a){if(!this.is.init)return this.o.pointers[0]&&!this.o.pointers[1]?(this.originValue=this.o.pointers[0].value.prc,this.o.indicators[0].css(this.settings.vertical?{top:0,height:this.o.pointers[0].value.prc+"%"}:{left:0,width:this.o.pointers[0].value.prc+"%"}),this.o.indicators[1].css(this.settings.vertical?{top:this.o.pointers[0].value.prc+"%"}:{left:this.o.pointers[0].value.prc+"%"}),this.o.indicators[3].css(this.settings.vertical?{top:this.o.pointers[0].value.prc+"%"}:{left:this.o.pointers[0].value.prc+"%"})):(this.o.indicators[2].css(this.settings.vertical?{top:this.o.pointers[1].value.prc+"%"}:{left:this.o.pointers[1].value.prc+"%"}),this.o.indicators[0].css(this.settings.vertical?{top:0,height:"0"}:{left:0,width:"0"}),this.o.indicators[3].css(this.settings.vertical?{top:"0",height:"0"}:{left:"0",width:"0"})),!1;this.setValue();var b,c;this.o.pointers[0]&&this.o.pointers[1]&&(b=this.settings.vertical?{top:this.o.pointers[0].value.prc+"%",height:this.o.pointers[1].value.prc-this.o.pointers[0].value.prc+"%"}:{left:this.o.pointers[0].value.prc+"%",width:this.o.pointers[1].value.prc-this.o.pointers[0].value.prc+"%"},this.o.value.css(b),this.o.pointers[0].value.prc===this.o.pointers[1].value.prc&&this.o.pointers[1].ptr.css("z-index",0===this.o.pointers[0].value.prc?"3":"1")),this.o.pointers[0]&&!this.o.pointers[1]&&(c=this.o.pointers[0].value.prc-this.originValue,this.o.indicators[3].css(c>=0?this.settings.vertical?{height:c+"%"}:{width:c+"%"}:this.settings.vertical?{height:0}:{width:0}),this.o.indicators[0].css(this.o.pointers[0].value.prc<this.originValue?this.settings.vertical?{height:this.o.pointers[0].value.prc+"%"}:{width:this.o.pointers[0].value.prc+"%"}:this.settings.vertical?{height:this.originValue+"%"}:{width:this.originValue+"%"}));var d=this.nice(a.value.origin);this.settings.modelLabels&&(d=void 0!==this.settings.modelLabels[d]?this.settings.modelLabels[d]:d),this.o.labels[a.uid].value.html(d),this.redrawLabels(a)},e.prototype.redrawLabels=function(a){function b(a,b,d){b.margin=-b.label/2;var e=c.settings.vertical?c.sizes.domHeight:c.sizes.domWidth;if(c.sizes.domWidth){var f=b.border+b.margin;0>f&&(b.margin-=f),c.sizes.domWidth>0&&b.border+b.label/2>e?(b.margin=0,b.right=!0):b.right=!1}return a.o.css(c.settings.vertical?{top:d+"%",marginLeft:"20px",marginTop:b.margin,bottom:"auto"}:{left:d+"%",marginLeft:b.margin+"px",right:"auto"}),b.right&&c.sizes.domWidth>0&&a.o.css(c.settings.vertical?{top:"auto",bottom:0}:{left:"auto",right:0}),b}var c=this,d=this.o.labels[a.uid],e=a.value.prc,f=0===d.o[0].offsetWidth?7*d.o[0].textContent.length:d.o[0].offsetWidth;this.sizes.domWidth=this.domNode[0].clientWidth,this.sizes.domHeight=this.domNode[0].clientHeight;var g,h,i={label:c.settings.vertical?d.o[0].offsetHeight:f,right:!1,border:e*(c.settings.vertical?this.sizes.domHeight:this.sizes.domWidth)/100},j=0===a.uid?1:0;if(!this.settings.single&&!this.settings.vertical){g=this.o.labels[j],h=this.o.pointers[j];var k=this.o.labels[0],l=this.o.labels[1],m=this.o.pointers[0],n=this.o.pointers[1],o=n.ptr[0].offsetLeft-m.ptr[0].offsetLeft,p=this.nice(h.value.origin);if(k.o.css(this.css.visible),l.o.css(this.css.visible),o+10<k.o[0].offsetWidth+l.o[0].offsetWidth){if(g.o.css(this.css.hidden),g.value.html(p),e=(h.value.prc-e)/2+e,h.value.prc!=a.value.prc){p=this.nice(this.o.pointers[0].value.origin);var q=this.nice(this.o.pointers[1].value.origin);this.settings.modelLabels&&(p=void 0!==this.settings.modelLabels[p]?this.settings.modelLabels[p]:p,q=void 0!==this.settings.modelLabels[q]?this.settings.modelLabels[q]:q),d.value.html(p+"&nbsp;&ndash;&nbsp;"+q),i.label=d.o[0].offsetWidth,i.border=e*r/100}}else g.value.html(p),g.o.css(this.css.visible)}i=b(d,i,e);var r=c.settings.vertical?c.sizes.domHeight:c.sizes.domWidth;if(g){var s=0===d.o[0].offsetWidth?d.o[0].textContent.length/2*7:d.o[0].offsetWidth,t={label:c.settings.vertical?g.o[0].offsetHeight:s,right:!1,border:h.value.prc*this.sizes.domWidth/100};i=b(g,t,h.value.prc)}this.redrawLimits()},e.prototype.redrawLimits=function(){if(this.settings.limits){var b=[!0,!0],c=0;for(var d in this.o.pointers)if(!this.settings.single||0===d){var e=this.o.pointers[d],f=this.o.labels[e.uid],g=f.o[0].offsetLeft-this.sizes.domOffset.left,h=this.o.limits[0];g<h[0].clientWidth&&(b[0]=!1),h=this.o.limits[1],g+f.o[0].clientWidth>this.sizes.domWidth-h[0].clientWidth&&(b[1]=!1)}for(;c<b.length;c++)a.element(this.o.limits[c]).addClass(b[c]?"animate-show":"animate-hidde")}},e.prototype.setValue=function(){var a=this.getValue();this.inputNode.attr("value",a),this.onstatechange.call(this,a,this.inputNode)},e.prototype.getValue=function(){if(!this.is.init)return!1;var b=this,c="";return a.forEach(this.o.pointers,function(a,d){void 0===a.value.prc||isNaN(a.value.prc)||(c+=(d>0?";":"")+b.prcToValue(a.value.prc))}),c},e.prototype.getPrcValue=function(){if(!this.is.init)return!1;var a="";return a},e.prototype.prcToValue=function(a){var b;if(this.settings.heterogeneity&&this.settings.heterogeneity.length>0)for(var c=this.settings.heterogeneity,d=0,e=this.settings.from,f=0;f<=c.length;f++){var g;g=c[f]?c[f].split("/"):[100,this.settings.to],a>=d&&a<=g[0]&&(b=e+(a-d)*(g[1]-e)/(g[0]-d)),d=g[0],e=g[1]}else b=this.settings.from+a*this.settings.interval/100;return this.round(b)},e.prototype.valueToPrc=function(a,b){var c;if(this.settings.heterogeneity&&this.settings.heterogeneity.length>0)for(var d=this.settings.heterogeneity,e=0,f=this.settings.from,g=0;g<=d.length;g++){var h;h=d[g]?d[g].split("/"):[100,this.settings.to],a>=f&&a<=h[1]&&(c=b.limits(e+(a-f)*(h[0]-e)/(h[1]-f))),e=h[0],f=h[1]}else c=b.limits(100*(a-this.settings.from)/this.settings.interval);return c},e.prototype.round=function(a){return a=Math.round(a/this.settings.step)*this.settings.step,a=this.settings.round?Math.round(a*Math.pow(10,this.settings.round))/Math.pow(10,this.settings.round):Math.round(a)},e}])}(angular),function(a){"use strict";a.module("ngSlider").run(["$templateCache",function(a){a.put("ng-slider/slider-bar.tmpl.html",'<span ng-class="mainSliderClass" id="{{sliderTmplId}}"><table><tr><td><div class="jslider-bg"><i class="left"></i><i class="right"></i><i class="range"></i><i class="before"></i><i class="default"></i><i class="default"></i><i class="after"></i></div><div class="jslider-pointer"></div><div class="jslider-pointer jslider-pointer-to"></div><div class="jslider-label"><span>{{from}}</span>{{options.dimension}}</div><div class="jslider-label jslider-label-to"><span>{{to}}</span>{{options.dimension}}</div><div class="jslider-value"><span></span>{{options.dimension}}</div><div class="jslider-value jslider-value-to"><span></span>{{options.dimension}}</div><div class="jslider-scale" id="{{sliderScaleDivTmplId}}"></div></td></tr></table></span>')}])}(window.angular);
BiKeyboardMock = function() {
}

BiKeyboardMock.prototype.available = function() {
  var keyboards = [
  { id: "enUS", title: "English US" },
  { id: "enUK", title: "English UK" },
    ];
  return keyboards;
}

BiLanguageMock = function() {
}

BiLanguageMock.prototype.available = function() {
  var langs = [
  { id: "id", title: "Bahasa Indonesia" },
  { id: "bew", title: "Base Betawi" },
  { id: "enUS", title: "English US" }
    ];

  return langs;
}

var BiKeyboard = BiKeyboard || new BiKeyboardMock();
var BiLanguage = BiLanguage || new BiLanguageMock();

window = window || {};
window.BiKeyboard = BiKeyboard;
window.BiLanguage = BiLanguage;

(function(e){var t={},n={},r=null,i=null,s=null,o=null;t.init=function(t){var u=this;return n=e.extend({},e.fn.timezonePicker.defaults,t),r=n.timezone,u.each(function(t,r){i=r,s=document.getElementsByName(i.useMap.replace(/^#/,""))[0],e(i).wrap('<div class="timezone-picker"></div>').parent().css({position:"relative",width:e(i).width()+"px"}),n.pinUrl?o=e('<img src="'+n.pinUrl+'" />').appendTo(i.parentNode).css("display","none"):n.pin&&(o=e(i).parent().parent().find(n.pin).appendTo(i.parentNode).css("display","none")),e(s).find("area").click(function(){var t=this;if(o){o.css("display","block");var r=e(t).attr("data-pin").split(","),i=parseInt(o.width()/2),s=o.height();o.css({position:"absolute",left:r[0]-i+"px",top:r[1]-s+"px"})}if(n.target){var u=e(t).attr("data-timezone");u&&e(n.target).val(u)}if(n.countryTarget){var a=e(t).attr("data-country");a&&e(n.countryTarget).val(a)}return!1}),n.target&&e(n.target).bind("change",function(){u.timezonePicker("updateTimezone",e(this).val())}),n.countryTarget&&n.countryGuess&&e(n.countryTarget).bind("change",function(){var t=e(this).val();n.countryGuesses[t]?e(s).find('area[data-timezone="'+n.countryGuesses[t]+'"]').click():e(s).find("area[data-country="+t+"]:first").click()});if(n.responsive){var a=null;e(window).resize(function(){a&&clearTimeout(a),a=setTimeout(function(){u.timezonePicker("resize")},200)})}setTimeout(function(){n.responsive&&parseInt(i.width)!==parseInt(i.getAttribute("width"))?u.timezonePicker("resize"):n.maphilight&&e.fn.maphilight&&e(i).maphilight(n),n.target&&e(n.target).triggerHandler("change")},500)})},t.updateTimezone=function(t){return r=t,o.css("display","none"),e(s).find("area").each(function(t,n){if(n.getAttribute("data-timezone")===r)return e(n).triggerHandler("click"),!1}),this},t.detectLocation=function(t){function r(n){var r=e(i),o=u(n.coords.latitude,n.coords.longitude,r.width(),r.height());e(s).find("area").each(function(n,r){var i=r.getAttribute("coords").split(","),s=r.getAttribute("shape"),u=[];for(var l=0;l<i.length/2;l++)u[l]=[i[l*2],i[l*2+1]];if(s==="poly"&&a(u,o[0],o[1])||s==="rect"&&f(i,o[0],o[1]))return e(r).triggerHandler("click",t.success),!1}),t.complete&&t.complete(n)}function o(e){t.error&&t.error(e),t.complete&&t.complete(e)}function u(e,t,n,r){var i=Math.round((t+180)*(n/360)),s=Math.round((e*-1+90)*(r/180));return[i,s]}function a(e,t,n){var r=!1,i=[1e6,1e6,-1e6,-1e6];for(var s=0,o=e.length-1;s<e.length;o=s++){var u=e[s][0],a=e[s][1],l=e[o][0],c=e[o][1];i[0]=Math.min(i[0],u),i[1]=Math.min(i[1],a),i[2]=Math.max(i[2],u),i[3]=Math.max(i[3],a);var h=a>n!=c>n&&t<(l-u)*(n-a)/(c-a)+u;h&&(r=!r)}return r&&f(i,t,n)}function f(e,t,n){return e=[Math.min(e[0],e[2]),Math.min(e[1],e[3]),Math.max(e[0],e[2]),Math.max(e[1],e[3])],t>=e[0]&&t<=e[2]&&n>=e[1]&&n<=e[2]}var n={success:undefined,error:undefined,complete:undefined};return t=e.extend(n,t),navigator.geolocation&&navigator.geolocation.getCurrentPosition(r,o),this},t.resize=function(){return e(s).find("area").each(function(t,r){r.originalCoords||(r.originalCoords={timezone:r.getAttribute("data-timezone"),country:r.getAttribute("data-country"),coords:r.getAttribute("coords"),pin:r.getAttribute("data-pin")});var s=i.width/i.getAttribute("width");e(i).parent().css({width:e(i).width()+"px"});var o=r.originalCoords.coords.split(","),u=new Array;for(var a=0;a<o.length;a++)u[a]=Math.round(parseInt(o[a])*s);r.setAttribute("coords",u.join(","));var f=r.originalCoords.pin.split(",");f[0]=Math.round(parseInt(f[0])*s),f[1]=Math.round(parseInt(f[1])*s),r.setAttribute("data-pin",f.join(",")),n.target&&e(n.target).triggerHandler("change")}),this},e.fn.timezonePicker=function(n){if(t[n])return t[n].apply(this,Array.prototype.slice.call(arguments,1));if(typeof n=="object"||!n)return t.init.apply(this,arguments);e.error("Method "+n+" does not exist on jQuery.timezonePicker")},e.fn.timezonePicker.defaults={pin:".timezone-pin",pinUrl:null,timezone:null,maphilight:!0,target:null,countryTarget:null,countryGuess:!0,countryGuesses:{AU:"Australia/Sydney",BR:"America/Sao_Paulo",CA:"America/Toronto",CN:"China/Shanghai",ES:"Europe/Madrid",MX:"America/Mexico_City",RU:"Russia/Moscow",US:"America/New_York"},responsive:!1,fade:!1,stroke:!0,strokeColor:"FFFFFF",strokeOpacity:.4,fillColor:"FFFFFF",fillOpacity:.4,groupBy:"data-offset"}})(jQuery);