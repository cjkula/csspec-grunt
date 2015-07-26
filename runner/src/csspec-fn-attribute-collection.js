'use strict';

window.CSSpec = window.CSSpec || {};

(function($, _) {
  var mod = CSSpec;

  // constructor
  CSSpec.FnAttributeCollection = function(rules) {
    this.fnAttributes = {};
    if (rules) this.createFnAttributes(rules);
  };

  mod.FnAttributeCollection.prototype = {

    createFnAttributes: function(rules) {
      var self = this,
          fnAttributes = {};
      _.each(rules, function(rule) {
        _.each(rule.declarations, function(declaration) {
          if (mod.isFnAttribute(declaration.property, declaration.value)) {
            _.each(rule.selectors, function(selector) {
              var fn = mod.unwrapFunction(declaration.value);
              self.appendFnAttribute(declaration.property, fn, selector);          
            });
          }
        });
      });
    },

    appendFnAttribute: function(attribute, fn, selector, inline, important) {
      var fnAttr = new mod.FnAttribute(attribute, fn, selector, inline, important);
      this.fnAttributes[attribute] = this.fnAttributes[attribute] || [];
      this.fnAttributes[attribute].push(fnAttr);
      return fnAttr;
    },

    matchFnAttribute: function($el, attribute) {
      var fnAttrs = _.filter(this.fnAttributes[attribute] || [], function(fnAttr) {
                      return attribute === fnAttr.attribute && $el.is(fnAttr.selector);
                    });

      if (fnAttrs.length === 0) return null;

      return _.reduce(fnAttrs, function(memo, fnAttr) {
        return fnAttr.specificity >= memo.specificity ? fnAttr : memo;
      });

    }

  };

})(jQuery, _);