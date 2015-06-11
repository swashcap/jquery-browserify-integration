'use strict';

// as you'll see below, this could be:
// `var $ = global.jQuery = global.$ = require('jquery');`
// vs. requiring jQuery twice
var $ = global.$ = require('jquery');
var jQuery = global.jQuery = require('jquery');

var $list = $(window.document.body).append('<ol>');

// helper to log output to document body & console
var dualLog = function(text) {
    $list.append('<li>' + text + '</li>');
    console.log(text);
};

dualLog('`require` jquery twice. are both results the same instance?: ' + ($ === jQuery) + ''); //=> true

require('jquery-ui');
dualLog('`require` jquery-ui. does it extend our $ instance?: ' + (!!$.ui) + ''); //=> true

// test if requiring a plugin with dep "jquery": "*" uses our own $, required above
var uiu = require('coins-jquery-ui-utilities');
var $dialog = uiu.dialog.base({
    body: '<div title="test">go bananas!</div>',
    close: function() {
        dualLog('`require`ing plugin registers with jquery successfully');
    }
});
dualLog('does plugin with jQuery dep (version: "*") use our instance ' +
    'of jQuery, not its own?: ' + $dialog.is($));
$dialog.dialog('close').dialog('destroy');  // keep DOM tidy

// simulate some plugin that requires jQuery on the window (ensure jQuery set to global FIRST)
(function($) {
    $.fn.dummyPlugin = function() {
        dualLog('plugin expecting global jquery ($ on the window) works successfully');
    };
})(window.$); // usage of global.$ sets window.$ to global.$ in the browser

$list.dummyPlugin();
