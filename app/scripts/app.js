'use strict';

/**
 * @ngdoc overview
 * @name thisDayApp
 * @description
 * # thisDayApp
 *
 * Main module of the application.
 */
angular.module('thisDayApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'firebase.ref',
    'firebase.auth',
    'angularMoment',
    'ngMaterial'
  ])
  .config(function ($sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://upload.wikimedia.org/**'
    ]);

  });