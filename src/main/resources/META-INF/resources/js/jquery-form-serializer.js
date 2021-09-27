/*
Copyright (c) 2011 Paul Macek

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

https://github.com/macek/jquery-serialize-object
*/

(function($) {
    $.fn.serializeObject = function() {

        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push": /^$/,
                "fixed": /^\d+$/,
                "named": /^[a-zA-Z0-9_]+$/
            };

        this.pair = function(base, key, value) {
            base[key] = value;
            return base;
        };

        this.push_counter = function(key) {
            if (push_counters[key] === undefined) {
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function(index, item) {

            // skip invalid keys
            var name = item.name;
            if (!patterns.validate.test(name)) {
                return;
            }

            var key;
            var keys = name.match(patterns.key);
            var value = item.value;
            var reverse_key = name;

            while ((key = keys.pop()) !== undefined) {

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + key + "\\]$"), '');

                // push
                if (key.match(patterns.push)) {
                    value = self.pair([], self.push_counter(reverse_key), value);
                }

                // fixed
                else if (key.match(patterns.fixed)) {
                    value = self.pair([], key, value);
                }

                // named
                else if (key.match(patterns.named)) {
                    value = self.pair({}, key, value);
                }
            }

            json = $.extend(true, json, value);
        });

        return json;
    };
})(jQuery);