(function(window, document, widget, AppleGlassButton, AppleInfoButton, undefined) {

  'use strict';

  var defaults = {
    url: '',
    width: 320,
    height: 146
  };

  var $ = (function () {
    var cache = {};

    return function (id) {
      return cache[id] || (cache[id] = document.getElementById(id));
    };
  })();

  var prefs = (function () {
    var options = {};

    var object = function (key, val) {
      if (val === undefined) {
        return options[key];
      }

      if (val === options[val]) {
        return object;
      }

      if (val === null) {
        delete options[key];
      }
      else {
        options[key] = val;
      }

      widget.setPreferenceForKey(val, widget.identifier + '-' + key);

      return object;
    };

    object.load = function (map, fn) {
      Object.keys(map).forEach(function (key) {
        var val = widget.preferenceForKey(widget.identifier + '-' + key);
        if (val === null || val === undefined) {
          val = map[key];
        }
        options[key] = val;
        fn(key, val);
      });
    };

    object.keys = Object.keys.bind(Object, options);

    object.clear = function (keys) {
      (keys || Object.keys(options)).forEach(function (key) {
        widget.setPreferenceForKey(null, widget.identifier + '-' + key);
      });
    };

    return object;
  })();

  var alert = (function () {
    var box = $('alert');
    return function (msg) {
      box.textContent = msg;
      box.classList.add('on');
      setTimeout(function () {
        box.classList.remove('on');
      }, 10000);
    };
  })();

  var frame = (function () {
    var iframe = $('iframe');
    var style = iframe.style;
    var src = '';
    var isHidden = true;
    var timeoutId;

    var object = function (url) {
      src = iframe.src = url;

      timeoutId = setTimeout(function() {
        alert('There seems to be a problem loading the requested URL.');
      }, 10000);

      return object;
    };

    object.show = iframe.onload = function () {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      // The load event is triggered even for and empty src string
      // so we need to filter that out. Also check that the iframe is hidden.
      if (src && isHidden) {
        style.display = 'block';
        isHidden = false;
      }
      return object;
    };

    object.hide = function () {
      style.display = 'none';
      isHidden = true;
      return object;
    };

    object.src = function () {
      return src;
    };

    return object;
  })();

  var resize = (function () {
    var width = defaults.width;
    var height = defaults.height;
    var style = $('front').style;

    return function () {
      var newWidth = parseInt(prefs('width'), 10);
      var newHeight = parseInt(prefs('height'), 10);
      if (newWidth != width || newHeight != height) {
        window.resizeTo(
          Math.max(newWidth, width, 10) + 20,
          Math.max(newHeight, height, 10) + 20
        );

        style.width = newWidth + 'px';
        style.height = newHeight + 'px';

        setTimeout(function () {
          width = newWidth;
          height = newHeight;
          window.resizeTo(width + 20, height + 20);
        }, 300);
      }
    };
  })();

  var flip = (function () {
    var isFront = true;
    return function () {
        widget.prepareForTransition(isFront && 'ToBack' || 'ToFront');
        $('back').style.display = isFront && 'block' || 'none';

        if (isFront) { frame.hide(); }
        else {
          if (prefs('url') != frame.src()) { frame(prefs('url')); }
          else { frame.show(); }
        }

        setTimeout(function () {
          widget.performTransition();
          if (!isFront) { setTimeout(resize, 600); }
          isFront = !isFront;
        }, 50);
    };
  })();

  // Load saved preferences while also setting defaults
  prefs.load(defaults, function (key, val) {
    // Set input fields
    $(key).value = val;
  });

  new AppleGlassButton($('done'), 'Done', function () {
    prefs.keys().forEach(function (key) {
      prefs(key, $(key).value);
    });
    flip();
  });

  new AppleInfoButton($('i'), $('front'), 'white', 'black', flip);

  if (prefs('url')) { frame(prefs('url')); }
  else { setTimeout(flip, 600); }

  // We don’t want to hog computer resources when the dashboard is hidden.
  widget.onhide = function () {
    frame.hide()('');
  };
  widget.onshow = function () {
    frame(prefs('url'));
  };

  widget.onremove = function () {
    // When removing the widget the iframe becomes like an hole
    // through which you can see underneath the widget which looks horrible.
    // By hiding the iframe we can at least see the nice placeholder.
    frame.hide();

    // Clean up after our selfs by removing all saved preferences.
    prefs.clear();
  };

})(window, document, widget, AppleGlassButton, AppleInfoButton);
