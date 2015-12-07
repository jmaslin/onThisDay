'use strict';

/**
 * @ngdoc directive
 * @name thisDayApp.directive:showDate
 * @description
 * # showDate
 */
angular.module('thisDayApp')
  .directive('showDate', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	var dateString = moment().format('MMMM Do');
        element.text(dateString);
      }
    };
  });