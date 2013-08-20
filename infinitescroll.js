(function (factory) {
	// Module systems magic dance.

	if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
		// CommonJS or Node: hard-coded dependency on "knockout"
		factory(require("knockout"), exports);
	} else if (typeof define === "function" && define["amd"]) {
		// AMD anonymous module with hard-coded dependency on "knockout"
		define(["knockout", "exports"], factory);
	} else {
		// <script> tag: use the global `ko` object, attaching a `mapping` property
		factory(ko, ko.mapping = {});
	}
}(function (ko, exports) {
	ko.extenders.infinitescroll = function(target, args) {
		var props = {};

		target.infinitescroll = props;

		props.numPagesPadding = ko.observable(parseFloat(args.numPagesPadding) || 1);

		// dimensions
		props.viewportWidth = ko.observable(-1);
		props.viewportHeight = ko.observable(-1);

		props.itemWidth = ko.observable(-1);
		props.itemHeight = ko.observable(-1);

		props.scrollY = ko.observable(0);

		// if using the main browser scroller to scroll a container that is not 100% tall,
		// the gap between the scroller height and div height is the scrollYOffset in px.
		props.scrollYOffset = ko.observable(0);

		// calculations
		props.numColsPerPage = ko.computed(function() {
			return Math.max(Math.floor(props.viewportWidth() / props.itemWidth()), 0);
		});
		props.numRowsPerPage = ko.computed(function() {
			return Math.max(Math.ceil(props.viewportHeight() / props.itemHeight()), 0);
		});
		props.numItemsPerPage = ko.computed(function() {
			return props.numColsPerPage() * props.numRowsPerPage()
		});
		props.firstVisibleIndex = ko.computed(function() {
			return Math.max(Math.floor((props.scrollY() - props.scrollYOffset()) / props.itemHeight()) * props.numColsPerPage(), 0);
		});
		props.lastVisibleIndex = ko.computed(function() {
			return props.firstVisibleIndex() + props.numItemsPerPage();
		});
		props.firstHiddenIndex = ko.computed(function() {
			return Math.max(props.firstVisibleIndex() - props.numItemsPerPage() * props.numPagesPadding(), 0);
		});
		props.lastHiddenIndex = ko.computed(function() {
			return props.lastVisibleIndex() + props.numItemsPerPage() * props.numPagesPadding();
		});

		// display items
		props.displayItems = ko.observableArray([]);

		// update display items, triggered by target(), lastVisibleIndex and numItemsPerPage
		ko.computed(function() {
			var oldDisplayItems = props.displayItems.peek().slice(0),
				newDisplayItems = target.slice(0, props.lastHiddenIndex());

			if (oldDisplayItems.length !== newDisplayItems.length) {
				props.displayItems(newDisplayItems);
				return;
			}

			// if collections are not identical, skip, replace with new items
			for (var i = oldDisplayItems.length - 1; i >= 0; i--) {
				if (newDisplayItems[i] !== oldDisplayItems[i]) {
					props.displayItems(newDisplayItems);
					return;
				}
			}
		});
	}
}));