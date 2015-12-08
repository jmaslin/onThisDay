'use strict';

/**
 * @ngdoc directive
 * @name thisDayApp.directive:showDate
 * @description
 * # showDate
 */
angular.module('thisDayApp')
  .directive('showDate', function ($location) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var dateString, monthName;

        // if ($routeParams.month && $routeParams.day) {
          // monthName = moment().month(parseInt($routeParams.month) - 1).format('MMMM');
          // dateString = monthName + " " + $routeParams.day;
        // } else {
      	 dateString = moment().format('MMMM Do');
        // }

        element.text(dateString);
      }
    };
  });