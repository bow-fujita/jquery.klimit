/*
 * Definition of 106/109 Japanese keyboard key code map used by jQuery
 * KeyLimit Plugin.
 * Overrides necessary key codes different from 101 US keyboard.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * @license http://www.gnu.org/licenses/gpl.html
 * @author  Hiromitsu Fujita <bow.fujita@gmail.com>
 */

jQuery.KLIMIT = jQuery.KLIMIT || {};
jQuery.KLIMIT.KEY_CODE_MAP = [
	{ c: '"',  k: [{ code: 0x32, shift: true }] },
	{ c: '&',  k: [{ code: 0x36, shift: true }] },
	{ c: "'",  k: [{ code: 0x37, shift: true }] },
	{ c: '(',  k: [{ code: 0x38, shift: true }] },
	{ c: ')',  k: [{ code: 0x39, shift: true }] },
	{ c: ':',  k: [{ code: 0xBA }, { code: 0x3B }] },
	{ c: '*',  k: [{ code: 0xBA, shift: true }, { code: 0x3B, shift: true }, { code: 0x6A }] },
	{ c: ';',  k: [{ code: 0xBB }, { code: 0x6B }] },
	{ c: '=',  k: [{ code: 0xBD, shift: true }, { code: 0x6D, shift: true }] },
	{ c: '@',  k: [{ code: 0xC0 }] },
	{ c: '`',  k: [{ code: 0xC0, shift: true }] },
	{ c: '\\', k: [{ code: 0xDC }, { code: 0xE2 }] },
	{ c: '^',  k: [{ code: 0xDE }] },
	{ c: '~',  k: [{ code: 0xDE, shift: true }] },
	{ c: '_',  k: [{ code: 0xE2, shift: true }] }
];

