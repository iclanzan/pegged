# Pegged #

Pegged is a beautiful OS X Dashboard widget to display webpages. It is a much better alternative to the built-in Web Clip widget because:

* there are no decorations to stand in your way
* you can manually set the size of the widget
* you can interact with the embedded website


### Installing ###

[Download](https://github.com/iclanzan/grunt-git-deploy/archive/master.zip) and extract the archive then double click on `Pegged.wdgt` to install the widget. You can then add Pegged widgets to your Dashboard just like you would any other widget.

### Configuration ###

When you add a widget it will ask you for the _URL_ of the website you wish to display. You can optionally change the widget size.

### Known issues ###

These are basically limitations of Apple’s implementation of Dashboard Widgets which I have yet to find a way to work around:

* Scrolling issues most websites. Scrolling works by dragging the scrollbar though. Elements with `overflow: auto` or `overflow: scroll` scroll fine.
* Links that should open in a blank page do not work.
