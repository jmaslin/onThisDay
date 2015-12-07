'use strict';

/**
 * @ngdoc function
 * @name thisDayApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the thisDayApp
 */
angular.module('thisDayApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
