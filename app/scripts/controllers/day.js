'use strict';

/**
 * @ngdoc function
 * @name thisDayApp.controller:DayCtrl
 * @description
 * # DayCtrl
 * Controller of the thisDayApp
 */
angular.module('thisDayApp')
  .controller('DayCtrl', function ($scope, $routeParams, wikiQuery, $timeout) {
	
	  $scope.myDate = new Date();

  	var dateString, month, monthName, day;
  	var peopleList;

  	if ($routeParams.month && $routeParams.day) {
  		month = parseInt($routeParams.month);
  		monthName = moment().month(month - 1).format('MMMM');
  		day = $routeParams.day;

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
  			// Timeout to improve UI/UX 
  			$timeout(function () {
  				$scope.person = person;
  			}, 250);
  		});
  	};

  	var init = function init () {
  		
  		$scope.dateToDisplay = dateString.replace('_' , ' ');
    	$scope.date = dateString;

  		delete $scope.person;

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

  	$scope.previousDay = function previousDay () {
  		dateString = moment(dateString, 'MMMM_D').subtract(1, 'days').format('MMMM_D');
  		init();
  	};

  	$scope.nextDay = function  nextDay () {
  		dateString = moment(dateString, 'MMMM_D').add(1, 'days').format('MMMM_D');
  		init();
  	};

  });
