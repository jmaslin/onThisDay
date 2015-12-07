'use strict';

describe('Directive: showDate', function () {

  // load the directive's module
  beforeEach(module('thisDayApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<show-date></show-date>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the showDate directive');
  }));
});
