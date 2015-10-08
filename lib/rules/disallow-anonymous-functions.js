/**
 * Requires that a function expression be named.
 *
 * Type: `Boolean`
 *
 * Value: `true`
 *
 * #### Example
 *
 * ```js
 * "disallowAnonymousFunctions": true
 * ```
 *
 * ##### Valid
 *
 * ```js
 * var a = function foo(){
 *
 * };
 *
 * $('#foo').click(function bar(){
 *
 * });
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var a = function(){
 *
 * };
 *
 * $('#foo').click(function(){
 *
 * });
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {
    configure: function(options) {
        var optionName = this.getOptionName();

        this._strict = true;
        if (typeof options === 'object') {
            assert(typeof options.strict === 'boolean', optionName + ' option object requires "strict" to ' +
                'be boolean or be set to `true`');
            this._strict = options.strict;
        } else {
            assert(options === true, this.getOptionName() + ' option requires either a true value or an object');
        }
    },

    getOptionName: function() {
        return 'disallowAnonymousFunctions';
    },

    check: function(file, errors) {
        var self = this;
        file.iterateNodesByType(['FunctionExpression', 'FunctionDeclaration'], function(node) {
            if (node.id !== null) {
                return;
            }

            // In strict mode we must have a name
            if (self._strict) {
                errors.add('Anonymous functions need to be named', node.loc.start);
                return;
            }

            // So this is an anonymous FunctionExpression, check the parent type, some must have names and that's ok
            var parent = node.parentNode;
            switch (parent.type) {
                case 'VariableDeclarator':
                    // var f = function(){...}
                    break;

                case 'AssignmentExpression':
                    // var f; f = function (){...}
                    break;

                case 'Property':
                    // var obj = {foo: function(){...}}
                    break;

                default:
                    errors.add('Anonymous functions need to be named', node.loc.start);
            }
        });
    }
};
