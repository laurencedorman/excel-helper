function convertToArrayOfStrings(string) {
  return JSON.stringify(string.split('\n'));
}

function stripQuotes(string) {
  return string.replace(/\'|\"/g, '');
}

var modes = {
  number: function(string) {
    string = string.replace(/\./g, '');
    string = string.replace(/\,/g, '.');

    string = convertToArrayOfStrings(string);

    return stripQuotes(string);
  },
  text: convertToArrayOfStrings
};

var ExcelTransformForm = {
  create: function() {
    var instance = $.extend({}, this.prototype);

    this.init.apply(instance, arguments);

    return instance;
  },

  init: function() {
    this.$input = $('#input');
    this.$output = $('#output');

    this.$relaunch = $('#relaunch');
    this.$relaunch.on('click', this.transformInput.bind(this));

    this.$empty = $('#empty-input');
    this.$empty.on('click', this.emptyInput.bind(this));

    this.$modeControl = $('#mode');
    this.$modeControl.on('click', 'button', function(e) {
      var clicked = e.currentTarget;

      var mode = clicked.dataset.mode;

      this.clearMode();
      this.setMode(mode);

      this.transformInput();
    }.bind(this));

    this.$input.on('input', this.transformInput.bind(this));

    this.setMode('text');
  },

  prototype: {
    emptyInput: function() {
      this.$input.val('');
    },

    setMode: function(mode) {
      this.mode = modes[mode];
      this.$modeControl.find('[data-mode="'+ mode + '"]').addClass('active');
    },

    clearMode: function() {
      this.mode = $.noop();

      this.$modeControl.find('button').removeClass('active');
    },

    transformInput: function(string) {
      try {
        var value = this.$input.val();

        this.$output.val(this.mode(value));
      } catch(err) {
        console.error(err);
      }
    }
  }
};

$(function() {
  'use strict';

  ExcelTransformForm.create();
});
