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

//format=json&action=query&prop=extracts&exintro=&explaintext=&titles=George+Washington

  	var dateString, month;

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

  	var init = function init () {

  		wikiQuery.getRandomPerson(dateString, displaySection).then(function (data) {
  			$scope.person = data;
  			console.log(data);
  		});

  	};

  	init();

  });
