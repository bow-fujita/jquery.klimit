/*
 * jQuery KeyLimit Plugin for limiting key input on text forms.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * @license http://www.gnu.org/licenses/gpl.html
 * @author  Hiromitsu Fujita <bow.fujita@gmail.com>
 * @version 1.0
 *
 * @usage
 *  Add 'klimit-*' to class attribute of input[type='text'] element
 *  which you want to limit key input. Just like this:
 *
 *    <input type='text' name='number' class='klimit-digit' />
 *
 *  Pre-defined 'klimit-*' classes are:
 *    - klimit-digit
 *    - klimit-hex
 *    - klimit-lower
 *    - klimit-upper
 *    - klimit-alpha
 *    - klimit-alnum
 *    - klimit-graph
 *    - klimit-mail
 *
 *  You can also make your custom rule. For instance, if you want allow
 *  user to input only alphabets, numbers, dot(.) and underscore(_)
 *  as username, this will be done with:
 *
 *    HTML
 *      <input type='type' name='username' id='username' />
 *
 *    jQuery
 *      $('input#username').klimit([$.KLIMIT.ALNUM, '._']);
 *
 * @note
 *  The key code map to convert a character into key code (event.keyCode)
 *  is based on 101 US keyboard layout by default. If you want to alter
 *  some of key codes, assign key code map to jQuery.KLIMIT.KEY_CODE_MAP
 *  prior to jquery.klimit.js is loaded.
 *  This plugin also provides 'jquery.klimit.kb109.js' which defines
 *  key codes for 106/109 Japanese keyboard as an example. So if you
 *  work with 106/109 Japanese keyboard, you should implement your HTML
 *  as below:
 *
 *    <script src='jquery.js'></script>
 *    <script src='jquery.klimit.kb109.js'></script>
 *    <script src='jquery.klimit.js'></script>
 *
 */

(function($) {

	// The following functions/variables are private.
	var key_code_map = [],
		key_bypassed = [
		0x08,	// Back space
		0x09,	// Tab
		0x0D,	// Enter
		0x21,	// Page up
		0x22,	// Page down
		0x23,	// End
		0x24,	// Home
		0x25,	// Left
		0x26,	// Up
		0x27,	// Right
		0x28,	// Down
		0x2D,	// Insert
		0x2E	// Delete
	];

	function set_key_code(c, k) {
		key_code_map.push({ chr: c, key: k });
	}

	function reset_key_code(c, k) {
		for(var i = 0; i < key_code_map.length; ++i) {
			if(key_code_map[i].chr == c) {
				key_code_map[i].key = k;
				return;
			}
		}
		set_key_code(c, k);
	}

	// Initialize key_code_map based on 101 US keyboard
	(function (){

		// For digit [0-9]
		var offset_digit = 0x30,
			offset_10key = 0x60;
		for(var i = 0; i <= 9; ++i) {
			set_key_code(
				String.fromCharCode(i+offset_digit),
				[ { code: i+offset_digit }, { code: i+offset_10key } ]
			);
		}

		// For alpha [a-zA-Z]
		var offset_upper = offset_code = 0x41,
			offset_lower = 0x61;
		for(var i = 0; i < 26; ++i) {
			set_key_code(
				String.fromCharCode(i+offset_upper),
				[{ code: i+offset_code, shift: true }]
			);
			set_key_code(
				String.fromCharCode(i+offset_lower),
				[{ code: i+offset_code }]
			);
		}

		// For graph ^[0-9a-zA-Z]
		jQuery.each([
			{ c: ' ',  k: [{ code: 0x20 }] },
			{ c: ')',  k: [{ code: 0x30, shift: true }] },
			{ c: '!',  k: [{ code: 0x31, shift: true }] },
			{ c: '@',  k: [{ code: 0x32, shift: true }] },
			{ c: '#',  k: [{ code: 0x33, shift: true }] },
			{ c: '$',  k: [{ code: 0x34, shift: true }] },
			{ c: '%',  k: [{ code: 0x35, shift: true }] },
			{ c: '^',  k: [{ code: 0x36, shift: true }] },
			{ c: '&',  k: [{ code: 0x37, shift: true }] },
			{ c: '*',  k: [{ code: 0x38, shift: true }, { code: 0x6A }, { code: 0x6A, shift: true }] },
			{ c: '(',  k: [{ code: 0x39, shift: true }] },

			{ c: ';',  k: [{ code: 0xBA }] },
			{ c: ':',  k: [{ code: 0xBA, shift: true }] },
			{ c: '+',  k: [{ code: 0xBB, shift: true }, { code: 0x6B }, { code: 0x6B, shift: true }] },
			{ c: ',',  k: [{ code: 0xBC }] },
			{ c: '<',  k: [{ code: 0xBC, shift: true }] },
			{ c: ',',  k: [{ code: 0xBB, shift: true }] },
			{ c: '-',  k: [{ code: 0xBD }, { code: 0x6D }, { code: 0x6D, shift: true }] },
			{ c: '_',  k: [{ code: 0xBD, shift: true }] },
			{ c: '.',  k: [{ code: 0xBE }, { code: 0x6E }, { code: 0x6E, shift: true }] },
			{ c: '>',  k: [{ code: 0xBE, shift: true }] },
			{ c: '/',  k: [{ code: 0xBF }, { code: 0x6F }, { code: 0x6F, shift: true }] },
			{ c: '?',  k: [{ code: 0xBF, shift: true }] },
			{ c: '`',  k: [{ code: 0xC0 }] },
			{ c: '~',  k: [{ code: 0xC0, shift: true }] },
			{ c: '[',  k: [{ code: 0xDB }] },
			{ c: '{',  k: [{ code: 0xDB, shift: true }] },
			{ c: '\\', k: [{ code: 0xDC }] },
			{ c: '|',  k: [{ code: 0xDC, shift: true }] },
			{ c: ']',  k: [{ code: 0xDD }] },
			{ c: '}',  k: [{ code: 0xDD, shift: true }] },
			{ c: "'",  k: [{ code: 0xDE }] },
			{ c: '"',  k: [{ code: 0xDE, shift: true }] }

		] , function() {
			set_key_code(this.c, this.k);
		});

		jQuery.KLIMIT = jQuery.KLIMIT || {};
		if(jQuery.KLIMIT.KEY_CODE_MAP) {
			jQuery.each(jQuery.KLIMIT.KEY_CODE_MAP, function() {
				reset_key_code(this.c, this.k);
			});
		}
	})();

	function is_key_bypassed(ev) {
		if(ev.ctrlKey) {
			return true;
		}
		if(ev.keyCode >= 0x70 && ev.keyCode <= 0x7B) {
			// Function keys: F1-F12
			return true;
		}
		return jQuery.inArray(ev.keyCode, key_bypassed) >= 0;
	}

	function is_key_obj(obj) {
		return typeof obj == 'object'
			&& obj.normal != undefined && obj.normal.constructor == Array
			&& obj.shift != undefined && obj.shift.constructor == Array;
	}

	function find_key(c) {
		var size = key_code_map.length;
		for(var i = 0; i < size; ++i) {
			if(key_code_map[i].chr == c) {
				return key_code_map[i].key;
			}
		}
		return null;
	}

	function make_key(str) {
		var obj = { normal: [], shift: [] },
			len = str.length;
		for(var i = 0; i < len; ++i) {
			var key = find_key(str.charAt(i));
			if(key) {
				jQuery.each(key, function() {
					(this.shift ? obj.shift : obj.normal).push(this.code);
				});
			}
		}
		return obj;
	}

	function concat_key() {
		var obj = make_key('');
		jQuery.each(arguments, function() {
			obj.normal = obj.normal.concat(this.normal);
			obj.shift = obj.shift.concat(this.shift);
		});
		return obj;
	}

	function build_key(keys) {
		var obj = make_key('');
		jQuery.each(keys, function(i, key) {
			if(is_key_obj(key)) {
				obj = concat_key(obj, key);
			}
			else if(typeof key == 'string') {
				obj = concat_key(obj, make_key(key));
			}
		});
		return obj;
	}

	function is_allowed(ev, keys) {
		if(is_key_bypassed(ev)) {
			return true;
		}

		var key = build_key(keys);
		return jQuery.inArray(ev.keyCode, ev.shiftKey ? key.shift : key.normal) >= 0;
	}

	// The following functions/variables are pubilc.
	jQuery.KLIMIT.DIGIT	= make_key('0123456789');
	jQuery.KLIMIT.HEX	= concat_key(jQuery.KLIMIT.DIGIT, make_key('abcdefABCDEF'));
	jQuery.KLIMIT.LOWER	= make_key('abcdefghijklmnopqrstuvwxyz');
	jQuery.KLIMIT.UPPER	= make_key('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	jQuery.KLIMIT.ALPHA	= concat_key(jQuery.KLIMIT.LOWER, jQuery.KLIMIT.UPPER);
	jQuery.KLIMIT.ALNUM	= concat_key(jQuery.KLIMIT.ALPHA, jQuery.KLIMIT.DIGIT);
	jQuery.KLIMIT.GRAPH	= concat_key(jQuery.KLIMIT.ALNUM, make_key('!"#$%&\'()*+-,./:;<=>?@[\\]^_`{|}~'));

	jQuery.makeKeyLimit	= make_key;

	jQuery.fn.klimit = function(keys) {
		return this.each(function() {
			jQuery(this).keydown(function(ev) {
				return is_allowed(ev, keys);
			});
		});
	};

})(jQuery);

jQuery(function() {
	var K = jQuery.KLIMIT;
	jQuery.each({
		digit:	[ K.DIGIT ],
		hex:	[ K.HEX ],
		lower:	[ K.LOWER ],
		upper:	[ K.UPPER ],
		alpha:	[ K.ALPHA ],
		alnum:	[ K.ALNUM ],
		graph:	[ K.GRAPH ],
		mail:	[ K.ALNUM, '@-_.' ]
	},
	function(cls, keys) {
		jQuery('input.klimit-'+cls).klimit(keys);
	});
});
