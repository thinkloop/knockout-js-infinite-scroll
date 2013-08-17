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
	ko.extenders.koInfiniteScroll = function(target) {
		var props = {};
		target.koInfiniteScroll = props;

		// dimensions
		props.viewportWidth = ko.observable(-1);
		props.viewportHeight = ko.observable(-1);

		props.itemWidth = ko.observable(-1);
		props.itemHeight = ko.observable(-1);

		props.scrollY = ko.observable(-1);

		// calculations
		props.numColsPerPage = ko.computed(function() {
//console.log('numColsPerPage >> ', Math.max(Math.floor(props.viewportWidth() / props.itemWidth()), 1), ' << = ', props.viewportWidth(), ' / ', props.itemWidth(), ', ', props.viewportWidth() / props.itemWidth());
			return Math.max(Math.floor(props.viewportWidth() / props.itemWidth()), 1);
		});
		props.numRowsPerPage = ko.computed(function() {
//console.log('numRowsPerPage >> ', Math.ceil(props.viewportHeight() / props.itemHeight()), ' << = ', props.viewportHeight(), ' / ', props.itemHeight(), ', ', props.viewportHeight() / props.itemHeight());
			return Math.ceil(props.viewportHeight() / props.itemHeight());
		});
		props.numItemsPerPage = ko.computed(function() { return props.numColsPerPage() * props.numRowsPerPage() });
		props.numItemsBeforeViewport = ko.computed(function() { return Math.floor(props.scrollY() / props.itemHeight()) * props.numColsPerPage(); });

		props.firstVisibleFilteredItemIndex = ko.computed(function() {
//console.log('firstVisibleFilteredItemIndex: ', Math.max(props.numItemsBeforeViewport(), 0));
			return Math.max(props.numItemsBeforeViewport(), 0);
		});
		props.lastVisibleFilteredItemIndex = ko.computed(function() {
//console.log('lastVisibleFilteredItemIndex: ', props.numItemsBeforeViewport() + props.numItemsPerPage());
			return props.numItemsBeforeViewport() + props.numItemsPerPage();
		});

		// display items
		props.displayItems = ko.observable([]);
		ko.computed(function() {
			var oldDisplayItems = props.displayItems.peek();
			var newDisplayItems = target.slice(0, props.lastVisibleFilteredItemIndex() + props.numItemsPerPage() * 2);

			if (oldDisplayItems.length != newDisplayItems.length) {
				props.displayItems(newDisplayItems);
				return;
			}

			for (var i = 0; i < oldDisplayItems.length; i++) {
				if (oldDisplayItems[i] != newDisplayItems[i]) {
					props.displayItems(newDisplayItems);
					return;
				}
			}
		});
	}
}));