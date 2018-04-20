// Public Variables
    
const tempselectors = [/divOutputAlign\d*/, /outputData/, /verblink\d*/, /cmdPlacesObjects\d*/, /cmdInventory\d*/, /paperscope-1/]; // Temporary selectors
var extcssfiles = ["res://local/playercore.css", "res://local/jquery-ui.min.css"];
var curcss = []; // complette extract CSS without changes
var newcss = []; // complette extract CSS with changes
var chacss = []; // only the extract CSS changes
const waittoext = 1000; // wait to current extraction (ms)

/* ---------------------------------------------------------------------------------------------------- */



/* Extract current stylesheet from HTML */

function cssExtractCurrent(tempsels, ids, classes, style, anonstyle, succmes, errmes) {
    try {
        // The readout works. Unfortunately, cssextract can only read the inner HTML code. Therefore no comparison is possible. Possibly in a future version.
        // curcss = cssToArray(cssbeautify(cssExtractFromHTML(tempsels, ids, classes, style, anonstyle) + readExternCssFiles()));
        curcss = cssToArray(cssbeautify(cssExtractFromHTML(tempsels, ids, classes, style, anonstyle)));
        console.log("STYLESHEET: Extract current Styles:");
        console.log(curcss);
    } catch (error) {
        alert(errmes + "\n" + error);
    }

    // Press CTRL + ENTER to extract the new code
    $(document).keydown(function(e) {
        if (e.ctrlKey && e.keyCode === 13) {
            cssExtractChanges(tempsels, ids, classes, style, anonstyle, succmes, errmes);
        }
    });
}

/* ---------------------------------------------------------------------------------------------------- */



/* Read the extern CSS-Files */

function readExternCssFiles() {
    var css = "";
    extcssfiles.forEach (function (filename) {
        css = css + readTextFile(filename);
    });
    return css;
}

/* ---------------------------------------------------------------------------------------------------- */



/* Read File */

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.send(null);
    return rawFile.responseText;
}

/* ---------------------------------------------------------------------------------------------------- */



/* Extract CSS from HTML and turn it into an array */

function cssExtractFromHTML(tempsels, ids, classes, style, anonstyle) {
    return extractCSS.extract(document.body.innerHTML, { extractIds: ids, extractClasses: classes, extractStyle: style, extractAnonStyle: anonstyle }, (tempsels));
}

/* ---------------------------------------------------------------------------------------------------- */



/* Compare the start stylesheet with the new stylesheet and copy the changes */

function cssExtractChanges(tempsels, ids, classes, style, anonstyle, sucmes, errmes) {
    try {
        newcss = cssToArray(cssbeautify(cssExtractFromHTML(tempsels, ids, classes, style, anonstyle)));
        respcss = cssbeautify(arrayToCss(compareCssCodes()));
        console.log("STYLESHEET: Extract new Styles:");
        console.log(newcss);
        console.log("STYLESHEET: Changed Styles:");
        console.log(chacss);
        if (respcss !== '') {
            copyToClipboard(respcss);
            alert(sucmes);
        }
    } catch (error) {
        alert(errmes + "\n" + error);
    }
}

/* ---------------------------------------------------------------------------------------------------- */



/* Compare the css codes with each other */

function compareCssCodes() {
    for (var selector in newcss) {
        if (curcss[selector] !== undefined) {
            for (var property in newcss[selector]) {
                if (curcss[selector][property] === undefined || curcss[selector][property] !== newcss[selector][property]) {
                    if (chacss[selector] === undefined) chacss[selector] = [];
                    chacss[selector][property] = newcss[selector][property];
                }
            }
        }
    }
    return chacss;
}

/* ---------------------------------------------------------------------------------------------------- */



/* Convert the arrays into CSS */

function arrayToCss(css_arr) {
    var css = '';
    for (var selector in css_arr) {
        css += selector + '{';
        for (var property in css_arr[selector]) {
            css += property + ':' + css_arr[selector][property] + ';';
        }
        css += '}';
    }
    return css;
}

/* ---------------------------------------------------------------------------------------------------- */



/* Convert the CSS into arrays */

function cssToArray(css) {
    css = css.replace(/\n|\/\*[\s\S]*?\*\//g, ''); // remove returns and comments
    const css_arr = [];

    while (css.match(/\{.*\}/)) {
        var openpos = css.indexOf('{');
        var closepos = css.indexOf('}');
        var selector = css.slice(0, openpos).trim();
        var properties = css.substring(openpos + 1, closepos).trim();
        css_arr[selector] = [];
        css = css.substring(closepos + 1);
        while (properties.match(/\:.*\;/)) {
            var openpos = properties.indexOf(':');
            var closepos = properties.indexOf(';');
            var property = properties.substring(0, openpos).trim();
            var value = properties.substring(openpos + 1, closepos).trim();
            css_arr[selector][property] = value;
            properties = properties.substring(closepos + 1);
        }
    }
    return css_arr;
}

/* ---------------------------------------------------------------------------------------------------- */



/* Load stylesheet */

function addStyleSheetExt(cssfile, imp) {
    var css = readFile(cssfile);
    addStyleSheet(css, imp);
}

/* ---------------------------------------------------------------------------------------------------- */



/* Read File */

function readFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.send(null);
    return rawFile.responseText;
}

/* ---------------------------------------------------------------------------------------------------- */



/* Insert stylesheet into the HTML code */

function addStyleSheet(css, imp, ext, own, tempsels, ids, classes, style, anonstyle, sucmes, errmes) {
    // Refresh stylesheet for HTML
    css = css.replace(/\<br\/>/g, '\n');

    // secure the current stylesheet before added new Style
    if (ext) {
        if (own) chacss = cssToArray(css); // Confess own stylesheet as a change
        setTimeout(function() {
           cssExtractCurrent(tempsels, ids, classes, style, anonstyle, sucmes, errmes)
        }, waittoext);
    }

    if (imp) {
        css = css.replace(/ !important;/g, ';');
        css = css.replace(/;/g, ' !important;');
    }
    if (css !== '') $('<style />').text(cssbeautify(css)).appendTo($('head'));
}

/* ---------------------------------------------------------------------------------------------------- */



/* Copy text to Clipboard */

function copyToClipboard(s) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(s).select();
    document.execCommand("copy");
    $temp.remove();
}

/* ---------------------------------------------------------------------------------------------------- */




/* begin cssbeautify */

/* ---------------------------------------------------------------------------------------------------- */

/*
 Copyright (C) 2013 Sencha Inc.
 Copyright (C) 2012 Sencha Inc.
 Copyright (C) 2011 Sencha Inc.

 Author: Ariya Hidayat.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/*jslint continue: true, indent: 4 */
/*global exports:true, module:true, window:true */

(function () {

    'use strict';

    function cssbeautify(style, opt) {

        var options, index = 0, length = style.length, blocks, formatted = '',
            ch, ch2, str, state, State, depth, quote, comment,
            openbracesuffix = true,
            autosemicolon = true,
            trimRight;

        options = arguments.length > 1 ? opt : {};
        if (typeof options.indent === 'undefined') {
            options.indent = '    ';
        }
        if (typeof options.openbrace === 'string') {
            openbracesuffix = (options.openbrace === 'end-of-line');
        }
        if (typeof options.autosemicolon === 'boolean') {
            autosemicolon = options.autosemicolon;
        }

        function isWhitespace(c) {
            return (c === ' ') || (c === '\n') || (c === '\t') || (c === '\r') || (c === '\f');
        }

        function isQuote(c) {
            return (c === '\'') || (c === '"');
        }

        // FIXME: handle Unicode characters
        function isName(c) {
            return (ch >= 'a' && ch <= 'z') ||
                (ch >= 'A' && ch <= 'Z') ||
                (ch >= '0' && ch <= '9') ||
                '-_*.:#[]'.indexOf(c) >= 0;
        }

        function appendIndent() {
            var i;
            for (i = depth; i > 0; i -= 1) {
                formatted += options.indent;
            }
        }

        function openBlock() {
            formatted = trimRight(formatted);
            if (openbracesuffix) {
                formatted += ' {';
            } else {
                formatted += '\n';
                appendIndent();
                formatted += '{';
            }
            if (ch2 !== '\n') {
                formatted += '\n';
            }
            depth += 1;
        }

        function closeBlock() {
            var last;
            depth -= 1;
            formatted = trimRight(formatted);

            if (formatted.length > 0 && autosemicolon) {
                last = formatted.charAt(formatted.length - 1);
                if (last !== ';' && last !== '{') {
                    formatted += ';';
                }
            }

            formatted += '\n';
            appendIndent();
            formatted += '}';
            blocks.push(formatted);
            formatted = '';
        }

        if (String.prototype.trimRight) {
            trimRight = function (s) {
                return s.trimRight();
            };
        } else {
            // old Internet Explorer
            trimRight = function (s) {
                return s.replace(/\s+$/, '');
            };
        }

        State = {
            Start: 0,
            AtRule: 1,
            Block: 2,
            Selector: 3,
            Ruleset: 4,
            Property: 5,
            Separator: 6,
            Expression: 7,
            URL: 8
        };

        depth = 0;
        state = State.Start;
        comment = false;
        blocks = [];

        // We want to deal with LF (\n) only
        style = style.replace(/\r\n/g, '\n');

        while (index < length) {
            ch = style.charAt(index);
            ch2 = style.charAt(index + 1);
            index += 1;

            // Inside a string literal?
            if (isQuote(quote)) {
                formatted += ch;
                if (ch === quote) {
                    quote = null;
                }
                if (ch === '\\' && ch2 === quote) {
                    // Don't treat escaped character as the closing quote
                    formatted += ch2;
                    index += 1;
                }
                continue;
            }

            // Starting a string literal?
            if (isQuote(ch)) {
                formatted += ch;
                quote = ch;
                continue;
            }

            // Comment
            if (comment) {
                formatted += ch;
                if (ch === '*' && ch2 === '/') {
                    comment = false;
                    formatted += ch2;
                    index += 1;
                }
                continue;
            }
            if (ch === '/' && ch2 === '*') {
                comment = true;
                formatted += ch;
                formatted += ch2;
                index += 1;
                continue;
            }

            if (state === State.Start) {

                if (blocks.length === 0) {
                    if (isWhitespace(ch) && formatted.length === 0) {
                        continue;
                    }
                }

                // Copy white spaces and control characters
                if (ch <= ' ' || ch.charCodeAt(0) >= 128) {
                    state = State.Start;
                    formatted += ch;
                    continue;
                }

                // Selector or at-rule
                if (isName(ch) || (ch === '@')) {

                    // Clear trailing whitespaces and linefeeds.
                    str = trimRight(formatted);

                    if (str.length === 0) {
                        // If we have empty string after removing all the trailing
                        // spaces, that means we are right after a block.
                        // Ensure a blank line as the separator.
                        if (blocks.length > 0) {
                            formatted = '\n\n';
                        }
                    } else {
                        // After finishing a ruleset or directive statement,
                        // there should be one blank line.
                        if (str.charAt(str.length - 1) === '}' ||
                            str.charAt(str.length - 1) === ';') {

                            formatted = str + '\n\n';
                        } else {
                            // After block comment, keep all the linefeeds but
                            // start from the first column (remove whitespaces prefix).
                            while (true) {
                                ch2 = formatted.charAt(formatted.length - 1);
                                if (ch2 !== ' ' && ch2.charCodeAt(0) !== 9) {
                                    break;
                                }
                                formatted = formatted.substr(0, formatted.length - 1);
                            }
                        }
                    }
                    formatted += ch;
                    state = (ch === '@') ? State.AtRule : State.Selector;
                    continue;
                }
            }

            if (state === State.AtRule) {

                // ';' terminates a statement.
                if (ch === ';') {
                    formatted += ch;
                    state = State.Start;
                    continue;
                }

                // '{' starts a block
                if (ch === '{') {
                    str = trimRight(formatted);
                    openBlock();
                    state = (str === '@font-face') ? State.Ruleset : State.Block;
                    continue;
                }

                formatted += ch;
                continue;
            }

            if (state === State.Block) {

                // Selector
                if (isName(ch)) {

                    // Clear trailing whitespaces and linefeeds.
                    str = trimRight(formatted);

                    if (str.length === 0) {
                        // If we have empty string after removing all the trailing
                        // spaces, that means we are right after a block.
                        // Ensure a blank line as the separator.
                        if (blocks.length > 0) {
                            formatted = '\n\n';
                        }
                    } else {
                        // Insert blank line if necessary.
                        if (str.charAt(str.length - 1) === '}') {
                            formatted = str + '\n\n';
                        } else {
                            // After block comment, keep all the linefeeds but
                            // start from the first column (remove whitespaces prefix).
                            while (true) {
                                ch2 = formatted.charAt(formatted.length - 1);
                                if (ch2 !== ' ' && ch2.charCodeAt(0) !== 9) {
                                    break;
                                }
                                formatted = formatted.substr(0, formatted.length - 1);
                            }
                        }
                    }

                    appendIndent();
                    formatted += ch;
                    state = State.Selector;
                    continue;
                }

                // '}' resets the state.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    continue;
                }

                formatted += ch;
                continue;
            }

            if (state === State.Selector) {

                // '{' starts the ruleset.
                if (ch === '{') {
                    openBlock();
                    state = State.Ruleset;
                    continue;
                }

                // '}' resets the state.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    continue;
                }

                formatted += ch;
                continue;
            }

            if (state === State.Ruleset) {

                // '}' finishes the ruleset.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    if (depth > 0) {
                        state = State.Block;
                    }
                    continue;
                }

                // Make sure there is no blank line or trailing spaces inbetween
                if (ch === '\n') {
                    formatted = trimRight(formatted);
                    formatted += '\n';
                    continue;
                }

                // property name
                if (!isWhitespace(ch)) {
                    formatted = trimRight(formatted);
                    formatted += '\n';
                    appendIndent();
                    formatted += ch;
                    state = State.Property;
                    continue;
                }
                formatted += ch;
                continue;
            }

            if (state === State.Property) {

                // ':' concludes the property.
                if (ch === ':') {
                    formatted = trimRight(formatted);
                    formatted += ': ';
                    state = State.Expression;
                    if (isWhitespace(ch2)) {
                        state = State.Separator;
                    }
                    continue;
                }

                // '}' finishes the ruleset.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    if (depth > 0) {
                        state = State.Block;
                    }
                    continue;
                }

                formatted += ch;
                continue;
            }

            if (state === State.Separator) {

                // Non-whitespace starts the expression.
                if (!isWhitespace(ch)) {
                    formatted += ch;
                    state = State.Expression;
                    continue;
                }

                // Anticipate string literal.
                if (isQuote(ch2)) {
                    state = State.Expression;
                }

                continue;
            }

            if (state === State.Expression) {

                // '}' finishes the ruleset.
                if (ch === '}') {
                    closeBlock();
                    state = State.Start;
                    if (depth > 0) {
                        state = State.Block;
                    }
                    continue;
                }

                // ';' completes the declaration.
                if (ch === ';') {
                    formatted = trimRight(formatted);
                    formatted += ';\n';
                    state = State.Ruleset;
                    continue;
                }

                formatted += ch;

                if (ch === '(') {
                    if (formatted.charAt(formatted.length - 2) === 'l' &&
                        formatted.charAt(formatted.length - 3) === 'r' &&
                        formatted.charAt(formatted.length - 4) === 'u') {

                        // URL starts with '(' and closes with ')'.
                        state = State.URL;
                        continue;
                    }
                }

                continue;
            }

            if (state === State.URL) {


                // ')' finishes the URL (only if it is not escaped).
                if (ch === ')' && formatted.charAt(formatted.length - 1 !== '\\')) {
                    formatted += ch;
                    state = State.Expression;
                    continue;
                }
            }

            // The default action is to copy the character (to prevent
            // infinite loop).
            formatted += ch;
        }

        formatted = blocks.join('') + formatted;

        return formatted;
    }

    if (typeof exports !== 'undefined') {
        // Node.js module.
        module.exports = exports = cssbeautify;
    } else if (typeof window === 'object') {
        // Browser loading.
        window.cssbeautify = cssbeautify;
    }

}());

/* ---------------------------------------------------------------------------------------------------- */

/* end cssbeautify */



/* begin extractcss */

/* ---------------------------------------------------------------------------------------------------- */

/**
 * extractcss.js
 * https://github.com/adnantopal/extractcss
 * http://extractcss.com/
 * Author: @adnantopal
 * Copyright 2013-2016, Adnan Topal (adnan.co)
 * Licensed under the MIT license.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.extractCSS = factory();
    }
}(this, function () {

    "use strict";

    var outputArr = [],
        outputStr = '';

    function getInlineStyle(element) {
        if (element.hasAttribute('style')) {
            return element.getAttribute('style');
        }

        return null;
    }

    function buildClassString(classes) {
        if (classes === null) {
            return;
        }

        var classString = classes.trim().replace(/(\s{2,})/g, ' ').split(' ').join('.');

        return '.' + classString;
    }

    function extractIds(input, temps) {
        var elements = input.querySelectorAll('*[id]');

        Array.prototype.forEach.call(elements, function (element) {
            var elementId = element.getAttribute('id');

            if (elementId === null || elementId === '') {
                return;
            }
            // Temporary IDs
            // Exclude temporary IDs
            else if (!temps) {
                for (var i in tempselectors) {
                    if (elementId.match(tempselectors[i])) {
                        return;
                    }
                }
            }
            // --------------------------------------------------

            outputArr.push({
                selector: '#' + elementId,
                style: getInlineStyle(element)
            });
        });

        return outputArr;
    }

    function extractClasses(input) {
        var elements = input.querySelectorAll('*[class]'),
            tmpArr = [];

        Array.prototype.forEach.call(elements, function (element) {
            var elementClasses = element.getAttribute('class'),
                elementClassString = buildClassString(elementClasses);

            if (element.getAttribute('id') || tmpArr.indexOf(elementClassString) !== -1 || elementClasses === null) {
                return;
            }

            tmpArr.push(elementClassString);

            outputArr.push({
                selector: elementClassString,
                style: getInlineStyle(element)
            });
        });

        return outputArr;
    }

    function extractStyles(input) {
        var elements = input.querySelectorAll('*[style]:not([id]):not([class])');

        Array.prototype.forEach.call(elements, function (element) {
            var parent = element.parentNode;

            if (parent.hasAttribute('id')) {
                outputArr.push({
                    selector: '#' + parent.getAttribute('id') + ' > ' + element.tagName.toLowerCase(),
                    style: getInlineStyle(element)
                });
            } else if (parent.hasAttribute('class')) {
                outputArr.push({
                    selector: buildClassString(parent.getAttribute('class')) + ' > ' + element.tagName.toLowerCase(),
                    style: getInlineStyle(element)
                });
            }
        });

        return outputArr;
    }

    function outputCSS(extractStyle) {
        outputArr.forEach(function (elem) {
            outputStr += elem.selector + '{' + (elem.style && extractStyle ? elem.style : '') + '}';
        });

        return outputStr;
    }

    // Temporary IDs
    function extract(input, options, temps) { // temps = Do not exclude temporary IDs?
        var inputEl = document.createElement('div');
        inputEl.innerHTML = input;

        options.extractAnonStyle && extractStyles(inputEl);
        options.extractIds && extractIds(inputEl, temps); // temps to the ID function
        options.extractClasses && extractClasses(inputEl);

        return outputCSS(options.extractStyle);
    }

    return {
        extract: extract,
        extractId: extractIds,
        extractClass: extractClasses,
        extractStyle: extractStyles
    };
}));

/* ---------------------------------------------------------------------------------------------------- */

/* end extractcss */