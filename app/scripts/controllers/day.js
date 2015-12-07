'use strict';

/**
 * @ngdoc function
 * @name thisDayApp.controller:DayCtrl
 * @description
 * # DayCtrl
 * Controller of the thisDayApp
 */
angular.module('thisDayApp')
  .controller('DayCtrl', function ($scope, $routeParams, wikiQuery) {
	
  	var dateString, month;
  	var peopleList;

  	if ($routeParams.month && $routeParams.day) {
  		var month = parseInt($routeParams.month);
  		var monthName = moment().month(month - 1).format('MMMM');
  		dateString = monthName + "_" + $routeParams.day;
  	} else {
  		$routeParams.month = moment().format('MM');
  		dateString = moment().format('MMMM_D');
  	}

  	$scope.dateToDisplay = dateString.replace('_' , ' ');

  	var displaySection = '2';

  	var pageSection = {
  		'1': {
  			title: 'Events'
  		},
  		'2': {
  			title: 'Births'
  		},
  		'3': {
  			title: 'Deaths'
  		}
  	};

  	var refreshPerson = function refreshPerson () {
  		wikiQuery.personFromList(peopleList).then(function (person) {
  			$scope.person = person;
  		});
  	};

  	var init = function init () {

  		wikiQuery.getList(dateString, displaySection).then(function (data) {
  			peopleList = data;
  			refreshPerson();
  		});

  	};

  	init();

  	$scope.refresh = function refresh () {
  		delete $scope.person;
  		refreshPerson();
  	};

  });
