expect = chai.expect;
assert = chai.assert;


var ViewModel = function() {
    var self = this;
    self.items = ko.observableArray([]);
    self.items.extend({
        infinitescroll: {}
    });
};

setViewport = function (target, args)
{
    target.items.infinitescroll.viewportHeight(args.height);
    target.items.infinitescroll.viewportWidth(args.width);
}

setItemSize = function(target, args)
{
    target.items.infinitescroll.itemHeight(args.height);
    target.items.infinitescroll.itemWidth(args.width);
}


describe('Infinitescroll - not scrolled, no page-padding -', function() {
  var target, itemDim;
  beforeEach(function() {
    target = new ViewModel();
    target.items.infinitescroll.numPagesPadding(0);
    itemDim = 10;
    target.items(['item1', 'item2',
                  'item3', 'item4',
                  'item5', 'item6',
                  'item7', 'item8',
                  'item9', 'item10']);
    setItemSize(target, {height: itemDim, width: itemDim});
  });
  it('should display no items initially', function() {
    expect(target.items.infinitescroll.displayItems()).to.have.length(0);
  });
  it('should display 1 item when grid is 1x1', function() {
    setViewport(target, {height: 1*itemDim, width: 1*itemDim});
    expect(target.items.infinitescroll.numRowsPerPage()).to.equal(1);
    expect(target.items.infinitescroll.numColsPerPage()).to.equal(1);
    expect(target.items.infinitescroll.numItemsPadding()).to.equal(1);
    expect(target.items.infinitescroll.displayItems()).to.have.length(1 + target.items.infinitescroll.numItemsPadding());
  });
  it('should display 2 items when grid is 2x1', function() {
    setViewport(target, {height: 2*itemDim, width: 1*itemDim});
    expect(target.items.infinitescroll.numRowsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numColsPerPage()).to.equal(1);
    expect(target.items.infinitescroll.numItemsPadding()).to.equal(1);
    expect(target.items.infinitescroll.displayItems()).to.have.length(2 + target.items.infinitescroll.numItemsPadding());
  });
  it('should display 2 items when grid is 1x2', function() {
    setViewport(target, {height: 1*itemDim, width: 2*itemDim});
    expect(target.items.infinitescroll.numRowsPerPage()).to.equal(1);
    expect(target.items.infinitescroll.numColsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numItemsPadding()).to.equal(2);
    expect(target.items.infinitescroll.displayItems()).to.have.length(2 + target.items.infinitescroll.numItemsPadding());
  });
  it('should display 4 items when grid is 2x2', function() {
    setViewport(target, {height: 2*itemDim, width: 2*itemDim});
    expect(target.items.infinitescroll.numRowsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numColsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numItemsPadding()).to.equal(2);
    expect(target.items.infinitescroll.displayItems()).to.have.length(4 + target.items.infinitescroll.numItemsPadding());
  });
  it('should display 3 items when grid is 2x2 and only exist 3 items', function() {
    setViewport(target, {height: 2*itemDim, width: 2*itemDim});
    target.items(['item1', 'item2', 'item3']);
    expect(target.items.infinitescroll.numRowsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numColsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.displayItems()).to.have.length(3);
  });
  it('should update displayed items when updating an item', function() {
    setViewport(target, {height: 2*itemDim, width: 2*itemDim});
    expect(target.items.infinitescroll.numRowsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numColsPerPage()).to.equal(2);
    target.items()[1] = 'newItem2';
    target.items.valueHasMutated();
    expect(target.items.infinitescroll.displayItems()[1]).to.equal('newItem2');
  });
});


describe('InfiniteScroll - scrolled, no page-padding - ', function() {
  beforeEach(function() {
    target = new ViewModel();
    target.items.infinitescroll.numPagesPadding(0);
    itemDim = 10;
    target.items(['item1', 'item2',
                  'item3', 'item4',
                  'item5', 'item6',
                  'item7', 'item8',
                  'item9', 'item10']);
    setItemSize(target, {height: itemDim, width: itemDim});
    setViewport(target, {height: 2*itemDim, width: 2*itemDim});
    expect(target.items.infinitescroll.numRowsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numColsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numItemsPadding()).to.equal(target.items.infinitescroll.numColsPerPage());
  });
  it('should keep items above, when scroll beyond them', function() {
    var firstVisibleRow = 3;
    target.items.infinitescroll.scrollY(firstVisibleRow*itemDim);
    expect(target.items.infinitescroll.displayItems()[0]).to.equal('item1');
  });
  it('should exclude items below, when not scrolled far enough to include them', function() {
    var firstVisibleRow = 1;
    target.items.infinitescroll.scrollY(firstVisibleRow*itemDim);
    expect(target.items.infinitescroll.displayItems()[0]).to.equal('item1');
    expect(target.items.infinitescroll.displayItems()[5]).to.equal('item6');
    expect(target.items.infinitescroll.displayItems()).to.have.length(6 + target.items.infinitescroll.numItemsPadding());
  });
  it('should have last-visible-index on the last visible item', function() {
    var firstVisibleRow = 1;
    target.items.infinitescroll.scrollY(firstVisibleRow*itemDim);
    // no page padding, item3, item4 are first visible row, and item5, item6 last visible => last visible index 5
    expect(target.items.infinitescroll.lastVisibleIndex()).to.equal(5)
    target.items.infinitescroll.scrollY(firstVisibleRow*itemDim + 0.1*itemDim);
    // now row item7,item8 is partially visible => last visible index 7
    expect(target.items.infinitescroll.lastVisibleIndex()).to.equal(7)
  })
});


describe('InfiniteScroll - scrolled, with page-padding - ', function() {
  beforeEach(function() {
    target = new ViewModel();
    target.items.infinitescroll.numPagesPadding(2);
    itemDim = 10;
    target.items(['item1', 'item2',
                  'item3', 'item4',
                  'item5', 'item6',
                  'item7', 'item8',
                  'item9', 'item10',
                  'item11', 'item12',
                  'item13', 'item14',
                  'item15', 'item16',
                  'item17', 'item18']);
    setItemSize(target, {height: itemDim, width: itemDim});
    setViewport(target, {height: 2*itemDim, width: 2*itemDim});
    expect(target.items.infinitescroll.numRowsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numColsPerPage()).to.equal(2);
    expect(target.items.infinitescroll.numItemsPadding()).to.equal(8);
  });
  it('first hidden index should be page-padded', function() {
    var firstVisibleRow = 6;
    target.items.infinitescroll.scrollY(firstVisibleRow*itemDim);
    // item13, item14 on row6, one page is 2x2, two pages up is on item5, first hidden is item4 = index 3
    expect(target.items.infinitescroll.firstHiddenIndex()).to.equal(3);
  });
  it('last hidden index should be page-padded', function() {
    var firstVisibleRow = 1;
    target.items.infinitescroll.scrollY(firstVisibleRow*itemDim);
    // item3, item4 on row1, grid is 2x2, so item5, item6 is in the view
    // two pages down from item6 is item14, first hidden is therefore item15 = index 14
    expect(target.items.infinitescroll.lastHiddenIndex()).to.equal(14);
  });
});
