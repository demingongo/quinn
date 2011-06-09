(function ($) {

    function extractExample (element, exampleID) {
        var code = element.text().
            // replace(/^\$\('\.slider'/, 'el.children(".slider"').
            replace(/\.quinn/,  '.quinnExample').
            replace(/\.slider/, '#' + exampleID + ' .slider').
            replace(/\.value/,  '#' + exampleID + ' .value');

        if (code.length === 0) {
            return function () {};
        } else {
            // Yes, yes. I know.
            return function () { eval(code); };
        }
    }

    function determinePrecision (number) {
        if (_.isNumber(number)) {
            number = number.toString().split('.');
            return number[1] ? number[1].length : 0
        }

        return 0;
    }

    function wrapCallback (cb, precision) {
        return function (newValue, slider) {
            if (_.isFunction(cb) && cb(newValue, slider) === false) {
                return false;
            }

            var precision = determinePrecision(slider.value),
                text      = newValue.toFixed(precision);

            if (slider && slider.wrapper.data('quinnSuffix')) {
                text += ' ' + slider.wrapper.data('quinnSuffix');
            }

            slider.wrapper.parents('.example').children('.value').text(text);
        };
    }

    // Wraps around the onChange and onSetup callbacks given in the
    // example to ensure that the value shown in the interactive example
    // is updated as the slider is moved.

    $.fn.quinnExample = function (options) {
        var $this = this;

        options = options || {};

        options = _.extend(options, {
            onChange: wrapCallback(options.onChange, 1),
            onSetup:  wrapCallback(options.onSetup,  1)
        });

        return $this.quinn(options);
    };

    $('pre:not(.no-example)').each(function () {
        var $this = $(this),

            // A unique ID used to identify the example.
            exampleID = _.uniqueId('example_'),

            // The options used by the $.fn.quinn call in the example.
            // options = extractOptions(code, exampleID),
            initExample = extractExample($this.find('code'), exampleID),

            // The main DOM node which will replace the pre element.
            exampleEl;

        exampleEl = $('<div class="example" id="' + exampleID + '"></div>');

        exampleEl.append($('<div class="slider"></div>'));
        exampleEl.append($('<div class="value"></div>'));
        exampleEl.append($('<pre></pre>').append(
            $('<code class="language-javascript"></code>').html($this.html())
        ));

        $this.replaceWith(exampleEl);

        try {
            initExample();
        } catch(e) {
            if (! _.isUndefined(console)) {
                console.log('Failed to init '+exampleID+' - ' + e.toString());
            }
        }
    });

    $('pre.no-example code').addClass('language-javascript');

    // Do highlighting.
    hljs.initHighlightingOnLoad();

})(jQuery);
