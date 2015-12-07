'use strict';

describe('Service: wikiQuery', function () {

  // load the service's module
  beforeEach(module('thisDayApp'));

  // instantiate service
  var wikiQuery;
  beforeEach(inject(function (_wikiQuery_) {
    wikiQuery = _wikiQuery_;
  }));

  it('should do something', function () {
    expect(!!wikiQuery).toBe(true);
  });

});
