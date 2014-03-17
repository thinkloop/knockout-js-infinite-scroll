Knockout JS (KO) Infinite Scroll
===========================

[![Build Status](https://travis-ci.org/julienaubert/knockout-js-infinite-scroll.png?branch=add_tests)](https://travis-ci.org/julienaubert/knockout-js-infinite-scroll)
[![Coverage Status](https://coveralls.io/repos/julienaubert/knockout-js-infinite-scroll/badge.png)](https://coveralls.io/r/julienaubert/knockout-js-infinite-scroll)


This is a KnockoutJS extender that provides infinite scroll functionality to an observable array by automatically filtering it down to only the items visible on screen. It was developed to display and scroll various long lists of complex items on [OppositeofOpposite.com](http://www.oppositeofopposite.com/), such as the main items list, the friends list and the categories list.

###Example Fiddle: http://jsfiddle.net/thinkloop/7MqJ2/###

The example fiddle shows the simplest implmentation of this component, see the next sections for important in-practice tips.

###Scale to Thousands of Items###
There is an important technique that allows this to scale to many thousands of complex items. Say we were working with a Pinterest style layout, where items with heavy content are floated next to each other forever. When items scroll out of view, we can unload their expensive contents (images, comments, styling, etc.), while keeping the top-level containers to maintain document structure:

```html
<!-- ko foreach: filteredItems.infinitescroll.displayItems -->
   <article class="main-item">
      <!-- ko if: $index() >= $root.filteredItems.infinitescroll.firstVisibleIndex() -->
         <!-- * * complex expensive content * * -->
      <!-- /ko -->
   </article>
<!-- /ko -->
````

We compare $index to firstVisibleIndex and only render the contents of items that are actually visible on screen. This way users can scroll through many thousands of items without any performance issues, since the majority of the containers will be empty and light-weight.

###Run tests:

Install dependencies:
- install [node.js](nodejs.org)
- `npm install -g bower`
- `bower install`
- `npm install`

Run tests: `npm test`

coverage report in html is in *coverage/*

###Bower:

Note, is compatible with at least knockout 3.0.0. Cannot be specified in the bower.json as dependency right now as no official proper package of knockout exists. FYI: [knockout - issue1039](https://github.com/knockout/knockout/issues/1039#issuecomment-31376866)
